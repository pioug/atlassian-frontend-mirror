import { InternalTokenIds } from './artifacts/types-internal';
import { THEME_NAME_MAP, THEMES } from './constants';

export type Groups = 'raw' | 'paint' | 'shadow' | 'opacity' | 'palette';
export type ActiveTokenState = 'active';
export type DeprecatedTokenState = 'deprecated';
export type DeletedTokenState = 'deleted';
export type TokenState =
  | ActiveTokenState
  | DeprecatedTokenState
  | DeletedTokenState;
export type Replacement = InternalTokenIds | InternalTokenIds[]; // Ideally, this is typed to all tokens that are active

export type PaletteCategory =
  | 'blue'
  | 'purple'
  | 'red'
  | 'magenta'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'light mode neutral'
  | 'dark mode neutral';

export type ValueCategory = 'opacity';

export type Themes = typeof THEMES[number];
export type ThemesLongName = keyof typeof THEME_NAME_MAP;

export interface Token<TValue, Group extends Groups> {
  value: TValue;
  attributes: {
    group: Group;
    description?: string;
    state?: TokenState;
    replacement?: Replacement;
  };
}

/**
 * Base tokens define the raw values consumed by Design Tokens. They are a context-agnostic
 * name:value pairing (for example, the base token N0 represents the value #FFFFFF ).
 */
export interface BaseToken<TValue, Group extends Groups>
  extends Token<TValue, Group> {
  attributes: {
    group: Group;
  };
}

/**
 * Design tokens represent single sources of truth to name and store semantic design decisions.
 * They map a semantic name (color.background.default) to a base token (N0).
 */
export interface DesignToken<TValue, Group extends Groups>
  extends Token<TValue, Group> {
  attributes:
    | {
        state: ActiveTokenState;
        group: Group;
        description: string;
        introduced: string;
      }
    | {
        state: DeprecatedTokenState;
        group: Group;
        description: string;
        introduced: string;
        deprecated: string;
        replacement?: Replacement; // Still optional, as there may be no correct replacement
      }
    | {
        state: DeletedTokenState;
        group: Group;
        description: string;
        introduced: string;
        deprecated: string;
        deleted: string;
        replacement?: Replacement; // Still optional, as there may be no correct replacement
      };
}

type OmitDistributive<T, K extends PropertyKey> = T extends any
  ? T extends object
    ? Id<DeepOmit<T, K>>
    : T
  : never;
type Id<T> = {} & { [P in keyof T]: T[P] };
type DeepOmit<T extends any, K extends PropertyKey> = Omit<
  { [P in keyof T]: OmitDistributive<T[P], K> },
  K
>;

// Recursively strips out attributes from schema
export type ValueSchema<Schema extends object> = DeepOmit<Schema, 'attributes'>;

// Recursively strips out values from schema
export type AttributeSchema<Schema extends object> = DeepOmit<Schema, 'value'>;

export interface PaletteToken extends BaseToken<string, 'palette'> {
  attributes: {
    group: 'palette';
    category: PaletteCategory;
  };
}

export interface ValueToken extends BaseToken<number, 'palette'> {
  attributes: {
    group: 'palette';
    category: ValueCategory;
  };
}

export type PaintToken<BaseToken> = DesignToken<BaseToken, 'paint'>;

export type ShadowToken<BaseToken> = DesignToken<
  Array<{
    color: BaseToken;
    opacity: number;
    offset: { x: number; y: number };
    radius: number;
    spread?: number;
    inset?: boolean;
  }>,
  'shadow'
>;

export type OpacityToken = DesignToken<string, 'opacity'>;

export type RawToken = DesignToken<string, 'raw'>;

export interface PaletteColorTokenSchema<PaletteValues extends string> {
  value: {
    opacity: {
      Opacity20: ValueToken;
      Opacity40: ValueToken;
    };
  };
  color: {
    palette: Record<PaletteValues, PaletteToken>;
  };
}

export interface BackgroundColorTokenSchema<BaseToken> {
  color: {
    blanket: {
      '[default]': PaintToken<BaseToken>;
      selected: PaintToken<BaseToken>;
      danger: PaintToken<BaseToken>;
    };
    background: {
      disabled: PaintToken<BaseToken>;
      inverse: {
        subtle: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      input: {
        '[default]': PaintToken<BaseToken>;
        hovered: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      neutral: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        subtle: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      brand: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      selected: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      danger: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      warning: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      success: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      discovery: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      information: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
    };
  };
}

export interface BorderColorTokenSchema<BaseToken> {
  color: {
    border: {
      '[default]': PaintToken<BaseToken>;
      bold: PaintToken<BaseToken>;
      inverse: PaintToken<BaseToken>;
      focused: PaintToken<BaseToken>;
      input: PaintToken<BaseToken>;
      disabled: PaintToken<BaseToken>;
      brand: PaintToken<BaseToken>;
      selected: PaintToken<BaseToken>;
      danger: PaintToken<BaseToken>;
      warning: PaintToken<BaseToken>;
      success: PaintToken<BaseToken>;
      discovery: PaintToken<BaseToken>;
      information: PaintToken<BaseToken>;
    };
  };
}

export interface IconColorTokenSchema<BaseToken> {
  color: {
    icon: {
      '[default]': PaintToken<BaseToken>;
      subtle: PaintToken<BaseToken>;
      inverse: PaintToken<BaseToken>;
      disabled: PaintToken<BaseToken>;
      brand: PaintToken<BaseToken>;
      selected: PaintToken<BaseToken>;
      danger: PaintToken<BaseToken>;
      warning: {
        '[default]': PaintToken<BaseToken>;
        inverse: PaintToken<BaseToken>;
      };
      success: PaintToken<BaseToken>;
      discovery: PaintToken<BaseToken>;
      information: PaintToken<BaseToken>;
    };
  };
}

export interface TextColorTokenSchema<BaseToken> {
  color: {
    text: {
      '[default]': PaintToken<BaseToken>;
      subtle: PaintToken<BaseToken>;
      subtlest: PaintToken<BaseToken>;
      inverse: PaintToken<BaseToken>;
      brand: PaintToken<BaseToken>;
      selected: PaintToken<BaseToken>;
      danger: PaintToken<BaseToken>;
      warning: {
        '[default]': PaintToken<BaseToken>;
        inverse: PaintToken<BaseToken>;
      };
      success: PaintToken<BaseToken>;
      information: PaintToken<BaseToken>;
      discovery: PaintToken<BaseToken>;
      disabled: PaintToken<BaseToken>;
    };
    link: {
      '[default]': PaintToken<BaseToken>;
      pressed: PaintToken<BaseToken>;
    };
  };
}

export interface AccentColorTokenSchema<BaseToken> {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        red: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        orange: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        yellow: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        green: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        purple: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        teal: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        magenta: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        gray: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
      };
    };
    icon: {
      accent: {
        blue: PaintToken<BaseToken>;
        red: PaintToken<BaseToken>;
        orange: PaintToken<BaseToken>;
        yellow: PaintToken<BaseToken>;
        green: PaintToken<BaseToken>;
        purple: PaintToken<BaseToken>;
        teal: PaintToken<BaseToken>;
        magenta: PaintToken<BaseToken>;
        gray: PaintToken<BaseToken>;
      };
    };
    border: {
      accent: {
        blue: PaintToken<BaseToken>;
        red: PaintToken<BaseToken>;
        orange: PaintToken<BaseToken>;
        yellow: PaintToken<BaseToken>;
        green: PaintToken<BaseToken>;
        purple: PaintToken<BaseToken>;
        teal: PaintToken<BaseToken>;
        magenta: PaintToken<BaseToken>;
        gray: PaintToken<BaseToken>;
      };
    };
    background: {
      accent: {
        blue: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        red: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        orange: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        yellow: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        green: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        teal: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        purple: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        magenta: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        gray: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
      };
    };
  };
}

export interface InteractionColorTokenSchema<BaseToken> {
  color: {
    interaction: {
      pressed: PaintToken<BaseToken>;
      hovered: PaintToken<BaseToken>;
    };
  };
}

export interface SkeletonColorTokenSchema<BaseToken> {
  color: {
    skeleton: {
      '[default]': PaintToken<BaseToken>;
      subtle: PaintToken<BaseToken>;
    };
  };
}

export interface UtilTokenSchema<BaseToken> {
  UNSAFE_util: {
    transparent: RawToken;
    MISSING_TOKEN: RawToken;
  };
}

export interface SurfaceTokenSchema<BaseToken> {
  elevation: {
    surface: {
      '[default]': {
        '[default]': PaintToken<BaseToken>;
        hovered: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      sunken: PaintToken<BaseToken>;
      raised: {
        '[default]': PaintToken<BaseToken>;
        hovered: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      overlay: {
        '[default]': PaintToken<BaseToken>;
        hovered: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
    };
  };
}

export interface ShadowTokenSchema<BaseToken> {
  elevation: {
    shadow: {
      raised: ShadowToken<BaseToken>;
      overflow: ShadowToken<BaseToken>;
      overlay: ShadowToken<BaseToken>;
    };
  };
}

export interface OpacityTokenSchema {
  opacity: {
    loading: OpacityToken;
    disabled: OpacityToken;
  };
}

export interface DeprecatedTokenSchema<BaseToken> {
  color: {
    accent: {
      boldBlue: PaintToken<BaseToken>;
      boldGreen: PaintToken<BaseToken>;
      boldOrange: PaintToken<BaseToken>;
      boldPurple: PaintToken<BaseToken>;
      boldRed: PaintToken<BaseToken>;
      boldTeal: PaintToken<BaseToken>;
      subtleBlue: PaintToken<BaseToken>;
      subtleRed: PaintToken<BaseToken>;
      subtleGreen: PaintToken<BaseToken>;
      subtleOrange: PaintToken<BaseToken>;
      subtleTeal: PaintToken<BaseToken>;
      subtlePurple: PaintToken<BaseToken>;
      subtleMagenta: PaintToken<BaseToken>;
    };
    background: {
      accent: {
        blue: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        red: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        orange: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        yellow: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        green: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        teal: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        purple: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        magenta: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
      };
      default: PaintToken<BaseToken>;
      sunken: PaintToken<BaseToken>;
      card: PaintToken<BaseToken>;
      inverse: {
        '[default]': PaintToken<BaseToken>;
      };
      overlay: PaintToken<BaseToken>;
      selected: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
      };
      blanket: PaintToken<BaseToken>;
      brand: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      boldBrand: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleBrand: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      boldDanger: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleDanger: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      boldWarning: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleWarning: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      boldSuccess: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleSuccess: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      boldDiscovery: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleDiscovery: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      boldNeutral: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      transparentNeutral: {
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleNeutral: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleBorderedNeutral: {
        resting: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
    };
    border: {
      focus: PaintToken<BaseToken>;
      neutral: PaintToken<BaseToken>;
    };
    iconBorder: {
      brand: PaintToken<BaseToken>;
      danger: PaintToken<BaseToken>;
      warning: PaintToken<BaseToken>;
      success: PaintToken<BaseToken>;
      discovery: PaintToken<BaseToken>;
    };
    text: {
      highEmphasis: PaintToken<BaseToken>;
      mediumEmphasis: PaintToken<BaseToken>;
      lowEmphasis: PaintToken<BaseToken>;
      onBold: PaintToken<BaseToken>;
      onBoldWarning: PaintToken<BaseToken>;
      link: {
        resting: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
    };
    overlay: {
      pressed: PaintToken<BaseToken>;
      hover: PaintToken<BaseToken>;
    };
    interaction: {
      inverse: {
        hovered: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
    };
  };
  shadow: {
    card: ShadowToken<BaseToken>;
    overlay: ShadowToken<BaseToken>;
  };
}

export type ElevationTokenSchema<BaseToken> = SurfaceTokenSchema<BaseToken> &
  ShadowTokenSchema<BaseToken>;

export type ColorTokenSchema<BaseToken> = BackgroundColorTokenSchema<
  BaseToken
> &
  BorderColorTokenSchema<BaseToken> &
  IconColorTokenSchema<BaseToken> &
  TextColorTokenSchema<BaseToken> &
  AccentColorTokenSchema<BaseToken> &
  UtilTokenSchema<BaseToken>;

export type TokenSchema<BaseToken> = ColorTokenSchema<BaseToken> &
  ElevationTokenSchema<BaseToken>;
