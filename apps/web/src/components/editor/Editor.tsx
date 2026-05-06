'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import Youtube from '@tiptap/extension-youtube';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import BubbleMenuComponent from './BubbleMenu';
import { SlashCommand } from './SlashCommand';
import { Callout } from './extensions/Callout';
import './editor.css';

const lowlight = createLowlight();
lowlight.register('javascript', js);
lowlight.register('typescript', ts);
lowlight.register('css', css);

interface EditorProps {
  content?: any;
  onChange?: (content: any) => void;
  placeholder?: string;
}

export default function Editor({ content, onChange, placeholder = 'Escribe algo, o presiona / para ver los comandos...' }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false, horizontalRule: false }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ controls: false, nocookie: true }),
      HorizontalRule,
      SlashCommand,
      Callout,
    ],
    content: content || { type: 'doc', content: [{ type: 'paragraph' }] },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  });

  if (!editor) return null;

  return (
    <div style={{ position: 'relative' }}>
      <BubbleMenuComponent editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}