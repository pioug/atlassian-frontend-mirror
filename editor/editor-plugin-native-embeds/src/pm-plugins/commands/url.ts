import type { Command } from '@atlaskit/editor-common/types';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

export const createOpenInNewWindowCommand =
	(selectedNativeEmbed: ContentNodeWithPos): Command =>
	() => {
		const url = getNativeEmbedUrl(selectedNativeEmbed);
		if (url) {
			window.open(url, '_blank', 'noopener,noreferrer');
		}
		return true;
	};

export const createCopyLinkCommand =
	(selectedNativeEmbed: ContentNodeWithPos): Command =>
	() => {
		const url = getNativeEmbedUrl(selectedNativeEmbed);
		if (url) {
			navigator.clipboard.writeText(url);
		}
		return true;
	};

const getNativeEmbedUrl = (selectedNativeEmbed: ContentNodeWithPos): string | undefined => {
	return selectedNativeEmbed.node.attrs.parameters?.url;
};
