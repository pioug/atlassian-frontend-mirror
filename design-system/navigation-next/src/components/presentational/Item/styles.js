import * as colors from '@atlaskit/theme/colors';
import {
  fontFamily,
  fontSize,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';

const targetEdgeAndIE11 = (styles) => {
  // From https://browserstrangeness.github.io/css_hacks.html
  return {
    '@media screen and (-ms-high-contrast: none)': styles,
    '@supports (-ms-ime-align:auto)': styles,
  };
};

const targetFirefox = (styles) => {
  // From https://stackoverflow.com/a/953491
  return {
    '@-moz-document url-prefix()': styles,
  };
};

const gridSize = gridSizeFn();

/**
 * Component tree structure:
 * - itemBase
 *   - beforeWrapper
 *   - contentWrapper
 *     - textWrapper
 *     - subTextWrapper
 *   - afterWrapper
 */

// These are the styles which are consistent regardless of theme or spacing
const baseStyles = {
  itemBase: {
    alignItems: 'center',
    border: 'none',
    borderRadius: '3px',
    boxSizing: 'border-box',
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    flexShrink: 0,
    fontSize: 'inherit',
    height: gridSize * 5,
    outline: 'none',
    textAlign: 'left',
    textDecoration: 'none',
    width: '100%',

    '&:focus': {
      boxShadow: `0 0 0 2px ${colors.B100} inset`,
    },
  },
  beforeWrapper: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflowX: 'hidden',
    ...targetEdgeAndIE11({
      fontFamily: fontFamily(),
    }),
  },
  textWrapper: {
    flex: '1 1 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    ...targetEdgeAndIE11({
      lineHeight: 18 / fontSize(),
    }),
    ...targetFirefox({
      lineHeight: 18 / fontSize(),
    }),
    lineHeight: 16 / fontSize(),
  },
  subTextWrapper: {
    flex: '1 1 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    ...targetEdgeAndIE11({
      marginTop: '-2px',
    }),
  },
  afterWrapper: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
  },
};

// These are styles which switch on the spacing prop
const layoutStyles = {
  compact: {
    itemBase: {
      paddingRight: gridSize,
      paddingLeft: gridSize,
    },
    beforeWrapper: {
      marginRight: gridSize,
    },
    subTextWrapper: {
      fontSize: '10px',
      lineHeight: 1.2,
    },
    afterWrapper: {
      marginLeft: gridSize,
    },
  },
  default: {
    itemBase: {
      paddingLeft: gridSize * 1.5,
      paddingRight: gridSize * 1.5,
    },
    beforeWrapper: {
      marginRight: gridSize * 2,
    },
    subTextWrapper: {
      fontSize: '12px',
      ...targetEdgeAndIE11({
        lineHeight: 16 / 12,
        marginTop: '-2px',
      }),
      lineHeight: 14 / 12,
    },
    afterWrapper: {
      marginLeft: gridSize * 2,
    },
  },
};

const getItemBackgroundColor = (
  background,
  { isActive, isSelected, isHover, isDragging },
) => {
  if (isDragging) return background.hint;
  if (isActive) return background.interact;
  if (isSelected) return background.static;
  if (isHover) return background.hint;
  return background.default;
};

// Light theme
export default ({ product }) => ({
  isActive,
  isDragging,
  isHover,
  isSelected,
  spacing,
}) => {
  const containerTextColor = isActive || isSelected ? colors.B400 : colors.N500;
  const containerBackgroundColor = getItemBackgroundColor(
    {
      default: colors.N20,
      hint: colors.N30,
      interact: colors.B50,
      static: colors.N30,
    },
    {
      isActive,
      isHover,
      isSelected,
      isDragging,
    },
  );
  const productBackgroundColor = getItemBackgroundColor(product.background, {
    isActive,
    isDragging,
    isHover,
    isSelected,
  });
  return {
    container: {
      itemBase: {
        ...baseStyles.itemBase,
        ...layoutStyles[spacing].itemBase,
        backgroundColor: containerBackgroundColor,
        fill: containerBackgroundColor,
      },
      beforeWrapper: {
        ...baseStyles.beforeWrapper,
        ...layoutStyles[spacing].beforeWrapper,
        color: containerTextColor,
      },
      contentWrapper: baseStyles.contentWrapper,
      textWrapper: {
        ...baseStyles.textWrapper,
        color: containerTextColor,
      },
      subTextWrapper: {
        ...baseStyles.subTextWrapper,
        ...layoutStyles[spacing].subTextWrapper,
        color: colors.N200,
      },
      afterWrapper: {
        ...baseStyles.afterWrapper,
        ...layoutStyles[spacing].afterWrapper,
        color: colors.N500,
      },
    },
    product: {
      itemBase: {
        ...baseStyles.itemBase,
        ...layoutStyles[spacing].itemBase,
        backgroundColor: productBackgroundColor,
        fill: productBackgroundColor,
      },
      beforeWrapper: {
        ...baseStyles.beforeWrapper,
        ...layoutStyles[spacing].beforeWrapper,
        color: product.text.default,
      },
      contentWrapper: baseStyles.contentWrapper,
      textWrapper: {
        ...baseStyles.textWrapper,
        color: product.text.default,
      },
      subTextWrapper: {
        ...baseStyles.subTextWrapper,
        ...layoutStyles[spacing].subTextWrapper,
        color: product.text.subtle,
      },
      afterWrapper: {
        ...baseStyles.afterWrapper,
        ...layoutStyles[spacing].afterWrapper,
        color: product.text.default,
      },
    },
  };
};
