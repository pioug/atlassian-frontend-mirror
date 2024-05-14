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
  'discovery',
];

const linkButtonAppearances: LinkButtonAppearance[] = [
  'default',
  'primary',
  'subtle',
  'warning',
  'danger',
  'discovery',
  'link',
  'subtle-link',
];

const iconButtonAppearances: IconButtonAppearance[] = [
  'default',
  'primary',
  'discovery',
  'subtle',
];

export { buttonAppearances, linkButtonAppearances, iconButtonAppearances };
