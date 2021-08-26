export interface Token<TValue, Group extends string> {
  value: TValue;
  attributes: {
    group?: Group;
    description?: string;
  };
}

export type ColorPalette = keyof PaletteColorTokenSchema['color']['palette'];

export type PaintToken<Value extends string = ColorPalette> = Token<
  Value,
  'paint'
>;

export type PaletteToken = Token<string, 'paint'> & {
  attributes: { isPalette: true };
};

export type ValueSchema<Schema extends object> = {
  [Key in keyof Schema]: ValueSchema<Omit<Schema[Key], 'attributes'>>;
};

export type AttributeSchema<Schema extends object> = {
  [Key in keyof Schema]: AttributeSchema<Omit<Schema[Key], 'value'>>;
};

export type ShadowToken<Value extends string = ColorPalette> = Token<
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

export type RawToken = Token<string, 'raw'>;

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
    background: {
      default: PaintToken;
      sunken: PaintToken;
      card: PaintToken;
      overlay: PaintToken;
      selected: {
        resting: PaintToken;
        hover: PaintToken;
        pressed: PaintToken;
      };
      disabled: PaintToken;
      blanket: PaintToken;
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
  };
}

export interface BorderColorTokenSchema {
  color: {
    border: {
      focus: PaintToken;
      neutral: PaintToken;
    };
  };
}

export interface IconBorderColorTokenSchema {
  color: {
    iconBorder: {
      brand: PaintToken;
      danger: PaintToken;
      warning: PaintToken;
      success: PaintToken;
      discovery: PaintToken;
    };
  };
}

export interface TextColorTokenSchema {
  color: {
    text: {
      selected: PaintToken;
      highEmphasis: PaintToken;
      mediumEmphasis: PaintToken;
      lowEmphasis: PaintToken;
      onBold: PaintToken;
      onBoldWarning: PaintToken;
      link: {
        resting: PaintToken;
        pressed: PaintToken;
      };
      brand: PaintToken;
      warning: PaintToken;
      danger: PaintToken;
      success: PaintToken;
      discovery: PaintToken;
      disabled: PaintToken;
    };
  };
}

export interface AccentColorTokenSchema {
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
  };
}

export interface OverlayColorTokenSchema {
  color: {
    overlay: {
      pressed: PaintToken;
      hover: PaintToken;
    };
  };
}

export interface ShadowTokenSchema {
  shadow: {
    card: ShadowToken;
    overlay: ShadowToken;
  };
}

export interface UtilTokenSchema {
  UNSAFE_util: {
    transparent: RawToken;
  };
}

export type ColorTokenSchema = BackgroundColorTokenSchema &
  BorderColorTokenSchema &
  IconBorderColorTokenSchema &
  TextColorTokenSchema &
  AccentColorTokenSchema &
  UtilTokenSchema;

export type TokenSchema = PaletteColorTokenSchema &
  ColorTokenSchema &
  ShadowTokenSchema;
