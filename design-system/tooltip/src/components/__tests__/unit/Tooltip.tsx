import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';
import { render, fireEvent } from '@testing-library/react';
import Tooltip from '../../Tooltip';
import { Tooltip as StyledTooltip } from '../../../styled';
import { hoveredPayload } from '../../utils/analytics-payloads';

declare var global: any;

// Tooltip makes fairly heavy use of timers so we have to runAllTimers after
// simulating events. Unfortunately, these timers cause enzyme's understanding of
// the component tree to become stale so we call update to refresh that.
const simulate = <TWrapper extends ReactWrapper>(
  wrapper: TWrapper,
  query: any,
  event: string,
) => {
  wrapper.find(query).simulate(event);
  jest.runAllTimers();
  wrapper.update();
};

let wrapper;

beforeEach(() => {
  jest.useFakeTimers();
});

const Target = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

test('tooltip should not be shown by default', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content">
      <Target>foo</Target>
    </Tooltip>,
  );
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
});

test('tooltip should be visible when target is hovered', () => {
  const spy = jest.fn();
  wrapper = mount(
    <Tooltip content="Tooltip content" onShow={spy}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find(StyledTooltip).text()).toEqual('Tooltip content');
  expect(spy).toHaveBeenCalledTimes(1);
});

test('tooltip should be hidden when target is unhovered', () => {
  const spy = jest.fn();
  wrapper = mount(
    <Tooltip content="Tooltip content" onHide={spy}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find(StyledTooltip).text()).toEqual('Tooltip content');
  // unhover
  simulate(wrapper, Target, 'mouseout');
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('tooltip should be visible after target is clicked', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content">
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  simulate(wrapper, Target, 'click');
  expect(wrapper.find(StyledTooltip).text()).toEqual('Tooltip content');
});

test('tooltip should be hidden after target click with hideTooltipOnClick set', () => {
  const spy = jest.fn();
  wrapper = mount(
    <Tooltip content="Tooltip content" hideTooltipOnClick onHide={spy}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  simulate(wrapper, Target, 'click');
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('tooltip should be hidden after target click with hideTooltipOnMouseDown set', () => {
  const spy = jest.fn();
  wrapper = mount(
    <Tooltip content="Tooltip content" hideTooltipOnMouseDown onHide={spy}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  simulate(wrapper, Target, 'mousedown');
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('tooltip should render whatever is passed to component prop', () => {
  const Popup = () => <div>Hi</div>;
  wrapper = mount(
    <Tooltip content={<Popup />}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find(Popup)).toHaveLength(1);
});

test('tooltip wrapping element should be a div by default', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content" tag="span">
      <Target>foo</Target>
    </Tooltip>,
  );
  expect(wrapper.getDOMNode().tagName).toEqual('SPAN');
});

test('tooltip wrapping element should be whatever is passed as tag prop', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content" tag="span">
      <Target>foo</Target>
    </Tooltip>,
  );
  expect(wrapper.getDOMNode().tagName).toEqual('SPAN');
});

test('tooltip should wait a default delay before showing', () => {
  const spy = jest.fn();
  wrapper = mount(
    <Tooltip content="Tooltip content" onShow={spy}>
      <Target>foo</Target>
    </Tooltip>,
  );
  wrapper.find(Target).simulate('mouseover');
  expect(spy).toHaveBeenCalledTimes(0);
  jest.runTimersToTime(299);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
  jest.runTimersToTime(1);
  expect(spy).toHaveBeenCalledTimes(1);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(1);
});

test('tooltip should wait a configuable delay before showing', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content" delay={1000}>
      <Target>foo</Target>
    </Tooltip>,
  );
  wrapper.find(Target).simulate('mouseover');
  jest.runTimersToTime(999);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
  jest.runTimersToTime(1);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(1);
});

test('tooltip should wait a default delay before hiding', () => {
  const spy = jest.fn();
  wrapper = mount(
    <Tooltip content="Tooltip content" onHide={spy}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  wrapper.find(Target).simulate('mouseout');
  jest.runTimersToTime(299);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(1);
  expect(spy).toHaveBeenCalledTimes(0);
  jest.runTimersToTime(130);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('tooltip should wait a configuable delay before hiding', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content" delay={1000}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  wrapper.find(Target).simulate('mouseout');
  jest.runTimersToTime(999);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(1);
  jest.runTimersToTime(130);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
});

test('tooltips should show and hide immediately once one has opened', () => {
  wrapper = mount(
    <div>
      <Tooltip content="button one tooltip">
        <Target>button one</Target>
      </Tooltip>
      <Tooltip content="button two tooltip">
        <Target>button two</Target>
      </Tooltip>
    </div>,
  );
  const targetOne = wrapper.find(Target).at(0);
  const targetTwo = wrapper.find(Target).at(1);
  targetOne.simulate('mouseover');
  jest.runAllTimers();
  targetOne.simulate('mouseout');
  targetTwo.simulate('mouseover');
  jest.runTimersToTime(1);
  wrapper.update();
  expect(wrapper.find(StyledTooltip).text()).toEqual('button two tooltip');
});
test('tooltip should render popup in Portal with specific z-index', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content">
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find(Portal).prop('zIndex')).toEqual(layers.tooltip());
});

describe('TooltipWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
    jest.useFakeTimers();
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
    jest.useRealTimers();
  });

  it('should mount without errors', () => {
    mount(
      <Tooltip content="Tooltip content">
        <div>foo</div>
      </Tooltip>,
    );
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });

  it('should send analytics event when tooltip becomes visible', () => {
    const Foo = () => <div>foo</div>;
    const spy = jest.fn();
    wrapper = mount(
      <AnalyticsListener channel="atlaskit" onEvent={spy}>
        <Tooltip content="Tooltip content">
          <Foo />
        </Tooltip>
      </AnalyticsListener>,
    );
    wrapper.find(Foo).simulate('mouseover');
    jest.runTimersToTime(301);
    wrapper.find(Foo).simulate('mouseout');
    jest.runTimersToTime(300);
    expect(spy).toHaveBeenCalledTimes(1);
    const [[{ payload }]] = spy.mock.calls;
    expect(payload).toEqual(hoveredPayload);
  });
});

test('tooltip should not show when content is null', () => {
  wrapper = mount(
    <Tooltip content={null}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find('Animation')).toHaveLength(0);
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
});

test('tooltip should not show when content is undefined', () => {
  wrapper = mount(
    <Tooltip content={undefined}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find('Animation')).toHaveLength(0);
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
});

test('tooltip should not show when content is an empty string', () => {
  wrapper = mount(
    <Tooltip content="">
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find('Animation')).toHaveLength(0);
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
});

test('tooltip should not call setState on after unmount', () => {
  jest.spyOn(console, 'error').mockImplementation(e => {
    throw new Error(e);
  });
  wrapper = mount(
    <Tooltip content="Hello">
      <Target>foo</Target>
    </Tooltip>,
  );
  wrapper.find(Target).simulate('mouseover');
  wrapper.unmount();
  expect(() => {
    jest.runAllTimers();
  }).not.toThrowError();
});

describe('interacting with a mouse', () => {
  it('should position tooltip to the left of the mouse', () => {
    const { getByTestId } = render(
      <Tooltip
        testId="tooltip"
        content="hello world"
        position="mouse"
        mousePosition="left"
      >
        <button data-testid="target">focus me</button>
      </Tooltip>,
    );

    fireEvent.mouseOver(getByTestId('target'));
    jest.runAllTimers();

    expect(getByTestId('tooltip').getAttribute('data-placement')).toEqual(
      'left',
    );
  });
});

describe('interacting with the keyboard', () => {
  it('should show the tooltip when the target is focused', () => {
    const { getByTestId } = render(
      <Tooltip testId="tooltip" content="hello world">
        <button data-testid="target">focus me</button>
      </Tooltip>,
    );

    fireEvent.focus(getByTestId('target'));
    jest.runAllTimers();

    expect(getByTestId('tooltip').textContent).toEqual('hello world');
  });

  it('should hide the tooltip when the target loses focused', () => {
    const { baseElement, getByTestId } = render(
      <Tooltip testId="tooltip" content="hello world">
        <button data-testid="target">focus me</button>
      </Tooltip>,
    );
    fireEvent.focus(getByTestId('target'));
    jest.runAllTimers();

    fireEvent.blur(getByTestId('target'));
    jest.runAllTimers();

    expect(baseElement.querySelector('[data-testid="tooltip"]')).toBeNull();
  });

  it('should position tooltip to the bottom of target when interacting with keyboard and position is mouse', () => {
    const { getByTestId } = render(
      <Tooltip
        testId="tooltip"
        content="hello world"
        position="mouse"
        mousePosition="right"
      >
        <button data-testid="target">focus me</button>
      </Tooltip>,
    );

    fireEvent.focus(getByTestId('target'));
    jest.runAllTimers();

    expect(getByTestId('tooltip').getAttribute('data-placement')).toEqual(
      'right',
    );
  });

  it('should position tooltip to the top of target when interacting with keyboard', () => {
    const { getByTestId } = render(
      <Tooltip testId="tooltip" content="hello world" position="left">
        <button data-testid="target">focus me</button>
      </Tooltip>,
    );

    fireEvent.focus(getByTestId('target'));
    jest.runAllTimers();

    expect(getByTestId('tooltip').getAttribute('data-placement')).toEqual(
      'left',
    );
  });

  it('should cleanup events when unmounting', () => {
    jest.spyOn(global.console, 'error');
    const { getByTestId, unmount } = render(
      <Tooltip testId="tooltip" content="hello world" position="left">
        <button data-testid="target">focus me</button>
      </Tooltip>,
    );
    const target = getByTestId('target');

    unmount();
    fireEvent.focus(target);
    jest.runAllTimers();

    // We are testing console error logs... :)
    // eslint-disable-next-line no-console
    expect(console.error).not.toHaveBeenCalled();
    global.console.error.mockRestore();
  });
});
