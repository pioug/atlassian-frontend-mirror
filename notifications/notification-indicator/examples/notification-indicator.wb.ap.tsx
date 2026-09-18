import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './00-basic';
import NotificationsExample from './10-notifications';

export const Basic: WorkbenchExample = wb(BasicExample);
export const Notifications: WorkbenchExample = wb(NotificationsExample);
