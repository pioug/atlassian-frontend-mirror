import cssToDesignTokens from './css-to-design-tokens/transform';
import removeFallbacksColor from './remove-fallbacks-color/transform';
import themeToDesignTokens from './theme-to-design-tokens/transform';

const config = {
	presets: {
		'theme-to-design-tokens': themeToDesignTokens,
		'css-to-design-tokens': cssToDesignTokens,
		'remove-fallbacks-color': removeFallbacksColor,
	},
};

export default config;
