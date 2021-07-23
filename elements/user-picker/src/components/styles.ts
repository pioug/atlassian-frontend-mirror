import { AVATAR_SIZES, BORDER_WIDTH } from '@atlaskit/avatar';
import * as colors from '@atlaskit/theme/colors';
import memoizeOne from 'memoize-one';
import { getAvatarSize } from './utils';
import { mergeStyles, StylesConfig } from '@atlaskit/select';

export const BORDER_PADDING = 6;
export const AVATAR_PADDING = 6;
export const INDICATOR_WIDTH = 39;
const TOTAL_PADDING_TAG_TO_CONTAINER = 10;
const TAG_MARGIN_WIDTH = 4;

export const getStyles = memoizeOne(
  (
    width: string | number,
    isMulti?: boolean,
    overrideStyles?: StylesConfig,
  ) => {
    let styles = {
      menu: (css: any, state: any) => ({
        ...css,
        width,
        minWidth: state.selectProps.menuMinWidth,
      }),
      control: (css: any, state: any) => {
        const isCompact = state.selectProps.appearance === 'compact';
        const isMulti = state.selectProps.isMulti;
        return {
          ...css,
          width,
          borderColor: state.isFocused
            ? css.borderColor
            : state.selectProps.subtle || state.selectProps.noBorder
            ? 'transparent'
            : colors.N40,
          backgroundColor: state.isFocused
            ? css['backgroundColor']
            : state.selectProps.subtle
            ? 'transparent'
            : state.selectProps.textFieldBackgroundColor
            ? colors.N10
            : colors.N20,
          '&:hover .fabric-user-picker__clear-indicator': { opacity: 1 },
          ':hover': {
            ...css[':hover'],
            borderColor: state.isFocused
              ? css[':hover']
                ? css[':hover'].borderColor
                : colors.B100
              : state.selectProps.subtle
              ? state.selectProps.hoveringClearIndicator
                ? colors.R50
                : colors.N30
              : colors.N40,
            backgroundColor:
              state.selectProps.subtle &&
              state.selectProps.hoveringClearIndicator
                ? colors.R50
                : state.isFocused
                ? css[':hover']
                  ? css[':hover'].backgroundColor
                  : colors.N0
                : state.isDisabled
                ? colors.N10
                : colors.N30,
          },
          padding: 0,
          minHeight: isCompact ? 'none' : 44,
          /* IE 11 needs to set height explicitly to be vertical align when being in not compact mode */
          height: isCompact || isMulti ? '100%' : 44,
          alignItems: 'stretch',
          maxWidth: '100%',
        };
      },
      clearIndicator: ({
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        ...css
      }: any) => ({
        ...css,
        opacity: 0,
        transition: css.transition + ', opacity 150ms',
        paddingTop: 0,
        padding: 0,
        ':hover': {
          color: colors.R400,
        },
      }),
      indicatorsContainer: (css: any) => ({
        ...css,
        paddingRight: 4,
      }),
      valueContainer: (
        { paddingTop, paddingBottom, position, ...css }: any,
        state: any,
      ) => {
        const isCompact = state.selectProps.appearance === 'compact';
        const isMulti = state.selectProps.isMulti;

        return {
          ...css,
          paddingTop: isCompact
            ? 0
            : TOTAL_PADDING_TAG_TO_CONTAINER - TAG_MARGIN_WIDTH,
          paddingBottom: isCompact
            ? 0
            : TOTAL_PADDING_TAG_TO_CONTAINER - TAG_MARGIN_WIDTH,
          flexGrow: 1,
          paddingLeft: isMulti ? BORDER_PADDING : 0,
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'hidden',
          overflowY: 'auto',
          flexWrap: state.selectProps.isMulti ? 'wrap' : 'nowrap',
          scrollbarWidth: 'none',
          maxHeight: state.selectProps.maxPickerHeight || '100%',
          '::-webkit-scrollbar': {
            width: 0,
            background: 'transparent',
          },
          position: 'relative',
        };
      },
      multiValue: (css: any) => ({
        ...css,
        borderRadius: 24,
        cursor: 'default',
      }),
      multiValueLabel: (css: any) => ({
        ...css,
        fontSize: '100%',
        display: 'flex',
      }),
      multiValueRemove: (css: any) => ({
        ...css,
        borderRadius: 24,
        cursor: 'pointer',
      }),
      placeholder: (css: any, state: any) => {
        const avatarSize = getAvatarSize(state.selectProps.appearance);

        // fix styling in IE 11: when the position is absolute and `left` prop is not defined,
        // IE and other browsers auto calculate value of "left" prop differently,
        // so we want to explicitly set value for the `left` property
        if (css.position === 'absolute' && !css.left) {
          css.left = `${BORDER_PADDING}px`;
        }

        return {
          ...css,
          paddingLeft: state.selectProps.isMulti
            ? 'none'
            : AVATAR_PADDING + 2 * BORDER_WIDTH + AVATAR_SIZES[avatarSize],
          /* Margin left right of 2px set by default */
          margin: 0,
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        };
      },
      option: (css: any) => ({
        ...css,
        overflow: 'hidden',
      }),
      input: ({ margin, ...css }: any) => ({
        ...css,
        display: 'flex',
        alignSelf: 'center',
        /* Necessary to make input height and tag height the same. */
        marginBottom: TAG_MARGIN_WIDTH,
        marginTop: TAG_MARGIN_WIDTH,
        /* Padding top and bottom of 2 is set by default. */
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: isMulti ? 0 : AVATAR_PADDING,
        '& input::placeholder': {
          /* Chrome, Firefox, Opera, Safari 10.1+ */
          color: colors.N100,
          opacity: 1 /* Firefox */,
        },
        '& input:-ms-input-placeholder': {
          /* Internet Explorer 10-11 */
          color: colors.N100,
        },
      }),
    };

    return overrideStyles ? mergeStyles(styles, overrideStyles) : styles;
  },
);

export const getPopupStyles = memoizeOne(
  (width: string | number, flip?: boolean, isMulti?: boolean) =>
    ({
      ...getStyles(width, isMulti),
      container: (css: any) => ({
        ...css,
        display: flip ? 'flex' : 'block',
        flexDirection: 'column-reverse',
      }),
      // there is not any avatar on the left of the placeholder
      placeholder: (css: any, state: any) => {
        const avatarSize = getAvatarSize(state.selectProps.appearance);
        if (css.position === 'absolute' && !css.left) {
          css.left = `${BORDER_PADDING}px`;
        }
        return {
          ...css,
          paddingTop: 2,
          paddingLeft: isMulti
            ? 'none'
            : AVATAR_PADDING + 2 * BORDER_WIDTH + AVATAR_SIZES[avatarSize],
          paddingRight: INDICATOR_WIDTH,
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
          margin: 0,
        };
      },
    } as StylesConfig),
);
