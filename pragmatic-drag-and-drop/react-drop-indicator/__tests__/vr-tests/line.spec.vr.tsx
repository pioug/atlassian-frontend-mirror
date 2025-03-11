import { snapshot } from '@af/visual-regression';

import {
	ColorDiscovery,
	ColorWarning,
	EdgeBottomTypeNoTerminalGap0px,
	EdgeBottomTypeNoTerminalGapTokenSpace100,
	EdgeBottomTypeTerminalGap0px,
	EdgeBottomTypeTerminalGapTokenSpace100,
	EdgeBottomTypeTerminalNoBleedGap0px,
	EdgeBottomTypeTerminalNoBleedGapTokenSpace100,
	EdgeBottomTypeTerminalNoBleedGapTokenSpace100IndentTokenSpace200,
	EdgeLeftTypeNoTerminalGap0px,
	EdgeLeftTypeNoTerminalGapTokenSpace100,
	EdgeLeftTypeTerminalGap0px,
	EdgeLeftTypeTerminalGapTokenSpace100,
	EdgeLeftTypeTerminalNoBleedGap0px,
	EdgeLeftTypeTerminalNoBleedGapTokenSpace100,
	EdgeLeftTypeTerminalNoBleedGapTokenSpace100IndentTokenSpace200,
	EdgeRightTypeNoTerminalGap0px,
	EdgeRightTypeNoTerminalGapTokenSpace100,
	EdgeRightTypeTerminalGap0px,
	EdgeRightTypeTerminalGapTokenSpace100,
	EdgeRightTypeTerminalNoBleedGap0px,
	EdgeRightTypeTerminalNoBleedGapTokenSpace100,
	EdgeRightTypeTerminalNoBleedGapTokenSpace100IndentTokenSpace200,
	EdgeTopTypeNoTerminalGap0px,
	EdgeTopTypeNoTerminalGapTokenSpace100,
	EdgeTopTypeTerminalGap0px,
	EdgeTopTypeTerminalGapTokenSpace100,
	EdgeTopTypeTerminalNoBleedGap0px,
	EdgeTopTypeTerminalNoBleedGapTokenSpace100,
	EdgeTopTypeTerminalNoBleedGapTokenSpace100IndentTokenSpace200,
} from '../../examples/line';

const options: Parameters<typeof snapshot>[1] = {
	variants: [{ name: 'light', environment: { colorScheme: 'light' } }],
};

snapshot(EdgeTopTypeTerminalGap0px, options);
snapshot(EdgeRightTypeTerminalGap0px, options);
snapshot(EdgeBottomTypeTerminalGap0px, options);
snapshot(EdgeLeftTypeTerminalGap0px, options);
snapshot(EdgeTopTypeTerminalGapTokenSpace100, options);
snapshot(EdgeRightTypeTerminalGapTokenSpace100, options);
snapshot(EdgeBottomTypeTerminalGapTokenSpace100, options);
snapshot(EdgeLeftTypeTerminalGapTokenSpace100, options);
snapshot(EdgeTopTypeNoTerminalGap0px, options);
snapshot(EdgeRightTypeNoTerminalGap0px, options);
snapshot(EdgeBottomTypeNoTerminalGap0px, options);
snapshot(EdgeLeftTypeNoTerminalGap0px, options);
snapshot(EdgeTopTypeNoTerminalGapTokenSpace100, options);
snapshot(EdgeRightTypeNoTerminalGapTokenSpace100, options);
snapshot(EdgeBottomTypeNoTerminalGapTokenSpace100, options);
snapshot(EdgeLeftTypeNoTerminalGapTokenSpace100, options);
snapshot(EdgeTopTypeTerminalNoBleedGap0px, options);
snapshot(EdgeRightTypeTerminalNoBleedGap0px, options);
snapshot(EdgeBottomTypeTerminalNoBleedGap0px, options);
snapshot(EdgeLeftTypeTerminalNoBleedGap0px, options);
snapshot(EdgeTopTypeTerminalNoBleedGapTokenSpace100, options);
snapshot(EdgeRightTypeTerminalNoBleedGapTokenSpace100, options);
snapshot(EdgeBottomTypeTerminalNoBleedGapTokenSpace100, options);
snapshot(EdgeLeftTypeTerminalNoBleedGapTokenSpace100, options);

// Indenting
snapshot(EdgeTopTypeTerminalNoBleedGapTokenSpace100IndentTokenSpace200, options);
snapshot(EdgeRightTypeTerminalNoBleedGapTokenSpace100IndentTokenSpace200, options);
snapshot(EdgeBottomTypeTerminalNoBleedGapTokenSpace100IndentTokenSpace200, options);
snapshot(EdgeLeftTypeTerminalNoBleedGapTokenSpace100IndentTokenSpace200, options);

// Custom colors
snapshot(ColorWarning, options);
snapshot(ColorDiscovery, options);
