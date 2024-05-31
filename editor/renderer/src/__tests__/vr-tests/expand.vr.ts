import { snapshot } from '@af/visual-regression';
import {
	ExpandRenderer,
	ExpandHoveredRenderer,
	ExpandWrappedRenderer,
	ExpandDefaultModeRenderer,
	ExpandFullWidthModeRenderer,
	ExpandWideModeRenderer,
} from './expand.fixture';

snapshot(ExpandRenderer);

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
