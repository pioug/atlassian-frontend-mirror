import { ActionName } from '../../../../constants';
import { ActionProps } from './action/types';
import { createDataAction, createUIAction } from './utils';
import { ViewActionProps } from './action/view-action/types';

export { default as FollowAction } from './follow-action';
export { default as PreviewAction } from './preview-action';
export { default as DownloadAction } from './download-action';

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
 * Creates a ViewAction component. Accepts default ViewActionProps, and defaults
 * to the text 'View' inside the button.
 * @see Action
 */
export const ViewAction = createDataAction<ViewActionProps>(
  ActionName.ViewAction,
);

/**
 * Creates a CustomAction component. Accepts default ActionProps. Required to provide
 * your own icon or text.
 * @see Action
 */
export const CustomAction = createUIAction<ActionProps>(
  ActionName.CustomAction,
);
