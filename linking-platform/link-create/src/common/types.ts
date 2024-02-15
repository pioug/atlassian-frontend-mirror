import { ReactNode } from 'react';

import { ModalDialogProps } from '@atlaskit/modal-dialog';

/** Map of field names to a list of validators for that field */
export type ValidatorMap = Record<string, Validator[]>;

export type Validator = {
  /** Return true when the given input is valid */
  isValid: (val: unknown) => boolean;
  /** An error message is used to tell a user that the field input is invalid. For example, an error message could be 'Invalid username, needs to be more than 4 characters'. */
  errorMessage: string;
};

export interface Group {
  /**
   * A label to display for the Group
   */
  label: string;

  /**
   * An icon to display for the Group
   */
  icon: string;

  /**
   * A unique key for the Group
   */
  key: string;
}

export type EditViewProps = {
  /**
   * The payload returned from the create function
   */
  payload: CreatePayload;
  /**
   * Function for the plugin to call when it signals to be closed
   */
  onClose: () => void;
};

export interface LinkCreatePlugin<Key = string> {
  /**
   * The Group that this plugin entity belongs to
   */
  group: Group;

  /**
   * A label to display for the plugin entity
   */
  label: string;

  /**
   * An icon to display for the plugin entity
   */
  icon: string;

  /**
   * A unique key for the plugin entity
   */
  key: Key;

  /**
   * A renderer function to render the form
   */
  form: ReactNode;

  /**
   * The post create edit view to be rendered after edit button is clicked.
   */
  editView?: ({ payload, onClose }: EditViewProps) => JSX.Element;
}

/** The object that is returned on successful callback of create function*/
export type CreatePayload = {
  /** The url to the resource created by the create plugin */
  url: string;
  /**
   * ARI of the created resource.
   * https://developer.atlassian.com/platform/atlassian-resource-identifier/spec/ari-latest/
   *
   * It should be returned but it's not required to be on the Jira side:
   * https://stash.atlassian.com/projects/JIRACLOUD/repos/jira-frontend/browse/src/packages/issue-create/issue-create-embed/src/ui/index.tsx
   * https://stash.atlassian.com/projects/JIRACLOUD/repos/jira-frontend/pull-requests/103587/overview?commentId=5778323
   */
  ari?: string | undefined;

  /** The object identifier for the resource created by the create plugin (for analytics) */
  objectId: string;
  /** The type of object created (for analytics) */
  objectType: string;
  /** The raw object returned from the create plugin */
  data?: Record<string, unknown>;
};

export interface LinkCreateProps {
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;

  plugins: LinkCreatePlugin[];

  /**
   * The initial group key for create. If this is provided, it will jump
   * directly to the entity selection screen
   */
  groupKey?: string;

  /**
   * The initial entity name for create. If this is provided, it will jump
   * directly to the entity creation form.
   * Note: it will be non-optional for now and can move to optional when we have
   * the meta creation flow built.
   */
  entityKey: string;

  /**
   * This callback for when the resource has been successfully created.
   */
  onCreate?: (payload: CreatePayload) => Promise<void> | void;

  /**
   * This callback for when the LinkCreate experience has successfully been completed.
   * Note: this callback is one of the requirements to enable the LinkCreate
   * post-create edit functionality
   */
  onComplete?: () => void;

  /**
   * This callback for any errors
   */
  onFailure?: (error: unknown) => void;

  /**
   * This callback for when the form was manually discarded by user
   */
  onCancel?: () => void;

  /**
   * This value tells where the linkCreate was triggered from. And it's for
   * analytic purpose only.
   * Default: unknown
   */
  triggeredFrom?: string;
}

export interface LinkCreateWithModalProps extends LinkCreateProps {
  /**
   * This value controls whether the Create Modal should be active or hidden
   * Default: false
   */
  active?: boolean;
  /**
   * A title for the LinkCreate with Modal component
   * Default: Create new
   */
  modalTitle?: string;
  /**
   * Callback function called when the final link create experience dialog has finished closing.
   * @see {@link https://atlassian.design/components/modal-dialog/code#ModalWrapper-onCloseComplete}
   */
  onCloseComplete?: ModalDialogProps['onCloseComplete'];
  /**
   * Callback function called when the link create experience dialog has finished opening.
   *  @see {@link https://atlassian.design/components/modal-dialog/code#ModalWrapper-onOpenComplete}
   */
  onOpenComplete?: ModalDialogProps['onOpenComplete'];
}
