/**
 * Plugin de Markdown: convierte ==texto== en subrayado a mano y ((texto)) en círculo a mano
 * dentro de los artículos del blog (mismo markup que el componente <Marked>).
 * No toca bloques de código (solo nodos de texto normales).
 */
import { MARK_RE, markHtml } from '../data/sketches';

type Node = { type: string; value?: string; children?: Node[] };

export default function remarkMarks() {
  return (tree: Node) => {
    let seed = 50;
    const walk = (node: Node) => {
      if (!node.children) return;
      const out: Node[] = [];
      for (const child of node.children) {
        if (child.type === 'text' && child.value && MARK_RE.test(child.value)) {
          for (const part of child.value.split(MARK_RE).filter(Boolean)) {
            if (part.startsWith('==') && part.endsWith('==')) out.push({ type: 'html', value: markHtml('underline', part.slice(2, -2), seed++) });
            else if (part.startsWith('((') && part.endsWith('))')) out.push({ type: 'html', value: markHtml('circle', part.slice(2, -2), seed++) });
            else out.push({ type: 'text', value: part });
          }
        } else {
          walk(child);
          out.push(child);
        }
      }
      node.children = out;
    };
    walk(tree);
  };
}
