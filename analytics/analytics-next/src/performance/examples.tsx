import React, { useCallback } from 'react';

import { fireEvent } from '@testing-library/react';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import AnalyticsListener from '../components/AnalyticsListener';
import UIAnalyticsEvent from '../events/UIAnalyticsEvent';
import withAnalyticsContext from '../hocs/withAnalyticsContext';
import withAnalyticsEvents, {
  WithAnalyticsEventsProps,
} from '../hocs/withAnalyticsEvents';
import { useAnalyticsEvents } from '../hooks/useAnalyticsEvents';
import { useCallbackWithAnalytics } from '../hooks/useCallbackWithAnalytics';
import { usePlatformLeafEventHandler } from '../hooks/usePlatformLeafEventHandler';
import createAndFireEvent from '../utils/createAndFireEvent';

type OnClickType = (
  value: React.MouseEvent<HTMLButtonElement>,
  analyticsEvent?: UIAnalyticsEvent,
) => void;

const ButtonWithUsePlatformLeafEventHandlerHook = ({
  onClick: providedOnClick,
}: {
  onClick: OnClickType;
}) => {
  const onClick = usePlatformLeafEventHandler({
    fn: providedOnClick,
    componentName: 'perf-test-button',
    packageName: '@atlaskit/perf-test-button',
    packageVersion: '0.1.0',
    action: 'clicked',
    analyticsData: {
      additionalData: true,
    },
  });

  return (
    <button onClick={onClick} data-testid="button">
      Click me
    </button>
  );
};

const ButtonWithUseAnalyticsEventHook = withAnalyticsContext({
  componentName: 'perf-test-button',
  packageName: '@atlaskit/perf-test-button',
  packageVersion: '0.1.0',
  additionalData: true,
})(({ onClick: providedOnClick }: { onClick: OnClickType }) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const onClick = useCallback(
    (mouseEvt: React.MouseEvent<HTMLButtonElement>) => {
      const analyticsEvent = createAnalyticsEvent({
        action: 'clicked',
        actionSubject: 'perf-test-button',
        attributes: {
          componentName: 'perf-test-button',
          packageName: '@atlaskit/perf-test-button',
          packageVersion: '0.1.0',
        },
      });
      analyticsEvent.fire('atlaskit');
      providedOnClick(mouseEvt);
    },
    [providedOnClick, createAnalyticsEvent],
  );

  return (
    <button onClick={onClick} data-testid="button">
      Click me
    </button>
  );
});

const ButtonWithUseCallbackWithAnalyticsHook = withAnalyticsContext({
  componentName: 'perf-test-button',
  packageName: '@atlaskit/perf-test-button',
  packageVersion: '0.1.0',
  additionalData: true,
})(({ onClick: providedOnClick }: { onClick: OnClickType }) => {
  const onClick = useCallbackWithAnalytics(
    providedOnClick,
    {
      action: 'clicked',
      actionSubject: 'perf-test-button',
      attributes: {
        componentName: 'perf-test-button',
        packageName: '@atlaskit/perf-test-button',
        packageVersion: '0.1.0',
      },
    },
    'atlaskit',
  );

  return (
    <button onClick={onClick} data-testid="button">
      Click me
    </button>
  );
});

const ButtonWithHOCs = withAnalyticsContext({
  componentName: 'perf-test-button',
  packageName: '@atlaskit/perf-test-button',
  packageVersion: '0.1.0',
  additionalData: true,
})(
  withAnalyticsEvents({
    onClick: createAndFireEvent('atlaskit')({
      action: 'clicked',
      actionSubject: 'perf-test-button',
      attributes: {
        componentName: 'perf-test-button',
        packageName: '@atlaskit/perf-test-button',
        packageVersion: '0.1.0',
      },
    }),
  })(({ onClick }: { onClick: OnClickType } & WithAnalyticsEventsProps) => {
    return (
      <button onClick={onClick} data-testid="button">
        Click me
      </button>
    );
  }),
);

const createEventHandler = () => {
  let done = (...args: any[]) => {};
  let promise: Promise<any[]> | null;

  const onEvent = (...args: any[]) => {
    done(args);
  };

  const create = () => {
    promise = new Promise((resolve) => {
      done = resolve;
    });
  };

  const getPromise = () => promise;

  return { onEvent, create, getPromise };
};

const eventHandler = createEventHandler();

const WithListener = (
  Component: React.JSXElementConstructor<{ onClick: OnClickType }>,
) => () => {
  eventHandler.create();

  const onEvent = eventHandler.onEvent;
  const onClick: OnClickType = () => {};

  return (
    <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
      <Component onClick={onClick} />
    </AnalyticsListener>
  );
};

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Dispatch event',
    description:
      'Recording how long it takes to fire and receive an event on the listener',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const button: HTMLElement | null = container.querySelector('button');

      if (button == null) {
        throw new Error('Could not find button element');
      }

      fireEvent.click(button);

      await eventHandler.getPromise();
    },
  },
];

export const UsePlatformLeafEventHandlerHookTest = WithListener(
  ButtonWithUsePlatformLeafEventHandlerHook,
);

export const UseAnalyticsEventHookTest = WithListener(
  ButtonWithUseAnalyticsEventHook,
);

export const UseCallbackWithAnalyticsHookTest = WithListener(
  ButtonWithUseCallbackWithAnalyticsHook,
);

export const HOCSTest = WithListener(ButtonWithHOCs);

(UsePlatformLeafEventHandlerHookTest as any).story = {
  name: 'usePlatformLeafEventHandler based component',
  component: UsePlatformLeafEventHandlerHookTest,
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

(UseAnalyticsEventHookTest as any).story = {
  name: 'useAnalyticsEvent based component',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

(UseCallbackWithAnalyticsHookTest as any).story = {
  name: 'useCallbackWithAnalytics based component',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

(HOCSTest as any).story = {
  name: 'HOC based component',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};
