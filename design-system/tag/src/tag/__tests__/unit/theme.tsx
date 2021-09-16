/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { getThemeColors } from '../../../theme';

describe('Theme Colors', () => {
  it('should standard theme getThemeColors in light mode', () => {
    const {
      chromeColors,
      chromeLinkColors,
      buttonColors,
      linkHoverColor,
    } = getThemeColors('standard', 'light');
    expect(chromeColors).toEqual({
      activeBackgroundColor: 'var(--background-subtleDanger-pressed, #FFEBE6)',
      backgroundColor: 'var(--background-subtleNeutral-resting, #F4F5F7)',
      backgroundColorHover: 'var(--background-subtleNeutral-hover, #EBECF0)',
      textColor: 'var(--text-highEmphasis, #253858)',
      textColorHover: 'var(--text-highEmphasis, #253858)',
    });
    expect(chromeLinkColors).toEqual({
      activeBackgroundColor: 'var(--background-subtleNeutral-pressed, #EBECF0)',
      activeBackgroundColorRemoval:
        'var(--background-subtleDanger-pressed, #FFEBE6)',
      focusRingColor: 'var(--border-focus, #4C9AFF)',
      hoverBackgroundColor: 'var(--background-subtleNeutral-hover, #EBECF0)',
      hoverBackgroundColorRemoval:
        'var(--background-subtleDanger-hover, #FFEBE6)',
      hoverTextColor: 'var(--text-link-pressed, #0065FF)',
    });
    expect(buttonColors).toEqual({
      backgroundColor: 'var(--background-subtleNeutral-resting, #F4F5F7)',
      backgroundColorHover: 'var(--background-subtleDanger-hover, #FFEBE6)',
      focusBoxShadowColor: 'var(--border-focus, #4C9AFF)',
    });
    expect(linkHoverColor).toEqual('var(--text-link-pressed, #0065FF)');
  });
  it('should standard theme getThemeColors in dark mode', () => {
    const {
      chromeColors,
      chromeLinkColors,
      buttonColors,
      linkHoverColor,
    } = getThemeColors('standard', 'dark');
    expect(chromeColors).toEqual({
      activeBackgroundColor: 'var(--background-subtleDanger-pressed, #B8C7E0)',
      backgroundColor:
        'var(--background-subtleNeutral-resting, rgba(13, 20, 36, 0.53))',
      backgroundColorHover: 'var(--background-subtleNeutral-hover, #313D52)',
      textColor: 'var(--text-highEmphasis, #B8C7E0)',
      textColorHover: 'var(--text-highEmphasis, #B8C7E0)',
    });
    expect(chromeLinkColors).toEqual({
      activeBackgroundColor: 'var(--background-subtleNeutral-pressed, #B8C7E0)',
      activeBackgroundColorRemoval:
        'var(--background-subtleDanger-pressed, #B8C7E0)',
      focusRingColor: 'var(--border-focus, #B3D4FF)',
      hoverBackgroundColor: 'var(--background-subtleNeutral-hover, #313D52)',
      hoverBackgroundColorRemoval:
        'var(--background-subtleDanger-hover, #FF8F73)',
      hoverTextColor: 'var(--text-link-pressed, #2684FF)',
    });
    expect(buttonColors).toEqual({
      backgroundColor:
        'var(--background-subtleNeutral-resting, rgba(13, 20, 36, 0.53))',
      backgroundColorHover: 'var(--background-subtleDanger-hover, #FF8F73)',
      focusBoxShadowColor: 'var(--border-focus, #B3D4FF)',
    });
    expect(linkHoverColor).toEqual('var(--text-link-pressed, #2684FF)');
  });
});
