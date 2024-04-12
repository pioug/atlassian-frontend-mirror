import { ActionName } from '../../../../constants';
import { ViewActionProps } from './action/view-action/types';
import { createDataAction } from './utils';

export { default as CustomAction } from './action';

export { default as DeleteAction } from './delete-action';
export { default as EditAction } from './edit-action';

export { default as DownloadAction } from './download-action';
export { default as FollowAction } from './follow-action';
export { default as PreviewAction } from './preview-action';

/**
 * Creates a ViewAction component. Accepts default ViewActionProps, and defaults
 * to the text 'View' inside the button.
 * @see Action
 */
export const ViewAction = createDataAction<ViewActionProps>(
  ActionName.ViewAction,
);
