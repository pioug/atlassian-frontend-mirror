import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { RenderTracking } from '../index';
import {
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION,
} from '../../../../plugins/analytics';

type ComponentProps = {
  prop1?: string;
  prop2?: number;
  prop3?: any;
};

describe('useComponentRenderTracking', () => {
  let mockHandleAnalyticsEvent: jest.Mock;
  let container: HTMLElement | null = null;

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
    mockHandleAnalyticsEvent = jest.fn();
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container!);
    if (container) {
      container.remove();
      container = null;
    }
    mockHandleAnalyticsEvent.mockRestore();
  });

  it('should set render count to 0 on first render', async () => {
    act(() => {
      render(
        <RenderTracking<ComponentProps>
          componentProps={{
            prop1: 'abc',
            prop2: 10,
            prop3: {
              prop31: {
                prop32: {},
              },
            },
          }}
          action={ACTION.RE_RENDERED}
          actionSubject={ACTION_SUBJECT.EDITOR}
          handleAnalyticsEvent={mockHandleAnalyticsEvent}
          propsToIgnore={[]}
          useShallow={false}
        />,
        container,
      );
    });
    expect(mockHandleAnalyticsEvent).toHaveBeenCalledTimes(0);
  });

  it('should set render count to 1 on second render with propsDifference', async () => {
    act(() => {
      render(
        <RenderTracking<ComponentProps>
          componentProps={{
            prop2: 10,
            prop3: {},
          }}
          action={ACTION.RE_RENDERED}
          actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
          handleAnalyticsEvent={mockHandleAnalyticsEvent}
          propsToIgnore={[]}
          useShallow={false}
        />,
        container,
      );
    });

    act(() => {
      render(
        <RenderTracking<ComponentProps>
          componentProps={{
            prop1: 'abc',
            prop2: 11,
            prop3: {},
          }}
          action={ACTION.RE_RENDERED}
          actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
          handleAnalyticsEvent={mockHandleAnalyticsEvent}
          propsToIgnore={[]}
          useShallow={false}
        />,
        container,
      );
    });

    const difference = {
      added: ['prop1'],
      changed: [
        {
          key: 'prop2',
          oldValue: 10,
          newValue: 11,
        },
        {
          key: 'prop3',
          difference: {
            added: [],
            removed: [],
            changed: [],
          },
        },
      ],
      removed: [],
    };
    expect(mockHandleAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(mockHandleAnalyticsEvent).toHaveBeenLastCalledWith({
      payload: {
        action: ACTION.RE_RENDERED,
        actionSubject: ACTION_SUBJECT.REACT_EDITOR_VIEW,
        attributes: {
          propsDifference: difference,
          count: 1,
        },
        eventType: EVENT_TYPE.OPERATIONAL,
      },
    });
  });

  it('should do shallow props difference.', async () => {
    act(() => {
      render(
        <RenderTracking<ComponentProps>
          componentProps={{
            prop2: 10,
            prop3: {
              prop31: {
                prop32: 10,
              },
            },
          }}
          action={ACTION.RE_RENDERED}
          actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
          handleAnalyticsEvent={mockHandleAnalyticsEvent}
          propsToIgnore={[]}
          useShallow={false}
        />,
        container,
      );
    });

    act(() => {
      render(
        <RenderTracking<ComponentProps>
          componentProps={{
            prop1: 'abc',
            prop2: 11,
            prop3: {
              prop31: {
                prop32: 11,
              },
            },
          }}
          action={ACTION.RE_RENDERED}
          actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
          handleAnalyticsEvent={mockHandleAnalyticsEvent}
          propsToIgnore={[]}
          useShallow={true}
        />,
        container,
      );
    });

    const difference = {
      added: ['prop1'],
      changed: ['prop2', 'prop3'],
      removed: [],
    };
    expect(mockHandleAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(mockHandleAnalyticsEvent).toHaveBeenLastCalledWith({
      payload: {
        action: ACTION.RE_RENDERED,
        actionSubject: ACTION_SUBJECT.REACT_EDITOR_VIEW,
        attributes: {
          propsDifference: difference,
          count: 1,
        },
        eventType: EVENT_TYPE.OPERATIONAL,
      },
    });
  });
});
