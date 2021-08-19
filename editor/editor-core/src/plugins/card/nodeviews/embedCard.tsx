import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { Card as SmartCard } from '@atlaskit/smart-card';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import rafSchedule from 'raf-schd';
import { SmartCardProps, Card } from './genericCard';
import {
  UnsupportedBlock,
  MediaSingle as RichMediaWrapper,
  browser,
  findOverflowScrollParent,
} from '@atlaskit/editor-common';
import {
  DEFAULT_EMBED_CARD_HEIGHT,
  DEFAULT_EMBED_CARD_WIDTH,
} from '@atlaskit/editor-shared-styles';
import { RichMediaLayout } from '@atlaskit/adf-schema';
import { SelectionBasedNodeView } from '../../../nodeviews/';
import { registerCard } from '../pm-plugins/actions';
import ResizableEmbedCard from '../ui/ResizableEmbedCard';
import { createDisplayGrid } from '../../../plugins/grid';
import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../width';

import {
  floatingLayouts,
  isRichMediaInsideOfBlockNode,
} from '../../../utils/rich-media-utils';
import { EventDispatcher } from '../../../event-dispatcher';
import { EmbedResizeMessageListener } from '@atlaskit/smart-card';
import { pluginKey as tableResizePluginKey } from '../../table/pm-plugins/table-resizing';
import { ColumnResizingPluginState } from '../../table/types';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';

export type EmbedCardState = {
  hasPreview: boolean;
  liveHeight?: number;
  initialAspectRatio?: number;
};

export class EmbedCardComponent extends React.PureComponent<
  SmartCardProps,
  EmbedCardState
> {
  private scrollContainer?: HTMLElement;
  private embedIframeRef = React.createRef<HTMLIFrameElement>();

  onClick = () => {};

  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  state: EmbedCardState = {
    hasPreview: true,
  };

  UNSAFE_componentWillMount() {
    const { view } = this.props;
    const scrollContainer = findOverflowScrollParent(view.dom as HTMLElement);
    this.scrollContainer = scrollContainer || undefined;
  }

  private getPosSafely = () => {
    const { getPos } = this.props;
    if (!getPos || typeof getPos === 'boolean') {
      return;
    }
    try {
      return getPos();
    } catch (e) {
      // Can blow up in rare cases, when node has been removed.
    }
  };

  onResolve = (data: {
    url?: string;
    title?: string;
    aspectRatio?: number;
  }) => {
    const { view } = this.props;

    const { title, url, aspectRatio } = data;
    const { originalHeight, originalWidth } = this.props.node.attrs;
    if (aspectRatio && !originalHeight && !originalWidth) {
      // Assumption here is if ADF already have both height and width set,
      // we will going to use that later on in this class as aspectRatio
      // Most likely we dealing with an embed that received aspectRatio via onResolve previously
      // and now this information already stored in ADF.
      this.setState({
        initialAspectRatio: aspectRatio,
      });
      this.saveOriginalDimensionsAttributes(
        DEFAULT_EMBED_CARD_HEIGHT,
        DEFAULT_EMBED_CARD_HEIGHT * aspectRatio,
      );
    }

    // don't dispatch immediately since we might be in the middle of
    // rendering a nodeview
    rafSchedule(() => {
      const pos = this.getPosSafely();
      if (pos === undefined) {
        return;
      }
      return view.dispatch(
        registerCard({
          title,
          url,
          pos,
        })(view.state.tr),
      );
    })();

    try {
      const cardContext = this.context.contextAdapter
        ? this.context.contextAdapter.card
        : undefined;

      const hasPreview =
        cardContext &&
        cardContext.value.extractors.getPreview(url, this.props.platform);

      if (!hasPreview) {
        this.setState({
          hasPreview: false,
        });
      }
    } catch (e) {}
  };

  updateSize = (pctWidth: number | null, layout: RichMediaLayout) => {
    const { state, dispatch } = this.props.view;
    const pos = this.getPosSafely();
    if (pos === undefined) {
      return;
    }
    const tr = state.tr.setNodeMarkup(pos, undefined, {
      ...this.props.node.attrs,
      width: pctWidth,
      layout,
    });
    tr.setMeta('scrollIntoView', false);
    dispatch(tr);
    return true;
  };

  private getLineLength = (
    view: EditorView,
    pos: number | boolean,
    originalLineLength: number,
  ): number => {
    if (typeof pos === 'number' && isRichMediaInsideOfBlockNode(view, pos)) {
      const $pos = view.state.doc.resolve(pos);
      const domNode = view.nodeDOM($pos.pos);

      if (
        $pos.nodeAfter &&
        floatingLayouts.indexOf($pos.nodeAfter.attrs.layout) > -1 &&
        domNode &&
        domNode.parentElement
      ) {
        return domNode.parentElement.offsetWidth;
      }

      if (domNode instanceof HTMLElement) {
        return domNode.offsetWidth;
      }
    }

    return originalLineLength;
  };

  /**
   * Even though render is capable of listening and reacting to iframely wrapper iframe sent `resize` events
   * it's good idea to store latest actual height in ADF, so that when renderer (well, editor as well) is loading
   * we will show embed window of appropriate size and avoid unnecessary content jumping.
   */
  saveOriginalDimensionsAttributes = (
    height: number,
    width: number | undefined,
  ) => {
    const { view } = this.props;

    const tableResizeState = tableResizePluginKey.getState(view.state) as
      | ColumnResizingPluginState
      | undefined
      | null;

    // We are not updating ADF when this function fired while table is resizing.
    // Changing ADF in the middle of resize will break table resize plugin logic
    // (tables will be considered different at the end of the drag and cell size won't be stored)
    // But this is not a big problem, editor user will be seeing latest height anyway (via updated state)
    // And even if page to be saved with slightly outdated height, renderer is capable of reading latest height value
    // when embed loads, and so it won't be a problem.
    if (tableResizeState?.dragging) {
      return;
    }

    rafSchedule(() => {
      const pos = this.getPosSafely();
      if (pos === undefined) {
        return;
      }
      view.dispatch(
        view.state.tr
          .step(
            new SetAttrsStep(pos, {
              originalHeight: height,
              originalWidth: width,
            }),
          )
          .setMeta('addToHistory', false),
      );
    })();
  };

  onHeightUpdate = (height: number) => {
    this.setState({ liveHeight: height });
    this.saveOriginalDimensionsAttributes(height, undefined);
  };

  render() {
    const {
      node,
      cardContext,
      platform,
      allowResizing,
      fullWidthMode,
      view,
      dispatchAnalyticsEvent,
      getPos,
    } = this.props;

    let {
      url,
      width: pctWidth,
      layout,
      originalHeight,
      originalWidth,
    } = node.attrs;
    const { hasPreview, liveHeight, initialAspectRatio } = this.state;

    // We don't want to use `originalHeight` when `originalWidth` also present,
    // since `heightAlone` is defined only when just height is available.
    let heightAlone =
      liveHeight ?? ((!originalWidth && originalHeight) || undefined);

    const aspectRatio =
      (!heightAlone && // No need getting aspectRatio if heightAlone defined already
        (initialAspectRatio || // If we have initialAspectRatio (coming from iframely) we should go with that
          (originalHeight &&
            originalWidth &&
            originalWidth / originalHeight))) || // If ADF contains both width and height we get ratio from that
      undefined;

    const cardProps = {
      layout,
      pctWidth,
      fullWidthMode,
    };

    const cardInner = (
      <EmbedResizeMessageListener
        embedIframeRef={this.embedIframeRef}
        onHeightUpdate={this.onHeightUpdate}
      >
        <WithPluginState
          editorView={view}
          plugins={{
            widthState: widthPluginKey,
          }}
          render={({ widthState }) => {
            const widthStateLineLength = widthState?.lineLength || 0;
            const widthStateWidth = widthState?.width || 0;

            const pos = this.getPosSafely();
            if (pos === undefined) {
              return null;
            }
            const lineLength = this.getLineLength(
              view,
              pos,
              widthStateLineLength,
            );

            const containerWidth = isRichMediaInsideOfBlockNode(view, pos)
              ? lineLength
              : widthStateWidth;

            const smartCard = (
              <SmartCard
                url={url}
                appearance="embed"
                onClick={this.onClick}
                onResolve={this.onResolve}
                showActions={platform === 'web'}
                isFrameVisible
                inheritDimensions={true}
                platform={platform}
                container={this.scrollContainer}
                embedIframeRef={this.embedIframeRef}
              />
            );

            if (!allowResizing || !hasPreview) {
              // There are two ways `width` and `height` can be defined here:
              // 1) Either as `heightAlone` as height value and no width
              // 2) or as `1` for height and aspectRation (defined or a default one) as a width
              // See above for how aspectRation is calculated.
              const defaultAspectRatio =
                DEFAULT_EMBED_CARD_WIDTH / DEFAULT_EMBED_CARD_HEIGHT;

              let richMediaWrapperHeight = 1;
              let richMediaWrapperWidth: number | undefined =
                aspectRatio || defaultAspectRatio;

              if (heightAlone) {
                richMediaWrapperHeight = heightAlone;
                richMediaWrapperWidth = undefined;
              }

              return (
                <RichMediaWrapper
                  {...cardProps}
                  height={richMediaWrapperHeight}
                  width={richMediaWrapperWidth}
                  nodeType="embedCard"
                  hasFallbackContainer={hasPreview}
                  lineLength={lineLength}
                  containerWidth={containerWidth}
                >
                  {smartCard}
                </RichMediaWrapper>
              );
            }

            return (
              <ResizableEmbedCard
                {...cardProps}
                height={heightAlone}
                aspectRatio={aspectRatio}
                view={this.props.view}
                getPos={getPos}
                lineLength={lineLength}
                gridSize={12}
                containerWidth={containerWidth}
                displayGrid={createDisplayGrid(
                  this.props.eventDispatcher as EventDispatcher,
                )}
                updateSize={this.updateSize}
                dispatchAnalyticsEvent={dispatchAnalyticsEvent}
              >
                {smartCard}
              </ResizableEmbedCard>
            );
          }}
        />
      </EmbedResizeMessageListener>
    );

    // [WS-2307]: we only render card wrapped into a Provider when the value is ready
    return (
      <>
        {cardContext && cardContext.value ? (
          <cardContext.Provider value={cardContext.value}>
            {cardInner}
          </cardContext.Provider>
        ) : null}
      </>
    );
  }
}

const WrappedBlockCard = Card(EmbedCardComponent, UnsupportedBlock);

export type EmbedCardNodeViewProps = Pick<
  SmartCardProps,
  | 'eventDispatcher'
  | 'allowResizing'
  | 'platform'
  | 'fullWidthMode'
  | 'dispatchAnalyticsEvent'
>;

export class EmbedCard extends SelectionBasedNodeView<EmbedCardNodeViewProps> {
  viewShouldUpdate(nextNode: PMNode) {
    if (this.node.attrs !== nextNode.attrs) {
      return true;
    }

    return super.viewShouldUpdate(nextNode);
  }

  createDomRef(): HTMLElement {
    const domRef = document.createElement('div');
    if (browser.chrome && this.reactComponentProps.platform !== 'mobile') {
      // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
      // see also: https://github.com/ProseMirror/prosemirror/issues/884
      domRef.contentEditable = 'true';
      domRef.setAttribute('spellcheck', 'false');
    }
    return domRef;
  }

  render() {
    const {
      eventDispatcher,
      allowResizing,
      platform,
      fullWidthMode,
      dispatchAnalyticsEvent,
    } = this.reactComponentProps;

    return (
      <WrappedBlockCard
        node={this.node}
        view={this.view}
        eventDispatcher={eventDispatcher}
        getPos={this.getPos}
        allowResizing={allowResizing}
        platform={platform}
        fullWidthMode={fullWidthMode}
        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
      />
    );
  }
}
