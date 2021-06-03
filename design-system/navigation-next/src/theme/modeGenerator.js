// TODO: @atlassian/navigation package is the only other package that uses chromatism (currently).
// We should update to chromatism@3.0.0 once @atlassian/navigation package is deprecated.
import chromatism from 'chromatism';

import contentNavStyles from '../components/presentational/ContentNavigation/styles';
import globalItemStyles from '../components/presentational/GlobalItem/styles';
import globalNavStyles from '../components/presentational/GlobalNav/styles';
import headingStyles from '../components/presentational/GroupHeading/styles';
import itemStyles from '../components/presentational/Item/styles';
import sectionStyles from '../components/presentational/Section/styles';
import separatorStyles from '../components/presentational/Separator/styles';
import skeletonItemStyles from '../components/presentational/SkeletonItem/styles';

const colorMatrix = [
  {
    // Dark
    when: ({ l }) => l <= 20,
    hint: { s: 0, l: 16 },
    interact: { s: -4, l: 8 },
    static: { s: -8, l: 12 },
  },
  {
    // bright and saturated
    when: ({ s, l }) => s > 65 && l > 30,
    hint: { s: -16, l: 12 },
    interact: { s: -16, l: 8 },
    static: { s: 0, l: -8 },
  },
  {
    // bright and dull
    when: ({ s, l }) => s <= 20 && l > 90,
    hint: { s: 0, l: -2 },
    interact: { s: 0, l: -4 },
    static: { s: 0, l: -6 },
  },
  {
    // pastel
    when: ({ s, l }) => s > 20 && s < 50 && l > 50,
    hint: { s: 24, l: 2 },
    interact: { s: 8, l: -4 },
    static: { s: 8, l: -12 },
  },
  {
    // dull
    when: ({ s, l }) => s <= 20 && l <= 90,
    hint: { s: 0, l: 4 },
    interact: { s: 0, l: -4 },
    static: { s: 0, l: -8 },
  },
];

const getStatesBackground = (parts, modifier) =>
  ['hint', 'interact', 'static'].reduce((acc, k) => {
    acc[k] = chromatism.convert({
      ...parts,
      s: parts.s + modifier[k].s,
      l: parts.l + modifier[k].l,
    }).hex;
    return acc;
  }, {});

const getContextColors = ({ background, text }) => {
  const bgParts = chromatism.convert(background).hsl;
  const vs = bgParts.l < 30 && bgParts.s < 50 ? -1 : 1;
  const textSubtle = chromatism.brightness(
    1 + vs * 6,
    chromatism.fade(4, background, text).hex[2],
  ).hex;
  const colorMod = colorMatrix.find((cm) => cm.when(bgParts)) || {
    hint: { s: 0, l: 8 },
    interact: { s: 0, l: 4 },
    static: { s: 8, l: -6 },
  };

  return {
    background: {
      default: background,
      ...getStatesBackground(bgParts, colorMod),
    },
    text: { default: text, subtle: textSubtle },
  };
};

export default ({ product }) => {
  const modeColors = {
    product: getContextColors(product),
  };

  return {
    globalItem: globalItemStyles(modeColors),
    globalNav: globalNavStyles(modeColors),
    contentNav: contentNavStyles(modeColors),
    heading: headingStyles(modeColors),
    item: itemStyles(modeColors),
    section: sectionStyles(modeColors),
    separator: separatorStyles(modeColors),
    skeletonItem: skeletonItemStyles(modeColors),
  };
};
