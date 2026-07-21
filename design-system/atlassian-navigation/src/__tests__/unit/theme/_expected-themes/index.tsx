import { type Mode } from '../../../../theme/types';

type ExpectedThemes = Array<{ mode: Mode }>;

/**
 * Expected output of `generateTheme` for each color scheme in `_theme-data`.
 * These values were previously captured as Jest snapshots and are now asserted
 * explicitly via `toEqual` (see LDR: Ban Snapshot tests in Platform).
 */
export const expectedThemes: ExpectedThemes = [
	{
		mode: {
			create: {
				active: {
					color: 'var(--ds-text-inverse)',
					backgroundColor: 'var(--ds-background-brand-bold-pressed)',
					boxShadow: '',
				},
				default: {
					color: 'var(--ds-text-inverse)',
					backgroundColor: 'var(--ds-background-brand-bold)',
					boxShadow: '',
				},
				focus: {
					color: 'var(--ds-text-inverse)',
					backgroundColor: '',
					boxShadow: '',
				},
				hover: {
					color: 'var(--ds-text-inverse)',
					backgroundColor: 'var(--ds-background-brand-bold-hovered)',
					boxShadow: '',
				},
				selected: {
					color: '',
					backgroundColor: '',
					boxShadow: '',
				},
			},
			iconButton: {
				active: {
					color: 'var(--ds-text-subtle)',
					backgroundColor: 'var(--ds-background-neutral-subtle-pressed)',
					boxShadow: '',
				},
				default: {
					color: 'var(--ds-text-subtle)',
					backgroundColor: 'transparent',
					boxShadow: '',
				},
				focus: {
					color: 'var(--ds-text-subtle)',
					backgroundColor: '',
					boxShadow: '',
				},
				hover: {
					color: 'var(--ds-text-subtle)',
					backgroundColor: 'var(--ds-background-neutral-subtle-hovered)',
					boxShadow: '',
				},
				selected: {
					color: 'var(--ds-text-selected)',
					backgroundColor: 'var(--ds-background-selected)',
					boxShadow: '',
				},
				selectedHover: {
					color: 'var(--ds-text-selected)',
					backgroundColor: 'var(--ds-background-selected-hovered)',
					boxShadow: '',
				},
			},
			navigation: {
				backgroundColor: 'var(--ds-surface)',
				color: 'var(--ds-text-subtlest)',
			},
			productHome: {
				backgroundColor: 'var(--ds-text-brand)',
				color: 'var(--ds-text)',
				borderRight: 'var(--ds-border-width) solid var(--ds-border)',
				iconColor: '#357DE8',
				textColor: 'var(--ds-text)',
			},
			primaryButton: {
				active: {
					color: 'var(--ds-text-subtle)',
					backgroundColor: 'var(--ds-background-neutral-subtle-pressed)',
					boxShadow: '',
				},
				default: {
					color: 'var(--ds-text-subtle)',
					backgroundColor: 'transparent',
					boxShadow: '',
				},
				focus: {
					color: 'var(--ds-text-subtle)',
					backgroundColor: '',
					boxShadow: '',
				},
				hover: {
					color: 'var(--ds-text-subtle)',
					backgroundColor: 'var(--ds-background-neutral-subtle-hovered)',
					boxShadow: '',
				},
				selected: {
					color: 'var(--ds-text-selected)',
					backgroundColor: 'var(--ds-background-selected)',
					boxShadow: '',
					borderColor: 'var(--ds-border-selected)',
				},
				selectedHover: {
					color: 'var(--ds-text-selected)',
					backgroundColor: 'var(--ds-background-selected-hovered)',
					boxShadow: '',
					borderColor: 'var(--ds-border-selected)',
				},
			},
			search: {
				default: {
					backgroundColor: 'var(--ds-background-input)',
					color: 'var(--ds-text-subtlest)',
					borderColor: 'var(--ds-border-input)',
				},
				focus: {
					borderColor: 'var(--ds-border-focused)',
				},
				hover: {
					backgroundColor: 'var(--ds-background-input-hovered)',
				},
			},
			skeleton: {
				backgroundColor: 'var(--ds-background-neutral)',
				opacity: 1,
			},
		},
	},
	{
		mode: {
			create: {
				active: {
					backgroundColor: 'rgba(51, 51, 51, 0.65)',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				default: {
					backgroundColor: '#333333',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				focus: {
					boxShadow: 'none',
					color: '#ffffff',
					backgroundColor: '#333333',
				},
				hover: {
					backgroundColor: 'rgba(51, 51, 51, 0.8)',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				selected: {
					color: '#ffffff',
					backgroundColor: 'rgba(105, 105, 105, 0.6)',
					borderColor: '#333333',
					boxShadow: '0 0 0 2px transparent',
				},
				selectedHover: {
					color: '#ffffff',
					backgroundColor: 'rgba(105, 105, 105, 0.6)',
					borderColor: '#333333',
					boxShadow: '0 0 0 2px transparent',
				},
			},
			iconButton: {
				active: {
					backgroundColor: 'rgba(159, 150, 152, 0.3)',
					boxShadow: '0 0 0 2px transparent',
					color: '#000000',
				},
				default: {
					backgroundColor: '#E8CBD2',
					boxShadow: '0 0 0 2px transparent',
					color: '#000000',
				},
				focus: {
					boxShadow: 'none',
					color: '#000000',
					backgroundColor: '#E8CBD2',
				},
				hover: {
					backgroundColor: 'rgba(138, 135, 136, 0.3)',
					boxShadow: '0 0 0 2px transparent',
					color: '#000000',
				},
				selected: {
					color: '#000000',
					backgroundColor: 'rgba(159, 150, 152, 0.3)',
					borderColor: '#333333',
					boxShadow: '0 0 0 2px transparent',
				},
				selectedHover: {
					color: '#000000',
					backgroundColor: 'rgba(159, 150, 152, 0.3)',
					borderColor: '#333333',
					boxShadow: '0 0 0 2px transparent',
				},
			},
			primaryButton: {
				active: {
					backgroundColor: 'rgba(159, 150, 152, 0.3)',
					boxShadow: '0 0 0 2px transparent',
					color: '#000000',
				},
				default: {
					backgroundColor: '#E8CBD2',
					boxShadow: '0 0 0 2px transparent',
					color: '#000000',
				},
				focus: {
					boxShadow: 'none',
					color: '#000000',
					backgroundColor: '#E8CBD2',
				},
				hover: {
					backgroundColor: 'rgba(138, 135, 136, 0.3)',
					boxShadow: '0 0 0 2px transparent',
					color: '#000000',
				},
				selected: {
					color: '#000000',
					backgroundColor: 'rgba(159, 150, 152, 0.3)',
					borderColor: '#333333',
					boxShadow: '0 0 0 2px transparent',
				},
				selectedHover: {
					color: '#000000',
					backgroundColor: 'rgba(159, 150, 152, 0.3)',
					borderColor: '#333333',
					boxShadow: '0 0 0 2px transparent',
				},
			},
			navigation: {
				backgroundColor: '#E8CBD2',
				color: '#000000',
			},
			productHome: {
				color: '#000000',
				iconColor: '#000000',
				textColor: '#000000',
				backgroundColor: '#333333',
				borderRight: 'var(--ds-border-width) solid rgba(0, 0, 0, 0.5)',
			},
			search: {
				default: {
					backgroundColor: '#E8CBD2',
					color: '#000000',
					borderColor: 'rgba(0, 0, 0, 0.5)',
				},
				focus: {
					borderColor: 'rgba(51, 51, 51, 0.8)',
					boxShadow: '0 0 0 2px rgba(51, 51, 51, 0.5)',
				},
				hover: {
					backgroundColor: 'rgba(138, 135, 136, 0.3)',
					color: '#000000',
				},
			},
			skeleton: {
				backgroundColor: '#000000',
				opacity: 0.08,
			},
		},
	},
	{
		mode: {
			create: {
				active: {
					backgroundColor: 'rgba(233, 78, 52, 0.65)',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				default: {
					backgroundColor: '#E94E34',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				focus: {
					boxShadow: 'none',
					color: '#ffffff',
					backgroundColor: '#E94E34',
				},
				hover: {
					backgroundColor: 'rgba(233, 78, 52, 0.8)',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				selected: {
					color: '#ffffff',
					backgroundColor: 'rgba(159, 113, 105, 0.6)',
					borderColor: '#E94E34',
					boxShadow: '0 0 0 2px transparent',
				},
				selectedHover: {
					color: '#ffffff',
					backgroundColor: 'rgba(159, 113, 105, 0.6)',
					borderColor: '#E94E34',
					boxShadow: '0 0 0 2px transparent',
				},
			},
			iconButton: {
				active: {
					backgroundColor: 'rgba(101, 101, 101, 0.6)',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				default: {
					backgroundColor: '#272727',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				focus: {
					boxShadow: 'none',
					color: '#ffffff',
					backgroundColor: '#272727',
				},
				hover: {
					backgroundColor: 'rgba(119, 119, 119, 0.6)',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				selected: {
					color: '#ffffff',
					backgroundColor: 'rgba(101, 101, 101, 0.6)',
					borderColor: '#E94E34',
					boxShadow: '0 0 0 2px transparent',
				},
				selectedHover: {
					color: '#ffffff',
					backgroundColor: 'rgba(101, 101, 101, 0.6)',
					borderColor: '#E94E34',
					boxShadow: '0 0 0 2px transparent',
				},
			},
			primaryButton: {
				active: {
					backgroundColor: 'rgba(101, 101, 101, 0.6)',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				default: {
					backgroundColor: '#272727',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				focus: {
					boxShadow: 'none',
					color: '#ffffff',
					backgroundColor: '#272727',
				},
				hover: {
					backgroundColor: 'rgba(119, 119, 119, 0.6)',
					boxShadow: '0 0 0 2px transparent',
					color: '#ffffff',
				},
				selected: {
					color: '#ffffff',
					backgroundColor: 'rgba(101, 101, 101, 0.6)',
					borderColor: '#E94E34',
					boxShadow: '0 0 0 2px transparent',
				},
				selectedHover: {
					color: '#ffffff',
					backgroundColor: 'rgba(101, 101, 101, 0.6)',
					borderColor: '#E94E34',
					boxShadow: '0 0 0 2px transparent',
				},
			},
			navigation: {
				backgroundColor: '#272727',
				color: '#ffffff',
			},
			productHome: {
				color: '#ffffff',
				iconColor: '#ffffff',
				textColor: '#ffffff',
				backgroundColor: '#E94E34',
				borderRight: 'var(--ds-border-width) solid rgba(255, 255, 255, 0.5)',
			},
			search: {
				default: {
					backgroundColor: '#272727',
					color: '#ffffff',
					borderColor: 'rgba(255, 255, 255, 0.5)',
				},
				focus: {
					borderColor: 'rgba(233, 78, 52, 0.8)',
					boxShadow: '0 0 0 2px rgba(233, 78, 52, 0.5)',
				},
				hover: {
					backgroundColor: 'rgba(119, 119, 119, 0.6)',
					color: '#ffffff',
				},
			},
			skeleton: {
				backgroundColor: '#ffffff',
				opacity: 0.08,
			},
		},
	},
];
