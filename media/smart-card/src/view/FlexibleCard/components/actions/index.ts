import { ActionName } from '../../../../constants';
import { ActionProps } from './action/types';
import { createUIAction } from './utils';

// Attention: Keep the export name and action name the same.
// This will help reducing the code for mapping action inside
// createAction and renderActionItems

/**
 * Creates a DeleteAction component. Accepts default ActionProps, but defaults
 * the icon to a cross icon.
 * @see Action
 */
export const DeleteAction = createUIAction<ActionProps>(
  ActionName.DeleteAction,
);
/**
 * Creates a EditAction component. Accepts default ActionProps, but defaults
 * the icon to an edit (pencil) icon.
 * @see Action
 */
export const EditAction = createUIAction<ActionProps>(ActionName.EditAction);
/**
 * Creates a CustomAction component. Accepts default ActionProps. Required to provide
 * your own icon or text.
 * @see Action
 */
export const CustomAction = createUIAction<ActionProps>(
  ActionName.CustomAction,
);
