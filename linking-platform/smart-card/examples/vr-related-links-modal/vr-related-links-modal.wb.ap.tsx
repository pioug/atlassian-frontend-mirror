import { wb, type WorkbenchExample } from '@atlassian/workbench';
import VrRelatedLinksModalErroredViewExample from './vr-related-links-modal-errored-view.vr.ap';
import VrRelatedLinksModalResolvedViewEmptyOutgoingExample from './vr-related-links-modal-resolved-view-empty-outgoing.vr.ap';
import VrRelatedLinksModalResolvedViewExample from './vr-related-links-modal-resolved-view.vr.ap';
import VrRelatedLinksModalResolvingViewExample from './vr-related-links-modal-resolving-view.vr.ap';
import VrRelatedLinksModalUnavailableViewExample from './vr-related-links-modal-unavailable-view.vr.ap';
import VrRelatedLinksModalExample from './vr-related-links-modal.vr.ap';

export const VrRelatedLinksModalErroredView: WorkbenchExample = wb(
	VrRelatedLinksModalErroredViewExample,
);
export const VrRelatedLinksModalResolvedViewEmptyOutgoing: WorkbenchExample = wb(
	VrRelatedLinksModalResolvedViewEmptyOutgoingExample,
);
export const VrRelatedLinksModalResolvedView: WorkbenchExample = wb(
	VrRelatedLinksModalResolvedViewExample,
);
export const VrRelatedLinksModalResolvingView: WorkbenchExample = wb(
	VrRelatedLinksModalResolvingViewExample,
);
export const VrRelatedLinksModalUnavailableView: WorkbenchExample = wb(
	VrRelatedLinksModalUnavailableViewExample,
);
export const VrRelatedLinksModal: WorkbenchExample = wb(VrRelatedLinksModalExample);
