import { css, keyframes } from '@emotion/core';

import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import { defaultEmojiHeight } from '../../util/constants';
import { akEmojiSelectedBackgroundColor } from '../../util/shared-styles';
import {
  N20,
  N200,
  N20A,
  N300,
  N900,
  R300,
  R400,
} from '@atlaskit/theme/colors';

export const commonSelectedStyles = 'emoji-common-selected';
export const selectOnHoverStyles = 'emoji-common-select-on-hover';
export const emojiSprite = 'emoji-common-emoji-sprite';
export const emojiNodeStyles = 'emoji-common-node';
export const emojiImage = 'emoji-common-emoji-image';
export const emojiDeleteButton = 'emoji-common-deleteButton';
export const emojiMainStyle = 'emoji-common-main-styles';

export const deleteButton = css({
  // hide by default
  visibility: 'hidden',
  display: 'flex',
  height: '0px',
  // 40px emoji width with 2px left offset
  width: '38px',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  // vertically align button and prevent emoji offset
  paddingTop: '4px',
  marginBottom: '-4px',
});

export const emojiToneSelectorContainer = css({
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '10px 10px 11px 0',
});

export const emojiStyles = css({
  borderRadius: `${borderRadius()}px`,
  backgroundColor: 'transparent',
  display: 'inline-block',
  verticalAlign: 'middle',
  // Ensure along with vertical align middle, we don't increase the line height for p and some
  // headings. Smaller headings get a slight increase in height, cannot add more negative margin
  // as a "selected" emoji (e.g. in the editor) will not look good.
  margin: '-1px 0',
  [`&.${commonSelectedStyles},&.${selectOnHoverStyles}:hover`]: {
    backgroundColor: akEmojiSelectedBackgroundColor,
  },
  [`&.${commonSelectedStyles},&.${selectOnHoverStyles}:hover .${emojiDeleteButton}`]: {
    // show delete button on hover
    visibility: 'visible',
  },
  img: {
    display: 'block',
  },
});

export const emojiContainer = css({
  display: 'inline-block',
  // Ensure along with vertical align middle, we don't increase the line height for h1..h6, and p
  margin: '-1px 0',

  [`&.${commonSelectedStyles},&.${selectOnHoverStyles}:hover`]: {
    backgroundColor: akEmojiSelectedBackgroundColor,
  },

  [`.${emojiSprite}`]: {
    background: 'transparent no-repeat',
    display: 'inline-block',
    minHeight: `${defaultEmojiHeight}px`,
    minWidth: `${defaultEmojiHeight}px`,
    verticalAlign: 'middle',
  },
});

export const placeholder = 'emoji-common-placeholder';

export const placeholderContainer = css({
  position: 'relative',
  margin: '-1px 0',
  display: 'inline-block',
  background: token('color.border', '#f7f7f7'),
  borderRadius: `${borderRadius()}px`,
  overflow: 'hidden',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  textAlign: 'center',
});

const easeSweep = keyframes`
  from {
    transform: translateX(-100%);
  }
  to   {
    transform: translateX(100%);
  }
`;

export const placeholderContainerAnimated = css({
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    background: token('color.background.neutral', N20A),
    height: '100%',
    width: '100%',
    animation: `${easeSweep} 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite`,
  },
});

export const emojiButton = css({
  backgroundColor: 'transparent',
  border: '0',
  cursor: 'pointer',
  padding: 0,

  /* Firefox */
  ['&::-moz-focus-inner']: {
    border: '0 none',
    padding: 0,
  },

  '&>span': {
    borderRadius: `${borderRadius()}px`,
    padding: '8px',

    // Scale sprite to fit regardless of default emoji size
    [`&>.${emojiSprite}`]: {
      height: '24px',
      width: '24px',
    },
    // Scale image to fit regardless of default emoji size
    [`&>img`]: {
      height: '24px',
      width: '24px',
    },
  },
});

export const hiddenToneButton = css({
  // Hide currently selected tone that rendered in the ToneSelector to avoid duplication
  display: 'none',
});

// Emoji Preview
export const emojiPickerAddEmoji = 'emoji-picker-add-emoji';

export const previewText = css({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  marginTop: '-2px',
  marginLeft: '10px',
  maxWidth: '285px',
  width: '285px' /* IE */,
  flexGrow: 1,
  flexShrink: 1,
});

export const emojiName = css({
  display: 'block',
  color: token('color.text', N900),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  ['&:first-letter']: {
    textTransform: 'uppercase',
  },
});

export const emojiShortName = css({
  display: 'block',
  color: token('color.text.subtle', N200),
  fontSize: '12px',
  lineHeight: 1,
  marginBottom: '-2px',
  overflow: 'hidden',
  paddingBottom: '2px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',

  ['&:first-of-type']: {
    color: token('color.text', N900),
    fontSize: '14px',
  },
});

export const preview = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  padding: '10px',
  height: '32px',
  alignItems: 'center',
});

export const previewImg = css({
  display: 'inline-block',
  flex: 'initial',
  width: '32px',
  [`& .${emojiSprite}, > span`]: {
    width: '32px',
    height: '32px',
    padding: 0,
    maxHeight: 'inherit',
  },
  [`& > span > img`]: {
    position: 'relative',
    left: '50%',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    maxHeight: '32px',
    maxWidth: '32px',
    padding: 0,
    display: 'block',
  },
});

// Scrollable

export const emojiScrollable = css({
  border: `1px solid ${token('color.border', '#fff')}`,
  borderRadius: `${borderRadius()}px`,
  display: 'block',
  margin: '0',
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: '0',
});

// EmojiUpload

export const emojiUpload = css({
  height: '78px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
});

export const uploadChooseFileMessage = css({
  color: token('color.text.subtle', N300),
  fontSize: '12px',
  paddingBottom: '7px',
});

export const emojiUploadBottom = css({
  fontSize: '11px',
});

export const uploadChooseFileRow = css({
  display: 'flex',
  justifyContent: 'space-between',
});

export const uploadChooseFileEmojiName = css({
  flex: '1 1 auto',
  marginRight: '5px',
  input: {
    background: 'transparent',
    border: 0,
    outline: 'none',

    ['&:invalid']: {
      boxShadow: 'none',
    },
    ['&::-ms-clear']: {
      display: 'none',
    },
  },
});

export const uploadChooseFileBrowse = css({
  flex: '0 0 auto',
});

export const uploadPreviewFooter = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100px',
  padding: '10px',
});

export const uploadPreview = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: token('color.background.neutral', N20),
  borderRadius: `${borderRadius()}px`,
  padding: '10px',
});

export const uploadPreviewText = css({
  h5: {
    color: token('color.text.subtle', N300),
    paddingBottom: '4px',
    fontSize: '12px',
  },
  img: {
    maxHeight: '20px',
    maxWidth: '50px',
  },
});

export const bigEmojiPreview = css({
  paddingLeft: '4px',
  img: {
    maxHeight: '40px',
    maxWidth: '100px',
  },
});

export const uploadAddRow = css({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingTop: '10px',
});

export const addCustomEmoji = css({
  alignSelf: 'center',
  marginLeft: '10px',
  marginBottom: '10px',
});

// Emoji Delete preview

export const submitDelete = 'emoji-submit-delete';

export const deletePreview = css({
  height: '100px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
});

export const deleteText = css({
  height: '64px',
  fontSize: '12px',

  '&:first-of-type': {
    color: token('color.text.subtle', N300),
    lineHeight: '16px',
  },
});

export const previewButtonGroup = css({
  display: 'flex',
});

export const deleteFooter = css({
  display: 'flex',
  height: '40px',
  alignItems: 'center',
  justifyContent: 'space-between',

  img: {
    maxHeight: '32px',
    maxWidth: '72px',
  },

  [`.${submitDelete}`]: {
    width: '84px',
    fontWeight: 'bold',
    marginRight: '4px',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '14px',

    div: {
      display: 'flex',
    },
  },
});

export const emojiDeleteErrorMessage = css({
  display: 'flex',
  color: token('color.text.danger', R400),
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: '4px',
});

export const emojiChooseFileErrorMessage = css({
  display: 'flex',
  color: token('color.text.danger', R300),
  paddingRight: '10px',
  justifyContent: 'flex-start',
});

export const emojiPreviewErrorMessage = css({
  display: 'inline-flex',
  color: token('color.text.danger', R400),
  paddingRight: '10px',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

export const addCustomEmojiButton = css({
  maxWidth: '285px',
});

export const uploadRetryButton = css({
  maxWidth: '172px',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: '4px',
  div: {
    display: 'flex',
  },
});

export const uploadEmojiButton = css({
  maxWidth: '187px',
  justifyContent: 'center',
  marginRight: '4px',

  div: {
    display: 'flex',
  },
});

export const cancelButton = css({
  maxWidth: '100px',
});

export const buttonSpinner = css({
  marginRight: '10px',
  marginLeft: '10px',
});

export const emojiActionsWrapper = css({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
});
