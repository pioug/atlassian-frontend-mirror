import { Device, snapshot } from '@af/visual-regression';
import {
	MediaImageInlineDefault,
	MediaImageInlineError,
	MediaImageInlineWithBorders,
	MediaImageInlineWithLinks,
	MediaImageInlineWithLinksAndBorders,
} from '../__helpers/rendererComponents';

snapshot(MediaImageInlineDefault, {
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
	],
	featureFlags: {
		'platform.editor.media.inline-image.base-support': true,
	},
});

snapshot(MediaImageInlineError, {
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
	],
	featureFlags: {
		'platform.editor.media.inline-image.base-support': true,
	},
});

snapshot(MediaImageInlineWithBorders, {
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
	],
	featureFlags: {
		'platform.editor.media.inline-image.base-support': true,
	},
});

// Flaky Test https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2942703/steps/%7B2cd9f3bd-29cb-49d1-816a-d1b6a862b09b%7D
snapshot.skip(MediaImageInlineWithLinks, {
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
	],
	featureFlags: {
		'platform.editor.media.inline-image.base-support': true,
	},
});

snapshot(MediaImageInlineWithLinksAndBorders, {
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
	],
	featureFlags: {
		'platform.editor.media.inline-image.base-support': true,
	},
});
