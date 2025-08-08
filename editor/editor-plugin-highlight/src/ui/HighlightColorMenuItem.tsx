/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ColorPalette, highlightColorPaletteNext } from '@atlaskit/editor-common/ui-color';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { Stack, Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { HighlightPlugin } from '../highlightPluginType';

interface HighlightMenuItemProps {
	api: ExtractInjectionAPI<HighlightPlugin> | undefined;
}

const styles = cssMap({
	container: {
		marginTop: token('space.200'),
		gap: token('space.100'),
	},
	colorPalette: {
		marginLeft: token('space.negative.100'),
	},
	removeHighlightButton: {
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('border.radius'),
	},
});
const colorPalette = highlightColorPaletteNext.filter((color) => color.label !== 'No color');

export function HighlightColorMenuItem({ api }: HighlightMenuItemProps) {
	const activeColor = useSharedPluginStateSelector(api, 'highlight.activeColor');

	return (
		<ToolbarDropdownItemSection>
			<Stack xcss={styles.container} testId="highlight-color-menu-item">
				<Text weight="bold">Highlight color</Text>
				<Box xcss={styles.colorPalette}>
					<ColorPalette
						onClick={() => {}}
						selectedColor={activeColor || null}
						paletteOptions={{
							palette: colorPalette || [],
							hexToPaletteColor: hexToEditorTextBackgroundPaletteColor,
						}}
					/>
				</Box>
				<div css={styles.removeHighlightButton}>
					<Button shouldFitContainer appearance="subtle">
						Remove highlight
					</Button>
				</div>
			</Stack>
		</ToolbarDropdownItemSection>
	);
}
