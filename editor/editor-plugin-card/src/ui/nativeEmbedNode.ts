import { isSafeUrl } from '@atlaskit/adf-schema/is-safe-url';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	type AnalyticsEventPayload,
	type EditorAnalyticsAPI,
	type SMART_LINK_TYPE,
} from '@atlaskit/editor-common/analytics';
import {
	NATIVE_EMBED_EXTENSION_KEY,
	NATIVE_EMBED_EXTENSION_TYPE,
} from '@atlaskit/editor-common/extensions';
import type { Node as PMNode, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * A native embed is an `extension` node that `editor-plugin-native-embeds` builds from
 * embedCard ADF (via the `embedCardNodeTransformer` registered on the card plugin).
 * A 1P link that resolves to an embed appearance — a whiteboard, page, slide or
 * database — therefore lands in the document as one of these rather than as an
 * `embedCard`, so card node types alone are not enough to describe what was pasted.
 *
 * `editor-plugin-native-embeds` owns the equivalent predicate, but the card plugin
 * cannot depend on it: that would close the cycle
 * editor-plugin-card -> editor-plugin-native-embeds -> editor-plugin-card.
 */
export const isNativeEmbedNode = (node: PMNode | null | undefined): boolean =>
	node?.type.name === 'extension' &&
	node.attrs?.extensionType === NATIVE_EMBED_EXTENSION_TYPE &&
	typeof node.attrs?.extensionKey === 'string' &&
	node.attrs.extensionKey.includes(NATIVE_EMBED_EXTENSION_KEY);

/**
 * Reads the embedded URL from a native embed node. The URL is stored in
 * `parameters.macroParams`, where values may be wrapped (`{ value }`) or bare, and is
 * mirrored in `parameters.macroMetadata` so it survives a revert to a card.
 */
export const getNativeEmbedUrl = (node: PMNode): string | undefined => {
	const parameters = node.attrs?.parameters as
		| { macroMetadata?: { url?: unknown }; macroParams?: { url?: unknown } }
		| undefined;
	const macroParamUrl = parameters?.macroParams?.url;
	const url =
		(macroParamUrl && typeof macroParamUrl === 'object' && 'value' in macroParamUrl
			? macroParamUrl.value
			: macroParamUrl) ?? parameters?.macroMetadata?.url;

	return typeof url === 'string' ? url : undefined;
};

const canReplaceNodeWith = (
	view: EditorView,
	pos: number,
	nodeType: NodeType | undefined,
): boolean => {
	if (!nodeType) {
		return false;
	}
	try {
		const $pos = view.state.doc.resolve(pos);
		const index = $pos.index();
		return $pos.parent.canReplaceWith(index, index + 1, nodeType);
	} catch {
		return false;
	}
};

/**
 * Whether a native embed at `pos` can be replaced by the given appearance. `url` and
 * `inline` both become a paragraph, `block` becomes a blockCard.
 */
export const isNativeEmbedAppearanceSupported = ({
	editorView,
	pos,
	appearance,
}: {
	appearance: 'url' | 'inline' | 'block';
	editorView: EditorView;
	pos: number;
}): boolean => {
	const { paragraph, inlineCard, blockCard } = editorView.state.schema.nodes;

	if (appearance === 'block') {
		return canReplaceNodeWith(editorView, pos, blockCard);
	}
	if (appearance === 'inline' && !inlineCard) {
		return false;
	}
	if (appearance === 'url' && !editorView.state.schema.marks.link) {
		return false;
	}
	return canReplaceNodeWith(editorView, pos, paragraph);
};

/**
 * Replaces a native embed with a link, an inline card or a block card. Mirrors
 * `setNativeEmbedAppearance` in `editor-plugin-native-embeds`, which cannot be reused
 * here because of the package cycle described on `isNativeEmbedNode`.
 */
export const changeNativeEmbedAppearance = ({
	editorView,
	pos,
	node,
	appearance,
	url,
	editorAnalyticsApi,
}: {
	appearance: 'url' | 'inline' | 'block';
	editorAnalyticsApi?: EditorAnalyticsAPI;
	editorView: EditorView;
	node: PMNode;
	pos: number;
	url: string;
}): boolean => {
	const { state, dispatch } = editorView;
	const { paragraph, inlineCard, blockCard } = state.schema.nodes;
	const { link } = state.schema.marks;

	if (!isSafeUrl(url)) {
		return false;
	}

	let content: PMNode | undefined;
	if (appearance === 'url' && link && paragraph) {
		content = paragraph.create(null, state.schema.text(url, [link.create({ href: url })]));
	} else if (appearance === 'inline' && inlineCard && paragraph) {
		content = paragraph.create(null, inlineCard.create({ url }));
	} else if (appearance === 'block' && blockCard) {
		content = blockCard.create({ url });
	}

	if (!content) {
		return false;
	}

	try {
		const tr = state.tr.replaceWith(pos, pos + node.nodeSize, content).scrollIntoView();
		editorAnalyticsApi?.attachAnalyticsEvent({
			action: ACTION.CHANGED_TYPE,
			actionSubject: ACTION_SUBJECT.NATIVE_EMBED,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				newType: appearance as SMART_LINK_TYPE,
				previousType: 'nativeEmbed',
			},
		} as AnalyticsEventPayload)(tr);
		dispatch(tr);
		return true;
	} catch {
		return false;
	}
};
