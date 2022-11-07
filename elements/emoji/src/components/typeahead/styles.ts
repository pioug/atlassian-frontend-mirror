import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import {
  emojiPreviewSelectedColor,
  emojiTypeAheadMaxHeight,
  emojiTypeAheadWidth,
  noDialogContainerBorderColor,
  noDialogContainerBorderRadius,
  noDialogContainerBoxShadow,
} from '../../util/shared-styles';

export const emojiTypeAhead = 'emoji-typeahead-element';
export const typeAheadListContainer = 'emoji-typeahead-list-container';

// editor-core is using this static class name for testing
export const typeaheadSelected = 'emoji-typeahead-selected';

export const typeAheadList = css({
  background: token('elevation.surface.overlay', 'white'),
  border: `1px solid ${noDialogContainerBorderColor}`,
  borderRadius: noDialogContainerBorderRadius,
  boxShadow: noDialogContainerBoxShadow,
  color: token('color.text.subtle', '#333'),
  width: emojiTypeAheadWidth,
});

export const typeAheadEmpty = css({
  display: 'none',
});

export const selected = css({
  backgroundColor: emojiPreviewSelectedColor,
});

export const typeAheadItem = css({
  cursor: 'pointer',
  display: 'block',
  listStyleType: 'none',
  overflow: 'hidden',
  width: emojiTypeAheadWidth,
});

export const typeAheadItemRow = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  verticalAlign: 'middle',
});

export const emojiTypeAheadSpinnerContainer = css({
  position: 'relative',
  height: `${emojiTypeAheadMaxHeight}px`,
  paddingTop: `${((emojiTypeAheadMaxHeight - 30) / 2).toFixed()}px`,
  boxSizing: 'border-box',
});

export const emojiTypeAheadSpinner = css({
  textAlign: 'center',
});
