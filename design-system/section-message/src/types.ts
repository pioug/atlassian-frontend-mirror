import type { ActionType } from './internal/types';

export type Appearance =
  | 'info'
  | 'warning'
  | 'error'
  | 'confirmation'
  | 'change';

export interface SectionMessageProps {
  /* The appearance styling to use for the section message. */
  appearance?: Appearance;
  /*
    The main content of the section message. This accepts a react node, although
    we recommend that this should be a paragraph.
  */
  children: React.ReactNode;
  /*
    The heading of the section message.
  */
  title?: string;
  /*
    Actions to be taken from the section message. These accept an object which
    are applied to @atlaskit/button components. Middots are automatically added
    between the items. We generally recommend using no more than two actions.
  */
  actions?: Array<ActionType>;
  /*
    An Icon component to be rendered instead of the default icon for the component.
    This should only be an `@atlaskit/icon` icon. You can check out [this example](/packages/design-system/section-message/example/custom-icon)
    to see how to provide this icon.
  */
  icon?: React.ElementType;
  /*
    A custom link component. This prop is designed to allow a custom link
    component to be passed to the link button being rendered by actions. The
    intended use-case is for when a custom router component such as react router
    is being used within the application.

    This component will only be used if a href is passed to the action.

    All actions provided will automatically have the linkcomponent passed to them.
  */
  linkComponent?: React.ComponentType<any>;
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;
}

export interface SectionMessageActionProps extends Exclude<ActionType, 'key'> {
  linkComponent?: React.ComponentType<any>;
}
