'use client';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance } from 'tippy.js';
import SlashMenu, { SlashItem } from './SlashMenu';

const items: SlashItem[] = [
  { title: 'Texto', description: 'Párrafo simple', icon: '¶', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run() },
  { title: 'Título 1', description: 'Encabezado grande', icon: 'H1', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run() },
  { title: 'Título 2', description: 'Encabezado mediano', icon: 'H2', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run() },
  { title: 'Título 3', description: 'Encabezado pequeño', icon: 'H3', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run() },
  { title: 'Lista', description: 'Lista con viñetas', icon: '•', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
  { title: 'Lista numerada', description: 'Lista ordenada', icon: '1.', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
  { title: 'Cita', description: 'Bloque destacado', icon: '"', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run() },
  { title: 'Callout', description: 'Bloque con énfasis', icon: '◆', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setCallout('info').run() },
  { title: 'Código', description: 'Bloque de código', icon: '</>', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run() },
  { title: 'Separador', description: 'Línea horizontal', icon: '—', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
  { title: 'Imagen', description: 'Subir desde tu computador', icon: '◫', command: ({ editor, range }) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const token = localStorage.getItem('substrato_token');
      if (!token) return alert('Inicia sesión');
      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (data.url) editor.chain().focus().deleteRange(range).setImage({ src: data.url }).run();
        else alert(data.error || 'Error al subir');
      } catch { alert('Error al subir imagen'); }
    };
    input.click();
  }},
  { title: 'YouTube', description: 'Embed de video', icon: '▶', command: ({ editor, range }) => {
    const url = prompt('URL de YouTube:');
    if (url) editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: url }).run();
  }},
  { title: 'Tabla', description: 'Tabla 3x3', icon: '⊞', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
];

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) =>
          items.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          ),
        render: () => {
          let component: ReactRenderer;
          let popup: Instance[];

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SlashMenu, { props, editor: props.editor });
              if (!props.clientRect) return;
              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },
            onUpdate(props: any) {
              component.updateProps(props);
              if (!props.clientRect) return;
              popup[0].setProps({ getReferenceClientRect: props.clientRect });
            },
            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
              }
              return (component.ref as any)?.onKeyDown(props);
            },
            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});