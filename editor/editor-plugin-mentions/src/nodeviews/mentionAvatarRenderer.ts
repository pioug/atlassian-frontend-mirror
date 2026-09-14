import { bind } from 'bind-event-listener';

import type { MentionNodeData } from '@atlaskit/mention/types';

const avatarImageClassName = 'editor-mention-avatar-image';
const agentAvatarClassName = 'editor-mention-avatar-agent';
const fallbackAvatarClassName = 'editor-mention-avatar-fallback';
const avatarSize = 16;

export interface MentionAvatarController {
	destroy: () => void;
	render: (data: MentionNodeData) => void;
}

/**
 * Populates the fixed-size avatar slot owned by the vanilla ProseMirror NodeView.
 * No React root or editor portal is created for individual mention nodes.
 */
export const mentionAvatarRenderer = ({
	container,
}: {
	container: HTMLElement;
}): MentionAvatarController => {
	let image: HTMLImageElement | undefined;
	let fallback: Text | undefined;
	let unbindImageError: (() => void) | undefined;

	const removeImage = () => {
		unbindImageError?.();
		unbindImageError = undefined;
		image?.remove();
		image = undefined;
	};
	const removeFallback = () => {
		fallback?.remove();
		fallback = undefined;
		container.classList.remove(fallbackAvatarClassName);
	};
	const showFallback = () => {
		removeImage();
		removeFallback();
		fallback = container.ownerDocument.createTextNode('@');
		container.appendChild(fallback);
		container.classList.add(fallbackAvatarClassName);
	};
	const destroy = () => {
		removeImage();
		removeFallback();
	};

	return {
		destroy,
		render: ({ appType, avatarUrl, isAvatarImagePreShaped }) => {
			container.classList.toggle(
				agentAvatarClassName,
				!isAvatarImagePreShaped && appType === 'agent',
			);
			removeFallback();

			if (!avatarUrl) {
				removeImage();
				return;
			}

			if (!image) {
				image = container.ownerDocument.createElement('img');
				image.alt = '';
				image.className = avatarImageClassName;
				image.decoding = 'async';
				image.draggable = false;
				image.height = avatarSize;
				image.loading = 'lazy';
				image.width = avatarSize;
				unbindImageError = bind(image, { type: 'error', listener: showFallback });
				container.appendChild(image);
			}

			image.src = avatarUrl;
		},
	};
};
