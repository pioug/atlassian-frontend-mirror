import { hexToRgba } from '@atlaskit/adf-schema';
import { B75, DN400, N30A, N400, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const iconOnlySpacing = {
  '&&': {
    padding: '0px',
    /**
      Increased specificity here because css for .hyperlink-open-link defined in
      packages/editor/editor-core/src/ui/ContentStyles/index.tsx file
      overrides padding left-right 2px with 4px.
    */
    '&&[href]': {
      padding: '0 2px',
    },
  },
  '& > span': {
    margin: '0px',
  },
};

interface Property {
  [key: string]: {
    [key: string]: any;
  };
}

const getStyles = (
  property: Property,
  { appearance = 'default', state = 'default', mode = 'light' },
) => {
  if (!property[appearance] || !property[appearance][state]) {
    return 'initial';
  }
  return property[appearance][state][mode];
};

const background: Property = {
  danger: {
    default: { light: 'inherit', dark: 'inherit' },
    hover: {
      light: token('color.background.neutral.subtle.hovered', N30A),
      dark: token('color.background.neutral.subtle.hovered', N30A),
    },
    active: {
      light: token(
        'color.background.neutral.pressed',
        `${hexToRgba(B75, 0.6)}`,
      ),
      dark: token('color.background.neutral.pressed', `${hexToRgba(B75, 0.6)}`),
    },
  },
};

const color = {
  danger: {
    default: {
      light: token('color.icon', N400),
      dark: token('color.icon', DN400),
    },
    hover: {
      light: token('color.icon.danger', R400),
      dark: token('color.icon.danger', R400),
    },
    active: {
      light: token('color.icon.danger', R400),
      dark: token('color.icon.danger', R400),
    },
  },
};

export const getButtonStyles = (props: any) => ({
  background: getStyles(background, props),
  color: getStyles(color, props),
});
