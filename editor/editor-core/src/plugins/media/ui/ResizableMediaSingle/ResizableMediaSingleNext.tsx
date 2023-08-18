/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import {
  findParentNodeOfTypeClosestToPos,
  hasParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { getMediaClient } from '@atlaskit/media-client';
import {
  calcPctFromPx,
  wrappedLayouts,
  handleSides,
  imageAlignmentMap,
  calcColumnsFromPx,
} from '@atlaskit/editor-common/ui';
import {
  nonWrappedLayouts,
  setNodeSelection,
} from '@atlaskit/editor-common/utils';
import {
  akEditorFullWidthLayoutWidth,
  akEditorGutterPadding,
  akEditorDefaultLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { wrapperStyle } from './styled';
import type { Props, EnabledHandles } from './types';
import type {
  Dimensions,
  HandleResize,
  HandleResizeStart,
  Position,
  Snap,
} from '@atlaskit/editor-common/resizer';
import { ResizerNext } from '@atlaskit/editor-common/resizer';
import classnames from 'classnames';
import {
  richMediaClassName,
  resizerStyles,
} from '@atlaskit/editor-common/styles';
import {
  MEDIA_SINGLE_MIN_PIXEL_WIDTH,
  MEDIA_SINGLE_SNAP_GAP,
  MEDIA_SINGLE_RESIZE_THROTTLE_TIME,
  calculateOffsetLeft,
  DEFAULT_IMAGE_WIDTH,
  calcMediaSingleMaxWidth,
} from '@atlaskit/editor-common/media-single';
import {
  findClosestSnap,
  getGuidelinesWithHighlights,
  generateDefaultGuidelines,
  generateDynamicGuidelines,
  getGuidelineSnaps,
  getGuidelineTypeFromKey,
  getRelativeGuideSnaps,
  getRelativeGuidelines,
} from '@atlaskit/editor-common/guideline';
import type {
  GuidelineConfig,
  RelativeGuides,
  GuidelineSnapsReference,
} from '@atlaskit/editor-common/guideline';
import memoizeOne from 'memoize-one';
import { getMediaResizeAnalyticsEvent } from '../../utils/analytics';
import throttle from 'lodash/throttle';
import {
  MEDIA_PLUGIN_IS_RESIZING_KEY,
  MEDIA_PLUGIN_RESIZING_WIDTH_KEY,
} from '../../pm-plugins/main';

type State = {
  offsetLeft: number;
  isVideoFile: boolean;
  resizedPctWidth?: number;
  isResizing: boolean;
  size: Dimensions;
  snaps: Snap;
  relativeGuides: RelativeGuides;
  guidelines: GuidelineConfig[];
};

export const resizerNextTestId = 'mediaSingle.resizerNext.testid';

type ResizableMediaSingleNextProps = Props;

class ResizableMediaSingleNext extends React.Component<
  ResizableMediaSingleNextProps,
  State
> {
  private lastSnappedGuidelineKeys: string[] = [];

  constructor(props: ResizableMediaSingleNextProps) {
    super(props);
    const initialWidth = props.mediaSingleWidth || DEFAULT_IMAGE_WIDTH;

    this.state = {
      offsetLeft: calculateOffsetLeft(
        this.insideInlineLike,
        this.insideLayout,
        this.props.view.dom,
        undefined,
      ),
      // We default to true until we resolve the file type
      isVideoFile: true,
      isResizing: false,
      size: {
        width: initialWidth,
        height: this.calcPxHeight(initialWidth),
      },
      snaps: {},
      relativeGuides: {},
      guidelines: [],
    };
  }

  /**
   * Calculate media single node initial width if props.mediaSingleWidth is undefined
   * (Mainly when switching from lagacy experience to new experience).
   *
   * @returns initial width in pixel
   */
  calcInitialWidth() {
    const {
      width: origWidth,
      lineLength: contentWidth,
      containerWidth,
    } = this.props;

    return Math.max(
      Math.min(
        origWidth || DEFAULT_IMAGE_WIDTH,
        contentWidth || containerWidth || akEditorDefaultLayoutWidth,
      ),
      MEDIA_SINGLE_MIN_PIXEL_WIDTH,
    );
  }

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

    if (
      prevProps.mediaSingleWidth !== this.props.mediaSingleWidth &&
      this.props.mediaSingleWidth
    ) {
      // update size when lineLength becomes defined later
      // ensures extended experience renders legacy image with the same size as the legacy experience
      const initialWidth = this.props.mediaSingleWidth;

      this.setState({
        size: {
          width: initialWidth,
          height: this.calcPxHeight(initialWidth),
        },
      });
    }

    if (
      this.props.layout === 'full-width' &&
      !this.isNestedNode() &&
      prevProps.containerWidth !== this.props.containerWidth
    ) {
      // To achieve edge-to-edge for full-width, we need to update its width according to containerWidth
      // Update state to allow resizer to get most up-to-date width to avoid jumping when start resizing
      this.setState((prevState) => {
        return {
          size: {
            width: calcMediaSingleMaxWidth(this.props.containerWidth),
            height: prevState.size.height,
          },
        };
      });
    }

    return true;
  }

  // check if is inside of layout, table, expand, nestedExpand and list item
  isNestedNode() {
    return !!(this.$pos && this.$pos.parent.type.name !== 'doc');
  }

  private getDefaultGuidelines() {
    const { lineLength, containerWidth, fullWidthMode } = this.props;

    // disable guidelines for nested media single node
    return this.isNestedNode()
      ? []
      : generateDefaultGuidelines(lineLength, containerWidth, fullWidthMode);
  }

  private updateGuidelines = () => {
    const { view, lineLength } = this.props;
    const defaultGuidelines = this.getDefaultGuidelines();

    const { relativeGuides, dynamicGuides } = generateDynamicGuidelines(
      view.state,
      lineLength,
      {
        styles: {
          lineStyle: 'dashed',
        },
        show: false,
      },
    );

    // disable guidelines for nested media single node
    const dynamicGuidelines = this.isNestedNode() ? [] : dynamicGuides;

    this.setState({
      relativeGuides,
      guidelines: [...defaultGuidelines, ...dynamicGuidelines],
    });
  };

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
  }

  get aspectRatio() {
    const { width, height } = this.props;
    if (width) {
      return width / height;
    }
    // TODO handle this case
    return 1;
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
    try {
      const state = await mediaClient.file.getCurrentState(mediaNode.attrs.id, {
        collectionName: mediaNode.attrs.collection,
      });
      if (state && state.status !== 'error' && state.mediaType === 'image') {
        this.setState({
          isVideoFile: false,
        });
      }
    } catch (err) {
      this.setState({
        isVideoFile: false,
      });
    }
  }

  calcNewSize = (newWidth: number, stop: boolean) => {
    const {
      layout,
      view: { state },
      containerWidth,
      lineLength,
      fullWidthMode,
    } = this.props;

    const newPct = calcPctFromPx(newWidth, lineLength) * 100;
    this.setState({ resizedPctWidth: newPct });

    let newLayout: MediaSingleLayout = hasParentNodeOfType(
      state.schema.nodes.table,
    )(state.selection)
      ? layout
      : this.calcUnwrappedLayout(
          newWidth,
          containerWidth,
          lineLength,
          fullWidthMode,
        );

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
    width: number,
    containerWidth: number,
    contentWidth: number,
    fullWidthMode?: boolean,
  ): 'center' | 'wide' | 'full-width' => {
    if (fullWidthMode) {
      if (width < contentWidth) {
        return 'center';
      }
      return 'full-width';
    }

    if (width <= contentWidth) {
      return 'center';
    }

    if (
      width <
      Math.min(
        containerWidth - akEditorGutterPadding * 2,
        akEditorFullWidthLayoutWidth,
      )
    ) {
      return 'wide';
    }

    // set full width to be containerWidth - akEditorGutterPadding * 2
    // instead of containerWidth - akEditorBreakoutPadding,
    // so that we have image aligned with text
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

  calcPxHeight = (newWidth: number): number => {
    const { width = newWidth, height } = this.props;
    return Math.round((height / width) * newWidth);
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

  private saveWrapper = (wrapper: HTMLDivElement) => (this.wrapper = wrapper);

  private displayGuideline = (guidelines: GuidelineConfig[]) => {
    const { pluginInjectionApi } = this.props;

    pluginInjectionApi?.dependencies?.guideline?.actions?.displayGuideline(
      this.props.view,
    )({ guidelines });
  };

  private setIsResizing = (isResizing: boolean) => {
    const { state, dispatch } = this.props.view;
    const tr = state.tr;
    tr.setMeta(MEDIA_PLUGIN_IS_RESIZING_KEY, isResizing);
    return dispatch(tr);
  };

  private updateSizeInPluginState = throttle((width?: number) => {
    const { state, dispatch } = this.props.view;
    const tr = state.tr;
    tr.setMeta(MEDIA_PLUGIN_RESIZING_WIDTH_KEY, width);
    return dispatch(tr);
  }, MEDIA_SINGLE_RESIZE_THROTTLE_TIME);

  private calcMaxWidth = memoizeOne(
    (contentWidth: number, containerWidth: number, fullWidthMode?: boolean) => {
      if (this.isNestedNode() || fullWidthMode) {
        return contentWidth;
      }

      return calcMediaSingleMaxWidth(containerWidth);
    },
  );

  private getRelativeGuides = () => {
    const relativeGuides: GuidelineConfig[] =
      this.$pos && this.$pos.nodeAfter && this.state.size.width
        ? getRelativeGuidelines(
            this.state.relativeGuides,
            {
              node: this.$pos.nodeAfter,
              pos: this.$pos.pos,
            },
            this.props.view,
            this.props.lineLength,
            this.state.size,
          )
        : [];

    return relativeGuides;
  };

  updateActiveGuidelines = (
    width = 0,
    guidelines: GuidelineConfig[],
    guidelineSnapsReference: GuidelineSnapsReference,
  ) => {
    if (guidelineSnapsReference.snaps.x) {
      const { gap, keys: activeGuidelineKeys } = findClosestSnap(
        width,
        guidelineSnapsReference.snaps.x,
        guidelineSnapsReference.guidelineReference,
        MEDIA_SINGLE_SNAP_GAP,
      );

      this.lastSnappedGuidelineKeys = activeGuidelineKeys;

      const relativeGuidelines = activeGuidelineKeys.length
        ? []
        : this.getRelativeGuides();

      this.displayGuideline([
        ...getGuidelinesWithHighlights(
          gap,
          MEDIA_SINGLE_SNAP_GAP,
          activeGuidelineKeys,
          guidelines,
        ),
        ...relativeGuidelines,
      ]);
    }
  };

  roundPixelValue = (value: number) => Math.round(value);

  getHeightFromNewWidth = (
    originalWidth: number,
    originalHeight: number,
    newWidth: number,
  ) => this.roundPixelValue((originalHeight / originalWidth) * newWidth);

  calculateSizeState = (
    size: Position & Dimensions,
    delta: Dimensions,
    originalWidth: number = 0,
    originalHeight: number,
    onResizeStop: boolean = false,
  ) => {
    const calculatedWidth = this.roundPixelValue(size.width + delta.width);
    const calculatedWidthWithLayout = this.calcNewSize(
      calculatedWidth,
      onResizeStop,
    );
    const calculatedHeightWithLayout = this.getHeightFromNewWidth(
      originalWidth,
      originalHeight,
      calculatedWidth,
    );

    return {
      width: calculatedWidth,
      height: calculatedHeightWithLayout,
      calculatedWidthWithLayout,
    };
  };

  selectCurrentMediaNode = () => {
    // TODO: if adding !this.props.selected, it doesn't work if media single node is at top postion
    if (typeof this.props.getPos === 'function') {
      const propPos = this.props.getPos();
      if (propPos !== undefined) {
        setNodeSelection(this.props.view, propPos);
      }
    }
  };

  getParentNodeTypeNameFromCurrentPositionNode = () => {
    const $pos = this.$pos;

    if (!$pos) {
      return undefined;
    }

    // Supported Parent Nodes
    const {
      listItem,
      expand,
      tableCell,
      tableHeader,
      layoutSection,
      nestedExpand,
    } = this.props.view.state.schema.nodes;
    const parentNode = findParentNodeOfTypeClosestToPos($pos, [
      listItem,
      expand,
      tableCell,
      tableHeader,
      layoutSection,
      nestedExpand,
    ]);

    // Return matched parent node name
    if (parentNode) {
      return parentNode.node.type.name;
    }

    // Return undefined if parent node cannot be found
    return undefined;
  };

  handleResizeStart: HandleResizeStart = () => {
    this.setState({ isResizing: true });
    this.selectCurrentMediaNode();
    this.setIsResizing(true);
    this.updateSizeInPluginState(this.state.size.width);
    // re-calucate guidelines
    this.updateGuidelines();
  };

  handleResize: HandleResize = (size, delta) => {
    const {
      width: originalWidth,
      height: originalHeight,
      layout,
      updateSize,
      lineLength,
    } = this.props;
    const { width, height, calculatedWidthWithLayout } =
      this.calculateSizeState(size, delta, originalWidth, originalHeight);

    const guidelineSnaps = getGuidelineSnaps(
      this.state.guidelines,
      lineLength,
      layout,
    );

    this.updateActiveGuidelines(width, this.state.guidelines, guidelineSnaps);

    const relativeSnaps = getRelativeGuideSnaps(
      this.state.relativeGuides,
      this.aspectRatio,
    );

    this.setState({
      size: {
        width,
        height,
      },
      snaps: {
        x: [...(guidelineSnaps.snaps.x || []), ...relativeSnaps],
      },
    });

    this.updateSizeInPluginState(width);

    if (calculatedWidthWithLayout.layout !== layout) {
      updateSize(width, calculatedWidthWithLayout.layout);
    }
  };

  handleResizeStop: HandleResize = (size, delta) => {
    const {
      width: originalWidth,
      height: originalHeight,
      updateSize,
      dispatchAnalyticsEvent,
      nodeType,
    } = this.props;
    const { width, height, calculatedWidthWithLayout } =
      this.calculateSizeState(size, delta, originalWidth, originalHeight, true);

    if (dispatchAnalyticsEvent) {
      const event = getMediaResizeAnalyticsEvent(nodeType || 'mediaSingle', {
        width,
        layout: calculatedWidthWithLayout.layout,
        widthType: 'pixel',
        snapType: getGuidelineTypeFromKey(
          this.lastSnappedGuidelineKeys,
          this.state.guidelines,
        ),
        parentNode: this.getParentNodeTypeNameFromCurrentPositionNode(),
      });
      if (event) {
        dispatchAnalyticsEvent(event);
      }
    }

    this.setIsResizing(false);
    this.displayGuideline([]);

    this.setState(
      {
        isResizing: false,
        size: {
          width,
          height,
        },
      },
      () => {
        updateSize(width, calculatedWidthWithLayout.layout);
      },
    );
  };

  render() {
    const {
      width: origWidth,
      layout,
      pctWidth,
      containerWidth,
      fullWidthMode,
      selected,
      children,
      lineLength,
    } = this.props;

    const { isResizing, size } = this.state;

    const enable: EnabledHandles = {};
    handleSides.forEach((side) => {
      const oppositeSide = side === 'left' ? 'right' : 'left';
      enable[side] =
        nonWrappedLayouts
          .concat(`wrap-${oppositeSide}` as MediaSingleLayout)
          .concat(
            `align-${imageAlignmentMap[oppositeSide]}` as MediaSingleLayout,
          )
          .indexOf(layout) > -1;

      if (side === 'left' && this.insideInlineLike) {
        enable[side] = false;
      }
    });

    // TODO: Clean up where this lives and how it gets generated
    const className = classnames(
      richMediaClassName,
      `image-${layout}`,
      isResizing ? 'is-resizing' : 'not-resizing',
      this.props.className,
      {
        'not-resized': !pctWidth,
        'richMedia-selected': selected,
        'rich-media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
      },
    );
    const resizerNextClassName = classnames(className, resizerStyles);

    const maxWidth = this.calcMaxWidth(
      lineLength,
      containerWidth,
      fullWidthMode,
    );

    return (
      <div
        ref={this.saveWrapper}
        css={wrapperStyle({
          layout,
          isResized: !!pctWidth,
          containerWidth: containerWidth || origWidth,
          fullWidthMode,
          mediaSingleWidth: this.state.size.width,
          isNestedNode: this.isNestedNode(),
          isExtendedResizeExperienceOn: true,
        })}
      >
        <ResizerNext
          minWidth={MEDIA_SINGLE_MIN_PIXEL_WIDTH}
          maxWidth={maxWidth}
          className={resizerNextClassName}
          snapGap={MEDIA_SINGLE_SNAP_GAP}
          enable={enable}
          width={size.width}
          handleResizeStart={this.handleResizeStart}
          handleResize={this.handleResize}
          handleResizeStop={this.handleResizeStop}
          snap={this.state.snaps}
          resizeRatio={nonWrappedLayouts.includes(layout) ? 2 : 1}
          data-testid={resizerNextTestId}
        >
          {children}
        </ResizerNext>
      </div>
    );
  }
}

export default ResizableMediaSingleNext;
