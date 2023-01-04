/** @jsx jsx */
import React, { useCallback } from 'react';
import { jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';

import { buttonGroupStyle } from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { Command } from '../../../../types/command';

import { MenuIconItem } from './types';

export const SingleToolbarButtons: React.FC<{
  items: MenuIconItem[];
  isReducedSpacing: boolean;
  editorView: EditorView;
}> = React.memo(({ items, isReducedSpacing, editorView }) => {
  const onClick = useCallback(
    (command: Command) => {
      return () => {
        command(editorView.state, editorView.dispatch);

        return false;
      };
    },
    [editorView.state, editorView.dispatch],
  );
  return (
    <span css={buttonGroupStyle}>
      {items.map((item) => (
        <ToolbarButton
          key={item.key}
          testId={`editor-toolbar__${String(item.content)}`}
          buttonId={item.buttonId}
          spacing={isReducedSpacing ? 'none' : 'default'}
          onClick={onClick(item.command)}
          selected={item.isActive}
          disabled={item.isDisabled}
          title={item.tooltipElement}
          iconBefore={item.iconElement}
          aria-pressed={item.isActive}
          aria-label={item['aria-label'] ?? String(item.content)}
          aria-keyshortcuts={item['aria-keyshortcuts']}
        />
      ))}
    </span>
  );
});
