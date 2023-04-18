import { ReactNode } from 'react';

import { Group } from './group-selection/types';

export interface LinkCreatePlugin {
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
  key: string;

  /**
   * A renderer function to render the form
   */
  form: ReactNode;
}

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
  onCreate?: (url: string) => void;

  /**
   * This callback for any errors
   */
  onFailure?: (error: unknown) => void;

  /**
   * This callback for when the form was manually discarded by user
   */
  onCancel?: () => void;

  /**
   * This value controls whether the Create Modal should be active or hidden
   * Default: false
   */
  active?: boolean;
}

export interface Option {
  /** html `value` attribute to differentiate options */
  value: string;
  /** This should be properly internationalization-ed */
  label: string;
}
