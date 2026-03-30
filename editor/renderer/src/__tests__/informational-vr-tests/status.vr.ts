import { snapshotInformational } from '@af/visual-regression';
import { StatusInPanelRenderer, MixedCaseStatusInPanelRenderer } from './status.fixture';

// This test ensures that the status component is rendered clearly within panels of the same color.
snapshotInformational(StatusInPanelRenderer, {
	description: 'should render status with all caps clearly within panels of the same color',
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-lozenge-tag-badge-visual-uplifts': true,
	},
	async prepare(page, component) {
		await page.pause();
	},
});

snapshotInformational(MixedCaseStatusInPanelRenderer, {
	description: 'should render status with mixed case clearly within panels of the same color',
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-lozenge-tag-badge-visual-uplifts': true,
	},
	async prepare(page, component) {
		await page.pause();
	},
});
