import { getPosts, normalize, plainText } from '../../data/blog';

/** Índice de texto completo del blog. El buscador lo descarga solo cuando alguien empieza a buscar. */
export async function GET() {
  const posts = await getPosts();
  const index = posts.map((p) => ({ id: p.id, text: normalize(plainText(p.body)) }));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json' } });
}
