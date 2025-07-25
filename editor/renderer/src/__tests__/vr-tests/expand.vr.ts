import { Device, snapshot } from '@af/visual-regression';
import { flagsForVrTestsWithReducedPadding } from '@atlaskit/editor-test-helpers/advanced-layouts-flags';
import {
	ExpandRenderer,
	ExpandFullPageRenderer,
	ExpandHoveredRenderer,
	ExpandWrappedRenderer,
	ExpandDefaultModeRenderer,
	ExpandFullWidthModeRenderer,
	ExpandWideModeRenderer,
	ExpandRendererWithReactLooselyLazy,
} from './expand.fixture';

snapshot(ExpandRenderer);

snapshot(ExpandRenderer, {
	...flagsForVrTestsWithReducedPadding,
	description: 'full-width renderer should have no padding on narrow screen',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});

snapshot(ExpandFullPageRenderer, {
	...flagsForVrTestsWithReducedPadding,
	description: 'full-page renderer should have 24px padding on narrow screen',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});

snapshot(ExpandHoveredRenderer, {
	description: 'should render a border on hover of a collapsed top level expand',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'expand-container-expand-expand-title-1' },
		},
	],
});

snapshot(ExpandWrappedRenderer, {
	description: 'should have a left aligned title when wrapped',
});

snapshot(ExpandDefaultModeRenderer, {
	description: 'should render a default collapsed top level expand',
});

snapshot(ExpandWideModeRenderer, {
	description: 'should render a wide collapsed top level expand',
});

snapshot(ExpandFullWidthModeRenderer, {
	description: 'should render a full width collapsed top level expand',
});

snapshot(ExpandRendererWithReactLooselyLazy);
