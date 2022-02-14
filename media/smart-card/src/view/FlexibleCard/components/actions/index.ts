import { ActionName } from '../../../../constants';
import { createAction } from './utils';
import { ActionProps } from './types';

// Attention: Keep the export name and action name the same.
// This will help reducing the code for mapping action inside
// createAction and renderActionItems
export const DeleteAction = createAction<ActionProps>(ActionName.DeleteAction);
