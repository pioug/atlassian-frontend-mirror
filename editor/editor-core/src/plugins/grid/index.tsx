import React from 'react';
import classnames from 'classnames';
import { withTheme } from 'styled-components';

import { PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import {
  breakoutWideScaleRatio,
  akEditorFullPageMaxWidth,
  akEditorBreakoutPadding,
} from '@atlaskit/editor-shared-styles';

import { GridPluginState, GridType } from './types';
import { pluginKey as widthPlugin } from '../width/index';
import WithPluginState from '../../ui/WithPluginState';
import { EventDispatcher, createDispatch } from '../../event-dispatcher';

export const stateKey = new PluginKey<GridPluginState>('gridPlugin');
export const GRID_SIZE = 12;

export type Highlights = Array<'wide' | 'full-width' | number>;

export const createDisplayGrid = (eventDispatcher: EventDispatcher) => {
  const dispatch = createDispatch(eventDispatcher);
  return (
    show: boolean,
    type: GridType,
    highlight: number[] | string[] = [],
  ) => {
    return dispatch(stateKey, {
      visible: show,
      gridType: type,
      highlight: highlight,
    } as GridPluginState);
  };
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
  highlight: number[];
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

interface GridPluginOptions {
  shouldCalcBreakoutGridLines?: boolean;
}

const gridPlugin = (options?: GridPluginOptions): EditorPlugin => ({
  name: 'grid',

  contentComponent: ({ editorView }) => {
    return (
      <WithPluginState
        plugins={{
          grid: stateKey,
          widthState: widthPlugin,
        }}
        render={({
          grid,
          widthState = { width: akEditorFullPageMaxWidth },
        }) => {
          if (!grid) {
            return null;
          }

          return (
            <ThemedGrid
              shouldCalcBreakoutGridLines={
                options && options.shouldCalcBreakoutGridLines
              }
              editorWidth={widthState.width}
              containerElement={editorView.dom as HTMLElement}
              {...grid}
            />
          );
        }}
      />
    );
  },
});

export default gridPlugin;
export { GRID_GUTTER } from './styles';
