import React from 'react';
import classnames from 'classnames';
import { withTheme } from '@emotion/react';

import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  NextEditorPlugin,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import {
  breakoutWideScaleRatio,
  akEditorFullPageMaxWidth,
  akEditorBreakoutPadding,
} from '@atlaskit/editor-shared-styles';

import type { GridPluginState, GridType, Highlights } from './types';
import type widthPlugin from '../width';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

export const GRID_SIZE = 12;

const key = new PluginKey<GridPluginState>('gridPlugin');

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type DisplayGrid = (props: Required<GridPluginState>) => boolean;
type CreateDisplayGrid = (view: EditorView) => DisplayGrid;

const createDisplayGrid: CreateDisplayGrid = (view) => (props) => {
  const { dispatch, state } = view;

  const tr = state.tr.setMeta(key, props);

  dispatch(tr);

  return true;
};

export const gridTypeForLayout = (layout: MediaSingleLayout): GridType =>
  layout === 'wrap-left' || layout === 'wrap-right' ? 'wrapped' : 'full';

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

  const minHighlight = highlights.reduce((prev, cur) =>
    Math.min(prev as any, cur as any),
  );
  const maxHighlight = highlights.reduce((prev, cur) =>
    Math.max(prev as any, cur as any),
  );

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
  sides.forEach((side) => {
    gridLines.push(
      <div
        key={side}
        className={classnames(
          'gridLine',
          overflowHighlight(highlights, side, 0, 4) ? 'highlight' : '',
        )}
        style={{ position: 'absolute', [side]: `-${wideSpacing}px` }}
      />,
    );

    gridLines.push(
      <div
        key={side + '-bk'}
        className={classnames(
          'gridLine',
          highlights.indexOf('full-width') > -1 ? 'highlight' : '',
        )}
        style={{
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
        className={classnames(
          'gridLine',
          highlights.indexOf(i) > -1 ? 'highlight' : '',
        )}
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

class Grid extends React.Component<Props> {
  render() {
    const {
      highlight,
      shouldCalcBreakoutGridLines,
      theme,
      containerElement,
      editorWidth,
      gridType,
      visible,
    } = this.props;
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
      <div className="gridParent">
        <div
          className={classnames('gridContainer', gridType)}
          style={{
            height: `${containerElement.scrollHeight}px`,
            display: visible ? 'block' : 'none',
          }}
        >
          {gridLines}
        </div>
      </div>
    );
  }
}

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

const gridPlugin: NextEditorPlugin<
  'grid',
  {
    pluginConfiguration: GridPluginOptions | undefined;
    dependencies: [typeof widthPlugin];
    sharedState: GridPluginState | null;
    actions: {
      displayGrid: CreateDisplayGrid;
    };
  }
> = (options?, api?) => {
  return {
    name: 'grid',

    getSharedState(editorState) {
      if (!editorState) {
        return null;
      }
      return key.getState(editorState);
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

export default gridPlugin;
export { GRID_GUTTER } from './styles';
