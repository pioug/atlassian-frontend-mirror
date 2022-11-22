import { ActionName } from '../../../../constants';
import { ActionProps } from './action/types';
import { createDataAction, createUIAction } from './utils';
import { PreviewActionProps } from './action/preview-action/types';
import { ViewActionProps } from './action/view-action/types';
import { DownloadActionProps } from './action/download-action/types';

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
 * Creates a PreviewAction component. Accepts default PreviewActionProps, and defaults
 * to the text 'Preview' inside the button.
 * @see Action
 */
export const PreviewAction = createDataAction<PreviewActionProps>(
  ActionName.PreviewAction,
);

/**
 * Creates a ViewAction component. Accepts default ViewActionProps, and defaults
 * to the text 'View' inside the button.
 * @see Action
 */
export const ViewAction = createDataAction<ViewActionProps>(
  ActionName.ViewAction,
);

/**
 * Creates a DownloadAction component. Accepts default DownloadActionProps, and defaults
 * to the text 'Download' inside the button.
 * @see Action
 */
export const DownloadAction = createDataAction<DownloadActionProps>(
  ActionName.DownloadAction,
);

/**
 * Creates a CustomAction component. Accepts default ActionProps. Required to provide
 * your own icon or text.
 * @see Action
 */
export const CustomAction = createUIAction<ActionProps>(
  ActionName.CustomAction,
);
