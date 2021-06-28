import { EditorState } from 'prosemirror-state';
import { TableCssClassName as ClassName } from '../types';
import { getFeatureFlags } from '../../feature-flags-context';

export const updateShadowListForStickyStyles = (
  heightStyle: string,

  shadows: HTMLCollection,
) => {
  Array.from(shadows).forEach((shadow) => {
    if (shadow.classList.contains(ClassName.TABLE_STICKY_SHADOW)) {
      if (
        shadow instanceof HTMLElement &&
        shadow.style.height !== heightStyle
      ) {
        shadow.style.height = heightStyle;
      }
    }
  });
};

/**
 * Update overflow shadows for a given wrapper & table.
 * if `overflowShadowOptimization` is enabled, this will exit early.
 */
export const updateOverflowShadows = (
  editorState: EditorState,
  wrapper?: HTMLElement | null,
  table?: HTMLElement | null,
  rightShadows?: NodeListOf<HTMLElement> | null,
  leftShadows?: NodeListOf<HTMLElement> | null,
) => {
  if (getFeatureFlags(editorState)?.tableOverflowShadowsOptimization === true) {
    return false;
  }
  // Right shadow
  if (table && wrapper) {
    const stickyRow = wrapper.querySelector('tr.sticky');
    const stickyCell = stickyRow && stickyRow.firstElementChild;

    if (rightShadows) {
      const diff = table.offsetWidth - wrapper.offsetWidth;

      for (let i = 0; i < rightShadows.length; i++) {
        const rightShadow = rightShadows[i];
        rightShadow.style.display =
          diff > 0 && diff > wrapper.scrollLeft ? 'block' : 'none';

        if (
          rightShadow.classList.contains(ClassName.TABLE_STICKY_SHADOW) &&
          stickyCell
        ) {
          rightShadow.style.height = `${stickyCell.clientHeight + 1}px`;
        }
      }
    }
    if (leftShadows) {
      for (let i = 0; i < leftShadows.length; i++) {
        const leftShadow = leftShadows[i];
        leftShadow.style.display = wrapper.scrollLeft > 0 ? 'block' : 'none';

        if (
          leftShadow.classList.contains(ClassName.TABLE_STICKY_SHADOW) &&
          stickyCell
        ) {
          leftShadow.style.height = `${stickyCell.clientHeight + 1}px`;
        }
      }
    }
  }
};
