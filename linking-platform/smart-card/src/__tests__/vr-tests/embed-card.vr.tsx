import { snapshot } from '@af/visual-regression';

import EmbedCardErrorView from '../../../examples/vr-embed-card/vr-embed-card-error';
import EmbedCardForbiddenView from '../../../examples/vr-embed-card/vr-embed-card-forbidden';
import EmbedCardForbiddenFixBlurring from '../../../examples/vr-embed-card/vr-embed-card-forbidden-fix-blurring';
import EmbedCardForbiddenViewFrameHide from '../../../examples/vr-embed-card/vr-embed-card-forbidden-frame-hide';
import EmbedCardForbiddenObjectRequestAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-object-request-access';
import EmbedCardForbiddenSiteDeniedAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-denied-access';
import EmbedCardForbiddenSiteDirectAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-direct-access';
import EmbedCardForbiddenSiteForbiddenAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-forbidden-access';
import EmbedCardForbiddenSitePendingAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-pending-access';
import EmbedCardForbiddenSiteRequestAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-request-access';
import EmbedCardFrameStyleHide from '../../../examples/vr-embed-card/vr-embed-card-frame-style-hide';
import EmbedCardFrameStyleHideAndSelected from '../../../examples/vr-embed-card/vr-embed-card-frame-style-hide-and-selected';
import EmbedCardFrameStyleShow from '../../../examples/vr-embed-card/vr-embed-card-frame-style-show';
import EmbedCardFrameStyleShowAndSelected from '../../../examples/vr-embed-card/vr-embed-card-frame-style-show-and-selected';
import EmbedCardFrameStyleShowOnHover from '../../../examples/vr-embed-card/vr-embed-card-frame-style-show-on-hover';
import EmbedCardFrameStyleShowOnHoverAndSelected from '../../../examples/vr-embed-card/vr-embed-card-frame-style-show-on-hover-and-selected';
import EmbedCardFrameWithHref from '../../../examples/vr-embed-card/vr-embed-card-frame-with-href';
import EmbedCardFrameWithNoHref from '../../../examples/vr-embed-card/vr-embed-card-frame-with-no-href';
import EmbedCardFrameWithNoPlaceholderWithHref from '../../../examples/vr-embed-card/vr-embed-card-frame-with-no-placeholder-with-href';
import EmbedCardFrameWithNoPlaceholderWithOnClick from '../../../examples/vr-embed-card/vr-embed-card-frame-with-no-placeholder-with-on-click';
import EmbedCardFrameWithPlaceholderAndHref from '../../../examples/vr-embed-card/vr-embed-card-frame-with-placeholder-and-href';
import EmbedCardFrameWithPlaceholderAndOnClick from '../../../examples/vr-embed-card/vr-embed-card-frame-with-placeholder-and-on-click';
import EmbedCardNotFoundView from '../../../examples/vr-embed-card/vr-embed-card-not-found';
import EmbedCardNotFoundViewFrameHide from '../../../examples/vr-embed-card/vr-embed-card-not-found-frame-hide';
import EmbedCardNotFoundSiteAccessExists from '../../../examples/vr-embed-card/vr-embed-card-not-found-site-access-exists';
import EmbedCardResolvedView from '../../../examples/vr-embed-card/vr-embed-card-resolved';
import EmbedCardResolvedViewCompetitorPrompt from '../../../examples/vr-embed-card/vr-embed-card-resolved-competitor-prompt';
import EmbedCardResolvedViewEntities from '../../../examples/vr-embed-card/vr-embed-card-resolved-entities';
import EmbedCardResolvedViewNoPreview from '../../../examples/vr-embed-card/vr-embed-card-resolved-no-preview';
import EmbedCardResolvedSmall from '../../../examples/vr-embed-card/vr-embed-card-resolved-small';
import EmbedCardResolvingView from '../../../examples/vr-embed-card/vr-embed-card-resolving';
import EmbedCardSelected from '../../../examples/vr-embed-card/vr-embed-card-selected';
import EmbedCardUnauthorisedView from '../../../examples/vr-embed-card/vr-embed-card-unauthorised';
import EmbedCardUnauthorisedViewFrameHide from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-frame-hide';
import EmbedCardUnauthorisedViewWithNoAuth from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-no-auth';
import EmbedCardUnauthorisedViewWithProviderImage from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-with-provider-image';
import { VREmbedProfileObject } from '../../../examples/vr-embed-card/vr-embed-profile-object';

const EmbedCardForbiddenDefault = EmbedCardForbiddenView;
const EmbedCardNotFoundDefault = EmbedCardNotFoundView;

snapshot(EmbedCardErrorView, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardForbiddenView, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardForbiddenFixBlurring, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardForbiddenDefault, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardForbiddenObjectRequestAccess, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardForbiddenSiteDeniedAccess, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardForbiddenSiteDirectAccess, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardForbiddenSiteForbiddenAccess, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardForbiddenSitePendingAccess, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardForbiddenSiteRequestAccess, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardNotFoundView, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardNotFoundDefault, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardNotFoundSiteAccessExists, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardResolvedSmall, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardResolvedView, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardResolvedView, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		prompt_whiteboard_competitor_link_gate: [true, false],
	},
});
snapshot(EmbedCardResolvedViewCompetitorPrompt, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		prompt_whiteboard_competitor_link_gate: [true, false],
	},
});
snapshot(EmbedCardResolvedViewNoPreview, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardResolvingView, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardSelected, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardUnauthorisedView, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardUnauthorisedViewWithProviderImage, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardUnauthorisedViewWithNoAuth, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});

snapshot(EmbedCardFrameWithHref, {
	description: 'embed card frame should render as a link when there is an href',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardFrameWithNoHref, {
	description: 'embed card frame should not render as a link when there is no href',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardFrameWithPlaceholderAndHref, {
	description:
		'embed card frame should not be interactive when isPlaceholder=true and href is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardFrameWithPlaceholderAndOnClick, {
	description:
		'embed card frame should not be interactive when isPlaceholder=true and onClick is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardFrameWithNoPlaceholderWithHref, {
	description:
		'embed card frame should be interactive when isPlaceholder=false and href is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardFrameWithNoPlaceholderWithOnClick, {
	description:
		'embed card frame should be interactive when isPlaceholder=false and onClick is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});

snapshot(EmbedCardFrameStyleHide, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardFrameStyleHideAndSelected, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardFrameStyleShow, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardFrameStyleShowAndSelected, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardFrameStyleShowOnHover, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardFrameStyleShowOnHover, {
	description: 'embed card frame style show on hover when hover',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardFrameStyleShowOnHoverAndSelected, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardForbiddenViewFrameHide, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardNotFoundViewFrameHide, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardUnauthorisedViewFrameHide, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});
snapshot(EmbedCardResolvedViewEntities, {
	featureFlags: {
		smart_links_noun_support: true,
	},
});
snapshot(VREmbedProfileObject, {
	featureFlags: {
		'platform-linking-visual-refresh-v2': true,
	},
});
