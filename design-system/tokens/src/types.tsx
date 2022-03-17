import { InternalTokenIds } from './artifacts/types-internal';

export type Groups = 'raw' | 'paint' | 'shadow' | 'palette';
export type ActiveTokenStates = 'active';
export type ReplacedTokenStates = 'deprecated' | 'deleted';
export type TokenState = ActiveTokenStates | ReplacedTokenStates;
export type Replacement = InternalTokenIds | InternalTokenIds[]; // Ideally, this is typed to all tokens that are active

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
        group: Group;
        description: string;
        state: ActiveTokenStates;
        replacement?: undefined;
      }
    | {
        group: Group;
        description: string;
        state: ReplacedTokenStates;
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

export type PaletteToken = BaseToken<string, 'palette'>;
export type ColorPalette = keyof PaletteColorTokenSchema['color']['palette'];

export type PaintToken<Value extends string = ColorPalette> = DesignToken<
  Value,
  'paint'
>;

export type ShadowToken<Value extends string = ColorPalette> = DesignToken<
  Array<{
    color: Value;
    opacity: number;
    offset: { x: number; y: number };
    radius: number;
    spread?: number;
    inset?: boolean;
  }>,
  'shadow'
>;

export type RawToken = DesignToken<string, 'raw'>;

export interface PaletteColorTokenSchema {
  color: {
    palette: {
      B100: PaletteToken;
      B200: PaletteToken;
      B300: PaletteToken;
      B400: PaletteToken;
      B500: PaletteToken;
      B600: PaletteToken;
      B700: PaletteToken;
      B800: PaletteToken;
      B900: PaletteToken;
      B1000: PaletteToken;
      R100: PaletteToken;
      R200: PaletteToken;
      R300: PaletteToken;
      R400: PaletteToken;
      R500: PaletteToken;
      R600: PaletteToken;
      R700: PaletteToken;
      R800: PaletteToken;
      R900: PaletteToken;
      R1000: PaletteToken;
      Y100: PaletteToken;
      Y200: PaletteToken;
      Y300: PaletteToken;
      Y400: PaletteToken;
      Y500: PaletteToken;
      Y600: PaletteToken;
      Y700: PaletteToken;
      Y800: PaletteToken;
      Y900: PaletteToken;
      Y1000: PaletteToken;
      G100: PaletteToken;
      G200: PaletteToken;
      G300: PaletteToken;
      G400: PaletteToken;
      G500: PaletteToken;
      G600: PaletteToken;
      G700: PaletteToken;
      G800: PaletteToken;
      G900: PaletteToken;
      G1000: PaletteToken;
      P100: PaletteToken;
      P200: PaletteToken;
      P300: PaletteToken;
      P400: PaletteToken;
      P500: PaletteToken;
      P600: PaletteToken;
      P700: PaletteToken;
      P800: PaletteToken;
      P900: PaletteToken;
      P1000: PaletteToken;
      T100: PaletteToken;
      T200: PaletteToken;
      T300: PaletteToken;
      T400: PaletteToken;
      T500: PaletteToken;
      T600: PaletteToken;
      T700: PaletteToken;
      T800: PaletteToken;
      T900: PaletteToken;
      T1000: PaletteToken;
      O100: PaletteToken;
      O200: PaletteToken;
      O300: PaletteToken;
      O400: PaletteToken;
      O500: PaletteToken;
      O600: PaletteToken;
      O700: PaletteToken;
      O800: PaletteToken;
      O900: PaletteToken;
      O1000: PaletteToken;
      M100: PaletteToken;
      M200: PaletteToken;
      M300: PaletteToken;
      M400: PaletteToken;
      M500: PaletteToken;
      M600: PaletteToken;
      M700: PaletteToken;
      M800: PaletteToken;
      M900: PaletteToken;
      M1000: PaletteToken;
      'DN-100': PaletteToken;
      'DN-100A': PaletteToken;
      DN0: PaletteToken;
      DN100: PaletteToken;
      DN100A: PaletteToken;
      DN200: PaletteToken;
      DN200A: PaletteToken;
      DN300: PaletteToken;
      DN300A: PaletteToken;
      DN400: PaletteToken;
      DN400A: PaletteToken;
      DN500: PaletteToken;
      DN500A: PaletteToken;
      DN600: PaletteToken;
      DN700: PaletteToken;
      DN800: PaletteToken;
      DN900: PaletteToken;
      DN1000: PaletteToken;
      DN1100: PaletteToken;
      N0: PaletteToken;
      N100: PaletteToken;
      N100A: PaletteToken;
      N200: PaletteToken;
      N200A: PaletteToken;
      N300: PaletteToken;
      N300A: PaletteToken;
      N400: PaletteToken;
      N400A: PaletteToken;
      N500: PaletteToken;
      N500A: PaletteToken;
      N600: PaletteToken;
      N700: PaletteToken;
      N800: PaletteToken;
      N900: PaletteToken;
      N1000: PaletteToken;
      N1100: PaletteToken;
    };
  };
}

export interface BackgroundColorTokenSchema {
  color: {
    blanket: {
      '[default]': PaintToken;
      selected: PaintToken;
      danger: PaintToken;
    };
    background: {
      disabled: PaintToken;
      inverse: PaintToken;
      input: {
        '[default]': PaintToken;
        hovered: PaintToken;
        pressed: PaintToken;
      };
      neutral: {
        '[default]': {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
        subtle: {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
        bold: {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
      };
      brand: {
        bold: {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
      };
      selected: {
        '[default]': {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
        bold: {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
      };
      danger: {
        '[default]': {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
        bold: {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
      };
      warning: {
        '[default]': {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
        bold: {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
      };
      success: {
        '[default]': {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
        bold: {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
      };
      discovery: {
        '[default]': {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
        bold: {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
      };
      information: {
        '[default]': {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
        bold: {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
      };
    };
  };
}

export interface BorderColorTokenSchema {
  color: {
    border: {
      '[default]': PaintToken;
      focused: PaintToken;
      input: PaintToken;
      disabled: PaintToken;
      brand: PaintToken;
      selected: PaintToken;
      danger: PaintToken;
      warning: PaintToken;
      success: PaintToken;
      discovery: PaintToken;
      information: PaintToken;
    };
  };
}

export interface IconColorTokenSchema {
  color: {
    icon: {
      '[default]': PaintToken;
      subtle: PaintToken;
      inverse: PaintToken;
      disabled: PaintToken;
      brand: PaintToken;
      selected: PaintToken;
      danger: PaintToken;
      warning: {
        '[default]': PaintToken;
        inverse: PaintToken;
      };
      success: PaintToken;
      discovery: PaintToken;
      information: PaintToken;
    };
  };
}

export interface TextColorTokenSchema {
  color: {
    text: {
      '[default]': PaintToken;
      subtle: PaintToken;
      subtlest: PaintToken;
      inverse: PaintToken;
      brand: PaintToken;
      selected: PaintToken;
      danger: PaintToken;
      warning: {
        '[default]': PaintToken;
        inverse: PaintToken;
      };
      success: PaintToken;
      information: PaintToken;
      discovery: PaintToken;
      disabled: PaintToken;
    };
    link: {
      '[default]': PaintToken;
      pressed: PaintToken;
    };
  };
}

export interface AccentColorTokenSchema {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': PaintToken;
          bolder: PaintToken;
        };
        red: {
          '[default]': PaintToken;
          bolder: PaintToken;
        };
        orange: {
          '[default]': PaintToken;
          bolder: PaintToken;
        };
        yellow: {
          '[default]': PaintToken;
          bolder: PaintToken;
        };
        green: {
          '[default]': PaintToken;
          bolder: PaintToken;
        };
        purple: {
          '[default]': PaintToken;
          bolder: PaintToken;
        };
        teal: {
          '[default]': PaintToken;
          bolder: PaintToken;
        };
        magenta: {
          '[default]': PaintToken;
          bolder: PaintToken;
        };
      };
    };
    icon: {
      accent: {
        blue: PaintToken;
        red: PaintToken;
        orange: PaintToken;
        yellow: PaintToken;
        green: PaintToken;
        purple: PaintToken;
        teal: PaintToken;
        magenta: PaintToken;
      };
    };
    border: {
      accent: {
        blue: PaintToken;
        red: PaintToken;
        orange: PaintToken;
        yellow: PaintToken;
        green: PaintToken;
        purple: PaintToken;
        teal: PaintToken;
        magenta: PaintToken;
      };
    };
    background: {
      accent: {
        blue: {
          subtlest: PaintToken;
          subtler: PaintToken;
          subtle: PaintToken;
          bolder: PaintToken;
        };
        red: {
          subtlest: PaintToken;
          subtler: PaintToken;
          subtle: PaintToken;
          bolder: PaintToken;
        };
        orange: {
          subtlest: PaintToken;
          subtler: PaintToken;
          subtle: PaintToken;
          bolder: PaintToken;
        };
        yellow: {
          subtlest: PaintToken;
          subtler: PaintToken;
          subtle: PaintToken;
          bolder: PaintToken;
        };
        green: {
          subtlest: PaintToken;
          subtler: PaintToken;
          subtle: PaintToken;
          bolder: PaintToken;
        };
        teal: {
          subtlest: PaintToken;
          subtler: PaintToken;
          subtle: PaintToken;
          bolder: PaintToken;
        };
        purple: {
          subtlest: PaintToken;
          subtler: PaintToken;
          subtle: PaintToken;
          bolder: PaintToken;
        };
        magenta: {
          subtlest: PaintToken;
          subtler: PaintToken;
          subtle: PaintToken;
          bolder: PaintToken;
        };
      };
    };
  };
}

export interface InteractionColorTokenSchema {
  color: {
    interaction: {
      pressed: PaintToken;
      hovered: PaintToken;
      inverse: {
        pressed: PaintToken;
        hovered: PaintToken;
      };
    };
  };
}

export interface SkeletonColorTokenSchema {
  color: {
    skeleton: {
      '[default]': PaintToken;
      subtle: PaintToken;
    };
  };
}

export interface UtilTokenSchema {
  UNSAFE_util: {
    transparent: RawToken;
    MISSING_TOKEN: RawToken;
  };
}

export interface SurfaceTokenSchema {
  elevation: {
    surface: {
      '[default]': PaintToken;
      sunken: PaintToken;
      raised: PaintToken;
      overlay: PaintToken;
    };
  };
}

export interface ShadowTokenSchema {
  elevation: {
    shadow: {
      raised: ShadowToken;
      overflow: ShadowToken;
      overlay: ShadowToken;
    };
  };
}

export interface DeprecatedTokenSchema {
  color: {
    accent: {
      boldBlue: PaintToken;
      boldGreen: PaintToken;
      boldOrange: PaintToken;
      boldPurple: PaintToken;
      boldRed: PaintToken;
      boldTeal: PaintToken;
      subtleBlue: PaintToken;
      subtleRed: PaintToken;
      subtleGreen: PaintToken;
      subtleOrange: PaintToken;
      subtleTeal: PaintToken;
      subtlePurple: PaintToken;
      subtleMagenta: PaintToken;
    };
    background: {
      accent: {
        blue: {
          '[default]': PaintToken;
          bold: PaintToken;
        };
        red: {
          '[default]': PaintToken;
          bold: PaintToken;
        };
        orange: {
          '[default]': PaintToken;
          bold: PaintToken;
        };
        yellow: {
          '[default]': PaintToken;
          bold: PaintToken;
        };
        green: {
          '[default]': PaintToken;
          bold: PaintToken;
        };
        teal: {
          '[default]': PaintToken;
          bold: PaintToken;
        };
        purple: {
          '[default]': PaintToken;
          bold: PaintToken;
        };
        magenta: {
          '[default]': PaintToken;
          bold: PaintToken;
        };
      };
      default: PaintToken;
      sunken: PaintToken;
      card: PaintToken;
      overlay: PaintToken;
      selected: {
        resting: PaintToken;
        hover: PaintToken;
      };
      blanket: PaintToken;
      brand: {
        '[default]': {
          '[default]': PaintToken;
          hovered: PaintToken;
          pressed: PaintToken;
        };
      };
      boldBrand: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      subtleBrand: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      boldDanger: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      subtleDanger: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      boldWarning: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      subtleWarning: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      boldSuccess: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      subtleSuccess: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      boldDiscovery: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      subtleDiscovery: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      boldNeutral: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      transparentNeutral: {
        hover: PaintToken;
        pressed: PaintToken;
      };
      subtleNeutral: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      subtleBorderedNeutral: {
        resting: PaintToken;
        pressed: PaintToken;
      };
    };
    border: {
      focus: PaintToken;
      neutral: PaintToken;
    };
    iconBorder: {
      brand: PaintToken;
      danger: PaintToken;
      warning: PaintToken;
      success: PaintToken;
      discovery: PaintToken;
    };
    text: {
      highEmphasis: PaintToken;
      mediumEmphasis: PaintToken;
      lowEmphasis: PaintToken;
      onBold: PaintToken;
      onBoldWarning: PaintToken;
      link: {
        resting: PaintToken;
        pressed: PaintToken;
      };
    };
    overlay: {
      pressed: PaintToken;
      hover: PaintToken;
    };
  };
  shadow: {
    card: ShadowToken;
    overlay: ShadowToken;
  };
}

export type ElevationTokenSchema = SurfaceTokenSchema & ShadowTokenSchema;

export type ColorTokenSchema = BackgroundColorTokenSchema &
  BorderColorTokenSchema &
  IconColorTokenSchema &
  TextColorTokenSchema &
  AccentColorTokenSchema &
  UtilTokenSchema;

export type TokenSchema = PaletteColorTokenSchema &
  ColorTokenSchema &
  ElevationTokenSchema;
