import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import {
  B200,
  B300,
  N100A,
  N200,
  N30,
  N30A,
  N50,
  N900,
} from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import {
  emojiPickerBorderColor,
  emojiPickerBoxShadow,
} from '../../util/shared-styles';
import { emojiSprite, placeholder, emojiNodeStyles } from '../common/styles';
import {
  emojiPickerHeight,
  emojiPickerHeightWithPreview,
  emojiPickerWidth,
} from '../../util/constants';

// Level 1 - picker

export const emojiPicker = (hasPreview?: boolean) => {
  return css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: token('elevation.surface.overlay', 'white'),
    border: `${emojiPickerBorderColor} 1px solid`,
    borderRadius: `${borderRadius()}px`,
    boxShadow: emojiPickerBoxShadow,
    height: `${
      hasPreview ? emojiPickerHeightWithPreview : emojiPickerHeight
    }px`,
    width: `${emojiPickerWidth}px`,
    marginBottom: '8px',
    minWidth: `${emojiPickerWidth}px`,
  });
};

// Level 2

/// Category Selector

export const addButton = 'emoji-picker-add-button';

export const categorySelector = css({
  flex: '0 0 auto',
  backgroundColor: token('elevation.surface.sunken', N30),
  ul: {
    listStyle: 'none',
    margin: '0 4px',
    padding: '3px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  li: {
    display: 'inline-block',
    margin: 0,
    padding: 0,
    button: {
      verticalAlign: 'middle',
    },
  },

  [`.${addButton}`]: {
    color: token('color.text.subtlest', N200),
    margin: '0 0 0 5px',
    verticalAlign: 'middle',
  },
});

export const active = css({
  color: token('color.text.selected', B300),
  ['&:hover']: {
    color: token('color.text.selected', B300),
  },
});

export const disable = css({
  color: token('color.text.subtlest', N50),
  cursor: 'default',
  ['&:hover']: {
    color: token('color.text.subtlest', N50),
  },
});

export const categoryStyles = css({
  backgroundColor: 'transparent',
  border: 0,
  color: token('color.text.subtlest', N100A),
  cursor: 'pointer',
  margin: '2px 0',
  padding: 0,
  transition: 'color 0.2s ease',

  /* Firefox */
  ['&::-moz-focus-inner']: {
    border: '0 none',
    padding: 0,
  },

  ['&:hover']: {
    color: token('color.text.selected', B200),
  },
});

/// EmojiPickerList

export const emojiPickerList = css({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  // To force Firefox/IE/Edge to shrink the list, if necessary (e.g. when upload panel in place)
  height: '0',
});

// react-virtualized enables focus style by default - turn it off
export const virtualList = css({
  '&:focus': {
    outline: 'none',
  },
});

//// Search

export const searchIcon = css({
  opacity: 0.5,
});
export const input = css({
  boxSizing: 'border-box',
  color: 'inherit',
  cursor: 'inherit',
  fontSize: '14px',
  outline: 'none',
  padding: '1px 0 2px 6px',
  width: '100%',
  ['&:invalid']: {
    boxShadow: 'none',
  },
  ['&::-ms-clear']: {
    display: 'none',
  },
});

export const pickerSearch = css({
  boxSizing: 'border-box',
  padding: '10px 10px 11px 10px',
  width: '100%',
});

//// Loading/Spinner

export const emojiPickerSpinner = css({
  display: 'flex',
  width: '100%',
  height: '150px',
  justifyContent: 'center',
  alignItems: 'center',
  '>div': {
    flex: '0 0 auto',
  },
});

//// Category/Result

export const emojiPickerRow = css({
  marginLeft: '8px',
});

export const emojiCategoryTitle = css({
  boxSizing: 'border-box',
  color: token('color.text', N900),
  fontSize: '14px',
  padding: '5px 8px',
  textTransform: 'lowercase',
  '&:first-letter': {
    textTransform: 'uppercase',
  },
});

export const emojiItem = css({
  display: 'inline-block',
  textAlign: 'center',
  width: '40px',

  [`& .${emojiNodeStyles}`]: {
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '5px',
    width: '24px',
    height: '24px',
  },
  [`& .${placeholder}`]: {
    padding: '0',
    margin: '7px',
    minWidth: '24px',
    maxWidth: '24px',
  },
  [`& .${emojiNodeStyles} .${placeholder}`]: {
    margin: '0',
  },
  // Fit non-square emoji to square
  [`& .${emojiNodeStyles} > img`]: {
    position: 'relative',
    left: '50%',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    maxHeight: '24px',
    maxWidth: '24px',
    display: 'block',
  },
  // Scale sprite to fit regardless of default emoji size
  [`& .${emojiNodeStyles} > .${emojiSprite}`]: {
    height: '24px',
    width: '24px',
  },
});

/// Footer
export const emojiPickerFooter = css({
  flex: '0 0 auto',
});

export const emojiPickerFooterWithTopShadow = css({
  borderTop: `2px solid ${token('color.border', N30A)}`,
  boxShadow: `0px -1px 1px 0px ${token('color.border', 'rgba(0, 0, 0, 0.1)')}`,
});

export const emojiActionsContainerWithBottomShadow = css({
  borderBottom: `2px solid ${token('color.border', N30A)}`,
  boxShadow: `0px 1px 1px 0px ${token('color.border', 'rgba(0, 0, 0, 0.1)')}`,
});
