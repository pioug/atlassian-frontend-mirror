/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3e928649c2fc736793a6af44ed39e44f>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::4e25079e2363933fae45ad0f1e9c123b>>
 */
import { token } from '@atlaskit/tokens';

export const fillMap: {
	'color.icon': 'var(--ds-icon)';
	'color.icon.accent.lime': 'var(--ds-icon-accent-lime)';
	'color.icon.accent.red': 'var(--ds-icon-accent-red)';
	'color.icon.accent.orange': 'var(--ds-icon-accent-orange)';
	'color.icon.accent.yellow': 'var(--ds-icon-accent-yellow)';
	'color.icon.accent.green': 'var(--ds-icon-accent-green)';
	'color.icon.accent.teal': 'var(--ds-icon-accent-teal)';
	'color.icon.accent.blue': 'var(--ds-icon-accent-blue)';
	'color.icon.accent.purple': 'var(--ds-icon-accent-purple)';
	'color.icon.accent.magenta': 'var(--ds-icon-accent-magenta)';
	'color.icon.accent.gray': 'var(--ds-icon-accent-gray)';
	'color.icon.disabled': 'var(--ds-icon-disabled)';
	'color.icon.inverse': 'var(--ds-icon-inverse)';
	'color.icon.selected': 'var(--ds-icon-selected)';
	'color.icon.brand': 'var(--ds-icon-brand)';
	'color.icon.danger': 'var(--ds-icon-danger)';
	'color.icon.warning': 'var(--ds-icon-warning)';
	'color.icon.warning.inverse': 'var(--ds-icon-warning-inverse)';
	'color.icon.success': 'var(--ds-icon-success)';
	'color.icon.discovery': 'var(--ds-icon-discovery)';
	'color.icon.information': 'var(--ds-icon-information)';
	'color.icon.subtlest': 'var(--ds-icon-subtlest)';
	'color.icon.subtle': 'var(--ds-icon-subtle)';
} = {
	'color.icon': token('color.icon', '#292A2E'),
	'color.icon.accent.lime': token('color.icon.accent.lime', '#6A9A23'),
	'color.icon.accent.red': token('color.icon.accent.red', '#C9372C'),
	'color.icon.accent.orange': token('color.icon.accent.orange', '#E06C00'),
	'color.icon.accent.yellow': token('color.icon.accent.yellow', '#B38600'),
	'color.icon.accent.green': token('color.icon.accent.green', '#22A06B'),
	'color.icon.accent.teal': token('color.icon.accent.teal', '#2898BD'),
	'color.icon.accent.blue': token('color.icon.accent.blue', '#357DE8'),
	'color.icon.accent.purple': token('color.icon.accent.purple', '#AF59E1'),
	'color.icon.accent.magenta': token('color.icon.accent.magenta', '#CD519D'),
	'color.icon.accent.gray': token('color.icon.accent.gray', '#7D818A'),
	'color.icon.disabled': token('color.icon.disabled', '#080F214A'),
	'color.icon.inverse': token('color.icon.inverse', '#FFFFFF'),
	'color.icon.selected': token('color.icon.selected', '#1868DB'),
	'color.icon.brand': token('color.icon.brand', '#1868DB'),
	'color.icon.danger': token('color.icon.danger', '#C9372C'),
	'color.icon.warning': token('color.icon.warning', '#E06C00'),
	'color.icon.warning.inverse': token('color.icon.warning.inverse', '#292A2E'),
	'color.icon.success': token('color.icon.success', '#6A9A23'),
	'color.icon.discovery': token('color.icon.discovery', '#AF59E1'),
	'color.icon.information': token('color.icon.information', '#357DE8'),
	'color.icon.subtlest': token('color.icon.subtlest', '#6B6E76'),
	'color.icon.subtle': token('color.icon.subtle', '#505258'),
} as const;

export type Fill = keyof typeof fillMap;
