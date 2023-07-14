interface ColorReplacements {
  fullReplacement: string;
  staticReplacement: string;
  tokenId?: string;
  importSpecifiers: string[];
}

export const colorReplacements: Record<string, ColorReplacements> = {
  background: {
    fullReplacement: `themed({ light: token('elevation.surface', N0), dark: token('elevation.surface', DN30) })`,
    staticReplacement: 'N0',
    tokenId: 'elevation.surface',
    importSpecifiers: ['N0', 'DN30'],
  },
  backgroundActive: {
    fullReplacement: `themed({ light: token('color.background.selected', B50), dark: token('color.background.selected', B75) })`,
    staticReplacement: 'B50',
    tokenId: 'color.background.selected',
    importSpecifiers: ['B50', 'B75'],
  },
  backgroundHover: {
    fullReplacement: `themed({ light: token('color.background.neutral.hovered', N30), dark: token('color.background.neutral.hovered', DN70) })`,
    staticReplacement: 'N30',
    tokenId: 'color.background.neutral.hovered',
    importSpecifiers: ['N30', 'DN70'],
  },
  backgroundOnLayer: {
    fullReplacement: `themed({ light: token('elevation.surface.overlay', N0), dark: token('elevation.surface.overlay', DN50) })`,
    staticReplacement: 'N0',
    tokenId: 'elevation.surface.overlay',
    importSpecifiers: ['N0', 'DN50'],
  },
  text: {
    fullReplacement: `themed({ light: token('color.text', N900), dark: token('color.text', DN600) })`,
    staticReplacement: 'N900',
    tokenId: 'color.text',
    importSpecifiers: ['N900', 'DN600'],
  },
  textHover: {
    fullReplacement: `themed({ light: token('color.text', N800), dark: token('color.text', DN600) })`,
    staticReplacement: 'N800',
    tokenId: 'color.text',
    importSpecifiers: ['N800', 'DN600'],
  },
  textActive: {
    fullReplacement: `themed({ light: token('color.text.selected', B400), dark: token('color.text.selected', B400) })`,
    staticReplacement: 'B400',
    tokenId: 'color.text.selected',
    importSpecifiers: ['B400', 'B400'],
  },
  subtleText: {
    fullReplacement: `themed({ light: token('color.text.subtlest', N200), dark: token('color.text.subtlest', DN300) })`,
    staticReplacement: 'N200',
    tokenId: 'color.text.subtlest',
    importSpecifiers: ['N200', 'DN300'],
  },
  placeholderText: {
    fullReplacement: `themed({ light: token('color.text.subtlest', N100), dark: token('color.text.subtlest', DN200) })`,
    staticReplacement: 'N100',
    tokenId: 'color.text.subtlest',
    importSpecifiers: ['N100', 'DN200'],
  },
  heading: {
    fullReplacement: `themed({ light: token('color.text', N800), dark: token('color.text', DN600) })`,
    staticReplacement: 'N800',
    tokenId: 'color.text',
    importSpecifiers: ['N800', 'DN600'],
  },
  subtleHeading: {
    fullReplacement: `themed({ light: token('color.text.subtlest', N200), dark: token('color.text.subtlest', DN300) })`,
    staticReplacement: 'N200',
    tokenId: 'color.text.subtlest',
    importSpecifiers: ['N200', 'DN300'],
  },
  codeBlock: {
    fullReplacement: `themed({ light: N20, dark: DN50 });`,
    staticReplacement: 'N20',
    importSpecifiers: ['N20', 'DN50'],
  },
  link: {
    fullReplacement: `themed({ light: token('color.link', B400), dark: token('color.link', B100) })`,
    staticReplacement: 'B400',
    tokenId: 'color.link',
    importSpecifiers: ['B400', 'B100'],
  },
  linkHover: {
    fullReplacement: `themed({ light: token('color.link.pressed', B300), dark: token('color.link.pressed', B200) })`,
    staticReplacement: 'B300',
    tokenId: 'color.link.pressed',
    importSpecifiers: ['B300', 'B200'],
  },
  linkActive: {
    fullReplacement: `themed({ light: token('color.link.pressed', B500), dark: token('color.link.pressed', B100) })`,
    staticReplacement: 'B500',
    tokenId: 'color.link.pressed',
    importSpecifiers: ['B500', 'B100'],
  },
  linkOutline: {
    fullReplacement: `themed({ light: token('color.border.focused', B100), dark: token('color.border.focused', B200) })`,
    staticReplacement: 'B100',
    tokenId: 'color.border.focused',
    importSpecifiers: ['B100', 'B200'],
  },
  primary: {
    fullReplacement: `themed({ light: token('color.background.brand.bold', B400), dark: token('color.background.brand.bold', B100) })`,
    staticReplacement: 'B400',
    tokenId: 'color.background.brand.bold',
    importSpecifiers: ['B400', 'B100'],
  },
  blue: {
    fullReplacement: `themed({ light: B400, dark: B100, })`,
    staticReplacement: 'B400',
    importSpecifiers: ['B400', 'B100'],
  },
  teal: {
    fullReplacement: `themed({ light: T300, dark: T200 })`,
    staticReplacement: 'T300',
    importSpecifiers: ['T300', 'T200'],
  },
  purple: {
    fullReplacement: `themed({ light: P300, dark: P100 })`,
    staticReplacement: 'P300',
    importSpecifiers: ['P300', 'P100'],
  },
  red: {
    fullReplacement: `R300`,
    staticReplacement: 'R300',
    importSpecifiers: ['R300'],
  },
  yellow: {
    fullReplacement: `Y300`,
    staticReplacement: 'Y300',
    importSpecifiers: ['Y300'],
  },
  green: {
    fullReplacement: `G300`,
    staticReplacement: 'G300',
    importSpecifiers: ['G300'],
  },
  skeleton: {
    fullReplacement: `token('color.skeleton', N20A)`,
    staticReplacement: 'N20A',
    tokenId: 'color.skeleton',
    importSpecifiers: ['N20A'],
  },
};
