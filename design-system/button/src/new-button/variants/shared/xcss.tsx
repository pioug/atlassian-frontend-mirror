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

const heights: { [key in Spacing]: string } = {
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
  hasOverlay,
}: {
  appearance: Appearance;
  interactionState?: 'default' | 'hover' | 'active';
  isDisabled?: boolean;
  isSelected?: boolean;
  hasOverlay?: boolean;
}): {
  backgroundColor: BackgroundColor;
  color: TextColor;
} {
  let key: keyof ColorGroup<any> = interactionState;
  // Overlay does not change color on interaction, revert to 'default' or resting state
  key = hasOverlay ? 'default' : key;
  key = isSelected ? 'selected' : key;
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
  shouldFitContainer: boolean;
  hasOverlay: boolean;
  isIconButton: boolean;
  hasIconBefore: boolean;
  hasIconAfter: boolean;
  /**
   * If the button is a LinkButton
   */
  isLink: boolean;
};

export function getXCSS({
  appearance,
  spacing,
  isDisabled,
  isSelected,
  isIconButton,
  shouldFitContainer,
  isLink,
  hasOverlay,
  hasIconBefore,
  hasIconAfter,
}: GetXCSSArgs): ReturnType<typeof xcss> {
  const baseColors = getColors({
    appearance,
    isSelected,
    isDisabled,
  });

  const combinedBaseColorStyles = isLink
    ? {
        ...baseColors,
        textDecoration: 'none',

        // Disabling visited styles (by re-declaring the base colors)
        ':visited': baseColors,
      }
    : baseColors;

  const height = heights[spacing];

  let width = shouldFitContainer ? '100%' : 'auto';
  width = isIconButton ? height : width;

  const paddingInlineStart =
    paddingInline[spacing][hasIconBefore ? 'withIcon' : 'default'];
  const paddingInlineEnd =
    paddingInline[spacing][hasIconAfter ? 'withIcon' : 'default'];

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
    paddingInlineStart: isIconButton ? 'space.0' : paddingInlineStart,
    paddingInlineEnd: isIconButton ? 'space.0' : paddingInlineEnd,
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
        isSelected,
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
        isSelected,
        isDisabled,
        interactionState: 'active',
        hasOverlay,
      }),
      // background, box-shadow
      transitionDuration: '0s, 0s',
    },
  });
}
