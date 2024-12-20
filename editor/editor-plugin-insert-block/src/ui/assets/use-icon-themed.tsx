import { useThemeObserver } from '@atlaskit/tokens';

// Copy of platform/packages/editor/editor-common/src/quick-insert/use-icon-themed.tsx
// As per warning in the original file, this hook may not be suitable to be exported
// and we want to avoid making experiment-only icons public (i.e. move to @atlaskit/editor-common/quick-insert)
export const useIconThemed = () => {
	const { colorMode } = useThemeObserver();

	return {
		iconThemed: (colors: { light: string; dark: string }) => {
			return colorMode && colorMode === 'dark' ? colors['dark'] : colors['light'];
		},
	};
};
