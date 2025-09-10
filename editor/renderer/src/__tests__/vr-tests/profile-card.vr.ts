import { snapshot } from '@af/visual-regression';
import { ProfileCardInRenderer } from './profile-card.fixture';

snapshot(ProfileCardInRenderer, {
	featureFlags: {
		platform_editor_typography_ugc: true,
		enable_absolute_positioning_profile_card: true,
	},
});
