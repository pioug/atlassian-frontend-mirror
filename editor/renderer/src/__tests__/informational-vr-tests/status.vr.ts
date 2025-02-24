import { snapshotInformational } from '@af/visual-regression';
import { StatusInPanelRenderer } from './status.fixture';

// This test ensures that the status component is rendered clearly within panels of the same color.
snapshotInformational(StatusInPanelRenderer, {
	description: 'should render status clearly within panels of the same color',
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	async prepare(page, component) {
		await page.pause();
	},
});
