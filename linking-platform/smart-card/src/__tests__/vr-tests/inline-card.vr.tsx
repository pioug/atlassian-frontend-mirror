import { snapshot } from '@af/visual-regression';

import VRInlineCardAllExamplesInText from '../../../examples/vr-inline-card/vr-inline-card-all-examples-in-text';
import InlineCardDefault from '../../../examples/vr-inline-card/vr-inline-card-default-icon';
import InlineCardDefaultTruncate from '../../../examples/vr-inline-card/vr-inline-card-default-truncate';
import InlineCardError from '../../../examples/vr-inline-card/vr-inline-card-error';
import InlineCardErrorTruncate from '../../../examples/vr-inline-card/vr-inline-card-error-truncate';
import InlineCardForbidden from '../../../examples/vr-inline-card/vr-inline-card-forbidden';
import InlineCardForbiddenDefaultIcon from '../../../examples/vr-inline-card/vr-inline-card-forbidden-default-icon';
import InlineCardForbiddenRequestAccess from '../../../examples/vr-inline-card/vr-inline-card-forbidden-request-access';
import InlineCardForbiddenDeniedSiteAccess from '../../../examples/vr-inline-card/vr-inline-card-forbidden-site-denied-access';
import InlineCardForbiddenDirectAccess from '../../../examples/vr-inline-card/vr-inline-card-forbidden-site-direct-access';
import InlineCardForbiddenPendingSiteAccess from '../../../examples/vr-inline-card/vr-inline-card-forbidden-site-pending-access';
import InlineCardForbiddenSiteRequestAccess from '../../../examples/vr-inline-card/vr-inline-card-forbidden-site-request-access';
import InlineCardForbiddenSiteRequestAccessTruncate from '../../../examples/vr-inline-card/vr-inline-card-forbidden-site-request-access-truncate';
import InlineCardForbiddenTruncate from '../../../examples/vr-inline-card/vr-inline-card-forbidden-truncate';
import InlineCardIcons from '../../../examples/vr-inline-card/vr-inline-card-icons';
import InlineCardNotFound from '../../../examples/vr-inline-card/vr-inline-card-not-found';
import InlineCardNotFoundTruncate from '../../../examples/vr-inline-card/vr-inline-card-not-found-truncate';
import InlineCardSelected from '../../../examples/vr-inline-card/vr-inline-card-selected';
import InlineCardTextWrap from '../../../examples/vr-inline-card/vr-inline-card-text-wrap';
import InlineCardUnauthorised from '../../../examples/vr-inline-card/vr-inline-card-unauthorised';
import InlineCardUnauthorisedDefaultIcon from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-default-icon';
import InlineCardUnauthorisedNoAuth from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-no-auth';
import InlineCardUnauthorisedTruncate from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-truncate';

snapshot(InlineCardDefault, {
	description: 'inline card with default icon',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'This error is expected when rendering an error boundary in a dev build',
			jiraIssueId: 'TODO-1',
		},
	],
});
snapshot(InlineCardDefault, {
	description: 'inline card renders correctly when hovering over url',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'This error is expected when rendering an error boundary in a dev build',
			jiraIssueId: 'TODO-1',
		},
	],
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-resolved-view' } }],
});

snapshot(InlineCardSelected, {
	description: 'inline card when selected',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-smart-card-icon-migration': [true, false],
	},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'This error is expected when rendering an error boundary in a dev build',
			jiraIssueId: 'TODO-1',
		},
	],
});
snapshot(InlineCardDefaultTruncate, {
	description: 'inline card with default icon and truncation',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'This error is expected when rendering an error boundary in a dev build',
			jiraIssueId: 'TODO-1',
		},
	],
});

snapshot(InlineCardTextWrap, {
	description: 'inline card with wrapped text renders correctly',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'This error is expected when rendering an error boundary in a dev build',
			jiraIssueId: 'TODO-1',
		},
	],
});
snapshot(InlineCardError, {
	description: 'inline card error view',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(InlineCardError, {
	description: 'inline card error view renders correctly when hovering over url in errored view',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-errored-view' } }],
});
snapshot(InlineCardErrorTruncate, {
	description: 'inline card error view with truncation',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(InlineCardForbidden, {
	description: 'inline card forbidden view',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(InlineCardForbidden, {
	description:
		'inline card forbidden view renders correctly when hovering over url in forbidden view',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-forbidden-view' } }],
});

snapshot(InlineCardForbiddenTruncate, {
	description: 'inline card forbidden view with truncation',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshot(InlineCardForbiddenRequestAccess, {
	description: 'inline card forbidden view with request access to object',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(InlineCardForbiddenSiteRequestAccess, {
	description: 'inline card forbidden view with request access to site',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshot(InlineCardForbiddenSiteRequestAccessTruncate, {
	description: 'inline card forbidden view with request access to site and truncation',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshot(InlineCardForbiddenDirectAccess, {
	description: 'inline card forbidden view with direct access',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(InlineCardForbiddenPendingSiteAccess, {
	description: 'inline card forbidden view with pending site access',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(InlineCardForbiddenDeniedSiteAccess, {
	description: 'inline card forbidden view with denied site access',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

// Design refresh: emotion + legacy icon
snapshot(InlineCardForbiddenDefaultIcon, {
	description: 'inline card forbidden view with default legacy icon',
});

// Design refresh: compiled + DS visual refresh
snapshot(InlineCardForbiddenDefaultIcon, {
	description: 'inline card forbidden view with default icon',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-smart-card-icon-migration': true,
		'platform-visual-refresh-icons': true,
		'platform-component-visual-refresh': true,
	},
});

// TODO: Remove on bandicoots-compiled-migration-smartcard cleanup
// Design refresh: compiled + legacy icon
snapshot(InlineCardForbiddenDefaultIcon, {
	description: 'inline card forbidden view with default legacy icon with compiled',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-smart-card-icon-migration': false,
		'platform-visual-refresh-icons': true,
		'platform-component-visual-refresh': true,
	},
});

// TODO: Remove on bandicoots-compiled-migration-smartcard cleanup
// Design refresh: emotion + DS visual refresh
snapshot(InlineCardForbiddenDefaultIcon, {
	description: 'inline card forbidden view with default icon with emotion',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': false,
		'platform-smart-card-icon-migration': true,
		'platform-visual-refresh-icons': true,
		'platform-component-visual-refresh': true,
	},
});

snapshot(InlineCardNotFound, {
	description: `inline card can't find link view`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(InlineCardNotFound, {
	description:
		'inline card not found view renders correctly when hovering over url in not-found view',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-smart-card-icon-migration': [true, false],
	},
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-not-found-view' } }],
});

snapshot(InlineCardNotFoundTruncate, {
	description: `inline card can't find link view with truncation`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshot(InlineCardUnauthorised, {
	description: `inline card unauthorised view`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(InlineCardUnauthorised, {
	description:
		'inline card unauthorised view renders correctly when hovering over url in unauthorized view',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'inline-card-unauthorized-view' },
		},
	],
});

snapshot(InlineCardUnauthorisedTruncate, {
	description: `inline card unauthorised view with truncation`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshot(InlineCardUnauthorised, {
	description: 'inline card unauthorised view renders correctly when hovering over connect account',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
	states: [{ state: 'hovered', selector: { byTestId: 'button-connect-account' } }],
});
snapshot(InlineCardUnauthorisedNoAuth, {
	description: `inline card unauthorised view with no auth`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

// Design refresh: emotion + legacy icon
snapshot(InlineCardUnauthorisedDefaultIcon, {
	description: 'inline card unauthorised view with default legacy icon',
});

// Design refresh: compiled + DS visual refresh
snapshot(InlineCardUnauthorisedDefaultIcon, {
	description: 'inline card unauthorised view with default icon',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-smart-card-icon-migration': true,
		'platform-visual-refresh-icons': true,
		'platform-component-visual-refresh': true,
	},
});

// TODO: Remove on bandicoots-compiled-migration-smartcard cleanup
// Design refresh: compiled + legacy icon
snapshot(InlineCardUnauthorisedDefaultIcon, {
	description: 'inline card unauthorised view with default legacy icon with compiled',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-smart-card-icon-migration': false,
		'platform-visual-refresh-icons': true,
		'platform-component-visual-refresh': true,
	},
});

// TODO: Remove on bandicoots-compiled-migration-smartcard cleanup
// Design refresh: emotion + DS visual refresh
snapshot(InlineCardUnauthorisedDefaultIcon, {
	description: 'inline card unauthorised view with default icon with emotion',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': false,
		'platform-smart-card-icon-migration': true,
		'platform-visual-refresh-icons': true,
		'platform-component-visual-refresh': true,
	},
});

snapshot(InlineCardIcons, {
	description: `inline card icons`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'platform-smart-card-icon-migration': true,
	},
});

snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text`,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'bandicoots-compiled-migration-smartcard': true,
		'platform-smart-card-icon-migration': true,
		'platform-linking-visual-refresh-v1': true,
	},
});

// TODO: Remove on platform-linking-visual-refresh-v1
snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text OLD`,
	featureFlags: {
		'platform-component-visual-refresh': false,
		'bandicoots-compiled-migration-smartcard': false,
		'platform-smart-card-icon-migration': false,
		'platform-linking-visual-refresh-v1': false,
	},
});

// TODO: Remove on platform-linking-visual-refresh-v1
snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text COMPILED ONLY`,
	featureFlags: {
		'platform-component-visual-refresh': false,
		'bandicoots-compiled-migration-smartcard': true,
		'platform-smart-card-icon-migration': false,
		'platform-linking-visual-refresh-v1': false,
	},
});
