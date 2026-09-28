---
title: 'Anonimizar un contrato antes de mandarlo a un LLM (sin otro LLM)'
description: 'En AdvAI ningún nombre, carnet ni NIT sale de la máquina: un anonimizador por reglas los cambia por marcadores estables y el sistema los restaura en la respuesta. Cómo funciona y por qué no usé IA para esto.'
date: 2026-09-22
tags: ['ia', 'llm', 'privacidad', 'python']
project: 'advai'
lang: 'es'
---

Un contrato está lleno de datos personales: nombres completos, números de carnet, NIT, teléfonos, direcciones, placas de vehículos, matrículas de inmuebles. Si quieres analizarlo con un modelo en la nube (Groq, Gemini…), todo eso viaja a un servidor que no controlas.

En **AdvAI**, mi proyecto de grado, la regla es simple: **a la nube solo llega texto anonimizado**. Este artículo explica cómo lo resolví y por qué la solución no fue "otro modelo de IA".

## La tentación: usar un LLM para anonimizar

Lo primero que se le ocurre a cualquiera es pedirle a un modelo: "reemplaza los datos personales de este texto". Tiene dos problemas:

1. **Para anonimizar con un modelo en la nube, primero tienes que mandarle los datos.** Justo lo que querías evitar.
2. **==No es determinista.==** Hoy reemplaza el nombre, mañana se le escapa uno. Y no puedes probarlo con un test que pase siempre.

Así que el anonimizador de AdvAI es **((código normal))**: expresiones regulares y reglas pensadas para contratos bolivianos. Sin servicios externos, rápido y con resultados que se pueden probar.

## Marcadores estables, no asteriscos

La idea clave: no borrar los datos, sino **reemplazarlos por marcadores que conservan el significado**. El modelo necesita saber que "el vendedor" y "la compradora" son personas distintas y quién se obligó a qué.

- Las partes del contrato se reemplazan por **su rol**: `[VENDEDOR]`, `[COMPRADORA]`, `[ARRENDATARIO]`…
- Otras personas y empresas: `[PERSONA_1]`, `[EMPRESA_1]`…
- Datos identificatorios: `[CI_1]`, `[NIT_1]`, `[TELEFONO_1]`, `[PLACA_1]`, `[DIRECCION_1]`…

Y lo que el análisis legal **sí necesita** se conserva: montos, porcentajes, plazos y fechas.

Un antes y después (con datos inventados):

```text
Antes:  Juan Carlos Pérez Rojas, con C.I. 1234567 CB, en adelante EL VENDEDOR,
        y María López, en adelante LA COMPRADORA, acuerdan el precio de Bs 50.000.

Después: [VENDEDOR], con [CI_1], en adelante EL VENDEDOR,
         y [COMPRADORA], en adelante LA COMPRADORA, acuerdan el precio de Bs 50.000.
```

## Detectar a las partes: "en adelante EL VENDEDOR"

Los contratos tienen una fórmula casi universal para definir a las partes: *"…, en adelante EL VENDEDOR"*, *"…, en adelante denominada LA ARRENDATARIA"*. Esa fórmula es un regalo: me dice el nombre **y** el rol a la vez.

La expresión regular (simplificada) busca un nombre o una razón social, algunos datos intermedios y la frase "en adelante":

```python
DEF_PARTE = re.compile(
    rf"(?P<quien>{EMPRESA}|{NOMBRE})"        # nombre o empresa
    rf"(?P<medio>[^.;]{{0,260}}?)"          # datos intermedios (C.I., domicilio…)
    rf"en\s+adelante\s+(?:denominad[oa]s?\s+|llamad[oa]s?\s+)?"
    rf"(?P<rol>(?:EL|LA|LOS|LAS)\s+[A-ZÁÉÍÓÚÑ ]{{2,40}}?)",
    re.S)
```

`NOMBRE` son de 2 a 5 palabras con mayúscula inicial (admitiendo "de", "del", "de la" entre apellidos) y `EMPRESA` es una secuencia de palabras que termina en un sufijo societario: `S.R.L.`, `S.A.`, `Ltda.`… Así "Juan Carlos Pérez Rojas, en adelante EL VENDEDOR" se convierte en `[VENDEDOR]`.

Después vienen, en orden:

1. **Representantes y personas con tratamiento** ("representada por…", "Sr.", "Lic.", "Dra."…) → `[PERSONA_n]`.
2. **Empresas** que no son parte del contrato → `[EMPRESA_n]`.
3. **Datos por patrón**: correo, C.I. (con extensión departamental: CB, LP, SC…), NIT, matrícula, placa, teléfono (celulares bolivianos de 8 dígitos, con o sin +591) y dirección ("Av.", "Calle", "Zona"… seguido de un nombre y un número).

## Los falsos positivos también importan

Una regla que busca "palabras con mayúscula" encuentra nombres, pero también "Código Civil", "Tribunal Supremo" o "Santa Cruz". Si los anonimizo, el modelo pierde justo el contexto legal que necesita.

Por eso hay una lista de palabras que **nunca** son nombres de persona: instituciones, ciudades, departamentos, términos del contrato ("Cláusula", "Primera", "Testimonio"…) e incluso marcas de autos que aparecen en contratos de compraventa. Un nombre necesita al menos dos palabras con mayúscula y ninguna de esa lista.

## Detalles que evitan errores sutiles

Tres decisiones pequeñas que hicieron la diferencia:

- **Sustituir primero lo más largo.** Si reemplazo "Juan Pérez" antes que "Juan Pérez Rojas", queda `[PERSONA_1] Rojas`. Ordenar por longitud descendente lo evita.
- **Variantes del mismo nombre.** Un contrato dice "Juan Carlos Pérez Rojas" en la comparecencia y "Juan Carlos" o "Juan Pérez" más adelante. Para nombres de tres o más palabras también se reemplazan esas formas cortas con el mismo marcador.
- **Un mapa para todo el contrato.** El análisis se hace cláusula por cláusula, en paralelo. Si cada cláusula se anonimizara por separado, el mismo vendedor podría ser `[PERSONA_1]` en una y `[PERSONA_3]` en otra. Por eso se anonimiza **el contrato completo una vez** y ese mapa se aplica a cada cláusula.

La interfaz es de tres métodos:

```python
texto_anon, mapa = Anonimizador().anonimizar(contrato)   # una vez por contrato
clausula_anon = Anonimizador.aplicar(clausula, mapa)       # por cada cláusula
respuesta = Anonimizador.restaurar(respuesta_llm, mapa)    # al volver del modelo
```

## El mapa nunca sale del servidor

El mapa `marcador → dato real` se queda en el servidor. El modelo ve `[VENDEDOR]`; cuando responde "la obligación de [VENDEDOR] de entregar el bien…", el sistema restaura los datos reales antes de mostrárselo al abogado. El usuario lee su contrato con nombres reales; el proveedor de IA nunca los vio.

Además, AdvAI prefiere un **modelo local** (Ollama) cuando está disponible, y los proveedores en la nube solo entran como respaldo. Pero incluso cuando se usa la nube, el texto ya salió anonimizado.

## Lo que aprendí

- **No todo problema de IA se resuelve con IA.** Para algo que tiene que funcionar siempre igual, unas reglas bien probadas le ganan a un modelo.
- **Privacidad por diseño cambia la arquitectura.** El mapa, el orden de sustitución y el "anonimizar una vez por contrato" salieron de pensar la privacidad desde el principio, no de agregarla al final.
- **Los falsos positivos cuestan tanto como los falsos negativos.** Anonimizar de más destruye el contexto que el modelo necesita para razonar.

¿Estás mandando datos de usuarios a un LLM? Antes de elegir el modelo, pregúntate qué parte del texto realmente necesita ver.
