import { THEME_DATA_ATTRIBUTE } from '../../constants';
import { loadAndAppendThemeCss } from '../../utils/theme-loading';

describe('loadAndAppendThemeCss', () => {
  beforeEach(() => {
    // Clear the DOM after each test
    document.getElementsByTagName('html')[0].innerHTML = '';
  });
  it('should add themes to the page when requested', async () => {
    await loadAndAppendThemeCss('light');
    const lightStyleElement = document.head.querySelector(
      `style[${THEME_DATA_ATTRIBUTE}="${'light'}"]`,
    );
    expect(lightStyleElement).not.toBeNull();

    await loadAndAppendThemeCss('dark');
    const darkStyleElement = document.head.querySelector(
      `style[${THEME_DATA_ATTRIBUTE}="${'dark'}"]`,
    );
    expect(darkStyleElement).not.toBeNull();
  });

  it('should not add a theme a second time if one is already present on the page', async () => {
    await loadAndAppendThemeCss('dark');
    await loadAndAppendThemeCss('dark');
    const styleElements = document.head.querySelectorAll(
      `style[${THEME_DATA_ATTRIBUTE}]`,
    );
    expect(styleElements).toHaveLength(1);
  });
});
