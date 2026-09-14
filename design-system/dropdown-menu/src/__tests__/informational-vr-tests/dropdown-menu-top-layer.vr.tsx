import { snapshotInformational } from '@af/visual-regression';

import DropdownSpacing from '../../../examples/10-dropdown-spacing.vr.ap';
import ShouldFitContainer from '../../../examples/18-should-fit-container.vr.ap';
import Loading from '../../../examples/93-testing-is-loading-reposition.vr.ap';
import ComplexDropdown from '../../../examples/99-testing-complex-dropdown-menu.vr.ap';
import Testing from '../../../examples/99-testing.vr.ap';
import SelectionStates from '../../../examples/selection-states.vr.ap';

const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

snapshotInformational(DropdownSpacing, {
	description: 'spacing compact and default',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(ComplexDropdown, {
	description: 'complex dropdown with radio groups',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(SelectionStates, {
	description: 'selection states',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(ShouldFitContainer, {
	description: 'should fit container',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Page actions' }).click();
		await page.getByRole('menuitem', { name: 'Move' }).waitFor({ state: 'visible' });
	},
});

snapshotInformational(Testing, {
	description: 'default dropdown opened via click',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Page actions' }).click();
	},
});

snapshotInformational(Loading, {
	description: 'loading state',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(Loading, {
	description: 'loading to loaded transition',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Toggle isLoading' }).click();
	},
});
