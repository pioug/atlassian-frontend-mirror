import {
  type ButtonAppearance,
  type IconButtonAppearance,
  type LinkButtonAppearance,
} from '../new-button/variants/types';

const buttonAppearances: ButtonAppearance[] = [
  'default',
  'primary',
  'subtle',
  'warning',
  'danger',
];

const linkButtonAppearances: LinkButtonAppearance[] = [
  'default',
  'primary',
  'subtle',
  'warning',
  'danger',
  'link',
  'subtle-link',
];

const iconButtonAppearances: IconButtonAppearance[] = [
  'default',
  'primary',
  'subtle',
];

export { buttonAppearances, linkButtonAppearances, iconButtonAppearances };
