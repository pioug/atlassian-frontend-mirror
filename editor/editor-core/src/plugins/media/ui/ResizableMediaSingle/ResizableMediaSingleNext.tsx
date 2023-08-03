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
  DEFAULT_IMAGE_WIDTH,
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
} from '@atlaskit/editor-common/resizer';
import { ResizerNext } from '@atlaskit/editor-common/resizer';
import ResizeLabel from '../../../../ui/Resizer/ResizeLabel';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import { messages } from './resizable-media-single-messages';
import type { MediaEventPayload } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import classnames from 'classnames';
import {
  richMediaClassName,
  resizerStyles,
} from '@atlaskit/editor-common/styles';
import {
  MEDIA_SINGLE_MIN_PIXEL_WIDTH,
  MEDIA_SINGLE_SNAP_GAP,
  MEDIA_SINGLE_HIGHLIGHT_GAP,
} from '@atlaskit/editor-common/media-single';
import {
  findClosestSnap,
  getSnapWidth,
  getGuidelinesWithHighlights,
} from '@atlaskit/editor-common/guideline';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import {
  generateDefaultGuidelines,
  generateDynamicGuidelines,
} from './guidelines';

type State = {
  offsetLeft: number;
  isVideoFile: boolean;
  resizedPctWidth?: number;
  isResizing: boolean;
  size: Dimensions;
};

export const resizerNextTestId = 'mediaSingle.resizerNext.testid';

export function calcOffsetLeft(
  insideInlineLike: boolean,
  insideLayout: boolean,
  pmViewDom: Element,
  wrapper?: HTMLElement,
) {
  if (wrapper && insideInlineLike && !insideLayout) {
    const currentNode: HTMLElement = wrapper;
    const boundingRect = currentNode.getBoundingClientRect();

    return boundingRect.left - pmViewDom.getBoundingClientRect().left;
  }

  return 0;
}

// TODO: Create new fixed image size event
const getResizeAnalyticsEvent = (
  type: string | undefined,
  size: number | null,
  layout: string,
): MediaEventPayload => {
  const actionSubject =
    type === 'embed' ? ACTION_SUBJECT.EMBEDS : ACTION_SUBJECT.MEDIA_SINGLE;
  return {
    action: ACTION.EDITED,
    actionSubject,
    actionSubjectId: ACTION_SUBJECT_ID.RESIZED,
    attributes: {
      size,
      layout,
    },
    eventType: EVENT_TYPE.UI,
  };
};

type ResizableMediaSingleNextProps = Props & WrappedComponentProps;

class ResizableMediaSingleNext extends React.Component<
  ResizableMediaSingleNextProps,
  State
> {
  constructor(props: ResizableMediaSingleNextProps) {
    super(props);
    const initialWidth = props.mediaSingleWidth || this.calcInitialWidth();

    this.state = {
      offsetLeft: calcOffsetLeft(
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

  componentDidUpdate(prevProps: Props, prevState: State) {
    const offsetLeft = calcOffsetLeft(
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
      prevState.isResizing !== this.state.isResizing &&
      this.state.isResizing
    ) {
      const guidelines = this.getDefaultGuidelines();
      this.displayGuideline(guidelines);
    }

    if (
      prevProps.lineLength === undefined &&
      this.props.lineLength !== undefined &&
      this.props.mediaSingleWidth === null
    ) {
      // re-initalises size when lineLength becomes defined later
      // ensures extended experience renders legacy image with the same size as the legacy experience
      const initialWidth = this.calcInitialWidth();

      this.setState({
        size: {
          width: initialWidth,
          height: this.calcPxHeight(initialWidth),
        },
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

  // Calculate width of media nodes for snaps based on dynamic guidelines
  // TODO:  refactor this later, maybe use state to hold snaps array
  private getSnaps() {
    const { view } = this.props;
    const { dom } = view;
    const defaultGuidelines = this.getDefaultGuidelines();
    // disable guidelines for nested media single node
    const dynamicGuidelines = this.isNestedNode()
      ? []
      : generateDynamicGuidelines(view);
    const guidelines = [...defaultGuidelines, ...dynamicGuidelines];
    const mediaSingleSelector =
      'div.mediaSingleView-content-wrap.ProseMirror-selectednode';

    const { width } = dom.getBoundingClientRect();
    const halfWidth = width / 2;

    const selectedMedia = dom.querySelector(mediaSingleSelector);

    if (selectedMedia) {
      const pixelWidth =
        parseFloat(selectedMedia.getAttribute('width') || '') || 0;

      const layout = selectedMedia.getAttribute('layout') as MediaSingleLayout;
      let snap = 0;
      switch (layout) {
        case 'align-start':
        case 'wrap-left':
          snap = pixelWidth - halfWidth;
          break;
        case 'align-end':
        case 'wrap-right':
          snap = width - pixelWidth - halfWidth;
          break;
        case 'center':
        case 'wide':
        case 'full-width':
          snap = -pixelWidth / 2;
          break;
        // we ingnore full-width and wide
        default:
          snap = 0;
      }

      const snapWidths = getSnapWidth(guidelines, pixelWidth, snap, layout);

      const snapToWidths = snapWidths.map((s) => s && s.width);

      // update guidelines
      if (this.state.isResizing) {
        const { gap, keys: activeGuidelineKeys } = findClosestSnap(
          this.state.size.width,
          snapToWidths,
          snapWidths,
          MEDIA_SINGLE_HIGHLIGHT_GAP,
        );

        this.displayGuideline(
          getGuidelinesWithHighlights(
            gap,
            MEDIA_SINGLE_HIGHLIGHT_GAP,
            activeGuidelineKeys,
            guidelines,
          ),
        );
      }

      return snapToWidths.length > 0 ? { x: snapToWidths } : {};
    }
    return {};
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
    } = this.props;

    const newPct = calcPctFromPx(newWidth, this.props.lineLength) * 100;
    this.setState({ resizedPctWidth: newPct });

    let newLayout: MediaSingleLayout = hasParentNodeOfType(
      state.schema.nodes.table,
    )(state.selection)
      ? layout
      : this.calcUnwrappedLayout(newWidth, containerWidth, lineLength);

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
  ): 'center' | 'wide' | 'full-width' => {
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
    tr.setMeta('mediaSinglePlugin.isResizing', isResizing);
    return dispatch(tr);
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
      intl,
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

    /**
     * NEW REFACTOR
     */
    const roundPixelValue = (value: number) => Math.round(value);

    const getHeightFromNewWidth = (
      originalWidth: number,
      originalHeight: number,
      newWidth: number,
    ) => roundPixelValue((originalHeight / originalWidth) * newWidth);

    const calculateSizeState = (
      size: Position & Dimensions,
      delta: Dimensions,
      originalWidth: number = 0,
      originalHeight: number,
      onResizeStop: boolean = false,
    ) => {
      const calculatedWidth = roundPixelValue(size.width + delta.width);
      const calculatedWidthWithLayout = this.calcNewSize(
        calculatedWidth,
        onResizeStop,
      );
      const calculatedHeightWithLayout = getHeightFromNewWidth(
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

    const selectCurrentMediaNode = () => {
      if (!this.props.selected && typeof this.props.getPos === 'function') {
        const propPos = this.props.getPos();
        if (propPos !== undefined) {
          setNodeSelection(this.props.view, propPos);
        }
      }
    };

    const handleResizeStart: HandleResizeStart = () => {
      this.setState({ isResizing: true });
      selectCurrentMediaNode();
      this.setIsResizing(true);

      // TODO: Update once type updated from editor common resizer
      return 0;
    };

    const handleResize: HandleResize = (size, delta) => {
      const {
        width: originalWidth,
        height: originalHeight,
        layout,
        updateSize,
      } = this.props;
      const { width, height, calculatedWidthWithLayout } = calculateSizeState(
        size,
        delta,
        originalWidth,
        originalHeight,
      );

      this.setState({
        size: {
          width,
          height,
        },
      });

      if (calculatedWidthWithLayout.layout !== layout) {
        updateSize(width, calculatedWidthWithLayout.layout);
      }

      // TODO: Update once type updated from editor common resizer
      return 0;
    };

    const handleResizeStop: HandleResize = (size, delta) => {
      const {
        width: originalWidth,
        height: originalHeight,
        updateSize,
        dispatchAnalyticsEvent,
        nodeType,
      } = this.props;
      const { width, height, calculatedWidthWithLayout } = calculateSizeState(
        size,
        delta,
        originalWidth,
        originalHeight,
        true,
      );
      this.setIsResizing(false);
      this.displayGuideline([]);
      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent(
          getResizeAnalyticsEvent(
            nodeType,
            calculatedWidthWithLayout.width,
            calculatedWidthWithLayout.layout,
          ),
        );
      }

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

      // TODO: Update once type updated from editor common resizer
      return 0;
    };

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

    const showSizeGuide = selected || isResizing;
    const label =
      layout === 'full-width'
        ? intl.formatMessage(messages.fullWidthImage)
        : `${this.state.size.width} x ${this.state.size.height}`;

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
          className={resizerNextClassName}
          snapGap={MEDIA_SINGLE_SNAP_GAP}
          enable={enable}
          width={size.width}
          handleResizeStart={handleResizeStart}
          handleResize={handleResize}
          handleResizeStop={handleResizeStop}
          snap={this.getSnaps()}
          resizeRatio={nonWrappedLayouts.includes(layout) ? 2 : 1}
          data-testid={resizerNextTestId}
        >
          {showSizeGuide && (
            <ResizeLabel label={label} containerWidth={this.state.size.width} />
          )}
          {children}
        </ResizerNext>
      </div>
    );
  }
}

// for testing purpose
export { ResizableMediaSingleNext as UnwrappedResizableMediaSingleNext };
export default injectIntl(ResizableMediaSingleNext);
