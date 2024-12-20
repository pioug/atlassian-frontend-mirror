import { snapshotInformational } from '@af/visual-regression';
import { StatusInPanelRenderer } from './status.fixture';

snapshotInformational(StatusInPanelRenderer, {
	description:
		'should render status with white background so status lozenge is distinguishable in panels of same colour',
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	async prepare(page, component) {
		await page.pause();
	},
});
