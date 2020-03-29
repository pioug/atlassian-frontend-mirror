import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';

import Tooltip from '../../Tooltip';
import { Tooltip as StyledTooltip } from '../../../styled';

// Tooltip makes fairly heavy use of timers so we have to runAllTimers after
// simulating events. Unfortuantely, these timers cause enzyme's understanding of
// the component tree to become stale so we call update to refresh that.
const simulate = (wrapper: any, query: any, event: any) => {
  wrapper.find(query).simulate(event);
  jest.runAllTimers();
  wrapper.update();
};

beforeEach(() => {
  jest.useFakeTimers();
});

const Target = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

describe('Using enzyme', () => {
  test('It should not generate data-testid when hovered', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <Tooltip content="Tooltip content" onShow={spy}>
        <Target>foo</Target>
      </Tooltip>,
    );
    simulate(wrapper, Target, 'mouseover');
    expect(wrapper.find(StyledTooltip).text()).toEqual('Tooltip content');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(wrapper.find(StyledTooltip).prop('data-testid')).toBeUndefined();
  });
  test('Tooltip should be same with data-testid', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <Tooltip content="Tooltip content" onShow={spy} testId="the-tooltip">
        <Target>foo</Target>
      </Tooltip>,
    );
    simulate(wrapper, Target, 'mouseover');
    expect(wrapper.find(StyledTooltip).text()).toEqual('Tooltip content');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(wrapper.find(StyledTooltip).prop('data-testid')).toBeDefined();
  });
});

describe('Tooltip should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'the-tooltip';
    const { getByTestId } = render(
      <Tooltip content="Tooltip content" testId={testId}>
        <Target>foo</Target>
      </Tooltip>,
    );
    expect(getByTestId(testId)).toBeTruthy();
  });
});
