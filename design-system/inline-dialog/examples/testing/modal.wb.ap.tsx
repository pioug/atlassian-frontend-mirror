import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ModalExample from '../06-modal';

export const Modal: WorkbenchExample<typeof ModalExample> = wb(ModalExample);
