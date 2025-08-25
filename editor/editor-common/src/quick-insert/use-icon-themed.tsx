import { useThemeObserver } from '@atlaskit/tokens';
/**
 * Warning -- if additional color modes beyond light and dark are added in future -- this will have unexpected behaviour
 */
export const useIconThemed = () => {
	const { colorMode } = useThemeObserver();

	return {
		iconThemed: (colors: { dark: string; light: string }) => {
			return colorMode && colorMode === 'dark' ? colors['dark'] : colors['light'];
		},
	};
};
