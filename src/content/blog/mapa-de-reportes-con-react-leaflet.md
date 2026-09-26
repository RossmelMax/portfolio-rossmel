---
title: 'Un mapa de reportes ciudadanos con react-leaflet (y cómo lo reescribiría hoy)'
description: 'En la hackatón Hackacom 2023 armamos Canasta: un mapa donde los vecinos reportan problemas de la ciudad y otros se suman a resolverlos. Repaso el código real, el bug clásico de los íconos de Leaflet y lo que cambiaría tres años después.'
date: 2026-09-17
tags: ['react', 'frontend']
project: 'canasta'
lang: 'es'
---

En 2023 participé en **Hackacom 2023** con Canasta: una app para que los vecinos de Cochabamba reporten en un mapa problemas pequeños que ellos mismos pueden resolver (basura acumulada, animales abandonados, espacios descuidados) y que otras personas se apunten como voluntarias para ir a arreglarlos.

No ganamos. Pero el código sigue en mi GitHub, y releerlo tres años después es un buen ejercicio: se ve lo que aprendí y lo que haría distinto. Este artículo muestra las partes interesantes del mapa y una revisión honesta.

## El stack: React + Leaflet + OpenStreetMap

Para un mapa en una hackatón, **Leaflet** con tiles de **OpenStreetMap** es difícil de superar: no pide API key, no tiene costo y `react-leaflet` lo integra con componentes de React.

```jsx
<MapContainer center={[-17.3697, -66.1653]} zoom={13} scrollWheelZoom style={{ height: '100vh' }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {/* marcadores… */}
</MapContainer>
```

(Si usas los tiles de OpenStreetMap en algo que va a tener tráfico real, agrega la atribución y revisa su política de uso. En una demo de hackatón pasa; en producción, no.)

## El bug clásico: los íconos de Leaflet no aparecen

Lo primero que le pasa a cualquiera que usa Leaflet con un bundler (Webpack, Vite…): los marcadores salen como una imagen rota. Leaflet calcula la ruta de sus íconos por defecto a partir de la URL de su CSS, y el bundler cambia esas rutas.

La solución que usamos (y que sigue siendo la estándar) es borrar ese cálculo y pasarle las imágenes importadas:

```js
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
```

Si alguna vez ves marcadores rotos en Leaflet, es esto.

## Crear un reporte: un marcador que se arrastra

La interacción para reportar era simple y funcionaba bien en el celular:

1. Al abrir el mapa se pide la **ubicación del usuario** y se pone ahí un marcador.
2. El marcador es **arrastrable**: el usuario lo mueve hasta el lugar exacto del problema.
3. Su popup tiene un botón "Crear" que abre el formulario del reporte con esas coordenadas.

```jsx
<Marker
  position={markerPosition}
  draggable
  eventHandlers={{
    dragend: (e) => setMarkerPosition(e.target.getLatLng()),
    mouseover: (e) => e.target.openPopup(),
  }}
>
  <Popup>Arrastra el marcador a la ubicación del reporte</Popup>
</Marker>
```

Los reportes se clasificaban en **((cuatro categorías))** (medio ambiente, abandono animal, revitalización urbana y controversia social), cada una con su color y su pin. Filtrar por categoría cambiaba los marcadores visibles.

## La revisión honesta: lo que cambiaría hoy

Código de hackatón es código de hackatón: se escribe para mostrar la idea en pocas horas. Pero hay cosas que hoy haría distinto incluso con prisa, porque cuestan lo mismo y evitan problemas.

### 1. Una tabla en vez de ternarios anidados

El color del botón y el ícono de cada categoría se elegían con ternarios encadenados, repetidos en dos lugares:

```js
// Antes
iconUrl: selectedCategory === 'medioambiente' ? require('../assets/pin-green.png')
       : selectedCategory === 'abandonoanimal' ? require('../assets/pin-brown.png')
       : selectedCategory === 'revitalizacionurbana' ? require('../assets/pin-orange.png')
       : /* … */
```

Hoy lo resolvería con **==un objeto de configuración==**: un solo lugar para agregar una categoría, y el color y el ícono nunca se desincronizan.

```js
// Después
const CATEGORIAS = {
  medioambiente:        { nombre: 'Medio ambiente',        color: '#00BA35', pin: pinVerde },
  abandonoanimal:       { nombre: 'Abandono animal',       color: '#964B00', pin: pinCafe },
  revitalizacionurbana: { nombre: 'Revitalización urbana', color: '#FFA500', pin: pinNaranja },
  controversiasocial:   { nombre: 'Controversia social',   color: '#FF0000', pin: pinRojo },
};
const cat = CATEGORIAS[selectedCategory] ?? { color: '#000000', pin: pinNegro };
```

### 2. Crear los íconos una sola vez

Cada render creaba un `new L.Icon(...)` por marcador. Con diez marcadores no se nota; con cientos, sí. Los íconos no cambian, así que se crean **una vez, fuera del componente**:

```js
const ICONOS = Object.fromEntries(
  Object.entries(CATEGORIAS).map(([id, c]) => [
    id,
    new L.Icon({ iconUrl: c.pin, iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -36] }),
  ]),
);
```

De paso corregiría el `iconAnchor`: el punto del ícono que toca el mapa tiene que ser **la punta del pin** (centro abajo: `[ancho / 2, alto]`). Con un ancla mal puesta, el marcador "flota" y apunta unos metros al costado del lugar real, que en un mapa de reportes es justo lo que no quieres.

### 3. Manejar el caso en que no hay ubicación

El código pedía la ubicación sin manejar el error:

```js
navigator.geolocation.getCurrentPosition((pos) => setMarkerPosition([pos.coords.latitude, pos.coords.longitude]));
```

Si el usuario rechaza el permiso (o está en una computadora sin GPS), no pasa nada y el marcador queda en el centro por defecto sin explicación. Hoy agregaría el callback de error, un mensaje claro ("arrastra el marcador hasta el lugar") y un tiempo máximo:

```js
navigator.geolocation.getCurrentPosition(
  (pos) => setMarkerPosition([pos.coords.latitude, pos.coords.longitude]),
  () => setAviso('No pudimos obtener tu ubicación: arrastra el marcador hasta el lugar del reporte.'),
  { enableHighAccuracy: true, timeout: 8000 },
);
```

### 4. Datos reales desde el principio

Los reportes de la demo estaban escritos a mano en un arreglo dentro del componente. Para una presentación funciona, pero hoy usaría desde el minuto uno un backend listo como **Supabase** o **Firebase**: autenticación, base de datos y tiempo real (ver aparecer los reportes de otros) en una tarde, sin escribir un servidor.

## Lo que aprendí

- **En una hackatón gana quien recorta.** Definir el mínimo que demuestra la idea (un mapa, un reporte, un voluntario) fue la decisión más importante de la hackatón.
- **Algunas buenas prácticas no cuestan tiempo.** Un objeto de configuración en vez de ternarios se escribe igual de rápido y te salva cuando el jurado pide "¿y si agregamos otra categoría?".
- **Releer tu código viejo es la mejor medida de cuánto creciste.** Si no encuentras nada que cambiar, probablemente no aprendiste mucho desde entonces.
