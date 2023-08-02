import __noop from '@atlaskit/ds-lib/noop';

// This import is just to get types
import { COLOR_MODE_ATTRIBUTE } from '../../constants';
import * as getSSRAutoScriptTypes from '../../get-ssr-auto-script';

// Mock window.matchMedia before importing setGlobalTheme
const matchMediaObject = {
  matches: false,
  media: '',
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((_) => {
    return matchMediaObject;
  }),
});

// Imported using `require` to allow us to mock matchMedia before importing
const {
  default: getSSRAutoScript,
}: typeof getSSRAutoScriptTypes = require('../../get-ssr-auto-script');

/**
 * Set the result of a dark mode media query
 */
function setMatchMedia(matchesDark: boolean) {
  matchMediaObject.matches = matchesDark;
}

/**
 * Cleans the DOM by clearing the html tag and re-setting the media query
 */
const cleanDOM = () => {
  // Clear the DOM after each test
  document.getElementsByTagName('html')[0].innerHTML = '';
  setMatchMedia(false);
};

describe('getSSRAutoScript', () => {
  beforeAll(cleanDOM);
  it('returns undefined when colorMode is not automatically set', async () => {
    const result = getSSRAutoScript('light');
    expect(result).toBeUndefined();
  });

  it('returns a script that correctly sets the data-color-mode attribute based on the system theme', async () => {
    // Get the SSR auto script
    const result = getSSRAutoScript('auto');
    expect(result).toBeDefined();

    // Execute the returned script
    const script = document.createElement('script');
    script.innerHTML = result || '';
    document.head.appendChild(script);

    // Check that the data-color-mode attribute has been set as expected to "light"
    const el = document.querySelector(`[${COLOR_MODE_ATTRIBUTE}]`);
    expect(el?.getAttribute(COLOR_MODE_ATTRIBUTE)).toBe('light');
  });
});
