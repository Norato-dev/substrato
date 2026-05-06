'use client';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface SlashItem {
  title: string;
  description: string;
  icon: string;
  command: (props: any) => void;
}

interface Props {
  items: SlashItem[];
  command: (item: SlashItem) => void;
}

const SlashMenu = forwardRef((props: Props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [props.items]);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) props.command(item);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (props.items.length === 0) {
    return (
      <div className="slash-menu">
        <div style={{ padding: '12px', fontSize: '13px', color: 'rgba(13,13,13,0.5)' }}>
          Sin resultados
        </div>
      </div>
    );
  }

  return (
    <div className="slash-menu">
      {props.items.map((item, index) => (
        <div
          key={index}
          className={`slash-item ${index === selectedIndex ? 'is-selected' : ''}`}
          onClick={() => selectItem(index)}
        >
          <div className="slash-icon">{item.icon}</div>
          <div className="slash-text">
            <div className="slash-title">{item.title}</div>
            <div className="slash-desc">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
});

SlashMenu.displayName = 'SlashMenu';
export default SlashMenu;