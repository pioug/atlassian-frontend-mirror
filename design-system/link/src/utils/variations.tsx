// A list of display variations used for VR and testing generation purposes
import { type LinkProps } from '../index';

type DisplayVariation = {
  name: string;
  props: LinkProps;
};

const displayVariations: DisplayVariation[] = [
  {
    name: 'Default',
    props: {
      href: 'https://www.atlassian.com',
      children: 'Link',
    },
  },
  {
    name: 'No underline',
    props: {
      href: 'https://www.atlassian.com',
      children: 'Link',
      isUnderlined: false,
    },
  },
  {
    name: 'Opens in new tab',
    props: {
      href: 'https://www.atlassian.com',
      children: 'Link',
      target: '_blank',
    },
  },
  {
    name: 'Opens in new tab, no underline',
    props: {
      href: 'https://www.atlassian.com',
      children: 'Link',
      target: '_blank',
      isUnderlined: false,
    },
  },
];

export default displayVariations;
