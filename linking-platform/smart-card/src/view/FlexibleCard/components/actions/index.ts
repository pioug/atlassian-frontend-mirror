import { ActionName } from '../../../../constants';
import { ActionProps } from './action/types';
import { createDataAction, createUIAction } from './utils';
import { ViewActionProps } from './action/view-action/types';

export { default as FollowAction } from './follow-action';
export { default as PreviewAction } from './preview-action';
export { default as DownloadAction } from './download-action';
export { default as EditAction } from './edit-action';
export { default as DeleteAction } from './delete-action';

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
