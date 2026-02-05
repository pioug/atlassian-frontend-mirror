import type { ComponentType } from 'react';
import React from 'react';

import { type GetPMNodeHeight } from '@atlaskit/editor-common/extensibility';
import type { Fragment, Mark, Node } from '@atlaskit/editor-prosemirror/model';
import { MarkType } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { AnalyticsEventPayload } from '../analytics/events';
import type { Serializer } from '../serializer';
import type {
	HeadingAnchorLinksProps,
	NodeComponentsProps,
	RendererAppearance,
	RendererContentMode,
	StickyHeaderConfig,
} from '../ui/Renderer/types';
import type { TextWrapper } from './nodes';
import {
	Doc,
	DocWithSelectAllTrap,
	isTextNode,
	isTextWrapper,
	mergeTextNodes,
	toReact,
} from './nodes';
import TextWrapperComponent from './nodes/text-wrapper';
import { isNestedHeaderLinksEnabled } from './utils/links';

import type {
	ExtensionHandlers,
	ExtensionParams,
	Parameters,
} from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { getColumnWidths } from '@atlaskit/editor-common/utils';
import { getMarksByOrder, isSameMark } from '@atlaskit/editor-common/validator';
import { findChildrenByMark, findChildrenByType } from '@atlaskit/editor-prosemirror/utils';
import type { EmojiResourceConfig } from '@atlaskit/emoji/resource';
import { fg } from '@atlaskit/platform-feature-flags';
import type { MediaOptions } from '../types/mediaOptions';
import type { SmartLinksOptions } from '../types/smartLinksOptions';
import { getText } from '../utils';
import { isAnnotationMark, toReact as markToReact } from './marks';
import { isCodeMark } from './marks/code';
import {
	insideBlockNode,
	insideBreakoutExpand,
	insideBreakoutLayout,
	insideMultiBodiedExtension,
	insideTable,
} from './renderer-node';
import type {
	AnnotationMarkMeta,
	ExtensionViewportSize,
	MarkMeta,
	NodeMeta,
	RendererContext,
	TextHighlighter,
} from './types';
import { renderTextSegments } from './utils/render-text-segments';
import { segmentText } from './utils/segment-text';
import { getStandaloneBackgroundColorMarks } from './utils/getStandaloneBackgroundColorMarks';
import { markBlockAsInline } from './utils/markBlockAsInline';

export interface ReactSerializerInit {
	allowAltTextOnImages?: boolean;
	allowAnnotations?: boolean;
	allowColumnSorting?: boolean;
	allowCopyToClipboard?: boolean;
	allowCustomPanels?: boolean;
	allowFixedColumnWidthOption?: boolean;
	allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
	allowMediaLinking?: boolean;
	allowPlaceholderText?: boolean;
	allowSelectAllTrap?: boolean;
	allowTableAlignment?: boolean;
	allowTableResizing?: boolean;
	allowWindowedCodeBlock?: boolean;
	allowWrapCodeBlock?: boolean;
	appearance?: RendererAppearance;
	contentMode?: RendererContentMode;
	disableActions?: boolean;
	disableHeadingIDs?: boolean;
	disableTableOverflowShadow?: boolean;
	emojiResourceConfig?: EmojiResourceConfig;
	eventHandlers?: EventHandlers;
	extensionHandlers?: ExtensionHandlers;
	extensionViewportSizes?: ExtensionViewportSize[];
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	getExtensionHeight?: GetPMNodeHeight;
	isInsideOfInlineExtension?: boolean;
	isPresentational?: boolean;
	media?: MediaOptions;
	nodeComponents?: NodeComponentsProps;
	objectContext?: RendererContext;
	onSetLinkTarget?: (url: string) => '_blank' | undefined;
	portal?: HTMLElement;
	providers?: ProviderFactory;
	shouldDisplayExtensionAsInline?: (extensionParams: ExtensionParams<Parameters>) => boolean;
	shouldOpenMediaViewer?: boolean;
	smartLinks?: SmartLinksOptions;
	/**
	 * Used for to set positions on nodes for annotations.
	 *
	 * When not provided defaults to 1.
	 */
	startPos?: number;
	stickyHeaders?: StickyHeaderConfig;
	surroundTextNodesWithTextWrapper?: boolean;
	textHighlighter?: TextHighlighter;
}

interface ParentInfo {
	parentIsIncompleteTask: boolean;
	path: Array<Node>;
	pos: number;
}

interface FragmentChildContext {
	index: number;
	parentInfo?: ParentInfo;
}

interface ParentNodeInfo {
	path: Array<Node>;
	pos: number;
}

interface ParentMarkInfo {
	path: Array<Mark>;
}

type SerializeMarkProps = {
	mark: Mark;
	parentMark: ParentMarkInfo;
	parentNode: ParentNodeInfo;
};

type MarkWithContent = Partial<Mark> & {
	content: Array<MarkWithContent | Node>;
};

function mergeMarks(marksAndNodes: Array<MarkWithContent | Node>) {
	return marksAndNodes.reduce(
		(acc, markOrNode) => {
			const prev = (acc.length && acc[acc.length - 1]) || null;

			if (
				markOrNode.type instanceof MarkType &&
				prev &&
				prev.type instanceof MarkType &&
				Array.isArray(prev.content) &&
				isSameMark(prev as Mark, markOrNode as Mark)
			) {
				(prev as MarkWithContent).content = mergeMarks(
					prev.content.concat((markOrNode as MarkWithContent).content),
				);
			} else {
				acc.push(markOrNode);
			}

			return acc;
		},
		[] as Array<MarkWithContent | Node>,
	);
}

export default class ReactSerializer implements Serializer<JSX.Element> {
	private providers?: ProviderFactory;
	private eventHandlers?: EventHandlers;
	private extensionHandlers?: ExtensionHandlers;
	private portal?: HTMLElement;
	private rendererContext?: RendererContext;
	private appearance?: RendererAppearance;
	private contentMode?: RendererContentMode;
	private disableHeadingIDs?: boolean;
	private disableActions?: boolean;
	private headingIds: string[] = [];
	/**
	 * The reason we have this extra array here is because we need to generate the same unique
	 * heading id for 2 different nodes: headers and expands (check the implementation of
	 * `getUniqueHeadingId` for more info).
	 *
	 * We will eventually need to refactor the current approach to generate unique ids
	 * for headers under this ticket -> https://product-fabric.atlassian.net/browse/ED-9668
	 */
	private expandHeadingIds: string[] = [];
	private allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
	private allowColumnSorting?: boolean;
	private allowCopyToClipboard?: boolean = false;
	private allowWrapCodeBlock?: boolean = false;
	private allowPlaceholderText?: boolean = true;
	private allowCustomPanels?: boolean = false;
	private fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	private shouldOpenMediaViewer?: boolean;
	private allowAltTextOnImages?: boolean;
	private stickyHeaders?: StickyHeaderConfig;
	private allowMediaLinking?: boolean;
	private initStartPos: number;
	private startPos: number;
	private surroundTextNodesWithTextWrapper: boolean = false;
	private media?: MediaOptions;
	private emojiResourceConfig?: EmojiResourceConfig;
	private smartLinks?: SmartLinksOptions;
	private extensionViewportSizes?: ExtensionViewportSize[];
	private getExtensionHeight?: GetPMNodeHeight;
	private allowAnnotations: boolean = false;
	private allowSelectAllTrap?: boolean;
	private nodeComponents?: NodeComponentsProps;
	private allowWindowedCodeBlock?: boolean;
	private isInsideOfInlineExtension?: boolean;

	private textHighlighter?: TextHighlighter;
	private allowTableAlignment?: boolean;
	private allowTableResizing?: boolean;
	private allowFixedColumnWidthOption?: boolean;
	private isPresentational?: boolean;
	private disableTableOverflowShadow?: boolean;
	private standaloneBackgroundColorMarks: Mark[] = [];
	private onSetLinkTarget?: (url: string) => '_blank' | undefined;
	private shouldDisplayExtensionAsInline?: (
		extensionParams: ExtensionParams<Parameters>,
	) => boolean;
	private inlinePositions: Set<number> = new Set();

	constructor(init: ReactSerializerInit) {
		if (editorExperiment('comment_on_bodied_extensions', true)) {
			this.initStartPos = init.startPos || 1;
			this.startPos = init.startPos || 1;
		} else {
			this.initStartPos = 1;
			this.startPos = 1;
		}
		this.providers = init.providers;
		this.eventHandlers = init.eventHandlers;
		this.extensionHandlers = init.extensionHandlers;
		this.portal = init.portal;
		this.rendererContext = init.objectContext;
		this.appearance = init.appearance;
		this.contentMode = init.contentMode;
		this.disableHeadingIDs = init.disableHeadingIDs;
		this.disableActions = init.disableActions;
		this.allowHeadingAnchorLinks = init.allowHeadingAnchorLinks;
		this.allowCopyToClipboard = init.allowCopyToClipboard;
		this.allowWrapCodeBlock = init.allowWrapCodeBlock;
		this.allowPlaceholderText = init.allowPlaceholderText;
		this.allowCustomPanels = init.allowCustomPanels;
		this.allowColumnSorting = init.allowColumnSorting;
		this.fireAnalyticsEvent = init.fireAnalyticsEvent;
		this.shouldOpenMediaViewer = init.shouldOpenMediaViewer;
		this.allowAltTextOnImages = init.allowAltTextOnImages;
		this.stickyHeaders = init.stickyHeaders;
		this.allowMediaLinking = init.allowMediaLinking;
		this.allowAnnotations = Boolean(init.allowAnnotations);
		this.surroundTextNodesWithTextWrapper = Boolean(init.surroundTextNodesWithTextWrapper);
		this.media = init.media;
		this.emojiResourceConfig = init.emojiResourceConfig;
		this.smartLinks = init.smartLinks;
		this.extensionViewportSizes = init.extensionViewportSizes;
		this.getExtensionHeight = init.getExtensionHeight;
		this.allowSelectAllTrap = init.allowSelectAllTrap;
		this.nodeComponents = init.nodeComponents;
		this.allowWindowedCodeBlock = init.allowWindowedCodeBlock;
		this.isInsideOfInlineExtension = init.isInsideOfInlineExtension;
		this.textHighlighter = init.textHighlighter;
		this.allowTableAlignment = init.allowTableAlignment;
		this.allowTableResizing = init.allowTableResizing;
		this.allowFixedColumnWidthOption = init.allowFixedColumnWidthOption;
		this.isPresentational = init.isPresentational;
		this.disableTableOverflowShadow = init.disableTableOverflowShadow;
		this.onSetLinkTarget = init.onSetLinkTarget;
		this.shouldDisplayExtensionAsInline = init.shouldDisplayExtensionAsInline;
	}

	private resetState() {
		this.headingIds = [];
		this.expandHeadingIds = [];
		this.startPos = this.initStartPos;
	}

	private getNodeProps(node: Node, parentInfo?: ParentInfo) {
		const path = parentInfo ? parentInfo.path : undefined;
		switch (node.type.name) {
			case 'date':
				return this.getDateProps(node, parentInfo, path);
			case 'hardBreak':
				return this.getHardBreakProps(node, path);
			case 'heading':
				return this.getHeadingProps(node, path);
			case 'media':
				return this.getMediaProps(node, path);
			case 'emoji':
				return this.getEmojiProps(node, path);
			case 'extension':
			case 'bodiedExtension':
				return this.getExtensionProps(node, path);
			case 'mediaGroup':
				return this.getMediaGroupProps(node);
			case 'mediaInline':
				return this.getMediaInlineProps(node);
			case 'mediaSingle':
				return this.getMediaSingleProps(node, path);
			case 'table':
				return this.getTableProps(node, path);
			case 'tableHeader':
			case 'tableRow':
				return this.getTableChildrenProps(node);
			case 'taskItem':
				return this.getTaskItemProps(node, path);
			case 'embedCard':
				return this.getEmbedCardProps(node, path);
			case 'blockCard':
				return this.getBlockCardProps(node, path);
			case 'inlineCard':
				return this.getInlineCardProps(node, path);
			case 'expand':
				return this.getExpandProps(node, path);
			case 'nestedExpand':
				if (fg('hot-121622_lazy_load_expand_content')) {
					return this.getExpandProps(node, path);
				}
				return this.getProps(node, path);
			case 'unsupportedBlock':
			case 'unsupportedInline':
				return this.getUnsupportedContentProps(node);
			case 'codeBlock':
				return this.getCodeBlockProps(node);
			case 'panel':
				return this.getPanelProps(node);
			default:
				return this.getProps(node, path);
		}
	}

	serializeFragment(
		fragment: Fragment,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		props: any = {},
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		target: any = this.allowSelectAllTrap ? DocWithSelectAllTrap : Doc,
		key: string = 'root-0',
		parentInfo?: ParentInfo,
	): JSX.Element | null {
		// This makes sure that we reset internal state on re-render.
		if (key === 'root-0') {
			this.resetState();
		}

		return this.renderNode(
			target,
			props,
			key,
			this.getChildNodes(fragment).map((node, index) => {
				if (isTextWrapper(node)) {
					return this.serializeTextWrapper(node.content, { index, parentInfo });
				}
				return this.serializeFragmentChild(node, { index, parentInfo });
			}),
		);
	}

	private serializeFragmentChild = (node: Node, { index, parentInfo }: FragmentChildContext) => {
		const pos = this.startPos;
		const currentPath = (parentInfo && parentInfo.path) || [];

		const parentIsIncompleteTask =
			((node.type.name === 'taskItem' ||
				(node.type.name === 'blockTaskItem' &&
					expValEquals('platform_editor_blocktaskitem_node_tenantid', 'isEnabled', true))) &&
				node.attrs.state !== 'DONE') ||
			// If blockTaskItem is in the schema, check if the parent of the current node
			// is an incomplete task item, because blockTaskItems can have nested nodes
			(node.type.schema.nodes.blockTaskItem &&
				parentInfo?.parentIsIncompleteTask === true &&
				expValEquals('platform_editor_blocktaskitem_node_tenantid', 'isEnabled', true));

		const nodeKey = `${node.type.name}__${this.startPos}`;
		const serializedContent = this.serializeFragment(
			node.content,
			this.getNodeProps(node, parentInfo),
			toReact(
				node,
				{
					allowSelectAllTrap: this.allowSelectAllTrap,
					allowWindowedCodeBlock: this.allowWindowedCodeBlock,
				},
				this.nodeComponents,
			),
			nodeKey,
			{
				parentIsIncompleteTask,
				path: [...currentPath, node],
				pos: this.startPos,
			},
		);

		this.startPos = pos + node.nodeSize;

		const marks = node.marks ? [...node.marks] : [];
		const isMedia = node.type.name === 'media';

		const shouldSkipBorderMark = (mark: Mark): boolean =>
			currentPath.some((n) => n.type?.name !== 'mediaSingle') &&
			isMedia &&
			mark.type.name === 'border';

		const shouldSkipLinkMark = (mark: Mark): boolean =>
			this.allowMediaLinking !== true && isMedia && mark.type.name === 'link';

		return marks.reduceRight((content, mark) => {
			if (shouldSkipLinkMark(mark) || shouldSkipBorderMark(mark)) {
				return content;
			}

			return this.renderMark(
				markToReact(mark),
				this.withMediaMarkProps(node, mark, this.getMarkProps(mark, [], node)),
				`${mark.type.name}-${index}`,
				content,
			);
		}, serializedContent);
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private withMediaMarkProps = (node: Node, mark: Mark, defaultProps: any): any => {
		if (mark.type.name === 'link' && node.type.name === 'media') {
			return {
				...defaultProps,
				isMediaLink: true,
			};
		}

		if (node.type.name === 'mediaInline' && mark.type.name === 'annotation') {
			return {
				...defaultProps,
				isMediaInline: true,
			};
		}

		return defaultProps;
	};

	private serializeTextWrapper(content: Node[], { parentInfo }: FragmentChildContext) {
		const currentPath = (parentInfo && parentInfo.path) || [];
		const nodePosition = (parentInfo && parentInfo.pos) || 1;

		this.standaloneBackgroundColorMarks.push(...getStandaloneBackgroundColorMarks(content));

		return ReactSerializer.buildMarkStructure(content).map((mark, _index) => {
			return this.serializeMark({
				mark,
				parentNode: {
					path: currentPath,
					pos: nodePosition,
				},
				parentMark: {
					path: [mark],
				},
			});
		});
	}

	private serializeMark({
		mark,
		parentNode,
		parentMark,
	}: SerializeMarkProps): JSX.Element | string {
		if (!isTextNode(mark)) {
			const serializeContent = (childMark: Mark, _index: number) =>
				this.serializeMark({
					mark: childMark,
					parentNode,
					parentMark: {
						path: [...parentMark.path, childMark],
					},
				});

			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const content = ((mark as any).content || []).map(serializeContent);
			const markKey = `${mark.type.name}-component__${this.startPos}__${parentMark.path.length}`;
			const isStandalone = this.standaloneBackgroundColorMarks.some((m) => mark.eq(m));
			return this.renderMark(
				markToReact(mark),
				{
					...this.getMarkProps(mark, parentMark.path),
					isStandalone,
				},
				markKey,
				content,
			);
		}

		const startPos = this.startPos;
		const endPos = startPos + mark.nodeSize;
		this.startPos = endPos;
		const textKey = `text-wrapper_${this.startPos}`;

		if (this.surroundTextNodesWithTextWrapper) {
			const parentDepth = Math.max(parentNode.path.length - 1, 0);

			return (
				<TextWrapperComponent
					key={textKey}
					startPos={startPos + parentDepth}
					endPos={endPos + parentDepth}
					textHighlighter={this.textHighlighter}
					marks={mark.marks}
				>
					{mark.text}
				</TextWrapperComponent>
			);
		}

		const segments = segmentText(mark.text, this.textHighlighter);
		return renderTextSegments(segments, this.textHighlighter, mark.marks, startPos);
	}

	private renderNode(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		NodeComponent: ComponentType<React.PropsWithChildren<any>>,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		props: any,
		key: string,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		content: string | JSX.Element | any[] | null | undefined,
	): JSX.Element {
		return (
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			<NodeComponent key={key} {...props}>
				{content}
			</NodeComponent>
		);
	}

	private renderMark(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		MarkComponent: ComponentType<React.PropsWithChildren<any>>,
		props: MarkMeta,
		key: string,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		content: any,
	) {
		return (
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			<MarkComponent key={key} {...props}>
				{content}
			</MarkComponent>
		);
	}

	private getTableChildrenProps(node: Node) {
		return {
			...this.getProps(node),
			allowColumnSorting: this.allowColumnSorting,
		};
	}

	private getTableProps(node: Node, path: Array<Node> = []) {
		const isInsideOfBlockNode = insideBlockNode(path, node.type.schema);
		const isInsideMultiBodiedExtension = insideMultiBodiedExtension(path, node.type.schema);
		const isInsideOfTable = insideTable(path, node.type.schema);

		// TODO: EDITOR-3850 - support sticky headers inside breakouts (layouts and expands)
		const isInsideBreakoutExpand =
			expValEquals(
				'platform_editor_table_sticky_header_improvements',
				'cohort',
				'test_with_overflow',
			) &&
			expValEquals('platform_editor_table_sticky_header_patch_11', 'isEnabled', true) &&
			insideBreakoutExpand(path);
		const stickyHeaders =
			!isInsideOfTable && !insideBreakoutLayout(path) && !isInsideBreakoutExpand
				? this.stickyHeaders
				: undefined;

		return {
			...this.getProps(node),
			allowColumnSorting: this.allowColumnSorting,
			columnWidths: getColumnWidths(node),
			tableNode: node,
			stickyHeaders,
			isInsideOfBlockNode,
			isInsideOfTable,
			isInsideMultiBodiedExtension,
			allowTableAlignment: this.allowTableAlignment,
			allowTableResizing: this.allowTableResizing,
			isPresentational: fg('platform_renderer_isPresentational') ? this.isPresentational : false,
			disableTableOverflowShadow: this.disableTableOverflowShadow,
			allowFixedColumnWidthOption: this.allowFixedColumnWidthOption,
		};
	}

	private getDateProps(
		node: Node,
		parentInfo: { parentIsIncompleteTask: boolean } | undefined,
		path: Array<Node> = [],
	) {
		return {
			timestamp: node.attrs && node.attrs.timestamp,
			parentIsIncompleteTask: parentInfo && parentInfo.parentIsIncompleteTask,
			dataAttributes: {
				// We need to account for depth (path.length gives up depth) here
				// but depth doesnt increment the pos, only accounted for.
				'data-renderer-start-pos': this.startPos + path.length,
			},
		};
	}

	private getMediaSingleProps(node: Node, path: Array<Node> = []) {
		const {
			marks: { link },
		} = node.type.schema;
		const isInsideOfBlockNode = insideBlockNode(path, node.type.schema);
		const isLinkMark = (mark: Mark) => mark.type === link;
		const childHasLink =
			node.firstChild &&
			node.firstChild.marks.filter((m) => isLinkMark(m) || this.allowMediaLinking === true).length;

		return {
			...this.getProps(node, path),
			isInsideOfBlockNode,
			childHasLink,
			allowCaptions: this.media && this.media.allowCaptions,
			featureFlags: this.media && this.media.featureFlags,
		};
	}

	private getMediaProps(node: Node, path: Array<Node> = []) {
		const {
			marks: { annotation, link, border },
		} = node.type.schema;

		const isChildOfMediaSingle = path.some((n) => n.type?.name === 'mediaSingle');

		const isAnnotationMark = (mark: Mark) => mark.type === annotation;
		const isLinkMark = (mark: Mark) => mark.type === link;
		const isBorderMark = (mark: Mark) => isChildOfMediaSingle && mark.type === border;

		return {
			...this.getProps(node, path),
			marks: node.marks.filter((m) => !isLinkMark(m) || this.allowMediaLinking === true),
			isLinkMark,
			isBorderMark,
			isAnnotationMark,
			allowAltTextOnImages: this.allowAltTextOnImages,
			featureFlags: this.media && this.media.featureFlags,
			shouldOpenMediaViewer: this.shouldOpenMediaViewer,
			ssr: this.media?.ssr,
			// surroundTextNodesWithTextWrapper checks inlineComment.allowDraftMode
			allowAnnotationsDraftMode: this.surroundTextNodesWithTextWrapper,
			enableSyncMediaCard: this.media?.enableSyncMediaCard,
		};
	}

	private getExtensionProps(node: Node, path: Array<Node> = []) {
		return {
			...this.getProps(node, path),
			extensionViewportSizes: this.extensionViewportSizes,
			nodeHeight: this.getExtensionHeight?.(node),
			shouldDisplayExtensionAsInline: this.shouldDisplayExtensionAsInline,
		};
	}

	private getEmojiProps(node: Node, path: Array<Node> = []) {
		return {
			...this.getProps(node, path),
			resourceConfig: this.emojiResourceConfig,
		};
	}

	private getEmbedCardProps(node: Node, path: Array<Node> = []) {
		const isInsideOfBlockNode = insideBlockNode(path, node.type.schema);
		return {
			...this.getProps(node),
			isInsideOfBlockNode,
			onSetLinkTarget: this.onSetLinkTarget,
		};
	}

	private getBlockCardProps(node: Node, path: Array<Node> = []) {
		return {
			...this.getProps(node),
			isNodeNested: path.length > 0,
			onSetLinkTarget: this.onSetLinkTarget,
		};
	}

	private getInlineCardProps(node: Node, path: Array<Node> = []) {
		return {
			...this.getProps(node, path),
			onSetLinkTarget: this.onSetLinkTarget,
		};
	}

	private getMediaGroupProps(node: Node) {
		return {
			...this.getProps(node),
			shouldOpenMediaViewer: this.shouldOpenMediaViewer,
			allowAltTextOnImages: this.allowAltTextOnImages,
			featureFlags: this.media && this.media.featureFlags,
			enableDownloadButton: this.media?.enableDownloadButton,
			ssr: this.media?.ssr,
		};
	}

	private getMediaInlineProps(node: Node) {
		return {
			...this.getProps(node),
			ssr: this.media?.ssr,
		};
	}

	private getTaskItemProps(node: Node, path: Array<Node> = []) {
		return {
			...this.getProps(node, path),
			disabled: this.disableActions,
		};
	}

	private getHardBreakProps(node: Node, path: Array<Node> = []) {
		let forceNewLine = false;

		const parentNode: Node | null = path.length > 0 ? path[path.length - 1] : null;

		if (parentNode && parentNode.lastChild === node) {
			forceNewLine = true;
		}

		return {
			...this.getProps(node),
			forceNewLine,
		};
	}

	private getCodeBlockProps(node: Node): NodeMeta {
		// The appearance being mobile indicates we are in an renderer being
		// rendered by mobile bridge in a web view.
		// The tooltip is likely to have unexpected behaviour there, with being cut
		// off, so we disable it. This is also to keep the behaviour consistent with
		// the rendering in the mobile Native Renderer.
		const codeBidiWarningTooltipEnabled = false;

		return {
			...this.getProps(node),
			text: node.textContent,
			codeBidiWarningTooltipEnabled,
		};
	}

	private getPanelProps(node: Node): NodeMeta {
		return {
			...this.getProps(node),
			allowCustomPanels: this.allowCustomPanels,
		};
	}

	private getUnsupportedContentProps = (node: Node) => {
		return {
			node,
			dispatchAnalyticsEvent: this.fireAnalyticsEvent,
		};
	};

	private getProps(node: Node, path: Array<Node> = []): NodeMeta {
		const startPos = this.startPos + path.length;

		return {
			asInline: this.inlinePositions.has(startPos) ? 'on' : undefined,
			text: node.text,
			providers: this.providers,
			eventHandlers: this.eventHandlers,
			extensionHandlers: this.extensionHandlers,
			portal: this.portal,
			rendererContext: this.rendererContext,
			serializer: this,
			content: node.content ? node.content.toJSON() : undefined,
			allowHeadingAnchorLinks: this.allowHeadingAnchorLinks,
			allowCopyToClipboard: this.allowCopyToClipboard,
			allowWrapCodeBlock: this.allowWrapCodeBlock,
			allowPlaceholderText: this.allowPlaceholderText,
			rendererAppearance: this.appearance,
			rendererContentMode: this.contentMode,
			fireAnalyticsEvent: this.fireAnalyticsEvent,
			nodeType: node.type.name,
			marks: node.marks,
			smartLinks: this.smartLinks,
			isInsideOfInlineExtension: this.isInsideOfInlineExtension,
			dataAttributes: {
				// We need to account for depth (path.length gives up depth) here
				// but depth doesnt increment the pos, only accounted for.
				'data-renderer-start-pos': startPos,
			},
			startPos,
			path,
			...node.attrs,
		};
	}

	private headingAnchorSupported(path: Array<Node> = []): boolean {
		const isImmediateParent = (path: Array<Node>, nodeName: string): boolean => {
			return path.length > 0 && path[path.length - 1].type.name === nodeName;
		};

		return (
			isNestedHeaderLinksEnabled(this.allowHeadingAnchorLinks) ||
			path.length === 0 ||
			isImmediateParent(path, 'layoutColumn')
		);
	}

	private getHeadingProps(node: Node, path: Array<Node> = []) {
		return {
			...this.getProps(node, path),
			content: node.content ? node.content.toJSON() : undefined,
			headingId: this.getHeadingId(node, this.headingIds),
			showAnchorLink:
				this.appearance !== 'comment' &&
				this.allowHeadingAnchorLinks &&
				!this.disableHeadingIDs &&
				this.headingAnchorSupported(path),
		};
	}

	private getExpandProps(node: Node, _path: Array<Node> = []) {
		let loadBodyContent = false;
		if (fg('hot-121622_lazy_load_expand_content')) {
			const annotations = findChildrenByMark(node, node.type.schema.marks.annotation, true);
			// Force rendering children if there are inline comments to support comments navigation
			// which relies on the HTML node to be present.
			loadBodyContent = annotations.some((annotation) => {
				return annotation.node.marks.some((mark) => mark.attrs.annotationType === 'inlineComment');
			});
		}

		if (!isNestedHeaderLinksEnabled(this.allowHeadingAnchorLinks)) {
			return {
				...this.getProps(node),
				loadBodyContent,
			};
		}

		const nestedHeaderIds = findChildrenByType(node, node.type.schema.nodes.heading).map(
			({ node }) => this.getHeadingId(node, this.expandHeadingIds),
		);

		return {
			...this.getProps(node),
			nestedHeaderIds,
			loadBodyContent,
		};
	}

	// The return value of this function is NOT url encoded,
	// In HTML5 standard, id can contain any characters, encoding is no necessary.
	// Plus we trying to avoid double encoding, therefore we leave the value as is.
	// Remember to use encodeURIComponent when generating url from the id value.
	private getHeadingId(node: Node, headingIds: string[]) {
		if (this.disableHeadingIDs || !node.content.size) {
			return;
		}

		// We are not use node.textContent here, because we would like to handle cases where
		// headings only contain inline blocks like emoji, status and date.
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const nodeContent = (node as any).content
			.toJSON()
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.reduce((acc: string, node: any) => acc.concat(getText(node) || ''), '')
			.trim()
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			.replace(/\s/g, '-');

		if (!nodeContent) {
			return;
		}

		return this.getUniqueHeadingId(nodeContent, headingIds);
	}

	private getUniqueHeadingId(baseId: string, headingIds: string[], counter = 0): string {
		if (counter === 0 && headingIds.indexOf(baseId) === -1) {
			headingIds.push(baseId);
			return baseId;
		} else if (counter !== 0) {
			const headingId = `${baseId}.${counter}`;
			if (headingIds.indexOf(headingId) === -1) {
				headingIds.push(headingId);
				return headingId;
			}
		}

		return this.getUniqueHeadingId(baseId, headingIds, ++counter);
	}

	private getAnnotationMarkProps = (mark: Mark, marksParentPath: Mark[]): AnnotationMarkMeta => {
		const annotationParentIds = (marksParentPath || []).reduce<string[]>((acc, parent) => {
			if (isAnnotationMark(parent)) {
				return [...acc, parent.attrs.id];
			}

			return acc;
		}, []);

		return {
			id: mark.attrs.id,
			annotationType: mark.attrs.annotationType,
			annotationParentIds,
			allowAnnotations: this.allowAnnotations,
			dataAttributes: {
				'data-renderer-mark': true,
			},
		};
	};

	private getMarkProps = (mark: Mark, marksParentPath: Mark[], node?: Node): MarkMeta => {
		if (isAnnotationMark(mark)) {
			return this.getAnnotationMarkProps(mark, marksParentPath);
		}

		const { key, ...otherAttrs } = mark.attrs;
		const extraProps = {
			isInline: node?.isInline,
		};

		// currently the only mark which has custom props is the code mark
		const markSpecificProps = isCodeMark(mark)
			? {
					// The appearance being mobile indicates we are in an renderer being
					// rendered by mobile bridge in a web view.
					// The tooltip is likely to have unexpected behaviour there, with being cut
					// off, so we disable it. This is also to keep the behaviour consistent with
					// the rendering in the mobile Native Renderer.
					codeBidiWarningTooltipEnabled: false,
				}
			: {};

		// Add deepLinkTarget for link marks
		const linkSpecificProps =
			mark.type.name === 'link'
				? {
						onSetLinkTarget: this.onSetLinkTarget,
					}
				: {};

		const props: MarkMeta = {
			eventHandlers: this.eventHandlers,
			fireAnalyticsEvent: this.fireAnalyticsEvent,
			markKey: key,
			...otherAttrs,
			...extraProps,
			...markSpecificProps,
			...linkSpecificProps,
			dataAttributes: {
				'data-renderer-mark': true,
			},
		};

		return props;
	};

	private getChildNodes(fragment: Fragment): (Node | TextWrapper)[] {
		let children: Node[] = [];
		fragment.forEach((node) => {
			children.push(node);
		});
		children = mergeTextNodes(children) as Node[];
		if (
			!!this.shouldDisplayExtensionAsInline &&
			expValEquals('platform_editor_render_bodied_extension_as_inline', 'isEnabled', true)
		) {
			markBlockAsInline({
				nodes: children,
				onMark: ({ pos }) => {
					this.inlinePositions.add(pos);
				},
				parentPos: this.startPos,
				shouldDisplayExtensionAsInline: this.shouldDisplayExtensionAsInline,
			});
		}
		return children;
	}

	static getMarks(node: Node): Mark[] {
		if (!node.marks || node.marks.length === 0) {
			return [];
		}

		return getMarksByOrder(node.marks);
	}

	static buildMarkStructure(content: Node[]) {
		return mergeMarks(
			content.map((node) => {
				const nodeMarks = this.getMarks(node);
				if (nodeMarks.length === 0) {
					return node;
				}

				return nodeMarks.reverse().reduce((acc, mark) => {
					const { eq } = mark;

					return {
						...mark,
						eq,
						content: [acc],
					};
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				}, node as any);
			}),
		) as Mark[];
	}

	// TODO: ED-9004 - Remove unused ReactSerializer.fromSchema in renderer
	// https://sourcegraph-frontend.internal.shared-prod.us-west-2.kitt-inf.net/search?q=ReactSerializer.fromSchema&patternType=literal
	static fromSchema(_: unknown, init: ReactSerializerInit) {
		if (process.env.NODE_ENV !== 'production') {
			// eslint-disable-next-line no-console
			console.warn(
				'ReactSerializer.fromSchema is deprecated. Please use the constructor instead via new ReactSerializer()',
			);
		}
		return new ReactSerializer(init);
	}
}
