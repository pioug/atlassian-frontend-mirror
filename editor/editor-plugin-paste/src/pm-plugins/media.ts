import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import { DEFAULT_IMAGE_WIDTH } from '@atlaskit/editor-common/media-single';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	mapSlice,
	removeNestedEmptyEls,
	unwrap,
	walkUpTreeUntil,
} from '@atlaskit/editor-common/utils';
import type { Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { getRandomHex } from '@atlaskit/media-common';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PastePlugin } from '../pastePluginType';

/**
 * Ensure correct layout in nested mode
 *
 * TODO: ED-26959 - this func is only used in handlePaste, so layout update won't work for drop event
 */
export function transformSliceForMedia(
	slice: Slice,
	schema: Schema,
	api?: ExtractInjectionAPI<PastePlugin>,
) {
	const { mediaSingle, layoutSection, table, bulletList, orderedList, expand, nestedExpand } =
		schema.nodes;

	return (selection: Selection): Slice => {
		let newSlice = slice;
		if (
			hasParentNodeOfType([layoutSection, table, bulletList, orderedList, expand, nestedExpand])(
				selection,
			)
		) {
			newSlice = mapSlice(newSlice, (node) => {
				const mediaState = api?.media?.sharedState.currentState();
				const extendedOrLegacyAttrs = mediaState?.mediaOptions?.allowPixelResizing
					? {
							layout: node.attrs.layout,
							widthType: node.attrs.widthType,
							width: node.attrs.width,
						}
					: { layout: node.attrs.layout };

				let attrs = {};
				if (hasParentNodeOfType([layoutSection, table])(selection)) {
					// Supports layouts
					attrs = { ...extendedOrLegacyAttrs };
				} else if (
					hasParentNodeOfType([bulletList, orderedList, expand, nestedExpand])(selection)
				) {
					// does not support other layouts
					attrs = { ...extendedOrLegacyAttrs, layout: 'center' };
				}

				return node.type.name === 'mediaSingle'
					? mediaSingle.createChecked(attrs, node.content, node.marks)
					: node;
			});
		}
		return newSlice;
	};
}

// Ignored via go/ees007
// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
// TODO move this to editor-common
export const isImage = (fileType?: string): boolean => {
	return !!fileType && (fileType.indexOf('image/') > -1 || fileType.indexOf('video/') > -1);
};

export const transformSliceToCorrectMediaWrapper = (slice: Slice, schema: Schema): Slice => {
	const { mediaGroup, mediaSingle, media } = schema.nodes;
	return mapSlice(slice, (node, parent) => {
		if (!parent && node.type === media) {
			if (mediaSingle && (isImage(node.attrs.__fileMimeType) || node.attrs.type === 'external')) {
				return mediaSingle.createChecked({}, node);
			} else {
				return mediaGroup.createChecked({}, [node]);
			}
		}
		return node;
	});
};

/**
 * This func will be called when copy & paste, drag & drop external html with media, media files, and slices from editor
 * Because width may not be available when transform, DEFAULT_IMAGE_WIDTH is used as a fallback
 *
 */
export const transformSliceToMediaSingleWithNewExperience = (
	slice: Slice,
	schema: Schema,
	api: ExtractInjectionAPI<PastePlugin> | undefined,
): Slice => {
	const { mediaInline, mediaSingle, media } = schema.nodes;
	const newSlice = mapSlice(slice, (node) => {
		// This logic is duplicated in editor-plugin-ai where external images can be inserted
		// from external sources through the use of AI.  The editor-plugin-ai package is avoiding
		// sharing dependencies with editor-core to support products using it with various versions
		// of editor packages.
		// The duplication is in the following file:
		// packages/editor/editor-plugin-ai/src/prebuilt/content-transformers/markdown-to-pm/markdown-transformer.ts
		if (node.type === mediaSingle) {
			const mediaState = api?.media?.sharedState.currentState();
			return mediaState?.mediaOptions?.allowPixelResizing
				? mediaSingle.createChecked(
						{
							width: node.attrs.width || DEFAULT_IMAGE_WIDTH,
							widthType: node.attrs.widthType || 'pixel',
							layout: node.attrs.layout,
						},
						node.content,
						node.marks,
					)
				: node;
		}
		return node;
	});

	return mapSlice(newSlice, (node) => {
		const __mediaTraceId = getRandomHex(8);
		if (node.type === media) {
			api?.core.actions.execute(api?.media?.commands.trackMediaPaste(node.attrs as MediaADFAttrs));

			return media.createChecked(
				{
					...node.attrs,
					__external: node.attrs.type === 'external',
					__mediaTraceId: node.attrs.type === 'external' ? null : __mediaTraceId,
				},
				node.content,
				node.marks,
			);
		}
		if (node.type.name === 'mediaInline') {
			api?.core.actions.execute(api?.media?.commands.trackMediaPaste(node.attrs as MediaADFAttrs));

			return mediaInline.createChecked(
				{
					...node.attrs,
					__mediaTraceId,
				},
				node.content,
				node.marks,
			);
		}

		return node;
	});
};

/**
 * Check base styles to see if an element will be invisible when rendered in a document.
 * @param element
 */
const isElementInvisible = (element: HTMLElement) => {
	return (
		element.style.opacity === '0' ||
		element.style.display === 'none' ||
		element.style.visibility === 'hidden'
	);
};

const VALID_TAGS_CONTAINER = ['DIV', 'TD', 'BLOCKQUOTE'];
function canContainImage(element: HTMLElement | null): boolean {
	if (!element) {
		return false;
	}
	return VALID_TAGS_CONTAINER.indexOf(element.tagName) !== -1;
}

/**
 * Determines whether an `<img>` inside a mediaSingle wrapper should be hoisted
 * out of the wrapper and treated as a standalone external image.
 *
 * This should only happen when:
 * - The image source is external (data-source="external"), and
 * - The media wrapper has no valid file reference (no data-id), meaning
 *   ProseMirror cannot reconstruct a proper internal media node from the wrapper.
 *
 * When the wrapper has a valid file reference (e.g. internal media from Jira),
 * we leave the wrapper intact so ProseMirror can reconstruct a proper internal media node with the file reference and fetch fresh auth tokens.
 */
function shouldHoistFromMediaSingle(imageTag: HTMLImageElement): boolean {
	const isExternalSource = imageTag.getAttribute('data-source') === 'external';
	if (!isExternalSource) {
		return false;
	}

	const mediaNode = imageTag.closest('[data-node-type="media"]');
	const hasFileReference = mediaNode?.hasAttribute('data-id') ?? false;

	return !hasFileReference;
}

/**
 * Given a html string, we attempt to hoist any nested `<img>` tags,
 * not directly wrapped by a `<div>` as ProseMirror no-op's
 * on those scenarios.
 * @param html
 */
export const unwrapNestedMediaElements = (html: string): string => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const wrapper = doc.body;

	// Remove Google Doc's wrapper <b> el
	const docsWrapper = wrapper.querySelector<HTMLElement>('b[id^="docs-internal-guid-"]');
	if (docsWrapper) {
		unwrap(wrapper, docsWrapper);
	}

	const imageTags = wrapper.querySelectorAll('img');
	if (!imageTags.length) {
		return html;
	}

	imageTags.forEach((imageTag) => {
		// Capture the immediate parent, we may remove the media from here later.
		const mediaParent = imageTag.parentElement;
		if (!mediaParent) {
			return;
		}

		// Bypass emoji
		if (imageTag.className.includes('emoji-common-emoji-image')) {
			return;
		}

		// Bypass mediaInline images - don't hoist images that are inside a mediaInline wrapper
		// as this would break parseDOM matching for mediaInline nodes
		// We remove the img from the DOM since mediaInline is a leaf node with no content
		if (imageTag.closest('[data-node-type="mediaInline"]')) {
			// Remove the img element so ProseMirror doesn't try to parse it
			// mediaInline nodes are leaf nodes and cannot have children
			imageTag.remove();
			return;
		}

		// when copying a jira comment that contains external image (data-source="external"),
		// the 'media' div is like this:
		// <div data-node-type="media"> has no data-id,
		// But when copying a jira comment that contains image that was uploaded to Jira, the div is like this:
		// <div data-node-type="media" data-type="file" data-id="dce9c14b-b857-41fd-9452-5f4ba3a4f679" data-collection="" data-file-name="Screenshot 2026-05-26 at 4.41.05 pm.png" data-file-size="1354355" data-file-mime-type="image/png">
		// ProseMirror fails to parse the media node because it has no data-id,
		// so we hoist the <img> to replace the entire mediaSingle wrapper
		// so the editor can treat it as a plain external image and render/re-upload it correctly.
		const mediaSingleWrapper = imageTag.closest('[data-node-type="mediaSingle"]');
		if (
			mediaSingleWrapper &&
			shouldHoistFromMediaSingle(imageTag) &&
			expValEquals('fix_copy_paste_external_media_renderer_to_editor', 'isEnabled', true)
		) {
			// Hoist the <img> to replace the entire mediaSingle wrapper
			if (mediaSingleWrapper.parentElement) {
				mediaSingleWrapper.parentElement.insertBefore(imageTag, mediaSingleWrapper);
				mediaSingleWrapper.remove();
				return;
			}
		}

		// If either the parent or the image itself contains styles that would make
		// them invisible on copy, dont paste them.
		if (isElementInvisible(mediaParent) || isElementInvisible(imageTag)) {
			mediaParent.removeChild(imageTag);
			return;
		}

		// If its wrapped by a valid container we assume its safe to bypass.
		// ProseMirror should handle these cases properly.
		if (
			canContainImage(mediaParent) ||
			(mediaParent instanceof HTMLSpanElement && mediaParent.closest('[class*="emoji-common"]'))
		) {
			return;
		}

		// Find the top most element that the parent has a valid container for the image.
		// Stop just before found the wrapper
		const insertBeforeElement = walkUpTreeUntil(mediaParent, (element) => {
			// If is at the top just use this element as reference
			if (element.parentElement === wrapper) {
				return true;
			}

			return canContainImage(element.parentElement);
		});

		// Here we try to insert the media right after its top most valid parent element
		// Unless its the last element in our structure then we will insert above it.
		if (insertBeforeElement && insertBeforeElement.parentElement) {
			// Insert as close as possible to the most closest valid element index in the tree.
			insertBeforeElement.parentElement.insertBefore(
				imageTag,
				insertBeforeElement.nextElementSibling || insertBeforeElement,
			);

			// Attempt to clean up lines left behind by the image
			mediaParent.innerText = mediaParent.innerText.trim();
			// Walk up and delete empty elements left over after removing the image tag
			removeNestedEmptyEls(mediaParent);
		}
	});

	// If last child is a hardbreak we don't want it
	if (wrapper.lastElementChild && wrapper.lastElementChild.tagName === 'BR') {
		wrapper.removeChild(wrapper.lastElementChild);
	}

	return wrapper.innerHTML;
};
