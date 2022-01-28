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
      activeBackgroundColor: 'var(--ds-background-danger-pressed, #FFEBE6)',
      backgroundColor: 'var(--ds-background-neutral, #F4F5F7)',
      backgroundColorHover: 'var(--ds-background-neutral-hovered, #EBECF0)',
      textColor: 'var(--ds-text, #253858)',
      textColorHover: 'var(--ds-text, #253858)',
    });
    expect(chromeLinkColors).toEqual({
      activeBackgroundColor: 'var(--ds-background-neutral-pressed, #EBECF0)',
      activeBackgroundColorRemoval:
        'var(--ds-background-danger-pressed, #FFEBE6)',
      focusRingColor: 'var(--ds-border-focused, #4C9AFF)',
      hoverBackgroundColor: 'var(--ds-background-neutral-hovered, #EBECF0)',
      hoverBackgroundColorRemoval:
        'var(--ds-background-danger-hovered, #FFEBE6)',
      hoverTextColor: 'var(--ds-link-pressed, #0065FF)',
    });
    expect(buttonColors).toEqual({
      backgroundColor: 'var(--ds-background-neutral, #F4F5F7)',
      backgroundColorHover: 'var(--ds-background-danger-hovered, #FFEBE6)',
      focusBoxShadowColor: 'var(--ds-border-focused, #4C9AFF)',
    });
    expect(linkHoverColor).toEqual('var(--ds-link-pressed, #0065FF)');
  });
  it('should standard theme getThemeColors in dark mode', () => {
    const {
      chromeColors,
      chromeLinkColors,
      buttonColors,
      linkHoverColor,
    } = getThemeColors('standard', 'dark');
    expect(chromeColors).toEqual({
      activeBackgroundColor: 'var(--ds-background-danger-pressed, #B8C7E0)',
      backgroundColor: 'var(--ds-background-neutral, rgba(13, 20, 36, 0.53))',
      backgroundColorHover: 'var(--ds-background-neutral-hovered, #313D52)',
      textColor: 'var(--ds-text, #B8C7E0)',
      textColorHover: 'var(--ds-text, #B8C7E0)',
    });
    expect(chromeLinkColors).toEqual({
      activeBackgroundColor: 'var(--ds-background-neutral-pressed, #B8C7E0)',
      activeBackgroundColorRemoval:
        'var(--ds-background-danger-pressed, #B8C7E0)',
      focusRingColor: 'var(--ds-border-focused, #B3D4FF)',
      hoverBackgroundColor: 'var(--ds-background-neutral-hovered, #313D52)',
      hoverBackgroundColorRemoval:
        'var(--ds-background-danger-hovered, #FF8F73)',
      hoverTextColor: 'var(--ds-link-pressed, #2684FF)',
    });
    expect(buttonColors).toEqual({
      backgroundColor: 'var(--ds-background-neutral, rgba(13, 20, 36, 0.53))',
      backgroundColorHover: 'var(--ds-background-danger-hovered, #FF8F73)',
      focusBoxShadowColor: 'var(--ds-border-focused, #B3D4FF)',
    });
    expect(linkHoverColor).toEqual('var(--ds-link-pressed, #2684FF)');
  });
});
