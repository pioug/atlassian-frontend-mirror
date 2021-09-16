import React, { ComponentType, MouseEvent, ReactNode } from 'react';

import { Actions } from '../types';

import SpotlightInner from './spotlight-inner';
import { SpotlightConsumer } from './spotlight-manager';

export interface SpotlightProps {
  /**
   * Buttons to render in the footer
   */
  actions?: Actions;
  /**
   * An optional node to be rendered beside the footer actions
   */
  actionsBeforeElement?: ReactNode;
  /**
   * The elements rendered in the modal
   */
  children?: ReactNode;
  /**
   * Where the dialog should appear, relative to the contents of the children.
   */
  dialogPlacement?:
    | 'top left'
    | 'top center'
    | 'top right'
    | 'right top'
    | 'right middle'
    | 'right bottom'
    | 'bottom left'
    | 'bottom center'
    | 'bottom right'
    | 'left top'
    | 'left middle'
    | 'left bottom';
  /**
   * The width of the dialog in pixels. Min 160 - Max 600
   */
  dialogWidth?: number;
  /**
   * Optional element rendered below the body
   */
  footer?: ComponentType<any>;
  /**
   * Optional element rendered above the body
   */
  header?: ComponentType<any>;
  /**
   * Heading text rendered above the body
   */
  heading?: string;
  /**
   * An optional element rendered to the right of the heading
   */
  headingAfterElement?: ReactNode;
  /**
   * Path to the the your image
   */
  image?: string;
  /**
   * Whether or not to display a pulse animation around the spotlighted element
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  pulse?: boolean;
  /**
   * The name of the SpotlightTarget
   */
  target?: string;
  /**
   * The spotlight target node
   */
  targetNode?: HTMLElement;
  /**
   * The background color of the element being highlighted
   */
  targetBgColor?: string;
  /**
   * Function to fire when a user clicks on the cloned target
   */
  targetOnClick?: (eventData: {
    event: MouseEvent<HTMLElement>;
    target?: string;
  }) => void;
  /**
   * The border-radius of the element being highlighted
   */
  targetRadius?: number;
  /**
   * Alternative element to render than the wrapped target
   */
  targetReplacement?: ComponentType<any>;
  /**
   * This prop is a unique string that appears as an attribute `data-testid` in the rendered HTML output serving as a hook for automated tests.
   * As this component is composed of multiple components we use this `testId` as a prefix:
   *
   * - `"${testId}--dialog"` to identify the spotlight dialog
   * - `"${testId}--target"` to identify the spotlight target clone
   *
   * Defaults to `"spotlight"`.
   */
  testId?: string;
}

/**
 * __Spotlight__
 *
 * A spotlight gives visual focus to an element and is paired with a dialog.
 *
 * Spotlights are used for onboarding and can be connected to create a tour.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/onboarding)
 */
const Spotlight: React.FC<SpotlightProps> = ({
  dialogWidth = 400,
  pulse = true,
  testId = 'spotlight',
  targetNode,
  target,
  ...rest
}) => (
  <SpotlightConsumer>
    {({ opened, closed, targets }) => {
      // use the targetNode prop or try get the target from context targets using name
      const actualTargetNode: HTMLElement | undefined =
        targetNode ||
        (typeof target === 'string' ? targets[target] : undefined);

      return actualTargetNode ? (
        <SpotlightInner
          {...rest}
          targetNode={actualTargetNode}
          target={target}
          onOpened={opened}
          onClosed={closed}
          testId={testId}
          dialogWidth={dialogWidth}
          pulse={pulse}
        />
      ) : null;
    }}
  </SpotlightConsumer>
);

export default Spotlight;
