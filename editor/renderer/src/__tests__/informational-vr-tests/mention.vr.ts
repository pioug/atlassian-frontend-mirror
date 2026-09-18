// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import { RendererMention } from './mention.fixtures.vr.ap';

snapshotInformational(RendererMention, {
	// Force the legacy profile card so this VR exercises the ProfileCardTrigger popup.
	// Editor VR tests default platform experiments to true, which would otherwise take the
	// new user-profile-card branch (covered by VR in @atlassian/user-profile-card instead).
	// TODO: PCON-386 - Remove this when we have VR for the new user-profile-card branch.
	featureFlags: {
		'people-teams_migrate-user-profile-card': false,
		pt_user_profile_card_migration_exp: false,
	},
	prepare: async (page: Page, component: Locator) => {
		const mention = page.locator('[data-mention-id]');
		await mention.click();
	},
});
