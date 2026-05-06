import { Post } from '@/types';

export default function ArticleBody({ post }: { post: Post }) {
  const hasContent = post.content?.content?.length > 0;

  return (
    <article
      style={{
        padding: 'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      {hasContent ? (
        <div className="prose-organic" dangerouslySetInnerHTML={{ __html: renderContent(post.content) }} />
      ) : (
        <div className="prose-organic">
          <p>
            El silencio entre las palabras es donde realmente vive el sentido. Esta es una versión preliminar del artículo
            mientras el editor WYSIWYG se construye en la próxima fase.
          </p>
          <p>
            Cada texto en Substrato se piensa como un organismo: tiene raíces en una pregunta, tronco en una idea central,
            y ramas que se extienden hacia preguntas nuevas. La estructura no es lineal, es ramificada.
          </p>
          <h2>Una segunda capa de pensamiento</h2>
          <p>
            Cuando dejamos de pensar en el contenido como información y empezamos a pensarlo como sustrato, todo cambia.
            El lector ya no consume; se siembra a sí mismo en el texto.
          </p>
          <blockquote>
            Lo que crece, crece despacio. Lo que crece despacio, dura.
          </blockquote>
          <p>
            Este es un párrafo que vive después de la cita, recibiendo su peso. La tipografía respira con generosidad
            porque el contenido lo merece — no porque haya espacio que llenar.
          </p>
          <h3>Un tercer nivel de detalle</h3>
          <p>
            Las imágenes en estos artículos se trabajarán con bordes orgánicos, blobs que se filtran entre el texto,
            citas que rompen el grid central. La página de artículo no es un documento; es un paisaje.
          </p>
        </div>
      )}
    </article>
  );
}

function renderContent(_content: any): string {
  return '<p>Contenido del editor.</p>';
}