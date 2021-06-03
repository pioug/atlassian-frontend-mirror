import { gridSize, fontFamily } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

import { StylesConfig, ValidationState } from './types';

const BORDER_WIDTH = 2;
const ICON_PADDING = 2;
const paddingExcludingBorder = gridSize() - BORDER_WIDTH;

export default function baseStyles<Option, IsMulti extends boolean>(
  validationState: ValidationState,
  isCompact: boolean,
): StylesConfig<Option, IsMulti> {
  return {
    container: (css, { isDisabled }) => ({
      ...css,
      fontFamily: fontFamily(),
      // react-select disables pointer events when isDisabled is true.
      // We override this and make the inner container turn it off instead.
      pointerEvents: 'all',
      cursor: isDisabled ? 'not-allowed' : undefined,
    }),
    control: (css, { isFocused, isDisabled }) => {
      let borderColor = isFocused ? colors.B100 : colors.N20;
      let backgroundColor = isFocused ? colors.N0 : colors.N20;

      if (isDisabled) {
        backgroundColor = colors.N20;
      }

      if (validationState === 'error') {
        borderColor = colors.R400;
      }
      if (validationState === 'success') {
        borderColor = colors.G400;
      }

      let borderColorHover = isFocused ? colors.B100 : colors.N30;

      if (validationState === 'error') {
        borderColorHover = colors.R400;
      }
      if (validationState === 'success') {
        borderColorHover = colors.G400;
      }

      const transitionDuration = '200ms';

      return {
        ...css,
        // Turn pointer events off when disabled - this makes it so hover etc don't work.
        pointerEvents: isDisabled ? 'none' : undefined,
        backgroundColor,
        borderColor,
        borderStyle: 'solid',
        borderRadius: '3px',
        borderWidth: '2px',
        boxShadow: 'none',
        minHeight: isCompact ? gridSize() * 4 : gridSize() * 5,
        padding: 0,
        transition: `background-color ${transitionDuration} ease-in-out,
        border-color ${transitionDuration} ease-in-out`,
        '::-webkit-scrollbar': {
          height: gridSize(),
          width: gridSize(),
        },
        '::-webkit-scrollbar-corner': {
          display: 'none',
        },
        ':hover': {
          '::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
          cursor: 'pointer',
          backgroundColor: isFocused ? colors.N0 : colors.N30,
          borderColor: borderColorHover,
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(0,0,0,0.4)',
        },
      };
    },
    valueContainer: (css) => ({
      ...css,
      paddingLeft: paddingExcludingBorder,
      paddingRight: paddingExcludingBorder,
      paddingBottom: isCompact ? 0 : 2,
      paddingTop: isCompact ? 0 : 2,
    }),
    clearIndicator: (css) => ({
      ...css,
      color: colors.N70,
      paddingLeft: ICON_PADDING,

      paddingRight: ICON_PADDING,

      paddingBottom: isCompact ? 0 : 6,

      paddingTop: isCompact ? 0 : 6,

      ':hover': {
        color: colors.N500,
      },
    }),
    loadingIndicator: (css) => ({
      ...css,
      paddingBottom: isCompact ? 0 : 6,
      paddingTop: isCompact ? 0 : 6,
    }),
    dropdownIndicator: (css, { isDisabled }) => {
      let color = colors.N500;

      if (isDisabled) {
        color = colors.N70;
      }

      return {
        ...css,
        color,
        paddingLeft: ICON_PADDING,
        paddingRight: ICON_PADDING,
        paddingBottom: isCompact ? 0 : 6,
        paddingTop: isCompact ? 0 : 6,
        ':hover': {
          color: colors.N200,
        },
      };
    },
    indicatorsContainer: (css) => ({
      ...css,
      paddingRight: paddingExcludingBorder - ICON_PADDING,
    }),
    option: (css, { isFocused, isSelected, isDisabled }) => {
      let color;
      if (isDisabled) {
        color = colors.N70;
      } else if (isSelected) {
        color = colors.N0;
      }

      let backgroundColor;
      if (isDisabled) {
        backgroundColor = undefined;
      } else if (isSelected) {
        backgroundColor = colors.N500;
      } else if (isFocused) {
        backgroundColor = colors.N30;
      }

      const cursor = isDisabled ? 'not-allowed' : undefined;

      return {
        ...css,
        paddingTop: '6px',
        paddingBottom: '6px',
        backgroundColor,
        color,
        cursor,
      };
    },
    placeholder: (css) => ({ ...css, color: colors.N100 }),
    singleValue: (css, { isDisabled }) => ({
      ...css,
      color: isDisabled ? colors.N70 : colors.N800,
      lineHeight: `${gridSize() * 2}px`, // 16px
    }),
    menuList: (css) => ({
      ...css,
      paddingTop: gridSize(),
      paddingBottom: gridSize(),
    }),
    multiValue: (css) => ({
      ...css,
      borderRadius: '2px',
      backgroundColor: colors.N40,
      color: colors.N500,
      maxWidth: '100%',
    }),
    multiValueLabel: (css) => ({
      ...css,
      padding: '2px',
      paddingRight: '2px',
    }),
    multiValueRemove: (
      css,
      {
        // @ts-ignore: missing in @types/react-select
        isFocused,
      },
    ) => ({
      ...css,
      backgroundColor: isFocused && colors.R75,
      color: isFocused && colors.R400,
      paddingLeft: '2px',
      paddingRight: '2px',
      borderRadius: '0px 2px 2px 0px',
      ':hover': {
        color: colors.R400,
        backgroundColor: colors.R75,
      },
    }),
  };
}
