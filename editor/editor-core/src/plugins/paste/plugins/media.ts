import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import {
  mapSlice,
  unwrap,
  removeNestedEmptyEls,
  walkUpTreeUntil,
} from '@atlaskit/editor-common/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { getRandomHex } from '@atlaskit/media-common';
import type { Slice, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

export function transformSliceForMedia(slice: Slice, schema: Schema) {
  const {
    mediaSingle,
    layoutSection,
    table,
    bulletList,
    orderedList,
    media,
    mediaInline,
    expand,
    nestedExpand,
  } = schema.nodes;

  return (selection: Selection) => {
    let newSlice = slice;
    if (
      hasParentNodeOfType([
        layoutSection,
        table,
        bulletList,
        orderedList,
        expand,
        nestedExpand,
      ])(selection)
    ) {
      newSlice = mapSlice(newSlice, (node) => {
        const extendedOrLegacyAttrs = getBooleanFF(
          'platform.editor.media.extended-resize-experience',
        )
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
          hasParentNodeOfType([bulletList, orderedList, expand, nestedExpand])(
            selection,
          )
        ) {
          // does not support other layouts
          attrs = { ...extendedOrLegacyAttrs, layout: 'center' };
        }

        return node.type.name === 'mediaSingle'
          ? mediaSingle.createChecked(attrs, node.content, node.marks)
          : node;
      });
    }

    const __mediaTraceId = getRandomHex(8);

    newSlice = mapSlice(newSlice, (node) => {
      // This logic is duplicated in editor-plugin-ai where external images can be inserted
      // from external sources through the use of AI.  The editor-plugin-ai package is avoiding
      // sharing dependencies with editor-core to support products using it with various versions
      // of editor packages.
      // The duplication is in the following file:
      // packages/editor/editor-plugin-ai/src/prebuilt/content-transformers/markdown-to-pm/markdown-transformer.ts
      if (node.type.name === 'media') {
        return media.createChecked(
          {
            ...node.attrs,
            __external: node.attrs.type === 'external',
            __mediaTraceId:
              node.attrs.type === 'external' ? null : __mediaTraceId,
          },
          node.content,
          node.marks,
        );
      }

      if (node.type.name === 'mediaInline') {
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

    return newSlice;
  };
}

// TODO move this to editor-common
export const isImage = (fileType?: string): boolean => {
  return (
    !!fileType &&
    (fileType.indexOf('image/') > -1 || fileType.indexOf('video/') > -1)
  );
};

export const transformSliceToCorrectMediaWrapper = (
  slice: Slice,
  schema: Schema,
) => {
  const { mediaGroup, mediaSingle, media } = schema.nodes;
  return mapSlice(slice, (node, parent) => {
    if (!parent && node.type === media) {
      if (
        mediaSingle &&
        (isImage(node.attrs.__fileMimeType) || node.attrs.type === 'external')
      ) {
        return mediaSingle.createChecked({}, node);
      } else {
        return mediaGroup.createChecked({}, [node]);
      }
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

const VALID_TAGS_CONTAINER = ['DIV', 'TD'];
function canContainImage(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }
  return VALID_TAGS_CONTAINER.indexOf(element.tagName) !== -1;
}

/**
 * Given a html string, we attempt to hoist any nested `<img>` tags,
 * not directly wrapped by a `<div>` as ProseMirror no-op's
 * on those scenarios.
 * @param html
 */
export const unwrapNestedMediaElements = (html: string) => {
  const parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');
  const wrapper = doc.body;

  // Remove Google Doc's wrapper <b> el
  const docsWrapper = wrapper.querySelector<HTMLElement>(
    'b[id^="docs-internal-guid-"]',
  );
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
      (mediaParent instanceof HTMLSpanElement &&
        mediaParent.closest('[class*="emoji-common"]'))
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
