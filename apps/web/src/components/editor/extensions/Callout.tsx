import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const icons: Record<string, string> = {
  info: '◆',
  warning: '▲',
  success: '●',
  idea: '✦',
};

const colors: Record<string, { bg: string; border: string }> = {
  info: { bg: 'var(--color-brote)', border: 'var(--color-musgo)' },
  warning: { bg: '#FAEEDA', border: 'var(--color-polen)' },
  success: { bg: 'var(--color-brote)', border: 'var(--color-musgo)' },
  idea: { bg: '#F0E8F5', border: 'var(--color-liquen)' },
};

function CalloutComponent({ node, updateAttributes }: any) {
  const variant = node.attrs.variant || 'info';
  const color = colors[variant];

  const cycle = () => {
    const variants = ['info', 'warning', 'success', 'idea'];
    const next = variants[(variants.indexOf(variant) + 1) % variants.length];
    updateAttributes({ variant: next });
  };

  return (
    <NodeViewWrapper
      className="callout"
      style={{ background: color.bg, borderLeftColor: color.border }}
    >
      <button
        contentEditable={false}
        onClick={cycle}
        className="callout-icon"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: color.border }}
      >
        {icons[variant]}
      </button>
      <NodeViewContent className="callout-content" />
    </NodeViewWrapper>
  );
}

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      variant: { default: 'info' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent);
  },

  addCommands() {
    return {
      setCallout:
        (variant: string = 'info') =>
        ({ commands }: any) => {
          return commands.wrapIn(this.name, { variant });
        },
    } as any;
  },
});