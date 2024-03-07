import cssToDesignTokens from './css-to-design-tokens/transform';
import themeToDesignTokens from './theme-to-design-tokens/transform';

export default {
  presets: {
    'theme-to-design-tokens': themeToDesignTokens,
    'css-to-design-tokens': cssToDesignTokens,
  },
};
