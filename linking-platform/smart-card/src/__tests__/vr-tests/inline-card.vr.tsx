import { snapshot } from '@af/visual-regression';

import VRInlineCardAllExamplesInText from '../../../examples/vr-inline-card/vr-inline-card-all-examples-in-text';
import InlineCardDefault from '../../../examples/vr-inline-card/vr-inline-card-default-icon';
import InlineCardDefaultTruncate from '../../../examples/vr-inline-card/vr-inline-card-default-truncate';
import InlineCardError from '../../../examples/vr-inline-card/vr-inline-card-error';
import InlineCardErrorTruncate from '../../../examples/vr-inline-card/vr-inline-card-error-truncate';
import InlineCardFontSize16 from '../../../examples/vr-inline-card/vr-inline-card-font-size-16';
import InlineCardFontSize24 from '../../../examples/vr-inline-card/vr-inline-card-font-size-24';
import InlineCardFontSize32 from '../../../examples/vr-inline-card/vr-inline-card-font-size-32';
import InlineCardFontSizeDefault from '../../../examples/vr-inline-card/vr-inline-card-font-size-default';
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
import InlineCardUnresolvedActionWordWrap from '../../../examples/vr-inline-card/vr-inline-card-unresolved-action-word-wrap';

snapshot(InlineCardDefault, {
	description: 'inline card with default icon',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
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
		'bandicoots-compiled-migration-smartcard': true,
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
		'bandicoots-compiled-migration-smartcard': true,
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
		'bandicoots-compiled-migration-smartcard': true,
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
		'bandicoots-compiled-migration-smartcard': true,
	},
});
snapshot(InlineCardError, {
	description: 'inline card error view renders correctly when hovering over url in errored view',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-errored-view' } }],
});
snapshot(InlineCardErrorTruncate, {
	description: 'inline card error view with truncation',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});
snapshot(InlineCardForbidden, {
	description: 'inline card forbidden view',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'bandicoots-compiled-migration-smartcard': true,
	},
});
snapshot(InlineCardForbidden, {
	description:
		'inline card forbidden view renders correctly when hovering over url in forbidden view',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-forbidden-view' } }],
});

snapshot(InlineCardForbiddenTruncate, {
	description: 'inline card forbidden view with truncation',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardForbiddenRequestAccess, {
	description: 'inline card forbidden view with request access to object',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});
snapshot(InlineCardForbiddenSiteRequestAccess, {
	description: 'inline card forbidden view with request access to site',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardForbiddenSiteRequestAccessTruncate, {
	description: 'inline card forbidden view with request access to site and truncation',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardForbiddenDirectAccess, {
	description: 'inline card forbidden view with direct access',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});
snapshot(InlineCardForbiddenPendingSiteAccess, {
	description: 'inline card forbidden view with pending site access',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});
snapshot(InlineCardForbiddenDeniedSiteAccess, {
	description: 'inline card forbidden view with denied site access',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});

// Design refresh: emotion + legacy icon
snapshot(InlineCardForbiddenDefaultIcon, {
	description: 'inline card forbidden view with default legacy icon',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});

// Design refresh: compiled + DS visual refresh
snapshot(InlineCardForbiddenDefaultIcon, {
	description: 'inline card forbidden view with default icon',
	featureFlags: {
		'platform-smart-card-icon-migration': true,
		'platform-visual-refresh-icons': true,
		'platform-component-visual-refresh': true,
		'bandicoots-compiled-migration-smartcard': true,
	},
});
snapshot(InlineCardNotFound, {
	description: `inline card can't find link view`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});
snapshot(InlineCardNotFound, {
	description:
		'inline card not found view renders correctly when hovering over url in not-found view',
	featureFlags: {
		'platform-smart-card-icon-migration': [true, false],
		'bandicoots-compiled-migration-smartcard': true,
	},
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-not-found-view' } }],
});

snapshot(InlineCardNotFoundTruncate, {
	description: `inline card can't find link view with truncation`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardUnauthorised, {
	description: `inline card unauthorised view`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});
snapshot(InlineCardUnauthorised, {
	description:
		'inline card unauthorised view renders correctly when hovering over url in unauthorized view',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
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
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardUnauthorised, {
	description: 'inline card unauthorised view renders correctly when hovering over connect account',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
	states: [{ state: 'hovered', selector: { byTestId: 'button-connect-account' } }],
});
snapshot(InlineCardUnauthorisedNoAuth, {
	description: `inline card unauthorised view with no auth`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardFontSizeDefault, {
	description: 'inline card with default font size',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardFontSize32, {
	description: 'inline card with 32 font size',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardFontSize24, {
	description: 'inline card with 24 font size',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardFontSize16, {
	description: 'inline card with 16 font size',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardUnresolvedActionWordWrap, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
		'bandicoots-compiled-migration-smartcard': true,
	},
});

// Design refresh: emotion + legacy icon
snapshot(InlineCardUnauthorisedDefaultIcon, {
	description: 'inline card unauthorised view with default legacy icon',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
	},
});

// Design refresh: compiled + DS visual refresh
snapshot(InlineCardUnauthorisedDefaultIcon, {
	description: 'inline card unauthorised view with default icon',
	featureFlags: {
		'platform-smart-card-icon-migration': true,
		'platform-visual-refresh-icons': true,
		'platform-component-visual-refresh': true,
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(InlineCardIcons, {
	description: `inline card icons`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'platform-smart-card-icon-migration': true,
		'bandicoots-compiled-migration-smartcard': true,
	},
});

snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text`,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-smart-card-icon-migration': true,
		'platform-linking-visual-refresh-v1': true,
		'bandicoots-compiled-migration-smartcard': true,
	},
});

// TODO: Remove on platform-linking-visual-refresh-v1
snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text OLD`,
	featureFlags: {
		'platform-component-visual-refresh': false,
		'platform-smart-card-icon-migration': false,
		'platform-linking-visual-refresh-v1': false,
		'bandicoots-compiled-migration-smartcard': true,
	},
});

// TODO: Remove on platform-linking-visual-refresh-v1
snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text COMPILED ONLY`,
	featureFlags: {
		'platform-component-visual-refresh': false,
		'platform-smart-card-icon-migration': false,
		'platform-linking-visual-refresh-v1': false,
		'bandicoots-compiled-migration-smartcard': true,
	},
});
