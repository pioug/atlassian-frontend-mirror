import { ActionName } from '../../../../constants';
import { ActionProps } from './action/types';
import { createUIAction } from './utils';

// Attention: Keep the export name and action name the same.
// This will help reducing the code for mapping action inside
// createAction and renderActionItems
// UIActions infer that you do not need to get any data from the context.
// DataActions infer that the action depends on the data from the context.
export const DeleteAction = createUIAction<ActionProps>(
  ActionName.DeleteAction,
);
