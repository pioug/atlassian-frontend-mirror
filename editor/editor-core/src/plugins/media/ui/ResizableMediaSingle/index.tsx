import React from 'react';
import {
  findParentNodeOfTypeClosestToPos,
  hasParentNodeOfType,
} from 'prosemirror-utils';
import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import { MediaClientConfig } from '@atlaskit/media-core';
import { getMediaClient } from '@atlaskit/media-client';
import {
  akEditorWideLayoutWidth,
  calcPxFromColumns,
  calcPctFromPx,
  akEditorBreakoutPadding,
  calcColumnsFromPx,
  wrappedLayouts,
} from '@atlaskit/editor-common';

import { Wrapper } from './styled';
import { Props, EnabledHandles } from './types';
import Resizer from '../../../../ui/Resizer';
import {
  snapTo,
  handleSides,
  imageAlignmentMap,
} from '../../../../ui/Resizer/utils';
import { calcMediaPxWidth } from '../../utils/media-single';
import { getPluginState } from '../../../table/pm-plugins/table-resizing/plugin-factory';
import { ColumnResizingPluginState } from '../../../table/types';

type State = {
  offsetLeft: number;
  isVideoFile: boolean;
  resizedPctWidth?: number;
};

export default class ResizableMediaSingle extends React.Component<
  Props,
  State
> {
  state: State = {
    offsetLeft: this.calcOffsetLeft(),

    // We default to true until we resolve the file type
    isVideoFile: true,
  };

  componentDidUpdate() {
    const offsetLeft = this.calcOffsetLeft();
    if (offsetLeft !== this.state.offsetLeft && offsetLeft >= 0) {
      this.setState({ offsetLeft });
    }

    return true;
  }

  get wrappedLayout() {
    return wrappedLayouts.indexOf(this.props.layout) > -1;
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
    if (!mediaNode || !mediaNode.attrs.id) {
      return;
    }

    const mediaClient = getMediaClient(viewMediaClientConfig);
    const state = await mediaClient.file.getCurrentState(mediaNode.attrs.id, {
      collectionName: mediaNode.attrs.collection,
    });
    if (state && state.status !== 'error' && state.mediaType === 'image') {
      this.setState({
        isVideoFile: false,
      });
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

  calcOffsetLeft() {
    let offsetLeft = 0;
    if (this.wrapper && this.insideInlineLike) {
      const currentNode: HTMLElement = this.wrapper;
      const boundingRect = currentNode.getBoundingClientRect();
      const pmRect = this.props.view.dom.getBoundingClientRect();
      offsetLeft = boundingRect.left - pmRect.left;
    }
    return offsetLeft;
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
  calcSnapPoints() {
    const { offsetLeft } = this.state;

    const { containerWidth, lineLength, allowBreakoutSnapPoints } = this.props;
    const snapTargets: number[] = [];
    for (let i = 0; i < this.gridWidth; i++) {
      snapTargets.push(
        calcPxFromColumns(i, lineLength, this.gridWidth) - offsetLeft,
      );
    }
    // full width
    snapTargets.push(lineLength - offsetLeft);

    const minimumWidth = calcPxFromColumns(
      this.wrappedLayout || this.insideInlineLike ? 1 : 2,
      lineLength,
      this.props.gridSize,
    );

    let snapPoints = snapTargets.filter(width => width >= minimumWidth);
    const $pos = this.$pos;
    if (!$pos) {
      return snapPoints;
    }

    const { isVideoFile } = this.state;

    snapPoints = isVideoFile
      ? snapPoints.filter(width => width > 320)
      : snapPoints;

    const isTopLevel = $pos.parent.type.name === 'doc';
    if (isTopLevel && allowBreakoutSnapPoints) {
      snapPoints.push(akEditorWideLayoutWidth);
      const fullWidthPoint = containerWidth - akEditorBreakoutPadding;
      if (fullWidthPoint > akEditorWideLayoutWidth) {
        snapPoints.push(fullWidthPoint);
      }
    }
    return snapPoints;
  }

  calcPxWidth = (useLayout?: MediaSingleLayout): number => {
    const {
      width: origWidth,
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
      pos: pos,
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

  highlights = (newWidth: number, snapPoints: number[]) => {
    const snapWidth = snapTo(newWidth, snapPoints);
    const {
      layoutColumn,
      table,
      expand,
      nestedExpand,
    } = this.props.view.state.schema.nodes;

    if (
      this.$pos &&
      !!findParentNodeOfTypeClosestToPos(
        this.$pos,
        [layoutColumn, table, expand, nestedExpand].filter(Boolean),
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

  render() {
    const {
      width: origWidth,
      height: origHeight,
      layout,
      pctWidth,
      containerWidth,
      fullWidthMode,
      selected,
      view: { state },
      children,
    } = this.props;

    const pxWidth = this.calcPxWidth();

    // scale, keeping aspect ratio
    const height = (origHeight / origWidth) * pxWidth;
    const width = pxWidth;

    const enable: EnabledHandles = {};
    handleSides.forEach((side: 'left' | 'right') => {
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

    return (
      <Wrapper
        ratio={((height / width) * 100).toFixed(3)}
        layout={layout}
        isResized={!!pctWidth}
        containerWidth={containerWidth || origWidth}
        innerRef={(elem: any) => (this.wrapper = elem)}
        fullWidthMode={fullWidthMode}
        // data-node-type="mediaSingle"
      >
        <Resizer
          {...this.props}
          width={width}
          height={height}
          selected={selected}
          enable={enable}
          calcNewSize={this.calcNewSize}
          snapPoints={this.calcSnapPoints()}
          scaleFactor={!this.wrappedLayout && !this.insideInlineLike ? 2 : 1}
          highlights={this.highlights}
          handleResizeStart={() => {
            const columResizingPluginState:
              | ColumnResizingPluginState
              | undefined = getPluginState(state);
            return columResizingPluginState
              ? !columResizingPluginState.dragging
              : true;
          }}
          nodeType="media"
          dispatchAnalyticsEvent={this.props.dispatchAnalyticsEvent}
        >
          {children}
        </Resizer>
      </Wrapper>
    );
  }
}
