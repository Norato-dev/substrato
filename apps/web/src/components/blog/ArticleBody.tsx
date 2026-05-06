import { Post } from '@/types';

function renderNode(node: any): string {
  if (!node) return '';

  switch (node.type) {
    case 'doc':
      return node.content?.map(renderNode).join('') ?? '';
    case 'paragraph':
      return `<p>${node.content?.map(renderNode).join('') ?? ''}</p>`;
    case 'heading':
      return `<h${node.attrs.level}>${node.content?.map(renderNode).join('') ?? ''}</h${node.attrs.level}>`;
    case 'blockquote':
      return `<blockquote>${node.content?.map(renderNode).join('') ?? ''}</blockquote>`;
    case 'bulletList':
      return `<ul>${node.content?.map(renderNode).join('') ?? ''}</ul>`;
    case 'orderedList':
      return `<ol>${node.content?.map(renderNode).join('') ?? ''}</ol>`;
    case 'listItem':
      return `<li>${node.content?.map(renderNode).join('') ?? ''}</li>`;
    case 'codeBlock':
      return `<pre><code>${node.content?.map(renderNode).join('') ?? ''}</code></pre>`;
    case 'horizontalRule':
      return '<hr />';
    case 'image':
      return `<img src="${node.attrs.src}" alt="${node.attrs.alt ?? ''}" />`;
    case 'callout':
      const icons: Record<string, string> = { info: '◆', warning: '▲', success: '●', idea: '✦' };
      const colors: Record<string, string> = {
        info: 'var(--color-musgo)',
        warning: 'var(--color-polen)',
        success: 'var(--color-musgo)',
        idea: 'var(--color-liquen)',
      };
      const variant = node.attrs?.variant ?? 'info';
      return `<div class="callout" style="border-left-color:${colors[variant]}">
        <span class="callout-icon" style="color:${colors[variant]}">${icons[variant]}</span>
        <div class="callout-content">${node.content?.map(renderNode).join('') ?? ''}</div>
      </div>`;
    case 'table':
      return `<table>${node.content?.map(renderNode).join('') ?? ''}</table>`;
    case 'tableRow':
      return `<tr>${node.content?.map(renderNode).join('') ?? ''}</tr>`;
    case 'tableHeader':
      return `<th>${node.content?.map(renderNode).join('') ?? ''}</th>`;
    case 'tableCell':
      return `<td>${node.content?.map(renderNode).join('') ?? ''}</td>`;
    case 'youtube':
      return `<div data-youtube-video><iframe src="https://www.youtube.com/embed/${getYoutubeId(node.attrs.src)}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:12px"></iframe></div>`;
    case 'text': {
      let text = node.text ?? '';
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === 'bold') text = `<strong>${text}</strong>`;
          if (mark.type === 'italic') text = `<em>${text}</em>`;
          if (mark.type === 'strike') text = `<s>${text}</s>`;
          if (mark.type === 'code') text = `<code>${text}</code>`;
          if (mark.type === 'link') text = `<a href="${mark.attrs.href}">${text}</a>`;
        }
      }
      return text;
    }
    default:
      return node.content?.map(renderNode).join('') ?? '';
  }
}

function getYoutubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match?.[1] ?? '';
}

export default function ArticleBody({ post }: { post: Post }) {
  const hasContent = post.content?.content?.some((n: any) => 
    n.content?.length > 0 || n.type === 'horizontalRule' || n.type === 'image'
  );

  const html = hasContent ? renderNode(post.content) : `
    <p>El silencio entre las palabras es donde realmente vive el sentido.</p>
    <p>Cada texto en Substrato se piensa como un organismo: tiene raíces en una pregunta, 
    tronco en una idea central, y ramas que se extienden hacia preguntas nuevas.</p>
    <h2>Una segunda capa</h2>
    <p>Cuando dejamos de pensar en el contenido como información y empezamos a pensarlo 
    como sustrato, todo cambia.</p>
    <blockquote>Lo que crece, crece despacio. Lo que crece despacio, dura.</blockquote>
  `;

  return (
    <article style={{ padding: 'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)', maxWidth: '720px', margin: '0 auto' }}>
      <div className="prose-organic" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}