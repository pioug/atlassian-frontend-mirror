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
      blue: 'rgba(23, 43, 77, 0.12)',
      'dark-blue': 'rgba(23, 43, 77, 0.12)',
      'dark-gray': 'rgba(23, 43, 77, 0.12)',
      'dark-green': 'rgba(23, 43, 77, 0.12)',
      'dark-purple': 'rgba(23, 43, 77, 0.12)',
      'dark-red': 'rgba(23, 43, 77, 0.12)',
      'dark-teal': 'rgba(23, 43, 77, 0.12)',
      green: 'rgba(23, 43, 77, 0.12)',
      'light-blue': 'rgba(23, 43, 77, 0.12)',
      'light-gray': 'rgba(23, 43, 77, 0.12)',
      'light-green': 'rgba(23, 43, 77, 0.12)',
      'light-purple': 'rgba(23, 43, 77, 0.12)',
      'light-red': 'rgba(23, 43, 77, 0.12)',
      'light-teal': 'rgba(23, 43, 77, 0.12)',
      'light-yellow': 'rgba(23, 43, 77, 0.12)',
      orange: 'rgba(23, 43, 77, 0.12)',
      purple: 'rgba(23, 43, 77, 0.12)',
      red: 'rgba(23, 43, 77, 0.12)',
      teal: 'rgba(23, 43, 77, 0.12)',
      white: 'rgba(23, 43, 77, 0.12)',
      yellow: 'rgba(23, 43, 77, 0.12)',
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
