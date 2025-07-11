import { snapshot } from '@af/visual-regression';
import { ProfileCardInRenderer } from './profile-card.fixture';

snapshot(ProfileCardInRenderer, {
	featureFlags: {
		platform_editor_profilecard_style_fix: [true, false],
		platform_editor_typography_ugc: true,
	},
});
