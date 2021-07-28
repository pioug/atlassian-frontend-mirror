import { borderRadius } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { defaultEmojiHeight } from '../../util/constants';
import { akEmojiSelectedBackgroundColor } from '../../util/shared-styles';
import { style } from 'typestyle';

export const selected = 'emoji-common-selected';
export const selectOnHover = 'emoji-common-select-on-hover';
export const emojiSprite = 'emoji-common-emoji-sprite';
export const emojiNode = 'emoji-common-node';
export const emojiImage = 'emoji-common-emoji-image';

export const deleteButton = style({
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

export const emoji = style({
  borderRadius: '5px',
  backgroundColor: 'transparent',
  display: 'inline-block',
  verticalAlign: 'middle',
  // Ensure along with vertical align middle, we don't increase the line height for p and some
  // headings. Smaller headings get a slight increase in height, cannot add more negative margin
  // as a "selected" emoji (e.g. in the editor) will not look good.
  margin: '-1px 0',

  $nest: {
    [`&.${selected},&.${selectOnHover}:hover`]: {
      backgroundColor: akEmojiSelectedBackgroundColor,
    },
    [`&.${selected},&.${selectOnHover}:hover .${deleteButton}`]: {
      // show delete button on hover
      visibility: 'visible',
    },
    img: {
      display: 'block',
    },
  },
});

export const emojiContainer = style({
  display: 'inline-block',
  // Ensure along with vertical align middle, we don't increase the line height for h1..h6, and p
  margin: '-1px 0',

  $nest: {
    [`&.${selected},&.${selectOnHover}:hover`]: {
      backgroundColor: akEmojiSelectedBackgroundColor,
    },

    [`.${emojiSprite}`]: {
      background: 'transparent no-repeat',
      display: 'inline-block',
      verticalAlign: 'middle',
      height: `${defaultEmojiHeight}px`,
      width: `${defaultEmojiHeight}px`,
    },
  },
});

export const placeholder = 'emoji-common-placeholder';

export const placeholderContainer = style({
  // Ensure no vertical reflow
  margin: '-1px 0',
  display: 'inline-block',
  background: '#f7f7f7',
  borderRadius: '20%',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
});

export const placeholderEmoji = style({
  display: 'inline-block',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
});

export const emojiButton = style({
  backgroundColor: 'transparent',
  border: '0',
  cursor: 'pointer',
  padding: 0,

  $nest: {
    /* Firefox */
    ['&::-moz-focus-inner']: {
      border: '0 none',
      padding: 0,
    },

    '&>span': {
      borderRadius: '5px',
      padding: '8px',

      $nest: {
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
    },
  },
});

export const hiddenToneButton = style({
  // Hide currently selected tone that rendered in the ToneSelector to avoid duplication
  // Set $ unique: true to be able to apply the ccs property to an element as described here https://github.com/typestyle/typestyle/issues/253
  display: 'none',
  $unique: true,
});

// Emoji Preview

export const buttons = 'emoji-common-buttons';
export const preview = 'emoji-common-preview';
export const previewImg = 'emoji-common-preview-image';
export const previewText = 'emoji-common-preview-text';
export const name = 'emoji-common-name';
export const shortName = 'emoji-common-shortname';
export const previewSingleLine = 'emoji-common-preview-single-line';
export const toneSelectorContainer = 'emoji-common-tone-selector-container';
export const withToneSelector = 'emoji-common-with-tone-selector';
export const emojiPreviewSection = 'emoji-preview-section';

export const emojiPreview = style({
  display: 'flex',
  height: '50px',
  boxSizing: 'border-box',

  $nest: {
    [`.${preview}`]: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      padding: '10px',

      $nest: {
        [`.${emojiSprite}`]: {
          height: '32px',
          margin: '0',
          width: '32px',
        },

        [`.${previewImg}`]: {
          display: 'inline-block',
          flex: 'initial',
          width: '32px',

          $nest: {
            '&>span': {
              width: '32px',
              height: '32px',
              padding: 0,
              maxHeight: 'inherit',

              $nest: {
                '&>img': {
                  position: 'relative',
                  left: '50%',
                  top: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                  maxHeight: '32px',
                  maxWidth: '32px',
                  padding: 0,
                  display: 'block',
                },
              },
            },
          },
        },

        [`.${previewText}`]: {
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '10px',
          marginTop: '-2px',
          maxWidth: '285px',
          width: '285px' /* IE */,
          flexGrow: 1,
          flexShrink: 1,

          $nest: {
            [`.${name}`]: {
              display: 'block',
              color: colors.N900,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',

              $nest: {
                ['&:first-letter']: {
                  textTransform: 'uppercase',
                },
              },
            },

            [`.${shortName}`]: {
              display: 'block',
              color: colors.N200,
              fontSize: '12px',
              lineHeight: 1,
              marginBottom: '-2px',
              overflow: 'hidden',
              paddingBottom: '2px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          },
        },

        [`.${previewSingleLine}`]: {
          paddingTop: '10px',

          $nest: {
            [`.${name}`]: {
              display: 'none',
            },

            [`.${shortName}`]: {
              color: colors.N900,
              fontSize: '14px',
            },
          },
        },
      },
    },

    [`.${buttons}`]: {
      flex: 1,
      textAlign: 'right',
      margin: '6px',
    },

    [`.${toneSelectorContainer}`]: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '6px',
    },

    [`.${withToneSelector} .${previewText}`]: {
      maxWidth: '235px',
      width: '235px' /* IE */,
    },
  },
});

// Scrollable

export const emojiScrollable = style({
  border: '1px solid #fff',
  borderRadius: `${borderRadius()}px`,
  display: 'block',
  margin: '0',
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: '0',
});

// EmojiUpload

export const emojiUpload = style({
  height: '78px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
});

export const uploadChooseFileMessage = style({
  color: colors.N300,
  fontSize: '12px',
  paddingBottom: '7px',
});

export const emojiUploadBottom = style({
  fontSize: '11px',
});

export const uploadChooseFileRow = style({
  display: 'flex',
  justifyContent: 'space-between',
});

export const uploadChooseFileEmojiName = style({
  flex: '1 1 auto',
  marginRight: '5px',

  $nest: {
    input: {
      background: 'transparent',
      border: 0,
      fontSize: '12px',
      outline: 'none',
      width: '100%',
      height: '22px', // fixed height is required to work in IE11 and other browsers in Windows

      $nest: {
        ['&:invalid']: {
          boxShadow: 'none',
        },
        ['&::-ms-clear']: {
          display: 'none',
        },
      },
    },
  },
});

export const uploadChooseFileBrowse = style({
  flex: '0 0 auto',
});

export const uploadPreviewFooter = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100px',
  padding: '10px',
});

export const uploadPreview = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: colors.N20,
  borderRadius: `${borderRadius()}px`,
  padding: '10px',
});

export const uploadPreviewText = style({
  $nest: {
    h5: {
      color: colors.N300,
      paddingBottom: '4px',
      fontSize: '12px',
    },
    img: {
      maxHeight: '20px',
      maxWidth: '50px',
    },
  },
});

export const bigEmojiPreview = style({
  paddingLeft: '4px',
  $nest: {
    img: {
      maxHeight: '40px',
      maxWidth: '100px',
    },
  },
});

export const uploadAddRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingTop: '10px',
});

export const AddCustomEmoji = style({
  alignSelf: 'center',
  marginLeft: '10px',
});

// Emoji Delete preview

export const submitDelete = 'emoji-submit-delete';

export const previewButtonGroup = 'emoji-preview-button-group';

export const deletePreview = style({
  height: '100px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  fontSize: '12px',
});

export const deleteText = style({
  height: '64px',

  $nest: {
    ':first-child': {
      color: colors.N300,
      lineHeight: '16px',
    },
  },
});

export const deleteFooter = style({
  display: 'flex',
  height: '40px',
  alignItems: 'center',
  justifyContent: 'space-between',

  $nest: {
    img: {
      maxHeight: '32px',
      maxWidth: '72px',
    },

    [`.${previewButtonGroup}`]: {
      display: 'flex',
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

      $nest: {
        div: {
          display: 'flex',
        },
      },
    },
  },
});

export const emojiDeleteErrorMessage = style({
  display: 'flex',
  color: colors.R400,
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: '4px',
});

export const emojiChooseFileErrorMessage = style({
  display: 'flex',
  color: colors.R300,
  paddingRight: '10px',
  justifyContent: 'flex-start',
});

export const emojiPreviewErrorMessage = style({
  display: 'inline-flex',
  color: colors.R400,
  paddingRight: '10px',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

export const addCustomEmojiButton = style({
  maxWidth: '285px',
});

export const uploadRetryButton = style({
  maxWidth: '172px',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: '4px',
  $nest: {
    div: {
      display: 'flex',
    },
  },
});

export const uploadEmojiButton = style({
  maxWidth: '187px',
  justifyContent: 'center',
  marginRight: '4px',
  $nest: {
    div: {
      display: 'flex',
    },
  },
});

export const cancelButton = style({
  maxWidth: '100px',
});

export const buttonSpinner = style({
  marginRight: '10px',
  marginLeft: '10px',
});
