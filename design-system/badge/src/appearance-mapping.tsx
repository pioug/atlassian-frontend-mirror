/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { NewAppearance } from './types';

export const appearanceMapping: Record<
	| 'added'
	| 'removed'
	| 'default'
	| 'primary'
	| 'primaryInverted'
	| 'important'
	| 'warning'
	| 'discovery'
	| 'danger'
	| 'success'
	| 'information'
	| 'inverse'
	| 'neutral',
	NewAppearance
> = {
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
};
