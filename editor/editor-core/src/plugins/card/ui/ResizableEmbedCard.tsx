import React from 'react';
import {
  findParentNodeOfTypeClosestToPos,
  hasParentNodeOfType,
} from 'prosemirror-utils';
import { RichMediaLayout } from '@atlaskit/adf-schema';
import {
  calcPxFromColumns,
  calcPctFromPx,
  calcColumnsFromPx,
  wrappedLayouts,
} from '@atlaskit/editor-common';
import {
  akEditorWideLayoutWidth,
  akEditorBreakoutPadding,
} from '@atlaskit/editor-shared-styles';

import { Wrapper } from '../../../ui/Resizer/styled';
import { Props, EnabledHandles } from '../../../ui/Resizer/types';
import Resizer from '../../../ui/Resizer';
import {
  snapTo,
  handleSides,
  imageAlignmentMap,
} from '../../../ui/Resizer/utils';
import { calcMediaPxWidth } from '../../../plugins/media/utils/media-single';

type State = {
  offsetLeft: number;
  resizedPctWidth?: number;
};

export default class ResizableEmbedCard extends React.Component<Props, State> {
  state: State = {
    offsetLeft: this.calcOffsetLeft(),
  };

  componentDidUpdate() {
    const offsetLeft = this.calcOffsetLeft();
    if (offsetLeft !== this.state.offsetLeft && offsetLeft >= 0) {
      this.setState({ offsetLeft });
    }
  }

  get wrappedLayout() {
    return wrappedLayouts.indexOf(this.props.layout) > -1;
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.layout !== nextProps.layout) {
      this.checkLayout(this.props.layout, nextProps.layout);
    }
  }

  /**
   * When returning to center layout from a wrapped/aligned layout, it might actually
   * be wide or full-width
   */
  checkLayout(oldLayout: RichMediaLayout, newLayout: RichMediaLayout) {
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

    let newLayout: RichMediaLayout = hasParentNodeOfType(
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

    const { containerWidth, lineLength } = this.props;
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

    const isTopLevel = $pos.parent.type.name === 'doc';
    if (isTopLevel) {
      snapPoints.push(akEditorWideLayoutWidth);
      const fullWidthPoint = containerWidth - akEditorBreakoutPadding;
      if (fullWidthPoint > akEditorWideLayoutWidth) {
        snapPoints.push(fullWidthPoint);
      }
    }
    return snapPoints;
  }

  calcPxWidth = (useLayout?: RichMediaLayout): number => {
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
      children,
    } = this.props;

    const pxWidth = this.calcPxWidth();

    // scale, keeping aspect ratio
    const height = (origHeight / origWidth) * pxWidth;
    const width = pxWidth;

    const enable: EnabledHandles = {};
    handleSides.forEach(side => {
      const oppositeSide = side === 'left' ? 'right' : 'left';
      enable[side] =
        ['full-width', 'wide', 'center']
          .concat(`wrap-${oppositeSide}` as RichMediaLayout)
          .concat(`align-${imageAlignmentMap[oppositeSide]}` as RichMediaLayout)
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
        innerRef={(elem?: HTMLElement) => (this.wrapper = elem)}
        fullWidthMode={fullWidthMode}
      >
        <Resizer
          {...this.props}
          width={width}
          height={height}
          enable={enable}
          calcNewSize={this.calcNewSize}
          snapPoints={this.calcSnapPoints()}
          scaleFactor={!this.wrappedLayout && !this.insideInlineLike ? 2 : 1}
          highlights={this.highlights}
          innerPadding={12}
          nodeType="embed"
        >
          {children}
        </Resizer>
      </Wrapper>
    );
  }
}
