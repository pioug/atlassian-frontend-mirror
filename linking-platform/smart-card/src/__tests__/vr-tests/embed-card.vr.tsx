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
import EmbedCardResolvedViewNoPreview from '../../../examples/vr-embed-card/vr-embed-card-resolved-no-preview';
import EmbedCardResolvingView from '../../../examples/vr-embed-card/vr-embed-card-resolving';
import EmbedCardSelected from '../../../examples/vr-embed-card/vr-embed-card-selected';
import EmbedCardUnauthorisedView from '../../../examples/vr-embed-card/vr-embed-card-unauthorised';
import EmbedCardUnauthorisedViewFrameHide from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-frame-hide';
import EmbedCardUnauthorisedViewWithNoAuth from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-no-auth';
import EmbedCardUnauthorisedViewWithProviderImage from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-with-provider-image';

const EmbedCardForbiddenDefault = EmbedCardForbiddenView;
const EmbedCardNotFoundDefault = EmbedCardNotFoundView;

snapshot(EmbedCardErrorView, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardForbiddenView, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardForbiddenFixBlurring, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardForbiddenDefault, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardForbiddenObjectRequestAccess, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardForbiddenSiteDeniedAccess, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardForbiddenSiteDirectAccess, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardForbiddenSiteForbiddenAccess, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardForbiddenSitePendingAccess, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardForbiddenSiteRequestAccess, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardNotFoundView, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardNotFoundDefault, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardNotFoundSiteAccessExists, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardResolvedView, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardResolvedViewNoPreview, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardResolvingView, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardSelected, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardUnauthorisedView, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardUnauthorisedViewWithProviderImage, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardUnauthorisedViewWithNoAuth, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshot(EmbedCardFrameWithHref, {
	description: 'embed card frame should render as a link when there is an href',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameWithNoHref, {
	description: 'embed card frame should not render as a link when there is no href',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameWithPlaceholderAndHref, {
	description:
		'embed card frame should not be interactive when isPlaceholder=true and href is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameWithPlaceholderAndOnClick, {
	description:
		'embed card frame should not be interactive when isPlaceholder=true and onClick is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameWithNoPlaceholderWithHref, {
	description:
		'embed card frame should be interactive when isPlaceholder=false and href is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameWithNoPlaceholderWithOnClick, {
	description:
		'embed card frame should be interactive when isPlaceholder=false and onClick is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshot(EmbedCardFrameStyleHide, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameStyleHideAndSelected, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameStyleShow, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameStyleShowAndSelected, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameStyleShowOnHover, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameStyleShowOnHover, {
	description: 'embed card frame style show on hover when hover',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardFrameStyleShowOnHoverAndSelected, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardForbiddenViewFrameHide, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardNotFoundViewFrameHide, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshot(EmbedCardUnauthorisedViewFrameHide, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
