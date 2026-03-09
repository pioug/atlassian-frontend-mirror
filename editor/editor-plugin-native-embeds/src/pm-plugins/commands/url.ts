import type { Command } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { getParameters } from '@atlaskit/native-embeds-common';

export const getNativeEmbedUrl = (selectedNode: PMNode): string | undefined => {
	return getParameters(selectedNode.attrs.parameters, 'url');
};

export const createOpenInNewWindowCommand =
	(selectedNode: PMNode): Command =>
	() => {
		const url = getNativeEmbedUrl(selectedNode);
		if (url) {
			window.open(url, '_blank', 'noopener,noreferrer');
		}
		return true;
	};

export const createCopyLinkCommand =
	(selectedNode: PMNode): Command =>
	() => {
		const url = getNativeEmbedUrl(selectedNode);
		if (url) {
			navigator.clipboard.writeText(url);
		}
		return true;
	};
