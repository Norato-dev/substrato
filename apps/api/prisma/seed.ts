import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('12345678', 12);

  const valentina = await prisma.user.upsert({
    where: { email: 'valentina@substrato.com' },
    update: {},
    create: { email: 'valentina@substrato.com', username: 'valentina', password, name: 'Valentina Cruz', role: 'AUTHOR', bio: 'Escribe sobre materia y memoria' },
  });
  const mateo = await prisma.user.upsert({
    where: { email: 'mateo@substrato.com' },
    update: {},
    create: { email: 'mateo@substrato.com', username: 'mateo', password, name: 'Mateo Ríos', role: 'AUTHOR' },
  });
  const camila = await prisma.user.upsert({
    where: { email: 'camila@substrato.com' },
    update: {},
    create: { email: 'camila@substrato.com', username: 'camila', password, name: 'Camila Torres', role: 'AUTHOR' },
  });
  const daniel = await prisma.user.upsert({
    where: { email: 'daniel@substrato.com' },
    update: {},
    create: { email: 'daniel@substrato.com', username: 'daniel', password, name: 'Daniel Mora', role: 'AUTHOR' },
  });

  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: 'ideas' }, update: {}, create: { name: 'Ideas', slug: 'ideas', color: '#5DCAA5' } }),
    prisma.category.upsert({ where: { slug: 'proceso' }, update: {}, create: { name: 'Proceso', slug: 'proceso', color: '#D4895A' } }),
    prisma.category.upsert({ where: { slug: 'cultura' }, update: {}, create: { name: 'Cultura', slug: 'cultura', color: '#9B8EA8' } }),
    prisma.category.upsert({ where: { slug: 'tecnologia' }, update: {}, create: { name: 'Tecnología', slug: 'tecnologia', color: '#5DCAA5' } }),
    prisma.category.upsert({ where: { slug: 'diseno' }, update: {}, create: { name: 'Diseño', slug: 'diseno', color: '#D4895A' } }),
  ]);

  const posts = [
    { title: 'La memoria de los materiales que nadie nombra', excerpt: 'Una exploración de cómo los objetos guardan historia sin saberlo, y por qué ese silencio importa.', author: valentina.id, category: cats[0].id, readTime: 8, featured: true },
    { title: 'Sistemas que aprenden a olvidar', excerpt: 'El olvido es una función técnica, no una falla.', author: daniel.id, category: cats[3].id, readTime: 5 },
    { title: 'El silencio como lenguaje de diseño', excerpt: 'Cuando el espacio vacío comunica más que el contenido.', author: camila.id, category: cats[4].id, readTime: 6 },
    { title: 'Raíces digitales en tierra analógica', excerpt: 'La paradoja de construir lo virtual con cimientos físicos.', author: mateo.id, category: cats[2].id, readTime: 9 },
    { title: 'Cómo diseñar desde el error y no desde la certeza', excerpt: 'Una exploración de los métodos que emergen cuando dejamos de planear y empezamos a escuchar lo que el material quiere decir.', author: mateo.id, category: cats[1].id, readTime: 7 },
    { title: 'Arquitecturas que respiran con quienes las habitan', excerpt: 'Espacios diseñados para cambiar.', author: camila.id, category: cats[2].id, readTime: 5 },
    { title: 'Redes que crecen como hongos bajo la superficie', excerpt: 'Los sistemas distribuidos tienen más en común con la biología que con la ingeniería clásica.', author: daniel.id, category: cats[3].id, readTime: 6 },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: slugify(p.title, { lower: true, strict: true }) },
      update: {},
      create: {
        title: p.title,
        slug: slugify(p.title, { lower: true, strict: true }),
        excerpt: p.excerpt,
        content: { type: 'doc', content: [] },
        status: 'PUBLISHED',
        publishedAt: new Date(),
        readTime: p.readTime,
        featured: p.featured ?? false,
        authorId: p.author,
        categoryId: p.category,
      },
    });
  }

  console.log('🌱 Seed completo');
}

main().finally(() => prisma.$disconnect());