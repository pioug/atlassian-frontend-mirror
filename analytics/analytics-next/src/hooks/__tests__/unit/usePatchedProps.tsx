import React, { memo, useMemo } from 'react';

import { fireEvent, render } from '@testing-library/react';

import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';

import UIAnalyticsEvent from '../../../events/UIAnalyticsEvent';
import { useRenderCounter } from '../../../test-utils/useRenderCounter';
import { CreateEventMap, CreateUIAnalyticsEvent } from '../../../types';
import { usePatchedProps } from '../../usePatchedProps';
import { useTrackedRef } from '../../useTrackedRef';

const FakeContextProvider = ({
  onEvent,
  data,
  children,
}: {
  children: React.ReactNode;
  data: Record<string, any>;
  onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
}) => {
  const dataRef = useTrackedRef(data);
  const onEventRef = useTrackedRef(onEvent);

  const value = useMemo(
    () => ({
      getAtlaskitAnalyticsContext: () => [dataRef.current],
      getAtlaskitAnalyticsEventHandlers: () => [onEventRef.current],
    }),
    [onEventRef, dataRef],
  );

  return (
    <AnalyticsReactContext.Provider value={value}>
      {children}
    </AnalyticsReactContext.Provider>
  );
};

const Button = memo(
  ({
    onClick,
    onMouseOver,
  }: {
    onClick: () => void;
    onMouseOver: () => void;
  }) => {
    const renderCounter = useRenderCounter();
    return (
      <button
        data-render-count={renderCounter}
        onClick={onClick}
        onMouseOver={onMouseOver}
      >
        Button
      </button>
    );
  },
);

const ComponentUsingHook = memo(
  <Props extends Record<string, any>>({
    createEventMap,
    ...rest
  }: {
    createEventMap: CreateEventMap;
  } & Props) => {
    const { patchedEventProps } = usePatchedProps(createEventMap, rest);
    return (
      <Button
        onClick={patchedEventProps.onClick as () => void}
        onMouseOver={patchedEventProps.onMouseOver as () => void}
      />
    );
  },
);

const UnderTest = ({
  contextData,
  onEvent,
  createEventMap,
  componentProps,
}: {
  contextData: Record<string, any>;
  onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
  createEventMap: CreateEventMap;
  componentProps: Record<string, any>;
}) => {
  return (
    <FakeContextProvider data={contextData} onEvent={onEvent}>
      <ComponentUsingHook createEventMap={createEventMap} {...componentProps} />
    </FakeContextProvider>
  );
};

describe('usePatchedProps', () => {
  it('should wrap any props with matching keys found in createEventMap when value is an object', () => {
    const contextData = { ticket: 'AFP-123' };

    const callback = jest.fn();

    const onEvent = (analyticsEvt: UIAnalyticsEvent, channel: string) => {
      callback(analyticsEvt.payload, analyticsEvt.context, channel);
    };

    const componentProps = {
      onClick: (
        _clickEvt: React.MouseEvent<HTMLButtonElement>,
        analyticsEvt: UIAnalyticsEvent,
      ) => {
        analyticsEvt.fire('atlaskit');
      },
    };

    const createEventMap: CreateEventMap = {
      onClick: { action: 'click' },
    };

    const { getByText } = render(
      <UnderTest
        contextData={contextData}
        onEvent={onEvent}
        createEventMap={createEventMap}
        componentProps={componentProps}
      />,
    );
    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(callback).toBeCalledWith(
      { action: 'click' },
      [{ ticket: 'AFP-123' }],
      'atlaskit',
    );
  });

  it('should wrap any props with matching keys found in createEventMap when value is a function', () => {
    const contextData = { ticket: 'AFP-123' };

    const callback = jest.fn();

    const onEvent = (analyticsEvt: UIAnalyticsEvent, channel: string) => {
      callback(analyticsEvt.payload, analyticsEvt.context, channel);
    };

    const componentProps = {
      onClick: (
        _clickEvt: React.MouseEvent<HTMLButtonElement>,
        analyticsEvt: UIAnalyticsEvent,
      ) => {
        analyticsEvt.fire('atlaskit');
      },
    };

    const createEventMap: CreateEventMap = {
      onClick: (create: CreateUIAnalyticsEvent) => create({ action: 'click' }),
    };

    const { getByText } = render(
      <UnderTest
        contextData={contextData}
        onEvent={onEvent}
        createEventMap={createEventMap}
        componentProps={componentProps}
      />,
    );
    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(callback).toBeCalledWith(
      { action: 'click' },
      [{ ticket: 'AFP-123' }],
      'atlaskit',
    );
  });

  it('should re-render with new props when createEventMap or wrapped props are updated', () => {
    const contextData = { ticket: 'AFP-123' };

    const callback = jest.fn();

    const onEvent = (analyticsEvt: UIAnalyticsEvent, channel: string) => {
      callback(analyticsEvt.payload, analyticsEvt.context, channel);
    };

    const initialComponentProps = {
      onClick: (
        _clickEvt: React.MouseEvent<HTMLButtonElement>,
        analyticsEvt: UIAnalyticsEvent,
      ) => {
        analyticsEvt.fire('atlaskit');
      },
    };

    const initialCreateEventMap: CreateEventMap = {
      onClick: { action: 'click' },
    };

    const { getByText, rerender } = render(
      <UnderTest
        contextData={contextData}
        onEvent={onEvent}
        createEventMap={initialCreateEventMap}
        componentProps={initialComponentProps}
      />,
    );
    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(callback).toBeCalledWith(
      { action: 'click' },
      [{ ticket: 'AFP-123' }],
      'atlaskit',
    );
    callback.mockReset();

    const updatedCreateEventMap: CreateEventMap = {
      onClick: { action: 'click', component: 'Button' },
      onMouseOver: { action: 'mouseover', component: 'Button' },
    };

    rerender(
      <UnderTest
        contextData={contextData}
        onEvent={onEvent}
        createEventMap={updatedCreateEventMap}
        componentProps={initialComponentProps}
      />,
    );

    expect(getByText('Button').dataset.renderCount).toBe('2');

    fireEvent.click(getByText('Button'));

    expect(callback).toBeCalledWith(
      { action: 'click', component: 'Button' },
      [{ ticket: 'AFP-123' }],
      'atlaskit',
    );
    callback.mockReset();

    const updatedComponentProps = {
      onClick: (
        _clickEvt: React.MouseEvent<HTMLButtonElement>,
        analyticsEvt: UIAnalyticsEvent,
      ) => {
        analyticsEvt.fire('atlaskit');
      },
      onMouseOver: (
        _moEvent: React.MouseEvent<HTMLButtonElement>,
        analyticsEvt: UIAnalyticsEvent,
      ) => {
        analyticsEvt.fire('media');
      },
    };

    rerender(
      <UnderTest
        contextData={contextData}
        onEvent={onEvent}
        createEventMap={updatedCreateEventMap}
        componentProps={updatedComponentProps}
      />,
    );

    expect(getByText('Button').dataset.renderCount).toBe('3');

    fireEvent.mouseOver(getByText('Button'));

    expect(callback).toBeCalledWith(
      { action: 'mouseover', component: 'Button' },
      [{ ticket: 'AFP-123' }],
      'media',
    );
  });

  it('should not re-render children when analytics context changes', () => {
    const initialCallback = jest.fn();

    const initialOnEvent = (
      analyticsEvt: UIAnalyticsEvent,
      channel: string,
    ) => {
      initialCallback(analyticsEvt.payload, analyticsEvt.context, channel);
    };

    const initialContextData = { ticket: 'AFP-123' };

    const componentProps = {
      onClick: (
        _clickEvt: React.MouseEvent<HTMLButtonElement>,
        analyticsEvt: UIAnalyticsEvent,
      ) => {
        analyticsEvt.fire('atlaskit');
      },
    };

    const createEventMap: CreateEventMap = {
      onClick: { action: 'click' },
    };

    const { getByText, rerender } = render(
      <UnderTest
        contextData={initialContextData}
        onEvent={initialOnEvent}
        createEventMap={createEventMap}
        componentProps={componentProps}
      />,
    );
    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(initialCallback).toBeCalledWith(
      { action: 'click' },
      [{ ticket: 'AFP-123' }],
      'atlaskit',
    );
    initialCallback.mockReset();

    const updatedContextData = { ticket: 'AFP-234' };

    rerender(
      <UnderTest
        contextData={updatedContextData}
        onEvent={initialOnEvent}
        createEventMap={createEventMap}
        componentProps={componentProps}
      />,
    );

    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(initialCallback).toBeCalledWith(
      { action: 'click' },
      [{ ticket: 'AFP-234' }],
      'atlaskit',
    );

    const updatedCallback = jest.fn();

    const updatedOnEvent = (
      analyticsEvt: UIAnalyticsEvent,
      channel: string,
    ) => {
      updatedCallback(analyticsEvt.payload, analyticsEvt.context, channel);
    };

    rerender(
      <UnderTest
        contextData={updatedContextData}
        onEvent={updatedOnEvent}
        createEventMap={createEventMap}
        componentProps={componentProps}
      />,
    );

    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(updatedCallback).toBeCalledWith(
      { action: 'click' },
      [{ ticket: 'AFP-234' }],
      'atlaskit',
    );
  });

  it('should not cause re-renders in children when a not analytic wrapped callback prop changes', () => {
    const initialCallback = jest.fn();

    const initialOnEvent = (
      analyticsEvt: UIAnalyticsEvent,
      channel: string,
    ) => {
      initialCallback(analyticsEvt.payload, analyticsEvt.context, channel);
    };

    const initialContextData = { ticket: 'AFP-123' };

    const initialComponentProps = {
      onClick: (
        _clickEvt: React.MouseEvent<HTMLButtonElement>,
        analyticsEvt: UIAnalyticsEvent,
      ) => {
        analyticsEvt.fire('atlaskit');
      },
      onMouseOver: (
        _moEvent: React.MouseEvent<HTMLButtonElement>,
        analyticsEvt: UIAnalyticsEvent,
      ) => {
        analyticsEvt.fire('media');
      },
      style: { color: 'blue' },
    };

    const createEventMap: CreateEventMap = {
      onClick: { action: 'click' },
    };

    const { getByText, rerender } = render(
      <UnderTest
        contextData={initialContextData}
        onEvent={initialOnEvent}
        createEventMap={createEventMap}
        componentProps={initialComponentProps}
      />,
    );
    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(initialCallback).toBeCalledWith(
      { action: 'click' },
      [{ ticket: 'AFP-123' }],
      'atlaskit',
    );
    initialCallback.mockReset();

    const updatedComponentProps = {
      onClick: initialComponentProps.onClick,
      onMouseOver: initialComponentProps.onMouseOver,
      style: { color: 'red' },
    };

    rerender(
      <UnderTest
        contextData={initialContextData}
        onEvent={initialOnEvent}
        createEventMap={createEventMap}
        componentProps={updatedComponentProps}
      />,
    );

    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(initialCallback).toBeCalledWith(
      { action: 'click' },
      [{ ticket: 'AFP-123' }],
      'atlaskit',
    );
  });
});
