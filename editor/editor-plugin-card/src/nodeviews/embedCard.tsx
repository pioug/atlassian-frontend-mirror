import React, { type ComponentProps } from 'react';

import rafSchedule from 'raf-schd';
import uuid from 'uuid/v4';

import type { RichMediaLayout } from '@atlaskit/adf-schema';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import { EditorCardProvider } from '@atlaskit/editor-card-provider';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { getPosHandler } from '@atlaskit/editor-common/react-node-view';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type {
	ColumnResizingPluginState,
	ExtractInjectionAPI,
	GridType,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import {
	findOverflowScrollParent,
	MediaSingle as RichMediaWrapper,
	UnsupportedBlock,
} from '@atlaskit/editor-common/ui';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { floatingLayouts, isRichMediaInsideOfBlockNode } from '@atlaskit/editor-common/utils';
import { type EditorViewModePluginState } from '@atlaskit/editor-plugin-editor-viewmode';
import type { Highlights } from '@atlaskit/editor-plugin-grid';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorFullPageNarrowBreakout,
	DEFAULT_EMBED_CARD_HEIGHT,
	DEFAULT_EMBED_CARD_WIDTH,
} from '@atlaskit/editor-shared-styles';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { EmbedResizeMessageListener, Card as SmartCard } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { cardPlugin } from '../index';
import { registerCard, removeCard } from '../pm-plugins/actions';
import ResizableEmbedCard from '../ui/ResizableEmbedCard';

import { BlockCardComponent } from './blockCard';
import type { SmartCardProps } from './genericCard';
import { Card } from './genericCard';

interface CardProps {
	fullWidthMode?: boolean;
	layout: RichMediaLayout;
	pctWidth?: number;
}

interface CardInnerProps {
	allowResizing: boolean | undefined;
	aspectRatio: number;
	cardProps: CardProps;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
	eventDispatcher: EventDispatcher;
	getLineLength: (view: EditorView, pos: number | boolean, originalLineLength: number) => number;
	getPos: getPosHandler;
	getPosSafely: () => number | undefined;
	hasPreview: boolean;
	heightAlone: number;
	pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined;
	smartCard: React.ReactElement;
	updateSize: (pctWidth: number | null, layout: RichMediaLayout) => boolean | undefined;
	view: EditorView;
}

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<typeof cardPlugin>,
		'width' | 'editorDisabled'
	>,
) => {
	return {
		widthStateLineLength: states.widthState?.lineLength || 0,
		widthStateWidth: states.widthState?.width || 0,
		editorDisabled: states.editorDisabledState?.editorDisabled,
	};
};

const CardInner = ({
	pluginInjectionApi,
	getPosSafely,
	getLineLength,
	view,
	smartCard,
	updateSize,
	getPos,
	aspectRatio,
	allowResizing,
	hasPreview,
	heightAlone,
	cardProps,
	dispatchAnalyticsEvent,
}: CardInnerProps) => {
	const { widthStateLineLength, widthStateWidth, editorDisabled } =
		useSharedPluginStateWithSelector(pluginInjectionApi, ['width', 'editorDisabled'], selector);

	const pos = getPosSafely();
	if (pos === undefined) {
		return null;
	}
	const lineLength = getLineLength(view, pos, widthStateLineLength);

	const containerWidth = isRichMediaInsideOfBlockNode(view, pos) ? lineLength : widthStateWidth;

	if (!allowResizing || !hasPreview) {
		// There are two ways `width` and `height` can be defined here:
		// 1) Either as `heightAlone` as height value and no width
		// 2) or as `1` for height and aspectRation (defined or a default one) as a width
		// See above for how aspectRation is calculated.
		const defaultAspectRatio = DEFAULT_EMBED_CARD_WIDTH / DEFAULT_EMBED_CARD_HEIGHT;

		let richMediaWrapperHeight = 1;
		let richMediaWrapperWidth: number | undefined = aspectRatio || defaultAspectRatio;

		if (heightAlone) {
			richMediaWrapperHeight = heightAlone;
			richMediaWrapperWidth = undefined;
		}

		return (
			<RichMediaWrapper
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
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

	const displayGrid = (visible: boolean, gridType: GridType, highlight: number[] | string[]) =>
		pluginInjectionApi?.grid?.actions?.displayGrid(view)({
			visible,
			gridType,
			highlight: highlight as Highlights,
		});

	return (
		<ResizableEmbedCard
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...cardProps}
			height={heightAlone}
			aspectRatio={aspectRatio}
			view={view}
			getPos={getPos}
			lineLength={lineLength}
			gridSize={12}
			containerWidth={containerWidth}
			displayGrid={displayGrid}
			updateSize={updateSize}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			isResizeDisabled={editorDisabled}
		>
			{smartCard}
		</ResizableEmbedCard>
	);
};

export type EmbedCardState = {
	hasPreview: boolean;
	initialAspectRatio?: number;
	isSSRDataAvailable?: boolean;
	liveHeight?: number;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class EmbedCardComponent extends React.PureComponent<
	SmartCardProps & { id?: string },
	EmbedCardState
> {
	private scrollContainer?: HTMLElement;
	private embedIframeRef = React.createRef<HTMLIFrameElement>();

	constructor(props: SmartCardProps & { id?: string }) {
		super(props);
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		this.scrollContainer = findOverflowScrollParent(props.view.dom as HTMLElement) || undefined;
		this.state = {
			hasPreview: true,
			isSSRDataAvailable:
				expValEquals('platform_editor_smart_card_otp', 'isEnabled', true) && props.isPageSSRed,
		};
	}

	state: EmbedCardState;

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

	onResolve = (data: { aspectRatio?: number; title?: string; url?: string }) => {
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
					id: this.props.id,
				})(view.state.tr),
			);
		})();

		try {
			const cardContext = this.props.cardContext?.value ? this.props.cardContext?.value : undefined;

			const hasPreview = url && cardContext && cardContext.extractors.getPreview(url, 'web');

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
	saveOriginalDimensionsAttributes = (height: number, width: number | undefined) => {
		const { view } = this.props;

		// Please, do not copy or use this kind of code below
		// @ts-ignore
		const fakeTableResizePluginKey = {
			key: 'tableFlexiColumnResizing$',
			getState: (state: EditorState) => {
				// eslint-disable-next-line
				return (state as any)['tableFlexiColumnResizing$'];
			},
		} as PluginKey;
		const fakeTableResizeState = fakeTableResizePluginKey.getState(view.state) as
			| ColumnResizingPluginState
			| undefined
			| null;

		// We are not updating ADF when this function fired while table is resizing.
		// Changing ADF in the middle of resize will break table resize plugin logic
		// (tables will be considered different at the end of the drag and cell size won't be stored)
		// But this is not a big problem, editor user will be seeing latest height anyway (via updated state)
		// And even if page to be saved with slightly outdated height, renderer is capable of reading latest height value
		// when embed loads, and so it won't be a problem.
		if (fakeTableResizeState?.dragging) {
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

	onError = ({ err }: { err?: Error }) => {
		if (err) {
			throw err;
		}
	};

	componentDidMount() {
		if (!expValEquals('platform_editor_smart_card_otp', 'isEnabled', true)) {
			return;
		}

		const provider = this.props.provider;

		if (!provider) {
			return;
		}

		const updateSSRDataAvailability = async () => {
			const resolvedProvider = await provider;

			if (resolvedProvider instanceof EditorCardProvider) {
				this.setState((state) => ({
					...state,
					isSSRDataAvailable: resolvedProvider.getCacheStatusForNode(this.props.node) === 'ssr',
				}));
			}
		};

		void updateSSRDataAvailability();
	}

	componentWillUnmount(): void {
		this.removeCard();
	}

	private removeCardDispatched = false;

	private removeCard() {
		if (this.removeCardDispatched) {
			return;
		}
		this.removeCardDispatched = true;
		const { tr } = this.props.view.state;
		removeCard({ id: this.props.id })(tr);
		this.props.view.dispatch(tr);
	}

	render() {
		const {
			node,
			allowResizing,
			fullWidthMode,
			view,
			dispatchAnalyticsEvent,
			getPos,
			pluginInjectionApi,
			actionOptions,
			onClick,
			CompetitorPrompt,
			isPageSSRed,
		} = this.props;

		const { url, width: pctWidth, layout, originalHeight, originalWidth } = node.attrs;

		const { hasPreview, liveHeight, initialAspectRatio } = this.state;

		// We don't want to use `originalHeight` when `originalWidth` also present,
		// since `heightAlone` is defined only when just height is available.
		const heightAlone = liveHeight ?? ((!originalWidth && originalHeight) || undefined);

		const aspectRatio =
			(!heightAlone && // No need getting aspectRatio if heightAlone defined already
				(initialAspectRatio || // If we have initialAspectRatio (coming from iframely) we should go with that
					(originalHeight && originalWidth && originalWidth / originalHeight))) || // If ADF contains both width and height we get ratio from that
			undefined;

		const cardProps = {
			layout,
			pctWidth,
			fullWidthMode,
		};

		const smartCard =
			isPageSSRed && expValEquals('platform_editor_smart_card_otp', 'isEnabled', true) ? (
				<CardSSR
					key={url}
					url={url}
					appearance="embed"
					onClick={onClick}
					onResolve={this.onResolve}
					onError={this.onError}
					frameStyle="show"
					inheritDimensions={true}
					platform={'web'}
					container={this.scrollContainer}
					embedIframeRef={this.embedIframeRef}
					actionOptions={actionOptions}
					CompetitorPrompt={CompetitorPrompt}
					hideIconLoadingSkeleton={
						expValEquals('platform_editor_smart_card_otp', 'isEnabled', true) &&
						this.state.isSSRDataAvailable
					}
				/>
			) : (
				<SmartCard
					key={url}
					url={url}
					appearance="embed"
					onClick={onClick}
					onResolve={this.onResolve}
					onError={this.onError}
					frameStyle="show"
					inheritDimensions={true}
					platform={'web'}
					container={this.scrollContainer}
					embedIframeRef={this.embedIframeRef}
					actionOptions={actionOptions}
					CompetitorPrompt={CompetitorPrompt}
				/>
			);

		return (
			<EmbedResizeMessageListener
				embedIframeRef={this.embedIframeRef}
				onHeightUpdate={this.onHeightUpdate}
			>
				<CardInner
					pluginInjectionApi={pluginInjectionApi}
					smartCard={smartCard}
					hasPreview={hasPreview}
					getPosSafely={this.getPosSafely}
					view={view}
					getLineLength={this.getLineLength}
					eventDispatcher={this.props.eventDispatcher as EventDispatcher}
					updateSize={this.updateSize}
					getPos={getPos}
					aspectRatio={aspectRatio}
					allowResizing={allowResizing}
					heightAlone={heightAlone}
					cardProps={cardProps}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
				/>
			</EmbedResizeMessageListener>
		);
	}
}

export const EmbedOrBlockCardComponent = (props: ComponentProps<typeof EmbedCardComponent>) => {
	const width = useSharedPluginStateSelector(props.pluginInjectionApi, 'width.width');
	const viewAsBlockCard = width && width <= akEditorFullPageNarrowBreakout;

	return viewAsBlockCard ? (
		<BlockCardComponent
			id={props.id}
			node={props.node}
			view={props.view}
			getPos={props.getPos}
			pluginInjectionApi={props.pluginInjectionApi}
			actionOptions={props.actionOptions}
			onClick={props.onClick}
			CompetitorPrompt={props.CompetitorPrompt}
			allowResizing={props.allowResizing}
			fullWidthMode={props.fullWidthMode}
			dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
			eventDispatcher={props.eventDispatcher}
			cardContext={props.cardContext}
			smartCard={props.smartCard}
			hasPreview={props.hasPreview}
			liveHeight={props.liveHeight}
			initialAspectRatio={props.initialAspectRatio}
			isPageSSRed={props.isPageSSRed}
			provider={props.provider}
		/>
	) : (
		<EmbedCardComponent
			id={props.id}
			node={props.node}
			view={props.view}
			getPos={props.getPos}
			pluginInjectionApi={props.pluginInjectionApi}
			actionOptions={props.actionOptions}
			onClick={props.onClick}
			CompetitorPrompt={props.CompetitorPrompt}
			allowResizing={props.allowResizing}
			fullWidthMode={props.fullWidthMode}
			dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
			eventDispatcher={props.eventDispatcher}
			cardContext={props.cardContext}
			smartCard={props.smartCard}
			hasPreview={props.hasPreview}
			liveHeight={props.liveHeight}
			initialAspectRatio={props.initialAspectRatio}
			isPageSSRed={props.isPageSSRed}
			provider={props.provider}
		/>
	);
};

const WrappedEmbedCardWithCondition = componentWithCondition(
	() =>
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		}),
	EmbedOrBlockCardComponent,
	EmbedCardComponent,
);

const WrappedEmbedCard = Card(WrappedEmbedCardWithCondition, UnsupportedBlock);

export type EmbedCardNodeViewProps = Pick<
	SmartCardProps,
	| 'eventDispatcher'
	| 'allowResizing'
	| 'fullWidthMode'
	| 'dispatchAnalyticsEvent'
	| 'pluginInjectionApi'
	| 'actionOptions'
	| 'onClickCallback'
	| 'isPageSSRed'
	| 'provider'
	| 'CompetitorPrompt'
>;

export class EmbedCard extends ReactNodeView<EmbedCardNodeViewProps> {
	private id = uuid();

	unsubscribe: (() => void) | undefined;

	viewShouldUpdate(nextNode: PMNode) {
		if (this.node.attrs !== nextNode.attrs) {
			return true;
		}

		return super.viewShouldUpdate(nextNode);
	}

	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');
		// It is a tradeoff for the bug mentioned that occurs in Chrome: https://product-fabric.atlassian.net/browse/ED-5379, https://github.com/ProseMirror/prosemirror/issues/884
		this.unsubscribe =
			this.reactComponentProps.pluginInjectionApi?.editorViewMode?.sharedState.onChange(
				({ nextSharedState }) => this.updateContentEditable(nextSharedState, domRef),
			);
		this.updateContentEditable(
			this.reactComponentProps.pluginInjectionApi?.editorViewMode?.sharedState.currentState(),
			domRef,
		);
		domRef.setAttribute('spellcheck', 'false');
		return domRef;
	}

	private updateContentEditable = (
		editorViewModeState: EditorViewModePluginState | null | undefined,
		divElement: HTMLDivElement,
	) => {
		divElement.contentEditable = editorViewModeState?.mode === 'view' ? 'false' : 'true';
	};

	render() {
		const {
			eventDispatcher,
			allowResizing,
			fullWidthMode,
			dispatchAnalyticsEvent,
			pluginInjectionApi,
			onClickCallback,
			CompetitorPrompt,
			isPageSSRed,
			provider,
		} = this.reactComponentProps;

		return (
			<WrappedEmbedCard
				node={this.node}
				view={this.view}
				eventDispatcher={eventDispatcher}
				getPos={this.getPos}
				allowResizing={allowResizing}
				fullWidthMode={fullWidthMode}
				dispatchAnalyticsEvent={dispatchAnalyticsEvent}
				pluginInjectionApi={pluginInjectionApi}
				onClickCallback={onClickCallback}
				id={this.id}
				CompetitorPrompt={CompetitorPrompt}
				isPageSSRed={isPageSSRed}
				provider={provider}
			/>
		);
	}

	destroy() {
		this.unsubscribe?.();
		super.destroy();
	}
}

export interface EmbedCardNodeViewProperties {
	actionOptions: EmbedCardNodeViewProps['actionOptions'];
	allowResizing: EmbedCardNodeViewProps['allowResizing'];
	CompetitorPrompt?: EmbedCardNodeViewProps['CompetitorPrompt'];
	fullWidthMode: EmbedCardNodeViewProps['fullWidthMode'];
	isPageSSRed: EmbedCardNodeViewProps['isPageSSRed'];
	onClickCallback: EmbedCardNodeViewProps['onClickCallback'];
	pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined;
	pmPluginFactoryParams: PMPluginFactoryParams;
	provider: EmbedCardNodeViewProps['provider'];
}

export const embedCardNodeView =
	({
		allowResizing,
		fullWidthMode,
		pmPluginFactoryParams,
		pluginInjectionApi,
		actionOptions,
		onClickCallback,
		CompetitorPrompt,
		isPageSSRed,
		provider,
	}: EmbedCardNodeViewProperties) =>
	(node: PMNode, view: EditorView, getPos: () => number | undefined) => {
		const { portalProviderAPI, eventDispatcher, dispatchAnalyticsEvent } = pmPluginFactoryParams;
		const reactComponentProps: EmbedCardNodeViewProps = {
			eventDispatcher,
			allowResizing,
			fullWidthMode,
			dispatchAnalyticsEvent,
			pluginInjectionApi,
			actionOptions,
			onClickCallback: onClickCallback,
			CompetitorPrompt,
			isPageSSRed,
			provider,
		};

		return new EmbedCard(
			node,
			view,
			getPos,
			portalProviderAPI,
			eventDispatcher,
			reactComponentProps,
		).init();
	};
