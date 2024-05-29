import React from 'react';

import { withTheme } from '@emotion/react';
import classnames from 'classnames';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  ExtractInjectionAPI,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
  akEditorBreakoutPadding,
  akEditorFullPageMaxWidth,
  breakoutWideScaleRatio,
} from '@atlaskit/editor-shared-styles';

import type { GridPluginState, GridType, Highlights } from './types';

export const GRID_SIZE = 12;

const key = new PluginKey<GridPluginState>('gridPlugin');

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type DisplayGrid = (props: Required<GridPluginState>) => boolean;
type CreateDisplayGrid = (view: EditorView) => DisplayGrid;

const createDisplayGrid: CreateDisplayGrid = view => props => {
  const { dispatch, state } = view;

  const tr = state.tr.setMeta(key, props);

  dispatch(tr);

  return true;
};

type Side = 'left' | 'right';
const sides: Side[] = ['left', 'right'];

const overflowHighlight = (
  highlights: Highlights,
  side: Side,
  start: number,
  size?: number,
) => {
  if (!highlights.length) {
    return false;
  }

  const numericHighlights = highlights.filter(
    (highlight): highlight is number => typeof highlight === 'number',
  );
  const minHighlight = Math.min(...numericHighlights);
  const maxHighlight = Math.max(...numericHighlights);

  if (side === 'left') {
    return (
      minHighlight < 0 &&
      minHighlight <= -start &&
      (typeof size === 'number' ? minHighlight >= -(start + size) : true)
    );
  } else {
    return (
      maxHighlight > GRID_SIZE &&
      maxHighlight >= GRID_SIZE + start &&
      (typeof size === 'number' ? maxHighlight <= GRID_SIZE + size : true)
    );
  }
};

const gutterGridLines = (
  editorMaxWidth: number,
  editorWidth: number,
  highlights: Highlights,
  shouldCalcBreakoutGridLines?: boolean,
): JSX.Element[] => {
  const gridLines: JSX.Element[] = [];
  if (!shouldCalcBreakoutGridLines) {
    return gridLines;
  }

  const wideSpacing =
    (editorMaxWidth * breakoutWideScaleRatio - editorMaxWidth) / 2;
  sides.forEach(side => {
    gridLines.push(
      <div
        key={side}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        className={classnames(
          'gridLine',
          overflowHighlight(highlights, side, 0, 4) ? 'highlight' : '',
        )}
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        style={{ position: 'absolute', [side]: `-${wideSpacing}px` }}
      />,
    );

    gridLines.push(
      <div
        key={side + '-bk'}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        className={classnames(
          'gridLine',
          highlights.indexOf('full-width') > -1 ? 'highlight' : '',
        )}
        style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          position: 'absolute',
          [side]: `-${
            (editorWidth - editorMaxWidth - akEditorBreakoutPadding) / 2
          }px`,
        }}
      />,
    );
  });

  return gridLines;
};

const lineLengthGridLines = (highlights: Highlights) => {
  const gridLines: JSX.Element[] = [];
  const gridSpacing = 100 / GRID_SIZE;

  for (let i = 0; i <= GRID_SIZE; i++) {
    const style = {
      paddingLeft: `${gridSpacing}%`,
    };
    gridLines.push(
      <div
        key={i}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        className={classnames(
          'gridLine',
          highlights.indexOf(i) > -1 ? 'highlight' : '',
        )}
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        style={i < GRID_SIZE ? style : undefined}
      />,
    );
  }

  return gridLines;
};

type Props = {
  theme: any;
  shouldCalcBreakoutGridLines?: boolean;
  containerElement: HTMLElement;
  editorWidth: number;

  visible: boolean;
  gridType: GridType;
  highlight: Highlights;
};

const Grid = ({
  highlight,
  shouldCalcBreakoutGridLines,
  theme,
  containerElement,
  editorWidth,
  gridType,
  visible,
}: Props) => {
  const editorMaxWidth = theme.layoutMaxWidth;

  let gridLines = [
    ...lineLengthGridLines(highlight),
    ...gutterGridLines(
      editorMaxWidth,
      editorWidth,
      highlight,
      shouldCalcBreakoutGridLines,
    ),
  ];

  return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
    <div className="gridParent">
      <div
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        className={classnames('gridContainer', gridType)}
        style={{
          height: `${containerElement.scrollHeight}px`,
          display: visible ? 'block' : 'none',
        }}
        data-testid="gridContainer"
      >
        {gridLines}
      </div>
    </div>
  );
};

const ThemedGrid = withTheme(Grid);

export interface GridPluginOptions {
  shouldCalcBreakoutGridLines?: boolean;
}

interface ContentComponentProps {
  api: ExtractInjectionAPI<typeof gridPlugin> | undefined;
  editorView: EditorView;
  options: GridPluginOptions | undefined;
}

const ContentComponent = ({
  api,
  editorView,
  options,
}: ContentComponentProps) => {
  const { widthState, gridState } = useSharedPluginState(api, [
    'width',
    'grid',
  ]);

  if (!gridState) {
    return null;
  }

  return (
    <ThemedGrid
      shouldCalcBreakoutGridLines={
        options && options.shouldCalcBreakoutGridLines
      }
      editorWidth={widthState?.width ?? akEditorFullPageMaxWidth}
      containerElement={editorView.dom as HTMLElement}
      visible={gridState.visible}
      gridType={gridState.gridType ?? 'full'}
      highlight={gridState.highlight}
    />
  );
};

const EMPTY_STATE: GridPluginState = {
  visible: false,
  highlight: [],
};
const gridPMPlugin = new SafePlugin<GridPluginState>({
  key,
  state: {
    init() {
      return EMPTY_STATE;
    },
    apply(tr, currentPluginState) {
      const nextPluginState = tr.getMeta(key);
      if (nextPluginState) {
        return nextPluginState as GridPluginState;
      }

      return currentPluginState;
    },
  },
});

export type GridPlugin = NextEditorPlugin<
  'grid',
  {
    pluginConfiguration: GridPluginOptions | undefined;
    dependencies: [WidthPlugin];
    sharedState: GridPluginState | null;
    actions: {
      displayGrid: CreateDisplayGrid;
    };
  }
>;

/**
 * Grid plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const gridPlugin: GridPlugin = ({ config: options, api }) => {
  return {
    name: 'grid',

    getSharedState(editorState) {
      if (!editorState) {
        return null;
      }
      return key.getState(editorState) || null;
    },

    actions: {
      displayGrid: createDisplayGrid,
    },

    pmPlugins() {
      return [
        {
          name: 'grid',
          plugin: () => gridPMPlugin,
        },
      ];
    },

    contentComponent: ({ editorView }) => (
      <ContentComponent editorView={editorView} options={options} api={api} />
    ),
  };
};
