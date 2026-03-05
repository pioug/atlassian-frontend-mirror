import { isSafeUrl } from '@atlaskit/adf-schema';
import type { Command } from '@atlaskit/editor-common/types';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

import type { NativeEmbedAppearance, SelectedNativeEmbed } from '../../nativeEmbedsPluginType';

function buildUrlReplacement(schema: Schema, url: string): PMNode | null {
	const { link } = schema.marks;
	if (!link) {
		return null;
	}
	const linkContent = schema.text(url, [link.create({ href: url })]);
	return schema.nodes.paragraph.create(null, linkContent);
}

function buildCardReplacement(
	schema: Schema,
	appearance: 'inline' | 'block',
	url: string,
): PMNode | null {
	const cardType = appearance === 'inline' ? schema.nodes.inlineCard : schema.nodes.blockCard;
	if (!cardType) {
		return null;
	}
	const cardNode = cardType.create({ url });
	return appearance === 'inline' ? schema.nodes.paragraph.create(null, cardNode) : cardNode;
}

/**
 * Returns a command transfroms the native embed to the specified appearance.
 * If the appearance is 'inline' or 'block', it replaces the native embed
 * with an inline or block card node.
 * If the appearance is 'url', it replaces the native embed with a link text node.
 * If the appearance is 'embed', it returns false to prevent the command from executing.
 */
export const setNativeEmbedAppearance =
	(selected: SelectedNativeEmbed, appearance: NativeEmbedAppearance): Command =>
	(state, dispatch) => {
		if (appearance === 'embed') {
			return false;
		}

		const { pos, node } = selected;
		const parameters = node.attrs.parameters || {};
		const { schema } = state;
		const url = parameters?.url;

		let content: PMNode | null = null;
		if (url && isSafeUrl(url)) {
			if (appearance === 'url') {
				content = buildUrlReplacement(schema, url);
			} else if (appearance === 'inline' || appearance === 'block') {
				content = buildCardReplacement(schema, appearance, url);
			}
		}

		if (content && dispatch) {
			dispatch(state.tr.replaceWith(pos, pos + node.nodeSize, content).scrollIntoView());
		}
		return true;
	};
