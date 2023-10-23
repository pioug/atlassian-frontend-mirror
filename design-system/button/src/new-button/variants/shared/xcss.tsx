import {
  type BackgroundColor,
  type Space,
  type TextColor,
  xcss,
} from '@atlaskit/primitives';
import { fontSize as getFontSize } from '@atlaskit/theme/constants';

import { type Appearance, type Spacing } from '../types';

import colors, { type ColorGroup } from './colors';

const fontSize: number = getFontSize();

export const heights: { [key in Spacing]: string } = {
  default: `${32 / fontSize}em`,
  compact: `${24 / fontSize}em`,
  none: 'auto',
};

const paddingInline: {
  [key in Spacing]: {
    default: Space;
    withIcon: Space;
  };
} = {
  default: {
    default: 'space.150',
    withIcon: 'space.100',
  },
  compact: {
    default: 'space.150',
    withIcon: 'space.100',
  },
  none: {
    default: 'space.0',
    withIcon: 'space.0',
  },
};

const gap: { [key in Spacing]: Space } = {
  compact: 'space.050',
  default: 'space.050',
  none: 'space.0',
};

const verticalAlign: { [key in Spacing]: string } = {
  default: 'middle',
  compact: 'middle',
  none: 'baseline',
};

const splitBorderStyles = {
  ':first-of-type': {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  ':last-of-type': {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  ':focus-visible': {
    zIndex: 1,
  },
};

function getColor<T extends BackgroundColor | TextColor>({
  group,
  key,
}: {
  group: ColorGroup<T>;
  key: keyof ColorGroup<T>;
}): T {
  return group[key] || group.default;
}

function getColors({
  appearance,
  interactionState = 'default',
  isDisabled,
  isSelected,
  isHighlighted,
  isActiveOverSelected,
  hasOverlay,
}: {
  appearance: Appearance;
  /**
   * isSelected state has limited relevance (e.g. dropdown-menu trigger button).
   * There is no isSelected state for color variants (e.g. primary, danger, warning).
   * Hens we provide ability to override the isSelected state with isActiveOverSelected to display `active` state instead of `selected` state.
   */
  isActiveOverSelected: boolean;
  interactionState?: 'default' | 'hover' | 'active';
  isDisabled?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  hasOverlay?: boolean;
}): {
  backgroundColor: BackgroundColor;
  color: TextColor;
} {
  let key: keyof ColorGroup<any> = interactionState;
  // Overlay does not change color on interaction, revert to 'default' or resting state
  key = hasOverlay ? 'default' : key;
  key =
    isSelected || isHighlighted
      ? isActiveOverSelected
        ? 'active'
        : 'selected'
      : key;
  // Disabled colors overrule everything else
  key = isDisabled ? 'disabled' : key;

  return {
    backgroundColor: getColor<BackgroundColor>({
      group: colors.background[appearance],
      key,
    }),
    color: `${getColor<TextColor>({
      group: colors.color[appearance],
      key,
    })}`,
  };
}

export type GetXCSSArgs = {
  appearance: Appearance;
  spacing: Spacing;
  isDisabled: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isActiveOverSelected: boolean;
  shouldFitContainer: boolean;
  hasOverlay: boolean;
  isIconButton: boolean;
  hasIconBefore: boolean;
  hasIconAfter: boolean;
  /**
   * If the button is a LinkButton
   */
  isLink: boolean;
  /**
   * If the button is a SplitButton
   */
  isSplit: boolean;
  /**
   * If the button is a PrimarySplitButton used in atlassian-navigation
   */
  isNavigationSplit: boolean;
};

export function getXCSS({
  appearance,
  spacing,
  isDisabled,
  isSelected,
  isHighlighted,
  isActiveOverSelected,
  isIconButton,
  shouldFitContainer,
  isLink,
  isSplit,
  isNavigationSplit,
  hasOverlay,
  hasIconBefore,
  hasIconAfter,
}: GetXCSSArgs): ReturnType<typeof xcss> {
  const baseColors = getColors({
    appearance,
    isSelected,
    isHighlighted,
    isActiveOverSelected,
    isDisabled,
  });

  const combinedBaseColorStyles = isLink
    ? {
        ...baseColors,
        textDecoration: 'none',

        // Disabling visited styles (by re-declaring the base colors)
        ':visited': baseColors,
      }
    : isNavigationSplit && !isSelected
    ? {
        ...baseColors,
        backgroundColor: 'color.background.neutral.subtle' as const,
      }
    : baseColors;

  const height = heights[spacing];

  let width = shouldFitContainer ? '100%' : 'auto';
  width = isIconButton ? (isNavigationSplit ? '24px' : height) : width;

  const defaultPaddingInlineStart =
    paddingInline[spacing][hasIconBefore ? 'withIcon' : 'default'];
  const defaultPaddingInlineEnd =
    paddingInline[spacing][hasIconAfter ? 'withIcon' : 'default'];

  const splitButtonStyles = isSplit ? splitBorderStyles : {};

  const getNavigationSplitButtonPaddings = () => {
    if (isNavigationSplit) {
      return {
        paddingInlineStart: 'space.075',
        paddingInlineEnd: 'space.075',
      } as const;
    }

    return {
      paddingInlineStart: isIconButton ? 'space.0' : defaultPaddingInlineStart,
      paddingInlineEnd: isIconButton ? 'space.0' : defaultPaddingInlineEnd,
    } as const;
  };

  const { paddingInlineStart, paddingInlineEnd } =
    getNavigationSplitButtonPaddings();

  return xcss({
    alignItems: 'center',
    borderWidth: 'border.width.0',
    borderRadius: 'border.radius.100',
    boxSizing: 'border-box',
    display: 'inline-flex',
    fontSize: 'inherit',
    fontStyle: 'normal',
    fontFamily: 'inherit',
    fontWeight: 500,
    maxWidth: '100%',
    // Needed to position overlay
    position: 'relative',
    textAlign: 'center',
    transition:
      'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
    whiteSpace: 'nowrap',
    height,
    paddingBlock: 'space.0',
    paddingInlineStart,
    paddingInlineEnd,
    columnGap: gap[spacing],
    verticalAlign: verticalAlign[spacing],
    width,
    // justifyContent required for shouldFitContainer buttons with an icon inside
    justifyContent: 'center',
    ...combinedBaseColorStyles,
    ...(isDisabled || hasOverlay
      ? {
          cursor: 'not-allowed',
        }
      : {}),

    ':hover': {
      ...getColors({
        appearance,
        isSelected: isNavigationSplit && !isSelected ? false : isSelected,
        isActiveOverSelected,
        isDisabled,
        interactionState: 'hover',
        hasOverlay,
      }),
      textDecoration:
        !isSelected && (appearance === 'link' || appearance === 'subtle-link')
          ? 'underline'
          : 'none',
      // background, box-shadow
      transitionDuration: '0s, 0.15s',
    },

    ':active': {
      ...getColors({
        appearance,
        isSelected: isNavigationSplit && !isSelected ? false : isSelected,
        isActiveOverSelected,
        isDisabled,
        interactionState: 'active',
        hasOverlay,
      }),
      // background, box-shadow
      transitionDuration: '0s, 0s',
    },
    ...splitButtonStyles,
  });
}
