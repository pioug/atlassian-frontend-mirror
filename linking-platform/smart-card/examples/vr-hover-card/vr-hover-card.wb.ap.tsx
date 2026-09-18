import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VrHoverCardActionsExample from './vr-hover-card-actions.vr.ap';
import VrHoverCardCanOpenPositioningExample from './vr-hover-card-can-open-positioning.vr.ap';
import VrHoverCardsEntitiesExample from './vr-hover-cards-entities.vr.ap';
import VrHoverCardsSsrErrorExample from './vr-hover-cards-ssr-error.vr.ap';
import VrHoverCardsSsrLoadingExample from './vr-hover-cards-ssr-loading.vr.ap';
import VrHoverCardsExample from './vr-hover-cards.vr.ap';
import VrUnauthorisedHoverCardsExample from './vr-unauthorised-hover-cards.vr.ap';

export const VrHoverCardActions: WorkbenchExample = wb(VrHoverCardActionsExample);
export const VrHoverCardCanOpenPositioning: WorkbenchExample = wb(
	VrHoverCardCanOpenPositioningExample,
);
export const VrHoverCardsEntities: WorkbenchExample = wb(VrHoverCardsEntitiesExample);
export const VrHoverCardsSsrError: WorkbenchExample = wb(VrHoverCardsSsrErrorExample);
export const VrHoverCardsSsrLoading: WorkbenchExample = wb(VrHoverCardsSsrLoadingExample);
export const VrHoverCards: WorkbenchExample = wb(VrHoverCardsExample);
export const VrUnauthorisedHoverCards: WorkbenchExample = wb(VrUnauthorisedHoverCardsExample);
