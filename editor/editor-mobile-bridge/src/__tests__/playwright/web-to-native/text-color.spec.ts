import { mobileBridgeEditorTestCase as test, expect } from '../not-libra';

test(`text-color.ts: Can change text color`, async ({ bridge }) => {
	await bridge.page.keyboard.type('Normal Text');
	await bridge.doCall({ funcName: 'setTextColor', args: ['#008DA6'] });
	await bridge.page.keyboard.type('Colorful text');

	await bridge.waitForStable();

	const results = await bridge.output({
		bridgeName: 'textFormatBridge',
		eventName: 'updateTextColor',
	});

	// @ts-ignore
	const result = JSON.parse(results[0]['states']);
	await expect(result).toEqual({
		borderColorPalette: {
			blue: 'var(--ds-border, #091E4224)',
			'dark-blue': 'var(--ds-border, #091E4224)',
			'dark-gray': 'var(--ds-border, #091E4224)',
			'dark-green': 'var(--ds-border, #091E4224)',
			'dark-purple': 'var(--ds-border, #091E4224)',
			'dark-red': 'var(--ds-border, #091E4224)',
			'dark-teal': 'var(--ds-border, #091E4224)',
			green: 'var(--ds-border, #091E4224)',
			'light-blue': 'var(--ds-border, #091E4224)',
			'light-gray': 'var(--ds-border, #091E4224)',
			'light-green': 'var(--ds-border, #091E4224)',
			'light-purple': 'var(--ds-border, #091E4224)',
			'light-red': 'var(--ds-border, #091E4224)',
			'light-teal': 'var(--ds-border, #091E4224)',
			'light-yellow': 'var(--ds-border, #091E4224)',
			orange: 'var(--ds-border, #091E4224)',
			purple: 'var(--ds-border, #091E4224)',
			red: 'var(--ds-border, #091E4224)',
			teal: 'var(--ds-border, #091E4224)',
			white: 'var(--ds-border, #091E4224)',
			yellow: 'var(--ds-border, #091E4224)',
		},
		color: '#172b4d',
		defaultColor: '#172b4d',
		disabled: false,
		palette: {
			Blue: '#4c9aff',
			'Dark blue': '#0747a6',
			'Dark gray': '#172b4d',
			'Dark green': '#006644',
			'Dark purple': '#403294',
			'Dark red': '#bf2600',
			'Dark teal': '#008da6',
			Green: '#36b37e',
			'Light blue': '#b3d4ff',
			'Light gray': '#97a0af',
			'Light green': '#abf5d1',
			'Light purple': '#eae6ff',
			'Light red': '#ffbdad',
			'Light teal': '#b3f5ff',
			'Light yellow': '#fff0b3',
			Orange: '#ff991f',
			Purple: '#6554c0',
			Red: '#ff5630',
			Teal: '#00b8d9',
			White: '#ffffff',
			Yellow: '#ffc400',
		},
	});
});
