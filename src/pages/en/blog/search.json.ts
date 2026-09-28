import { searchIndex } from '../../../data/blog';

/** Índice de texto completo del blog (EN). El buscador lo descarga solo cuando alguien empieza a buscar. */
export async function GET() {
  return new Response(JSON.stringify(await searchIndex('en')), { headers: { 'Content-Type': 'application/json' } });
}
