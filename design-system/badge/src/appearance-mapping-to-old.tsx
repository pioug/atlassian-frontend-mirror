/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { NewAppearance } from './types';

type OldAppearance = 'added' | 'removed' | 'default' | 'primary' | 'primaryInverted' | 'important';

export const appearanceMappingToOld: Record<NewAppearance, OldAppearance> & {
	added: OldAppearance;
	removed: OldAppearance;
	default: OldAppearance;
	primary: OldAppearance;
	primaryInverted: OldAppearance;
	important: OldAppearance;
} = {
	added: 'added',
	removed: 'removed',
	default: 'default',
	primary: 'primary',
	primaryInverted: 'primaryInverted',
	important: 'important',
	danger: 'removed',
	success: 'added',
	information: 'primary',
	inverse: 'primaryInverted',
	neutral: 'default',
	warning: 'default',
	discovery: 'default',
	informationBold: 'primary',
	successBold: 'added',
	dangerBold: 'removed',
	warningBold: 'default',
	discoveryBold: 'default',
};
