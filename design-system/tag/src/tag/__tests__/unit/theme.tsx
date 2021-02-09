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
      backgroundColor: '#F4F5F7',
      backgroundColorHover: '#EBECF0',
      textColor: '#253858',
      textColorHover: '#253858',
    });
    expect(chromeLinkColors).toEqual({
      focusRingColor: '#4C9AFF',
      hoverBackgroundColor: '#EBECF0',
      hoverBackgroundColorRemoval: '#FFEBE6',
      hoverTextColor: '#0065FF',
      hoverTextColorRemoval: '#BF2600',
    });
    expect(buttonColors).toEqual({
      backgroundColor: '#F4F5F7',
      backgroundColorHover: '#FFEBE6',
      focusBoxShadowColor: '#4C9AFF',
      hoverBoxShadowColor: '#FF5630',
    });
    expect(linkHoverColor).toEqual('#0065FF');
  });
  it('should standard theme getThemeColors in dark mode', () => {
    const {
      chromeColors,
      chromeLinkColors,
      buttonColors,
      linkHoverColor,
    } = getThemeColors('standard', 'dark');
    expect(chromeColors).toEqual({
      backgroundColor: 'rgba(13, 20, 36, 0.53)',
      backgroundColorHover: '#313D52',
      textColor: '#B8C7E0',
      textColorHover: '#B8C7E0',
    });
    expect(chromeLinkColors).toEqual({
      focusRingColor: '#B3D4FF',
      hoverBackgroundColor: '#313D52',
      hoverBackgroundColorRemoval: '#FF8F73',
      hoverTextColor: '#2684FF',
      hoverTextColorRemoval: '#1B2638',
    });
    expect(buttonColors).toEqual({
      backgroundColor: 'rgba(13, 20, 36, 0.53)',
      backgroundColorHover: '#FF8F73',
      focusBoxShadowColor: '#B3D4FF',
      hoverBoxShadowColor: '#FF7452',
    });
    expect(linkHoverColor).toEqual('#2684FF');
  });
});
