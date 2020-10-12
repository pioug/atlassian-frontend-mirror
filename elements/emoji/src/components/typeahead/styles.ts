import { style } from 'typestyle';

import {
  emojiPreviewSelectedColor,
  emojiTypeAheadMaxHeight,
  emojiTypeAheadWidth,
  noDialogContainerBorderColor,
  noDialogContainerBorderRadius,
  noDialogContainerBoxShadow,
} from '../../util/shared-styles';

export const selected = 'emoji-typeahead-selected';

export const emojiTypeAhead = 'emoji-typeahead-element';

export const typeAheadListContainer = 'emoji-typeahead-list-container';

export const typeAheadList = style({
  background: 'white',
  border: `1px solid ${noDialogContainerBorderColor}`,
  borderRadius: noDialogContainerBorderRadius,
  boxShadow: noDialogContainerBoxShadow,
  color: '#333',
  width: emojiTypeAheadWidth,
});

export const typeAheadEmpty = style({
  display: 'none',
});

export const typeAheadItem = style({
  cursor: 'pointer',
  display: 'block',
  listStyleType: 'none',
  overflow: 'hidden',
  width: emojiTypeAheadWidth,

  $nest: {
    [`&.${selected}`]: {
      backgroundColor: emojiPreviewSelectedColor,
    },
  },
});

export const typeAheadItemRow = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  verticalAlign: 'middle',
});

export const emojiTypeAheadSpinnerContainer = style({
  position: 'relative',
  height: `${emojiTypeAheadMaxHeight}px`,
  paddingTop: `${((emojiTypeAheadMaxHeight - 30) / 2).toFixed()}px`,
  boxSizing: 'border-box',
});

export const emojiTypeAheadSpinner = style({
  textAlign: 'center',
});
