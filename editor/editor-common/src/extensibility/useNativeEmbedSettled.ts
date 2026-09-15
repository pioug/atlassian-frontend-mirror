import { useEffect } from 'react';

/** Set to `"true"` by the embed frame while loading, then removed — never set to `"false"`. */
const NATIVE_EMBED_LOADING_ATTRIBUTE = 'data-native-embed-loading';

/**
 * Calls `onSettled` once the native embed inside `container` has finished loading, successfully or
 * not. The extension handler mounts the embed asynchronously, so the subtree is observed rather
 * than a known element.
 *
 * Two signals, because neither alone catches every embed: the attribute having been seen and gone,
 * which covers a failure that renders no frame; or a frame with no attribute, which covers an embed
 * that never advertises loading. The frame is present either way, so the attribute comes first.
 *
 * `onSettled` must be stable, and runs at most once per container.
 */
export const useNativeEmbedSettled = (
	container: HTMLElement | null,
	onSettled: () => void,
): void => {
	useEffect(() => {
		if (!container || typeof MutationObserver === 'undefined') {
			return;
		}

		let hasBeenLoading = false;
		let settled = false;

		const read = () => {
			if (settled) {
				return;
			}

			if (container.querySelector(`[${NATIVE_EMBED_LOADING_ATTRIBUTE}="true"]`)) {
				hasBeenLoading = true;
				return;
			}

			if (hasBeenLoading || container.querySelector('iframe')) {
				settled = true;
				onSettled();
			}
		};

		const observer = new MutationObserver(read);
		observer.observe(container, {
			attributes: true,
			attributeFilter: [NATIVE_EMBED_LOADING_ATTRIBUTE],
			childList: true,
			subtree: true,
		});

		// After `observe`, so a change landing in between is either read here or queued.
		read();

		return () => observer.disconnect();
	}, [container, onSettled]);
};
