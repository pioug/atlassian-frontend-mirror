import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VrEmbedCardErrorExample from './vr-embed-card-error.vr.ap';
import VrEmbedCardForbiddenFixBlurringExample from './vr-embed-card-forbidden-fix-blurring.vr.ap';
import VrEmbedCardForbiddenFrameHideExample from './vr-embed-card-forbidden-frame-hide.vr.ap';
import VrEmbedCardForbiddenObjectRequestAccessExample from './vr-embed-card-forbidden-object-request-access.vr.ap';
import VrEmbedCardForbiddenSiteDeniedAccessExample from './vr-embed-card-forbidden-site-denied-access.vr.ap';
import VrEmbedCardForbiddenSiteDirectAccessExample from './vr-embed-card-forbidden-site-direct-access.vr.ap';
import VrEmbedCardForbiddenSiteForbiddenAccessExample from './vr-embed-card-forbidden-site-forbidden-access.vr.ap';
import VrEmbedCardForbiddenSitePendingAccessExample from './vr-embed-card-forbidden-site-pending-access.vr.ap';
import VrEmbedCardForbiddenSiteRequestAccessExample from './vr-embed-card-forbidden-site-request-access.vr.ap';
import VrEmbedCardForbiddenExample from './vr-embed-card-forbidden.vr.ap';
import VrEmbedCardFrameExample from './vr-embed-card-frame';
import VrEmbedCardFrameStyleHideAndSelectedExample from './vr-embed-card-frame-style-hide-and-selected.vr.ap';
import VrEmbedCardFrameStyleHideExample from './vr-embed-card-frame-style-hide.vr.ap';
import VrEmbedCardFrameStyleShowAndSelectedExample from './vr-embed-card-frame-style-show-and-selected.vr.ap';
import VrEmbedCardFrameStyleShowOnHoverAndSelectedExample from './vr-embed-card-frame-style-show-on-hover-and-selected.vr.ap';
import VrEmbedCardFrameStyleShowOnHoverExample from './vr-embed-card-frame-style-show-on-hover.vr.ap';
import VrEmbedCardFrameStyleShowExample from './vr-embed-card-frame-style-show.vr.ap';
import VrEmbedCardFrameWithHrefExample from './vr-embed-card-frame-with-href.vr.ap';
import VrEmbedCardFrameWithNoHrefExample from './vr-embed-card-frame-with-no-href.vr.ap';
import VrEmbedCardFrameWithNoPlaceholderWithHrefExample from './vr-embed-card-frame-with-no-placeholder-with-href.vr.ap';
import VrEmbedCardFrameWithNoPlaceholderWithOnClickExample from './vr-embed-card-frame-with-no-placeholder-with-on-click.vr.ap';
import VrEmbedCardFrameWithPlaceholderAndHrefExample from './vr-embed-card-frame-with-placeholder-and-href.vr.ap';
import VrEmbedCardFrameWithPlaceholderAndOnClickExample from './vr-embed-card-frame-with-placeholder-and-on-click.vr.ap';
import VrEmbedCardNotFoundFrameHideExample from './vr-embed-card-not-found-frame-hide.vr.ap';
import VrEmbedCardNotFoundSiteAccessExistsExample from './vr-embed-card-not-found-site-access-exists.vr.ap';
import VrEmbedCardNotFoundExample from './vr-embed-card-not-found.vr.ap';
import VrEmbedCardResolvedCompetitorPromptExample from './vr-embed-card-resolved-competitor-prompt.vr.ap';
import VrEmbedCardResolvedEntitiesExample from './vr-embed-card-resolved-entities.vr.ap';
import VrEmbedCardResolvedNoPreviewExample from './vr-embed-card-resolved-no-preview.vr.ap';
import VrEmbedCardResolvedRovoActionsFooterExample from './vr-embed-card-resolved-rovo-actions-footer.vr.ap';
import VrEmbedCardResolvedSmallExample from './vr-embed-card-resolved-small.vr.ap';
import VrEmbedCardResolvedExample from './vr-embed-card-resolved.vr.ap';
import VrEmbedCardResolvingExample from './vr-embed-card-resolving.vr.ap';
import VrEmbedCardSelectedExample from './vr-embed-card-selected.vr.ap';
import VrEmbedCardUnauthorisedFrameHideExample from './vr-embed-card-unauthorised-frame-hide.vr.ap';
import VrEmbedCardUnauthorisedNoAuthExample from './vr-embed-card-unauthorised-no-auth.vr.ap';
import VrEmbedCardUnauthorisedWithProviderImageExample from './vr-embed-card-unauthorised-with-provider-image.vr.ap';
import VrEmbedCardUnauthorisedExample from './vr-embed-card-unauthorised.vr.ap';

export const VrEmbedCardError: WorkbenchExample<typeof VrEmbedCardErrorExample> =
	wb(VrEmbedCardErrorExample);
export const VrEmbedCardForbiddenFixBlurring: WorkbenchExample<
	typeof VrEmbedCardForbiddenFixBlurringExample
> = wb(VrEmbedCardForbiddenFixBlurringExample);
export const VrEmbedCardForbiddenFrameHide: WorkbenchExample<
	typeof VrEmbedCardForbiddenFrameHideExample
> = wb(VrEmbedCardForbiddenFrameHideExample);
export const VrEmbedCardForbiddenObjectRequestAccess: WorkbenchExample<
	typeof VrEmbedCardForbiddenObjectRequestAccessExample
> = wb(VrEmbedCardForbiddenObjectRequestAccessExample);
export const VrEmbedCardForbiddenSiteDeniedAccess: WorkbenchExample<
	typeof VrEmbedCardForbiddenSiteDeniedAccessExample
> = wb(VrEmbedCardForbiddenSiteDeniedAccessExample);
export const VrEmbedCardForbiddenSiteDirectAccess: WorkbenchExample<
	typeof VrEmbedCardForbiddenSiteDirectAccessExample
> = wb(VrEmbedCardForbiddenSiteDirectAccessExample);
export const VrEmbedCardForbiddenSiteForbiddenAccess: WorkbenchExample<
	typeof VrEmbedCardForbiddenSiteForbiddenAccessExample
> = wb(VrEmbedCardForbiddenSiteForbiddenAccessExample);
export const VrEmbedCardForbiddenSitePendingAccess: WorkbenchExample<
	typeof VrEmbedCardForbiddenSitePendingAccessExample
> = wb(VrEmbedCardForbiddenSitePendingAccessExample);
export const VrEmbedCardForbiddenSiteRequestAccess: WorkbenchExample<
	typeof VrEmbedCardForbiddenSiteRequestAccessExample
> = wb(VrEmbedCardForbiddenSiteRequestAccessExample);
export const VrEmbedCardForbidden: WorkbenchExample<typeof VrEmbedCardForbiddenExample> = wb(
	VrEmbedCardForbiddenExample,
);
export const VrEmbedCardFrameStyleHideAndSelected: WorkbenchExample<
	typeof VrEmbedCardFrameStyleHideAndSelectedExample
> = wb(VrEmbedCardFrameStyleHideAndSelectedExample);
export const VrEmbedCardFrameStyleHide: WorkbenchExample<typeof VrEmbedCardFrameStyleHideExample> =
	wb(VrEmbedCardFrameStyleHideExample);
export const VrEmbedCardFrameStyleShowAndSelected: WorkbenchExample<
	typeof VrEmbedCardFrameStyleShowAndSelectedExample
> = wb(VrEmbedCardFrameStyleShowAndSelectedExample);
export const VrEmbedCardFrameStyleShowOnHoverAndSelected: WorkbenchExample<
	typeof VrEmbedCardFrameStyleShowOnHoverAndSelectedExample
> = wb(VrEmbedCardFrameStyleShowOnHoverAndSelectedExample);
export const VrEmbedCardFrameStyleShowOnHover: WorkbenchExample<
	typeof VrEmbedCardFrameStyleShowOnHoverExample
> = wb(VrEmbedCardFrameStyleShowOnHoverExample);
export const VrEmbedCardFrameStyleShow: WorkbenchExample<typeof VrEmbedCardFrameStyleShowExample> =
	wb(VrEmbedCardFrameStyleShowExample);
export const VrEmbedCardFrameWithHref: WorkbenchExample<typeof VrEmbedCardFrameWithHrefExample> =
	wb(VrEmbedCardFrameWithHrefExample);
export const VrEmbedCardFrameWithNoHref: WorkbenchExample<
	typeof VrEmbedCardFrameWithNoHrefExample
> = wb(VrEmbedCardFrameWithNoHrefExample);
export const VrEmbedCardFrameWithNoPlaceholderWithHref: WorkbenchExample<
	typeof VrEmbedCardFrameWithNoPlaceholderWithHrefExample
> = wb(VrEmbedCardFrameWithNoPlaceholderWithHrefExample);
export const VrEmbedCardFrameWithNoPlaceholderWithOnClick: WorkbenchExample<
	typeof VrEmbedCardFrameWithNoPlaceholderWithOnClickExample
> = wb(VrEmbedCardFrameWithNoPlaceholderWithOnClickExample);
export const VrEmbedCardFrameWithPlaceholderAndHref: WorkbenchExample<
	typeof VrEmbedCardFrameWithPlaceholderAndHrefExample
> = wb(VrEmbedCardFrameWithPlaceholderAndHrefExample);
export const VrEmbedCardFrameWithPlaceholderAndOnClick: WorkbenchExample<
	typeof VrEmbedCardFrameWithPlaceholderAndOnClickExample
> = wb(VrEmbedCardFrameWithPlaceholderAndOnClickExample);
export const VrEmbedCardFrame: WorkbenchExample<typeof VrEmbedCardFrameExample> =
	wb(VrEmbedCardFrameExample);
export const VrEmbedCardNotFoundFrameHide: WorkbenchExample<
	typeof VrEmbedCardNotFoundFrameHideExample
> = wb(VrEmbedCardNotFoundFrameHideExample);
export const VrEmbedCardNotFoundSiteAccessExists: WorkbenchExample<
	typeof VrEmbedCardNotFoundSiteAccessExistsExample
> = wb(VrEmbedCardNotFoundSiteAccessExistsExample);
export const VrEmbedCardNotFound: WorkbenchExample<typeof VrEmbedCardNotFoundExample> = wb(
	VrEmbedCardNotFoundExample,
);
export const VrEmbedCardResolvedCompetitorPrompt: WorkbenchExample<
	typeof VrEmbedCardResolvedCompetitorPromptExample
> = wb(VrEmbedCardResolvedCompetitorPromptExample);
export const VrEmbedCardResolvedEntities: WorkbenchExample<
	typeof VrEmbedCardResolvedEntitiesExample
> = wb(VrEmbedCardResolvedEntitiesExample);
export const VrEmbedCardResolvedNoPreview: WorkbenchExample<
	typeof VrEmbedCardResolvedNoPreviewExample
> = wb(VrEmbedCardResolvedNoPreviewExample);
export const VrEmbedCardResolvedRovoActionsFooter: WorkbenchExample<
	typeof VrEmbedCardResolvedRovoActionsFooterExample
> = wb(VrEmbedCardResolvedRovoActionsFooterExample);
export const VrEmbedCardResolvedSmall: WorkbenchExample<typeof VrEmbedCardResolvedSmallExample> =
	wb(VrEmbedCardResolvedSmallExample);
export const VrEmbedCardResolved: WorkbenchExample<typeof VrEmbedCardResolvedExample> = wb(
	VrEmbedCardResolvedExample,
);
export const VrEmbedCardResolving: WorkbenchExample<typeof VrEmbedCardResolvingExample> = wb(
	VrEmbedCardResolvingExample,
);
export const VrEmbedCardSelected: WorkbenchExample<typeof VrEmbedCardSelectedExample> = wb(
	VrEmbedCardSelectedExample,
);
export const VrEmbedCardUnauthorisedFrameHide: WorkbenchExample<
	typeof VrEmbedCardUnauthorisedFrameHideExample
> = wb(VrEmbedCardUnauthorisedFrameHideExample);
export const VrEmbedCardUnauthorisedNoAuth: WorkbenchExample<
	typeof VrEmbedCardUnauthorisedNoAuthExample
> = wb(VrEmbedCardUnauthorisedNoAuthExample);
export const VrEmbedCardUnauthorisedWithProviderImage: WorkbenchExample<
	typeof VrEmbedCardUnauthorisedWithProviderImageExample
> = wb(VrEmbedCardUnauthorisedWithProviderImageExample);
export const VrEmbedCardUnauthorised: WorkbenchExample<typeof VrEmbedCardUnauthorisedExample> = wb(
	VrEmbedCardUnauthorisedExample,
);
