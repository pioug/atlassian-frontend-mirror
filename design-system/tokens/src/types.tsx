export interface Token<TValue, TGroup extends string> {
  value: TValue;
  comment?: string;
  attributes: {
    group: TGroup;
  };
}

export type PaintToken<
  Value extends string = keyof PaletteColorTokenSchema['color']['palette']
> = Token<Value, 'paint'>;

export type PaletteToken = Token<string, 'paint'> & {
  attributes: { isPalette: true };
};

export type ShadowToken<
  Value extends string = keyof PaletteColorTokenSchema['color']['palette']
> = Token<
  Array<{
    color: Value;
    opacity: number;
    offset: { x: number; y: number };
    radius: number;
    spread?: number;
  }>,
  'shadow'
>;

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
      DN600A: PaletteToken;
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
    backgroundDisabled: PaintToken;
    backgroundBlanket: PaintToken;
    backgroundBoldBrand: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundSubtleBrand: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundBoldDanger: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundSubtleDanger: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundBoldWarning: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundSubtleWarning: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundBoldSuccess: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundSubtleSuccess: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundBoldDiscovery: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundSubtleDiscovery: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundBoldNeutral: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundTransparentNeutral: {
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundSubtleNeutral: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    backgroundSubtleBorderedNeutral: {
      resting: PaintToken;
      pressed: PaintToken;
    };
  };
}

export interface BorderColorTokenSchema {
  color: {
    borderTextHighlighted: PaintToken;
    borderFocus: ShadowToken;
    borderNeutral: PaintToken;
    borderDisabled: PaintToken;
  };
}

export interface IconBorderColorTokenSchema {
  color: {
    iconBorderBrand: PaintToken;
    iconBorderDanger: PaintToken;
    iconBorderWarning: PaintToken;
    iconBorderSuccess: PaintToken;
    iconBorderDiscovery: PaintToken;
  };
}

export interface TextColorTokenSchema {
  color: {
    textHighEmphasis: PaintToken;
    textMediumEmphasis: PaintToken;
    textLowEmphasis: PaintToken;
    textOnBold: PaintToken;
    textOnBoldWarning: PaintToken;
    textLink: {
      resting: PaintToken;
      hover: PaintToken;
      pressed: PaintToken;
    };
    textBrand: PaintToken;
    textWarning: PaintToken;
    textDanger: PaintToken;
    textSuccess: PaintToken;
    textDiscovery: PaintToken;
    textDisabled: PaintToken;
  };
}

export interface AccentColorTokenSchema {
  color: {
    accentBlueSubtle: PaintToken;
    accentRedSubtle: PaintToken;
    accentGreenSubtle: PaintToken;
    accentOrangeSubtle: PaintToken;
    accentTealSubtle: PaintToken;
    accentPurpleSubtle: PaintToken;
    accentMagentaSubtle: PaintToken;
  };
}

export interface ElevationTokenSchema {
  elevation: {
    base: PaintToken;

    flatSecondary: PaintToken;

    borderFlatPrimary: PaintToken;
    borderOverlay: PaintToken;

    backgroundCard: PaintToken;
    backgroundOverlay: PaintToken;

    shadowCard: ShadowToken;
    shadowOverlay: ShadowToken;
  };
}

export type ColorTokenSchema = BackgroundColorTokenSchema &
  BorderColorTokenSchema &
  IconBorderColorTokenSchema &
  TextColorTokenSchema &
  AccentColorTokenSchema;

export type TokenSchema = PaletteColorTokenSchema &
  ColorTokenSchema &
  ElevationTokenSchema;
