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
      activeBackgroundColor:
        'var(--ds-background-subtleDanger-pressed, #FFEBE6)',
      backgroundColor: 'var(--ds-background-subtleNeutral-resting, #F4F5F7)',
      backgroundColorHover: 'var(--ds-background-subtleNeutral-hover, #EBECF0)',
      textColor: 'var(--ds-text-highEmphasis, #253858)',
      textColorHover: 'var(--ds-text-highEmphasis, #253858)',
    });
    expect(chromeLinkColors).toEqual({
      activeBackgroundColor:
        'var(--ds-background-subtleNeutral-pressed, #EBECF0)',
      activeBackgroundColorRemoval:
        'var(--ds-background-subtleDanger-pressed, #FFEBE6)',
      focusRingColor: 'var(--ds-border-focus, #4C9AFF)',
      hoverBackgroundColor: 'var(--ds-background-subtleNeutral-hover, #EBECF0)',
      hoverBackgroundColorRemoval:
        'var(--ds-background-subtleDanger-hover, #FFEBE6)',
      hoverTextColor: 'var(--ds-text-link-pressed, #0065FF)',
    });
    expect(buttonColors).toEqual({
      backgroundColor: 'var(--ds-background-subtleNeutral-resting, #F4F5F7)',
      backgroundColorHover: 'var(--ds-background-subtleDanger-hover, #FFEBE6)',
      focusBoxShadowColor: 'var(--ds-border-focus, #4C9AFF)',
    });
    expect(linkHoverColor).toEqual('var(--ds-text-link-pressed, #0065FF)');
  });
  it('should standard theme getThemeColors in dark mode', () => {
    const {
      chromeColors,
      chromeLinkColors,
      buttonColors,
      linkHoverColor,
    } = getThemeColors('standard', 'dark');
    expect(chromeColors).toEqual({
      activeBackgroundColor:
        'var(--ds-background-subtleDanger-pressed, #B8C7E0)',
      backgroundColor:
        'var(--ds-background-subtleNeutral-resting, rgba(13, 20, 36, 0.53))',
      backgroundColorHover: 'var(--ds-background-subtleNeutral-hover, #313D52)',
      textColor: 'var(--ds-text-highEmphasis, #B8C7E0)',
      textColorHover: 'var(--ds-text-highEmphasis, #B8C7E0)',
    });
    expect(chromeLinkColors).toEqual({
      activeBackgroundColor:
        'var(--ds-background-subtleNeutral-pressed, #B8C7E0)',
      activeBackgroundColorRemoval:
        'var(--ds-background-subtleDanger-pressed, #B8C7E0)',
      focusRingColor: 'var(--ds-border-focus, #B3D4FF)',
      hoverBackgroundColor: 'var(--ds-background-subtleNeutral-hover, #313D52)',
      hoverBackgroundColorRemoval:
        'var(--ds-background-subtleDanger-hover, #FF8F73)',
      hoverTextColor: 'var(--ds-text-link-pressed, #2684FF)',
    });
    expect(buttonColors).toEqual({
      backgroundColor:
        'var(--ds-background-subtleNeutral-resting, rgba(13, 20, 36, 0.53))',
      backgroundColorHover: 'var(--ds-background-subtleDanger-hover, #FF8F73)',
      focusBoxShadowColor: 'var(--ds-border-focus, #B3D4FF)',
    });
    expect(linkHoverColor).toEqual('var(--ds-text-link-pressed, #2684FF)');
  });
});
