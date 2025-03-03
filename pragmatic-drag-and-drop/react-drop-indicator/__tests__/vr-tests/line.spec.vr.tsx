import { snapshot } from '@af/visual-regression';

import {
	ColorDiscovery,
	ColorWarning,
	EdgeBottomAppearanceNoTerminalGap0px,
	EdgeBottomAppearanceNoTerminalGapTokenSpace100,
	EdgeBottomAppearanceTerminalGap0px,
	EdgeBottomAppearanceTerminalGapTokenSpace100,
	EdgeBottomAppearanceTerminalNoBleedGap0px,
	EdgeBottomAppearanceTerminalNoBleedGapTokenSpace100,
	EdgeBottomAppearanceTerminalNoBleedGapTokenSpace100IndentTokenSpace200,
	EdgeLeftAppearanceNoTerminalGap0px,
	EdgeLeftAppearanceNoTerminalGapTokenSpace100,
	EdgeLeftAppearanceTerminalGap0px,
	EdgeLeftAppearanceTerminalGapTokenSpace100,
	EdgeLeftAppearanceTerminalNoBleedGap0px,
	EdgeLeftAppearanceTerminalNoBleedGapTokenSpace100,
	EdgeLeftAppearanceTerminalNoBleedGapTokenSpace100IndentTokenSpace200,
	EdgeRightAppearanceNoTerminalGap0px,
	EdgeRightAppearanceNoTerminalGapTokenSpace100,
	EdgeRightAppearanceTerminalGap0px,
	EdgeRightAppearanceTerminalGapTokenSpace100,
	EdgeRightAppearanceTerminalNoBleedGap0px,
	EdgeRightAppearanceTerminalNoBleedGapTokenSpace100,
	EdgeRightAppearanceTerminalNoBleedGapTokenSpace100IndentTokenSpace200,
	EdgeTopAppearanceNoTerminalGap0px,
	EdgeTopAppearanceNoTerminalGapTokenSpace100,
	EdgeTopAppearanceTerminalGap0px,
	EdgeTopAppearanceTerminalGapTokenSpace100,
	EdgeTopAppearanceTerminalNoBleedGap0px,
	EdgeTopAppearanceTerminalNoBleedGapTokenSpace100,
	EdgeTopAppearanceTerminalNoBleedGapTokenSpace100IndentTokenSpace200,
} from '../../examples/line';

const options: Parameters<typeof snapshot>[1] = {
	variants: [{ name: 'light', environment: { colorScheme: 'light' } }],
};

snapshot(EdgeTopAppearanceTerminalGap0px, options);
snapshot(EdgeRightAppearanceTerminalGap0px, options);
snapshot(EdgeBottomAppearanceTerminalGap0px, options);
snapshot(EdgeLeftAppearanceTerminalGap0px, options);
snapshot(EdgeTopAppearanceTerminalGapTokenSpace100, options);
snapshot(EdgeRightAppearanceTerminalGapTokenSpace100, options);
snapshot(EdgeBottomAppearanceTerminalGapTokenSpace100, options);
snapshot(EdgeLeftAppearanceTerminalGapTokenSpace100, options);
snapshot(EdgeTopAppearanceNoTerminalGap0px, options);
snapshot(EdgeRightAppearanceNoTerminalGap0px, options);
snapshot(EdgeBottomAppearanceNoTerminalGap0px, options);
snapshot(EdgeLeftAppearanceNoTerminalGap0px, options);
snapshot(EdgeTopAppearanceNoTerminalGapTokenSpace100, options);
snapshot(EdgeRightAppearanceNoTerminalGapTokenSpace100, options);
snapshot(EdgeBottomAppearanceNoTerminalGapTokenSpace100, options);
snapshot(EdgeLeftAppearanceNoTerminalGapTokenSpace100, options);
snapshot(EdgeTopAppearanceTerminalNoBleedGap0px, options);
snapshot(EdgeRightAppearanceTerminalNoBleedGap0px, options);
snapshot(EdgeBottomAppearanceTerminalNoBleedGap0px, options);
snapshot(EdgeLeftAppearanceTerminalNoBleedGap0px, options);
snapshot(EdgeTopAppearanceTerminalNoBleedGapTokenSpace100, options);
snapshot(EdgeRightAppearanceTerminalNoBleedGapTokenSpace100, options);
snapshot(EdgeBottomAppearanceTerminalNoBleedGapTokenSpace100, options);
snapshot(EdgeLeftAppearanceTerminalNoBleedGapTokenSpace100, options);

// Indenting
snapshot(EdgeTopAppearanceTerminalNoBleedGapTokenSpace100IndentTokenSpace200, options);
snapshot(EdgeRightAppearanceTerminalNoBleedGapTokenSpace100IndentTokenSpace200, options);
snapshot(EdgeBottomAppearanceTerminalNoBleedGapTokenSpace100IndentTokenSpace200, options);
snapshot(EdgeLeftAppearanceTerminalNoBleedGapTokenSpace100IndentTokenSpace200, options);

// Custom colors
snapshot(ColorWarning, options);
snapshot(ColorDiscovery, options);
