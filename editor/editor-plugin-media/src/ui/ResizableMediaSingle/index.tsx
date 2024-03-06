/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import { calculateOffsetLeft } from '@atlaskit/editor-common/media-single';
import type { GridType, SnapPointsProps } from '@atlaskit/editor-common/types';
import {
  calcColumnsFromPx,
  calcMediaPxWidth,
  calcPctFromPx,
  handleSides,
  imageAlignmentMap,
  Resizer,
  snapTo,
  wrappedLayouts,
} from '@atlaskit/editor-common/ui';
import { calculateSnapPoints } from '@atlaskit/editor-common/utils';
import type { Highlights } from '@atlaskit/editor-plugin-grid';
import {
  findParentNodeOfTypeClosestToPos,
  hasParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { akEditorWideLayoutWidth } from '@atlaskit/editor-shared-styles';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { token } from '@atlaskit/tokens';

import { checkMediaType } from '../../utils/check-media-type';

import { wrapperStyle } from './styled';
import type { EnabledHandles, Props } from './types';

type State = {
  offsetLeft: number;
  isVideoFile: boolean;
  resizedPctWidth?: number;
};
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class ResizableMediaSingle extends React.Component<
  Props,
  State
> {
  state: State = {
    offsetLeft: calculateOffsetLeft(
      this.insideInlineLike,
      this.insideLayout,
      this.props.view.dom,
      undefined,
    ),

    // We default to true until we resolve the file type
    isVideoFile: true,
  };

  componentDidUpdate(prevProps: Props) {
    const offsetLeft = calculateOffsetLeft(
      this.insideInlineLike,
      this.insideLayout,
      this.props.view.dom,
      this.wrapper,
    );
    if (offsetLeft !== this.state.offsetLeft && offsetLeft >= 0) {
      this.setState({ offsetLeft });
    }

    // Handle undo, when the actual pctWidth changed,
    // we sync up with the internal state.
    if (prevProps.pctWidth !== this.props.pctWidth) {
      this.setState({ resizedPctWidth: this.props.pctWidth });
    }

    return true;
  }

  private displayGrid = (
    visible: boolean,
    gridType: GridType,
    highlight: number[] | string[],
  ) => {
    const { pluginInjectionApi, view } = this.props;

    pluginInjectionApi?.grid?.actions?.displayGrid(view)({
      visible,
      gridType,
      highlight: highlight as Highlights,
    });
  };

  get wrappedLayout() {
    return wrappedLayouts.indexOf(this.props.layout) > -1;
  }

  // check if is inside of a table
  isNestedInTable() {
    const { table } = this.props.view.state.schema.nodes;
    if (!this.$pos) {
      return false;
    }
    return !!findParentNodeOfTypeClosestToPos(this.$pos, table);
  }

  async componentDidMount() {
    const { viewMediaClientConfig } = this.props;
    if (viewMediaClientConfig) {
      await this.checkVideoFile(viewMediaClientConfig);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.viewMediaClientConfig !== nextProps.viewMediaClientConfig) {
      this.checkVideoFile(nextProps.viewMediaClientConfig);
    }
    if (this.props.layout !== nextProps.layout) {
      this.checkLayout(this.props.layout, nextProps.layout);
    }
  }

  async checkVideoFile(viewMediaClientConfig?: MediaClientConfig) {
    const $pos = this.$pos;

    if (!$pos || !viewMediaClientConfig) {
      return;
    }

    const mediaNode = this.props.view.state.doc.nodeAt($pos.pos + 1);
    const mediaType = mediaNode
      ? await checkMediaType(mediaNode, viewMediaClientConfig)
      : undefined;

    const isVideoFile = mediaType !== 'external' && mediaType !== 'image';

    if (this.state.isVideoFile !== isVideoFile) {
      this.setState({ isVideoFile });
    }
  }

  /**
   * When returning to center layout from a wrapped/aligned layout, it might actually
   * be wide or full-width
   */
  checkLayout(oldLayout: MediaSingleLayout, newLayout: MediaSingleLayout) {
    const { resizedPctWidth } = this.state;
    if (
      wrappedLayouts.indexOf(oldLayout) > -1 &&
      newLayout === 'center' &&
      resizedPctWidth
    ) {
      const layout = this.calcUnwrappedLayout(
        resizedPctWidth,
        this.calcPxWidth(newLayout),
      );

      this.props.updateSize(resizedPctWidth, layout);
    }
  }

  calcNewSize = (newWidth: number, stop: boolean) => {
    const {
      layout,
      view: { state },
    } = this.props;

    const newPct = calcPctFromPx(newWidth, this.props.lineLength) * 100;
    this.setState({ resizedPctWidth: newPct });

    let newLayout: MediaSingleLayout = hasParentNodeOfType(
      state.schema.nodes.table,
    )(state.selection)
      ? layout
      : this.calcUnwrappedLayout(newPct, newWidth);

    if (newPct <= 100) {
      if (this.wrappedLayout && (stop ? newPct !== 100 : true)) {
        newLayout = layout;
      }
      return {
        width: newPct,
        layout: newLayout,
      };
    } else {
      return {
        width: this.props.pctWidth || null,
        layout: newLayout,
      };
    }
  };

  calcUnwrappedLayout = (
    pct: number,
    width: number,
  ): 'center' | 'wide' | 'full-width' => {
    if (pct <= 100) {
      return 'center';
    }
    if (width <= akEditorWideLayoutWidth) {
      return 'wide';
    }
    return 'full-width';
  };

  get $pos() {
    if (typeof this.props.getPos !== 'function') {
      return null;
    }
    const pos = this.props.getPos();
    if (Number.isNaN(pos as any) || typeof pos !== 'number') {
      return null;
    }

    // need to pass view because we may not get updated props in time
    return this.props.view.state.doc.resolve(pos);
  }

  /**
   * The maxmimum number of grid columns this node can resize to.
   */
  get gridWidth() {
    const { gridSize } = this.props;

    return !(this.wrappedLayout || this.insideInlineLike)
      ? gridSize / 2
      : gridSize;
  }

  calcColumnLeftOffset = () => {
    const { offsetLeft } = this.state;
    return this.insideInlineLike
      ? calcColumnsFromPx(
          offsetLeft,
          this.props.lineLength,
          this.props.gridSize,
        )
      : 0;
  };

  wrapper?: HTMLElement;

  calcPxWidth = (useLayout?: MediaSingleLayout): number => {
    const {
      width: origWidth = 0,
      height: origHeight,
      layout,
      pctWidth,
      lineLength,
      containerWidth,
      fullWidthMode,
      getPos,
      view: { state },
    } = this.props;
    const { resizedPctWidth } = this.state;
    const pos = typeof getPos === 'function' ? getPos() : undefined;

    return calcMediaPxWidth({
      origWidth,
      origHeight,
      pctWidth,
      state,
      containerWidth: { width: containerWidth, lineLength },
      isFullWidthModeEnabled: fullWidthMode,
      layout: useLayout || layout,
      pos,
      resizedPctWidth,
    });
  };

  get insideInlineLike(): boolean {
    const $pos = this.$pos;
    if (!$pos) {
      return false;
    }

    const { listItem } = this.props.view.state.schema.nodes;
    return !!findParentNodeOfTypeClosestToPos($pos, [listItem]);
  }

  get insideLayout(): boolean {
    const $pos = this.$pos;
    if (!$pos) {
      return false;
    }

    const { layoutColumn } = this.props.view.state.schema.nodes;

    return !!findParentNodeOfTypeClosestToPos($pos, [layoutColumn]);
  }

  highlights = (newWidth: number, snapPoints: number[]) => {
    const snapWidth = snapTo(newWidth, snapPoints);
    const { layoutColumn, table, expand, nestedExpand, panel } =
      this.props.view.state.schema.nodes;

    if (
      this.$pos &&
      !!findParentNodeOfTypeClosestToPos(
        this.$pos,
        [layoutColumn, table, expand, nestedExpand, panel].filter(Boolean),
      )
    ) {
      return [];
    }

    if (snapWidth > akEditorWideLayoutWidth) {
      return ['full-width'];
    }

    const { layout, lineLength, gridSize } = this.props;
    const columns = calcColumnsFromPx(snapWidth, lineLength, gridSize);
    const columnWidth = Math.round(columns);
    const highlight: number[] = [];

    if (layout === 'wrap-left' || layout === 'align-start') {
      highlight.push(0, columnWidth);
    } else if (layout === 'wrap-right' || layout === 'align-end') {
      highlight.push(gridSize, gridSize - columnWidth);
    } else if (this.insideInlineLike) {
      highlight.push(Math.round(columns + this.calcColumnLeftOffset()));
    } else {
      highlight.push(
        Math.floor((gridSize - columnWidth) / 2),
        Math.ceil((gridSize + columnWidth) / 2),
      );
    }

    return highlight;
  };

  private saveWrapper = (wrapper: HTMLDivElement) => (this.wrapper = wrapper);

  render() {
    const {
      width: origWidth,
      height: origHeight,
      layout,
      pctWidth,
      containerWidth,
      fullWidthMode,
      selected,
      children,
    } = this.props;

    const initialWidth = this.calcPxWidth(); // width with padding
    let ratio: string | undefined;
    if (origWidth) {
      ratio = ((origHeight / origWidth) * 100).toFixed(3);
    }

    const enable: EnabledHandles = {};
    handleSides.forEach(side => {
      const oppositeSide = side === 'left' ? 'right' : 'left';
      enable[side] =
        ['full-width', 'wide', 'center']
          .concat(`wrap-${oppositeSide}` as MediaSingleLayout)
          .concat(
            `align-${imageAlignmentMap[oppositeSide]}` as MediaSingleLayout,
          )
          .indexOf(layout) > -1;

      if (side === 'left' && this.insideInlineLike) {
        enable[side] = false;
      }
    });

    const snapPointsProps: SnapPointsProps = {
      $pos: this.$pos,
      akEditorWideLayoutWidth: akEditorWideLayoutWidth,
      allowBreakoutSnapPoints: this.props.allowBreakoutSnapPoints,
      containerWidth: this.props.containerWidth,
      gridSize: this.props.gridSize,
      gridWidth: this.gridWidth,
      insideInlineLike: this.insideInlineLike,
      insideLayout: this.insideLayout,
      isVideoFile: this.state.isVideoFile,
      lineLength: this.props.lineLength,
      offsetLeft: this.state.offsetLeft,
      wrappedLayout: this.wrappedLayout,
    };

    const nestedInTableHandleStyles = (isNestedInTable: boolean) => {
      if (!isNestedInTable) {
        return;
      }
      return {
        left: {
          left: `calc(${token('space.025', '0.125em')} * -0.5)`,
          paddingLeft: '0px',
        },
        right: {
          right: `calc(${token('space.025', '0.125em')} * -0.5)`,
          paddingRight: '0px',
        },
      };
    };

    return (
      <div
        ref={this.saveWrapper}
        css={wrapperStyle({
          layout,
          isResized: !!pctWidth,
          containerWidth: containerWidth || origWidth,
          fullWidthMode,
          width: origWidth,
        })}
      >
        <Resizer
          {...this.props}
          displayGrid={this.displayGrid}
          ratio={ratio}
          width={initialWidth}
          selected={selected}
          enable={enable}
          calcNewSize={this.calcNewSize}
          snapPoints={calculateSnapPoints(snapPointsProps)}
          scaleFactor={!this.wrappedLayout && !this.insideInlineLike ? 2 : 1}
          highlights={this.highlights}
          nodeType="media"
          dispatchAnalyticsEvent={this.props.dispatchAnalyticsEvent}
          // when cursor is located below a media with caption,
          // press “Up“ key will result cursor focus on an invalid position, (on the resize handler)
          // This workaround adds an empty div inside the resize handler to prevent the issue.
          handleComponentFunc={() => <div contentEditable={false} />}
          handleStyles={nestedInTableHandleStyles(this.isNestedInTable())}
        >
          {children}
        </Resizer>
      </div>
    );
  }
}
