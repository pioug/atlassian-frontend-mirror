import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-dark-theme-vr-tests', rule, {
	valid: [
		{
			name: 'light theme VR test only',
			code: `
		import { snapshot } from '@af/visual-regression';

        snapshot(ComponentName, {
			variants: [
				{
					name: 'Light',
					environment: {
						colorScheme: 'light',
					},
				},
			],
		});
			`,
		},
		{
			name: 'light and dark theme VR tests, API imported from invalid source',
			code: `
		import { snapshot } from '@atlaskit/visual-regression';

        snapshot(ComponentName, {
			variants: [
				{
					name: 'Light',
					environment: {
						colorScheme: 'light',
					},
				},
			],
		});
			`,
		},
	],
	invalid: [
		{
			name: 'colorScheme set to both light and dark',
			code: `
	import { snapshot } from '@af/visual-regression';
    import ComponentName from '../../examples';

	snapshot(ComponentName, {
		variants: [
			{
				name: 'Light',
				environment: {
					colorScheme: 'light',
				},
			},
			{
				name: 'Dark',
				environment: {
					colorScheme: 'dark',
				},
			},
		],
	});
		`,
			output: `
	import { snapshot } from '@af/visual-regression';
    import ComponentName from '../../examples';

	snapshot(ComponentName, {
		variants: [
			{
				name: 'Light',
				environment: {
					colorScheme: 'light',
				},
			},
			
		],
	});
		`,
			errors: [
				{
					messageId: 'noDarkThemeVR',
				},
			],
		},
		{
			name: 'colorScheme set to both light and dark in variants array and passed into snapshot function',
			code: `
	import { snapshot } from '@af/visual-regression';
    import ComponentName from '../../examples';

	const variants = [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'Dark',
			environment: {
				colorScheme: 'dark',
			},
		},
	];
	snapshot(ComponentName, { variants });
		`,
			output: `
	import { snapshot } from '@af/visual-regression';
    import ComponentName from '../../examples';

	const variants = [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
		
	];
	snapshot(ComponentName, { variants });
		`,
			errors: [
				{
					messageId: 'noDarkThemeVR',
				},
			],
		},
	],
});
