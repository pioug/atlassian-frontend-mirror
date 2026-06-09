/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { NewAppearance } from './types';

export const appearanceMapping: Record<NewAppearance, NewAppearance> & {
	added: NewAppearance;
	removed: NewAppearance;
	default: NewAppearance;
	primary: NewAppearance;
	primaryInverted: NewAppearance;
	important: NewAppearance;
} = {
	added: 'success',
	removed: 'danger',
	default: 'neutral',
	primary: 'information',
	primaryInverted: 'inverse',
	important: 'danger',
	warning: 'warning',
	discovery: 'discovery',
	danger: 'danger',
	success: 'success',
	information: 'information',
	inverse: 'inverse',
	neutral: 'neutral',
	informationBold: 'informationBold',
	successBold: 'successBold',
	dangerBold: 'dangerBold',
	warningBold: 'warningBold',
	discoveryBold: 'discoveryBold',
};
