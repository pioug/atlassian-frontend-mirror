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
		name: 'Subtle',
		props: {
			href: 'https://www.atlassian.com',
			children: 'Link',
			appearance: 'subtle',
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
		name: 'Opens in new tab, subtle',
		props: {
			href: 'https://www.atlassian.com',
			children: 'Link',
			target: '_blank',
			appearance: 'subtle',
		},
	},
];

export default displayVariations;
