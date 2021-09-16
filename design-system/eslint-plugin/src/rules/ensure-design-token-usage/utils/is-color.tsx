const namedColors = [
  'black',
  'silver',
  'gray',
  'white',
  'maroon',
  'red',
  'purple',
  'fuchsia',
  'green',
  'lime',
  'olive',
  'yellow',
  'navy',
  'blue',
  'teal',
  'aqua',
  'orange',
  'aliceblue',
  'antiquewhite',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'blanchedalmond',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'limegreen',
  'linen',
  'magenta',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'oldlace',
  'olivedrab',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'whitesmoke',
  'yellowgreen',
  'rebeccapurple',
];

const legacyColors = [
  'R50',
  'R75',
  'R100',
  'R200',
  'R300',
  'R400',
  'R500',
  'Y50',
  'Y75',
  'Y100',
  'Y200',
  'Y300',
  'Y400',
  'Y500',
  'G50',
  'G75',
  'G100',
  'G200',
  'G300',
  'G400',
  'G500',
  'B50',
  'B75',
  'B100',
  'B200',
  'B300',
  'B400',
  'B500',
  'P50',
  'P75',
  'P100',
  'P200',
  'P300',
  'P400',
  'P500',
  'T50',
  'T75',
  'T100',
  'T200',
  'T300',
  'T400',
  'T500',
  'N0',
  'N10',
  'N20',
  'N30',
  'N40',
  'N50',
  'N60',
  'N70',
  'N80',
  'N90',
  'N100',
  'N200',
  'N300',
  'N400',
  'N500',
  'N600',
  'N700',
  'N800',
  'N900',
  'N10A',
  'N20A',
  'N30A',
  'N40A',
  'N50A',
  'N60A',
  'N70A',
  'N80A',
  'N90A',
  'N100A',
  'N200A',
  'N300A',
  'N400A',
  'N500A',
  'N600A',
  'N700A',
  'N800A',
  'DN900',
  'DN800',
  'DN700',
  'DN600',
  'DN500',
  'DN400',
  'DN300',
  'DN200',
  'DN100',
  'DN90',
  'DN80',
  'DN70',
  'DN60',
  'DN50',
  'DN40',
  'DN30',
  'DN20',
  'DN10',
  'DN0',
  'DN800A',
  'DN700A',
  'DN600A',
  'DN500A',
  'DN400A',
  'DN300A',
  'DN200A',
  'DN100A',
  'DN90A',
  'DN80A',
  'DN70A',
  'DN60A',
  'DN50A',
  'DN40A',
  'DN30A',
  'DN20A',
  'DN10A',
];

const legacyColorMixins = [
  'background',
  'backgroundActive',
  'backgroundHover',
  'backgroundOnLayer',
  'text',
  'textHover',
  'textActive',
  'subtleText',
  'placeholderText',
  'heading',
  'subtleHeading',
  'codeBlock',
  'link',
  'linkHover',
  'linkActive',
  'linkOutline',
  'primary',
  'blue',
  'teal',
  'purple',
  'red',
  'yellow',
  'green',
  'skeleton',
];

const includesWholeWord = (value: string, options: string[]) => {
  const values = value
    .replace(/[^a-zA-Z ]/g, ' ')
    .trim()
    .split(/(?:,|\.| )+/);

  let result = false;

  options.forEach((el) => {
    if (values.includes(el)) {
      result = true;
    }
  });

  return result;
};

export const isLegacyColor = (value: string) => legacyColors.includes(value);
export const isLegacyNamedColor = (value: string) =>
  legacyColorMixins.includes(value);

export const includesHardCodedColor = (raw: string): boolean => {
  const value = raw.toLowerCase();
  if (
    /#(?:[a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})\b|(?:rgb|hsl)a?\([^\)]*\)/.exec(
      value.toLowerCase(),
    )
  ) {
    return true;
  }

  if (includesWholeWord(value, namedColors)) {
    return true;
  }

  return false;
};

export const isHardCodedColor = (value: string): boolean => {
  if (includesWholeWord(value.toLowerCase(), namedColors)) {
    return true;
  }

  if (
    value.startsWith('rgb(') ||
    value.startsWith('rgba(') ||
    value.startsWith('hsl(') ||
    value.startsWith('hsla(') ||
    value.startsWith('lch(') ||
    value.startsWith('lab(') ||
    value.startsWith('color(')
  ) {
    return true;
  }

  if (
    value.startsWith('#') &&
    // short hex, hex, or hex with alpha
    (value.length === 4 || value.length === 7 || value.length === 9)
  ) {
    return true;
  }

  return false;
};
