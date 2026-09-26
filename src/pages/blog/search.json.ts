import { searchIndex } from '../../data/blog';

/** Índice de texto completo del blog (ES). El buscador lo descarga solo cuando alguien empieza a buscar. */
export async function GET() {
  return new Response(JSON.stringify(await searchIndex('es')), { headers: { 'Content-Type': 'application/json' } });
}
