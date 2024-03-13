import React from 'react';

import ReactDOM from 'react-dom';

import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

type SelectionType = 'anchor' | 'head';

// Copied from: platform/packages/editor/editor-plugin-ai/src/ui/modal/styles.tsx
const selectionMarkerStyles = xcss({
  content: "''",
  position: 'absolute',
  backgroundImage:
    "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMyIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDMgMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMSAxSDBMMSAxLjg1NzE0VjE4LjE0MzNMMCAxOS4wMDA0SDNMMiAxOC4xNDMzVjEuODU3MTRMMyAxSDJIMVoiIGZpbGw9IiM1NzlERkYiLz4KPHJlY3QgeT0iMTkiIHdpZHRoPSIzIiBoZWlnaHQ9IjEiIGZpbGw9IiM1NzlERkYiLz4KPHJlY3Qgd2lkdGg9IjMiIGhlaWdodD0iMSIgZmlsbD0iIzU3OURGRiIvPgo8L3N2Zz4K')",
  top: 'space.0',
  bottom: token('space.negative.025', '-2px'),
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: 'center',
  backgroundPositionY: 'center',
  backgroundSize: 'contain',
  aspectRatio: '3/20',
  left: '0px',
  marginLeft: '-0.1em',
  right: '0px',
  marginRight: '-0.1em',
  pointerEvents: 'none',
});

type WidgetProps = { type: SelectionType };

const Widget = ({ type }: WidgetProps) => {
  return (
    <Box
      as={'span'}
      xcss={selectionMarkerStyles}
      testId={`selection-marker-${type}-cursor`}
      contentEditable={false}
    />
  );
};

const toDOM = (type: SelectionType) => {
  let element = document.createElement('span');
  element.contentEditable = 'false';

  element.setAttribute('style', `position: relative;`);
  ReactDOM.render(<Widget type={type} />, element);

  return element;
};

const containsText = (resolvedPos: ResolvedPos) => {
  const { nodeBefore, nodeAfter } = resolvedPos;
  return nodeBefore?.isInline || nodeAfter?.isInline;
};

export const createWidgetDecoration = (
  resolvedPos: ResolvedPos,
  type: SelectionType,
  selection: Selection,
) => {
  // We don't want the cursor to show if it's not text selection
  // ie. if it's on media selection
  if (
    !(selection instanceof TextSelection) ||
    containsText(resolvedPos) === false
  ) {
    return [];
  }

  return [
    Decoration.widget(resolvedPos.pos, toDOM(type), {
      side: -1,
      key: `${type}WidgetDecoration`,
      stopEvent: () => true,
      ignoreSelection: true,
    }),
  ];
};
