import React, { Component, ComponentType, ReactNode } from 'react';
import FocusLock from 'react-focus-lock';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { Popper, Placement } from '@atlaskit/popper';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import { Actions } from '../types';
import { Image } from '../styled/Dialog';
import SpotlightCard from './SpotlightCard';
import ValueChanged from './ValueChanged';
import { CardTokens } from './Card';

export interface SpotlightDialogProps extends WithAnalyticsEventsProps {
  /** Buttons to render in the footer */
  actions?: Actions;
  /** An optional element rendered beside the footer actions */
  actionsBeforeElement?: ReactNode;
  /** The elements rendered in the modal */
  children?: ReactNode;
  /** Where the dialog should appear, relative to the contents of the children. */
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
  /** The width of the dialog in pixels. Min 160 - Max 600 */
  dialogWidth: number;
  /** Optional element rendered below the body */
  footer?: ComponentType<any>;
  /** Optional element rendered above the body */
  header?: ComponentType<any>;
  /** Heading text rendered above the body */
  heading?: string;
  /** Path to the the your image */
  image?: string;
  /** The spotlight target node */
  targetNode: HTMLElement;
  /** js object containing the animation styles to apply to component */
  animationStyles: Object;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

interface State {
  focusLockDisabled: boolean;
}

class SpotlightDialog extends Component<SpotlightDialogProps, State> {
  state = {
    focusLockDisabled: true,
  };

  private focusLockTimeoutId: number | undefined;

  componentDidMount() {
    this.focusLockTimeoutId = window.setTimeout(() => {
      // we delay the enabling of the focus lock to avoid the scroll position
      // jumping around in some situations
      this.setState({ focusLockDisabled: false });
    }, 200);
  }

  componentWillUnmount() {
    window.clearTimeout(this.focusLockTimeoutId);
  }

  render() {
    const {
      actions,
      actionsBeforeElement,
      animationStyles,
      children,
      dialogPlacement,
      dialogWidth,
      footer,
      header,
      heading,
      image,
      targetNode,
      testId,
    } = this.props;
    const { focusLockDisabled } = this.state;

    const translatedPlacement: Placement | undefined = dialogPlacement
      ? ({
          'top left': 'top-start',
          'top center': 'top',
          'top right': 'top-end',
          'right top': 'right-start',
          'right middle': 'right',
          'right bottom': 'right-end',
          'bottom left': 'bottom-start',
          'bottom center': 'bottom',
          'bottom right': 'bottom-end',
          'left top': 'left-start',
          'left middle': 'left',
          'left bottom': 'left-end',
        }[dialogPlacement] as Placement)
      : undefined;

    return (
      <Popper referenceElement={targetNode} placement={translatedPlacement}>
        {({ ref, style, scheduleUpdate }) => (
          <ValueChanged value={dialogWidth} onChange={scheduleUpdate}>
            <FocusLock
              disabled={focusLockDisabled}
              returnFocus={false}
              autoFocus
            >
              <SpotlightCard
                ref={ref}
                testId={testId}
                theme={parent => {
                  const { container, ...others } = parent({});
                  return {
                    ...others,
                    container: {
                      ...container,
                      ...style,
                      ...animationStyles,
                    },
                  } as CardTokens;
                }}
                width={dialogWidth}
                actions={actions}
                actionsBeforeElement={actionsBeforeElement}
                image={image && <Image alt={heading} src={image} />}
                components={{
                  Header: header,
                  Footer: footer,
                }}
                heading={heading}
              >
                {children}
              </SpotlightCard>
            </FocusLock>
          </ValueChanged>
        )}
      </Popper>
    );
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'spotlight',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    targetOnClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'spotlight',
      attributes: {
        componentName: 'spotlight',
        packageName,
        packageVersion,
      },
    }),
  })(SpotlightDialog),
);
