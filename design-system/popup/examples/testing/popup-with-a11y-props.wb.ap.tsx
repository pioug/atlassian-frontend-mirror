import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PopupWithA11yPropsExample from '../16-popup-with-a11y-props';

export const PopupWithA11yProps: WorkbenchExample<typeof PopupWithA11yPropsExample> =
	wb(PopupWithA11yPropsExample);
