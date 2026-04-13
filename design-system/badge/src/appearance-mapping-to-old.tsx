/**
 * @jsxRuntime classic
 * @jsx jsx
 */
export const appearanceMappingToOld: Record<
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
	'added' | 'removed' | 'default' | 'primary' | 'primaryInverted' | 'important'
> = {
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
};
