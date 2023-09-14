import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { render as renderToDOM, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';

import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
import type {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsClient } from '@atlaskit/editor-test-helpers/analytics-client-mock';

export const renderWithIntl = (component: React.ReactNode): RenderResult => {
  return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

export const setupMultipleRendersTestHelper = () => {
  let container: HTMLElement | null = null;

  beforeEach(() => {
    // setup a DOM element as Renderer render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container!);
    if (container) {
      container.remove();
      container = null;
    }
  });

  const renderNthTimes = (
    Component: (props: any) => JSX.Element,
    timesToRender: number,
    propsToChange: any[],
    WrapperComponent?: (props: any) => JSX.Element,
  ) => {
    let propsToChangeReversed = propsToChange.reverse();
    while (timesToRender > 0) {
      act(() => {
        const changingProps = propsToChangeReversed[timesToRender - 1];
        if (WrapperComponent) {
          renderToDOM(
            <WrapperComponent>
              <Component {...changingProps} />
            </WrapperComponent>,
            container,
          );
        } else {
          renderToDOM(<Component {...changingProps} />, container);
        }
      });
      timesToRender--;
    }
  };

  const expectAnalyticsEventAfterNthRenders = (
    Component: (props: any) => JSX.Element,
    timesToRender: number,
    propsToChange: any[],
    eventExpectation: any,
    done: jest.DoneCallback,
  ) => {
    const mockAnalyticsClient = (
      done: jest.DoneCallback,
    ): AnalyticsWebClient => {
      const analyticsEventHandler = (
        event: GasPurePayload | GasPureScreenEventPayload,
      ) => {
        expect(event).toEqual(eventExpectation);
        done();
      };
      return analyticsClient(analyticsEventHandler);
    };

    let WrapperComponent = ({ children }: { children: React.ReactNode }) => (
      <FabricAnalyticsListeners client={mockAnalyticsClient(done)}>
        {children}
      </FabricAnalyticsListeners>
    );

    renderNthTimes(Component, timesToRender, propsToChange, WrapperComponent);
  };

  return { renderNthTimes, expectAnalyticsEventAfterNthRenders };
};
