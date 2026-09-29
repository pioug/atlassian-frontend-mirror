import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ModalOverPopupExample from '../01-modal-over-popup';

export const ModalOverPopup: WorkbenchExample<typeof ModalOverPopupExample> =
	wb(ModalOverPopupExample);
