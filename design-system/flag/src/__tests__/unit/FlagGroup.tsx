import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import Flag from '../../index';
import { FlagProps } from '../../types';
import FlagGroup from '../../flag-group';

import { matchers } from 'jest-emotion';

expect.extend(matchers);

describe('FlagGroup', () => {
  const generateFlag = (extraProps?: Partial<FlagProps>) => (
    <Flag id={''} icon={<div />} title="Flag" {...extraProps} />
  );

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render Flag children in the correct place', () => {
    const { getByTestId, queryByTestId } = render(
      <FlagGroup>
        {generateFlag({ testId: '0' })}
        {generateFlag({ testId: '1' })}
        {generateFlag({ testId: '2' })}
      </FlagGroup>,
    );

    expect(queryByTestId('0')).toBeTruthy();

    const flag1Container = getByTestId('1').parentElement;
    const flag2Container = getByTestId('2').parentElement;
    if (flag1Container === null || flag2Container === null) {
      throw Error('Flag 1 and 1 missing container');
    }

    const flag1ContainerStyle = window.getComputedStyle(flag1Container);
    expect(flag1ContainerStyle.transform).toBe(
      'translateX(0) translateY(100%) translateY(16px)',
    );

    const flag2ContainerStyle = window.getComputedStyle(flag2Container);
    expect(flag2ContainerStyle.transform).toBe(
      'translateX(0) translateY(100%) translateY(16px)',
    );
  });

  it('should allow falsy children', () => {
    expect(() => {
      render(<FlagGroup>{null}</FlagGroup>);
      render(<FlagGroup>{false}</FlagGroup>);
      render(<FlagGroup>{[]}</FlagGroup>);
    }).not.toThrow();
  });

  it('should move Flag children up when dismissed', () => {
    const spy = jest.fn();
    const { getByTestId, queryByTestId, rerender } = render(
      <FlagGroup onDismissed={spy}>
        {generateFlag({ testId: '0', id: '0' })}
        {generateFlag({ testId: '1', id: '2' })}
        {generateFlag({ testId: '2', id: '2' })}
      </FlagGroup>,
    );

    rerender(
      <FlagGroup onDismissed={spy}>
        {generateFlag({ testId: '1', id: '2' })}
        {generateFlag({ testId: '2', id: '2' })}
      </FlagGroup>,
    );

    act(() => jest.runAllTimers());
    expect(queryByTestId('0')).toBeNull();

    const flag1Container = getByTestId('1').parentElement;
    const flag2Container = getByTestId('2').parentElement;
    if (flag1Container === null || flag2Container === null) {
      throw Error('Flag 1 or 2 missing container');
    }

    const flag1ContainerStyle = window.getComputedStyle(flag1Container);
    expect(flag1ContainerStyle.transform).toBe('translate(0,0)');

    const flag2ContainerStyle = window.getComputedStyle(flag2Container);
    expect(flag2ContainerStyle.transform).toBe(
      'translateX(0) translateY(100%) translateY(16px)',
    );
    expect(flag2ContainerStyle.visibility).toBe('visible');
  });

  it('should move Flag children down when new flag is added', () => {
    const spy = jest.fn();
    const { getByTestId, rerender } = render(
      <FlagGroup onDismissed={spy}>
        {generateFlag({ testId: '1', id: '1' })}
        {generateFlag({ testId: '2', id: '2' })}
      </FlagGroup>,
    );

    rerender(
      <FlagGroup onDismissed={spy}>
        {generateFlag({ testId: '0', id: '0' })}
        {generateFlag({ testId: '1', id: '2' })}
        {generateFlag({ testId: '2', id: '2' })}
      </FlagGroup>,
    );

    act(() => jest.runAllTimers());

    const flag0Container = getByTestId('0').parentElement;
    const flag1Container = getByTestId('1').parentElement;
    const flag2Container = getByTestId('2').parentElement;
    if (
      flag0Container === null ||
      flag1Container === null ||
      flag2Container === null
    ) {
      throw Error('Flag 0, 1 or 2 missing container');
    }

    const flag0ContainerStyle = window.getComputedStyle(flag0Container);
    expect(flag0ContainerStyle.transform).toBe('translate(0,0)');

    const flag1ContainerStyle = window.getComputedStyle(flag1Container);
    expect(flag1ContainerStyle.transform).toBe(
      'translateX(0) translateY(100%) translateY(16px)',
    );

    const flag2ContainerStyle = window.getComputedStyle(flag2Container);
    expect(flag2ContainerStyle.transform).toBe(
      'translateX(0) translateY(100%) translateY(16px)',
    );
  });

  it('onDismissed provided by FlagGroup should be called when child Flag is dismissed', () => {
    const spy = jest.fn();
    const { getByTestId } = render(
      <FlagGroup onDismissed={spy}>
        {generateFlag({
          id: 'a',
          testId: 'a',
        })}
        {generateFlag({ id: 'b' })}
      </FlagGroup>,
    );

    fireEvent.click(getByTestId('a-dismiss'));
    act(() => jest.runAllTimers());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a', expect.anything());
  });

  it('onDismissed provided by Flag should be called when child Flag is dismissed', () => {
    const spy = jest.fn();
    const { getByTestId } = render(
      <FlagGroup>
        {generateFlag({
          id: 'a',
          testId: 'a',
          onDismissed: spy,
        })}
        {generateFlag({ id: 'b' })}
      </FlagGroup>,
    );

    fireEvent.click(getByTestId('a-dismiss'));
    act(() => jest.runAllTimers());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a', expect.anything());
  });

  it('onDismissed provided by Flag and FlagGroup should be called when child Flag is dismissed', () => {
    const flagGroupSpy = jest.fn();
    const flagSpy = jest.fn();
    const { getByTestId } = render(
      <FlagGroup onDismissed={flagGroupSpy}>
        {generateFlag({
          id: 'a',
          testId: 'a',
          onDismissed: flagSpy,
        })}
        {generateFlag({ id: 'b' })}
      </FlagGroup>,
    );

    fireEvent.click(getByTestId('a-dismiss'));
    act(() => jest.runAllTimers());

    expect(flagGroupSpy).toHaveBeenCalledTimes(1);
    expect(flagGroupSpy).toHaveBeenCalledWith('a', expect.anything());

    expect(flagSpy).toHaveBeenCalledTimes(1);
    expect(flagSpy).toHaveBeenCalledWith('a', expect.anything());
  });

  it('should call onDismissed of the first flag and not the second when the first is dismissed', () => {
    const flagASpy = jest.fn();
    const flagBSpy = jest.fn();
    const { getByTestId } = render(
      <FlagGroup>
        {generateFlag({
          id: 'a',
          testId: 'a',
          onDismissed: flagASpy,
        })}
        {generateFlag({ id: 'b', onDismissed: flagBSpy })}
      </FlagGroup>,
    );

    fireEvent.click(getByTestId('a-dismiss'));
    act(() => jest.runAllTimers());

    expect(flagASpy).toHaveBeenCalledTimes(1);
    expect(flagASpy).toHaveBeenCalledWith('a', expect.anything());

    expect(flagBSpy).not.toHaveBeenCalled();
  });

  it('onDismissed provided by Flag should be called when child Flag wrapped within another component and dismissed', () => {
    const spy = jest.fn();
    const { getByTestId } = render(
      <FlagGroup>
        <div>
          {generateFlag({
            id: 'a',
            testId: 'a',
            onDismissed: spy,
          })}
        </div>
        <div>{generateFlag({ id: 'b' })}</div>
      </FlagGroup>,
    );

    fireEvent.click(getByTestId('a-dismiss'));
    act(() => jest.runAllTimers());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a', expect.anything());
  });

  it('should render screen reader text only when FlagGroup has children', () => {
    const { queryByText } = render(<FlagGroup>{generateFlag()}</FlagGroup>);
    expect(queryByText('Flag notifications')).toBeTruthy();
  });

  it("should not render screen reader text when FlagGroup doesn't have children", () => {
    const { queryByText } = render(<FlagGroup></FlagGroup>);
    expect(queryByText('Flag notifications')).toBeFalsy();
  });

  it('should render custom screen reader text and tag from props', () => {
    const { getByText } = render(
      <FlagGroup label="notifs" labelTag="h3">
        {generateFlag()}
      </FlagGroup>,
    );
    const screenReaderText = getByText('notifs');
    expect(screenReaderText.nodeName).toBe('H3');
  });

  it('should render an id attribute when provided', () => {
    render(
      <FlagGroup id="my-unique-flag-group-id">{generateFlag()}</FlagGroup>,
    );
    /** @testing-library/react doesn't have any good mechanisms for querying
     * elements by ID, so use the `document` method instead. Note that
     * `baseElement.querySelector` would also work, but `container.querySelector`
     * would not, because the result is rendered in a Portal.
     */
    const flagGroupContainer = document.getElementById(
      'my-unique-flag-group-id',
    );
    expect(flagGroupContainer?.nodeName).toBe('DIV');
  });
});
