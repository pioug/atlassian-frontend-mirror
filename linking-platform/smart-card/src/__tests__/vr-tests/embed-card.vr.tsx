import { snapshot } from '@af/visual-regression';

import EmbedCardErrorView from '../../../examples/vr-embed-card/vr-embed-card-error.vr.ap';
import EmbedCardForbiddenFixBlurring from '../../../examples/vr-embed-card/vr-embed-card-forbidden-fix-blurring.vr.ap';
import EmbedCardForbiddenViewFrameHide from '../../../examples/vr-embed-card/vr-embed-card-forbidden-frame-hide.vr.ap';
import EmbedCardForbiddenObjectRequestAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-object-request-access.vr.ap';
import EmbedCardForbiddenSiteDeniedAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-denied-access.vr.ap';
import EmbedCardForbiddenSiteDirectAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-direct-access.vr.ap';
import EmbedCardForbiddenSiteForbiddenAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-forbidden-access.vr.ap';
import EmbedCardForbiddenSitePendingAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-pending-access.vr.ap';
import EmbedCardForbiddenSiteRequestAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-request-access.vr.ap';
import EmbedCardForbiddenView from '../../../examples/vr-embed-card/vr-embed-card-forbidden.vr.ap';
import EmbedCardFrameStyleHideAndSelected from '../../../examples/vr-embed-card/vr-embed-card-frame-style-hide-and-selected.vr.ap';
import EmbedCardFrameStyleHide from '../../../examples/vr-embed-card/vr-embed-card-frame-style-hide.vr.ap';
import EmbedCardFrameStyleShowAndSelected from '../../../examples/vr-embed-card/vr-embed-card-frame-style-show-and-selected.vr.ap';
import EmbedCardFrameStyleShowOnHoverAndSelected from '../../../examples/vr-embed-card/vr-embed-card-frame-style-show-on-hover-and-selected.vr.ap';
import EmbedCardFrameStyleShowOnHover from '../../../examples/vr-embed-card/vr-embed-card-frame-style-show-on-hover.vr.ap';
import EmbedCardFrameStyleShow from '../../../examples/vr-embed-card/vr-embed-card-frame-style-show.vr.ap';
import EmbedCardFrameWithHref from '../../../examples/vr-embed-card/vr-embed-card-frame-with-href.vr.ap';
import EmbedCardFrameWithNoHref from '../../../examples/vr-embed-card/vr-embed-card-frame-with-no-href.vr.ap';
import EmbedCardFrameWithNoPlaceholderWithHref from '../../../examples/vr-embed-card/vr-embed-card-frame-with-no-placeholder-with-href.vr.ap';
import EmbedCardFrameWithNoPlaceholderWithOnClick from '../../../examples/vr-embed-card/vr-embed-card-frame-with-no-placeholder-with-on-click.vr.ap';
import EmbedCardFrameWithPlaceholderAndHref from '../../../examples/vr-embed-card/vr-embed-card-frame-with-placeholder-and-href.vr.ap';
import EmbedCardFrameWithPlaceholderAndOnClick from '../../../examples/vr-embed-card/vr-embed-card-frame-with-placeholder-and-on-click.vr.ap';
import EmbedCardNotFoundViewFrameHide from '../../../examples/vr-embed-card/vr-embed-card-not-found-frame-hide.vr.ap';
import EmbedCardNotFoundSiteAccessExists from '../../../examples/vr-embed-card/vr-embed-card-not-found-site-access-exists.vr.ap';
import EmbedCardNotFoundView from '../../../examples/vr-embed-card/vr-embed-card-not-found.vr.ap';
import EmbedCardResolvedViewCompetitorPrompt from '../../../examples/vr-embed-card/vr-embed-card-resolved-competitor-prompt.vr.ap';
import EmbedCardResolvedViewEntities from '../../../examples/vr-embed-card/vr-embed-card-resolved-entities.vr.ap';
import EmbedCardResolvedViewNoPreview from '../../../examples/vr-embed-card/vr-embed-card-resolved-no-preview.vr.ap';
import VREmbedCardResolvedRovoActionsFooter, {
	VREmbedCardResolvedRovoActionsFooterDisabled,
	VREmbedCardResolvedRovoActionsFooterExperimentOff,
	VREmbedCardResolvedRovoActionsFooterKillSwitchOff,
} from '../../../examples/vr-embed-card/vr-embed-card-resolved-rovo-actions-footer.vr.ap';
import EmbedCardResolvedSmall from '../../../examples/vr-embed-card/vr-embed-card-resolved-small.vr.ap';
import EmbedCardResolvedView from '../../../examples/vr-embed-card/vr-embed-card-resolved.vr.ap';
import EmbedCardResolvingView from '../../../examples/vr-embed-card/vr-embed-card-resolving.vr.ap';
import EmbedCardSelected from '../../../examples/vr-embed-card/vr-embed-card-selected.vr.ap';
import EmbedCardUnauthorisedViewFrameHide from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-frame-hide.vr.ap';
import EmbedCardUnauthorisedViewWithNoAuth from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-no-auth.vr.ap';
import EmbedCardUnauthorisedViewWithProviderImage from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-with-provider-image.vr.ap';
import EmbedCardUnauthorisedView from '../../../examples/vr-embed-card/vr-embed-card-unauthorised.vr.ap';
import {
	EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide1,
	EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide2,
	EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide3,
	EmbedCardUnauthorizedCarouselFigmaInTrelloSlide1,
	EmbedCardUnauthorizedCarouselFigmaInTrelloSlide2,
	EmbedCardUnauthorizedCarouselFigmaInTrelloSlide3,
	EmbedCardUnauthorizedCarouselDropboxInAtlasSlide1,
} from '../../../examples/vr-embed-card/vr-embed-card-unauthorized-carousel.vr.ap';
import { VREmbedProfileObject } from '../../../examples/vr-embed-card/vr-embed-profile-object.vr.ap';

const EmbedCardForbiddenDefault = EmbedCardForbiddenView;
const EmbedCardNotFoundDefault = EmbedCardNotFoundView;

snapshot(EmbedCardErrorView);
snapshot(EmbedCardForbiddenView);
snapshot(EmbedCardForbiddenFixBlurring);
snapshot(EmbedCardForbiddenDefault);
snapshot(EmbedCardForbiddenObjectRequestAccess);
snapshot(EmbedCardForbiddenSiteDeniedAccess);
snapshot(EmbedCardForbiddenSiteDirectAccess);
snapshot(EmbedCardForbiddenSiteForbiddenAccess);
snapshot(EmbedCardForbiddenSitePendingAccess);
snapshot(EmbedCardForbiddenSiteRequestAccess);
snapshot(EmbedCardNotFoundView);
snapshot(EmbedCardNotFoundDefault);
snapshot(EmbedCardNotFoundSiteAccessExists);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(EmbedCardResolvedSmall);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(EmbedCardResolvedView);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(EmbedCardResolvedViewCompetitorPrompt);
snapshot(EmbedCardResolvedViewNoPreview);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(VREmbedCardResolvedRovoActionsFooter, {
	description: 'embed card resolved view with Rovo actions footer FG on EXP on',
});
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(VREmbedCardResolvedRovoActionsFooterExperimentOff, {
	description: 'embed card resolved view with Rovo actions footer FG on EXP off',
});
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(VREmbedCardResolvedRovoActionsFooterKillSwitchOff, {
	description: 'embed card resolved view with Rovo actions footer FG off EXP on',
});
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(VREmbedCardResolvedRovoActionsFooterDisabled, {
	description: 'embed card resolved view with Rovo actions footer FG off EXP off',
});
snapshot(EmbedCardResolvingView);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(EmbedCardSelected);
snapshot(EmbedCardUnauthorisedView);
snapshot(EmbedCardUnauthorisedViewWithProviderImage);
snapshot(EmbedCardUnauthorisedViewWithNoAuth);
snapshot(EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide1);
snapshot(EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide2);
snapshot(EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide3);
snapshot(EmbedCardUnauthorizedCarouselFigmaInTrelloSlide1);
snapshot(EmbedCardUnauthorizedCarouselFigmaInTrelloSlide2);
snapshot(EmbedCardUnauthorizedCarouselFigmaInTrelloSlide3);
snapshot(EmbedCardUnauthorizedCarouselDropboxInAtlasSlide1);

snapshot(EmbedCardFrameWithHref, {
	description: 'embed card frame should render as a link when there is an href',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
});
snapshot(EmbedCardFrameWithNoHref, {
	description: 'embed card frame should not render as a link when there is no href',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
});
snapshot(EmbedCardFrameWithPlaceholderAndHref, {
	description:
		'embed card frame should not be interactive when isPlaceholder=true and href is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
});
snapshot(EmbedCardFrameWithPlaceholderAndOnClick, {
	description:
		'embed card frame should not be interactive when isPlaceholder=true and onClick is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
});
snapshot(EmbedCardFrameWithNoPlaceholderWithHref, {
	description:
		'embed card frame should be interactive when isPlaceholder=false and href is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
});
snapshot(EmbedCardFrameWithNoPlaceholderWithOnClick, {
	description:
		'embed card frame should be interactive when isPlaceholder=false and onClick is defined',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
});

snapshot(EmbedCardFrameStyleHide);
snapshot(EmbedCardFrameStyleHideAndSelected);
snapshot(EmbedCardFrameStyleShow);
snapshot(EmbedCardFrameStyleShowAndSelected);
snapshot(EmbedCardFrameStyleShowOnHover);
snapshot(EmbedCardFrameStyleShowOnHover, {
	description: 'embed card frame style show on hover when hover',
	states: [{ selector: { byTestId: 'vr-embed-card-frame' }, state: 'hovered' }],
});
snapshot(EmbedCardFrameStyleShowOnHoverAndSelected);
snapshot(EmbedCardForbiddenViewFrameHide);
snapshot(EmbedCardNotFoundViewFrameHide);
snapshot(EmbedCardUnauthorisedViewFrameHide);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(EmbedCardResolvedViewEntities);
snapshot(VREmbedProfileObject);
