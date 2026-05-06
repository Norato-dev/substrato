'use client';
import { Editor } from '@tiptap/react';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';

export default function BubbleMenu({ editor }: { editor: Editor }) {
  return (
    <TiptapBubbleMenu
      editor={editor}
      className="bubble-menu"
    >
      <button
        className={`bubble-button ${editor.isActive('bold') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        N
      </button>
      <button
        className={`bubble-button ${editor.isActive('italic') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </button>
      <button
        className={`bubble-button ${editor.isActive('strike') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        S
      </button>
      <button
        className={`bubble-button ${editor.isActive('code') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        {'<>'}
      </button>
      <div style={{ width: '0.5px', background: 'rgba(255,255,255,0.15)', margin: '4px 2px' }} />
      <button
        className={`bubble-button ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </button>
      <button
        className={`bubble-button ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </button>
      <button
        className={`bubble-button ${editor.isActive('blockquote') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        "
      </button>
      <div style={{ width: '0.5px', background: 'rgba(255,255,255,0.15)', margin: '4px 2px' }} />
      <button
        className="bubble-button"
        onClick={() => {
          const url = prompt('URL del enlace:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        Link
      </button>
      <button
        className={`bubble-button ${editor.isActive('link') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        ×
      </button>
    </TiptapBubbleMenu>
  );
}