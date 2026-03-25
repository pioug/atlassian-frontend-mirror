import { snapshot } from '@af/visual-regression';
import {
	MediaBorderADF,
	MediaBorderWithinTableADF,
	MediaBorderWithLinkADF,
} from './media-border.fixtures';

snapshot(MediaBorderADF, {
	description: 'should render caption correctly',
	featureFlags: {
		'platform_editor_media_border_radius_fix': true,
	},
});

snapshot(MediaBorderWithinTableADF, {
	description: 'should render long caption correctly',
	featureFlags: {
		'platform_editor_media_border_radius_fix': true,
	},
});

snapshot(MediaBorderWithLinkADF, {
	description: 'should render complicated caption correctly',
	featureFlags: {
		'platform_editor_media_border_radius_fix': true,
	},
});
