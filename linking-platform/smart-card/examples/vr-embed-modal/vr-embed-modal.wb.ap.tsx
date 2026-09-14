import { wb, type WorkbenchExample } from '@atlassian/workbench';
import VrEmbedModalConfluenceExample from './vr-embed-modal-confluence.vr.ap';
import VrEmbedModalWithFlexibleUiIconExample from './vr-embed-modal-with-flexible-ui-icon.vr.ap';
import VrEmbedModalExample from './vr-embed-modal.vr.ap';

export const VrEmbedModalConfluence: WorkbenchExample = wb(VrEmbedModalConfluenceExample);
export const VrEmbedModalWithFlexibleUiIcon: WorkbenchExample = wb(
	VrEmbedModalWithFlexibleUiIconExample,
);
export const VrEmbedModal: WorkbenchExample = wb(VrEmbedModalExample);
