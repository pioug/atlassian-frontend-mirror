import { Device, snapshot } from '@af/visual-regression';
import { flagsForVrTestsWithReducedPadding } from '@atlaskit/editor-test-helpers/advanced-layouts-flags';
import {
	CodeBlockRendererCopy,
	CodeBlockRendererCopyWrap,
	CodeBlockRendererTrailingNewline,
	CodeBlockRendererWrap,
	CodeBlockRendererOverflow,
	CodeBlockWithReactLooselyLazy,
	CodeBlockRendererWithBreakout,
	CodeBlockRendererWithBreakoutFullWidth,
	CodeBlockRendererWithWrapEnabled,
} from './code-block.fixture';

snapshot(CodeBlockRendererCopy, {
	description: 'should render copy button on hover if enabled',
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
});

snapshot(CodeBlockRendererCopyWrap, {
	description: 'should render both copy and wrap button on hover if enabled',
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
});

snapshot(CodeBlockRendererTrailingNewline, {
	description: 'should render trailing newline',
});

snapshot(CodeBlockRendererWrap, {
	description: 'should render wrap button on hover if enabled',
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
});

snapshot(CodeBlockRendererWithWrapEnabled, {
	description:
		'should initialise wrap from ADF wrap attribute and render wrap button as selected on hover',
	featureFlags: {
		platform_editor_renderer_rm_usespecbasedvalidator: true,
	},
	variants: [{ name: 'light', environment: { colorScheme: 'light' } }],
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
});

snapshot(CodeBlockRendererOverflow, {
	description: 'should render overflow as expected',
	variants: [{ name: 'light', environment: { colorScheme: 'light' } }],
});

snapshot(CodeBlockWithReactLooselyLazy, {
	description: 'should render with react loosely lazy',
	variants: [{ name: 'light', environment: { colorScheme: 'light' } }],
});

snapshot(CodeBlockRendererWithBreakout, {
	description: 'should render code block with breakout',
});

snapshot(CodeBlockRendererWithBreakout, {
	...flagsForVrTestsWithReducedPadding,
	description: 'full-page renderer should have 24px padding on narrow screen',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});

snapshot(CodeBlockRendererWithBreakoutFullWidth, {
	...flagsForVrTestsWithReducedPadding,
	description: 'full-width renderer should have no padding on narrow screen',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});
