import { snapshot } from '@af/visual-regression';
import {
	NestedExpandInExpandRenderer,
	NestedExpandInExpandDefaultModeRenderer,
	NestedExpandInExpandWideModeRenderer,
	NestedExpandInExpandFullWidthModeRenderer,
} from './nested-expand.fixture';

snapshot(NestedExpandInExpandRenderer);

snapshot(NestedExpandInExpandRenderer, {
	description: 'should render a border on hover of a collapsed expand with a nested expand inside',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'expand-container-expand-expand-title-1' },
		},
	],
});

snapshot(NestedExpandInExpandDefaultModeRenderer, {
	description: 'should render a default collapsed expand with a nested expand inside',
});

snapshot(NestedExpandInExpandWideModeRenderer, {
	description: 'should render a wide collapsed expand with a nested expand inside',
});

snapshot(NestedExpandInExpandFullWidthModeRenderer, {
	description: 'should render a full width collapsed expand with a nested expand inside',
});
