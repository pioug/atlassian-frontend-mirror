import React, { Component, MouseEvent } from 'react';
import { shallow, mount } from 'enzyme';
import {
  UIAnalyticsEvent,
  AnalyticsListener,
  AnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '../..';

interface WrappedProps extends WithAnalyticsEventsProps {
  abc?: string;
  children: React.ReactNode;
  onClick?: (
    e: MouseEvent<HTMLButtonElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
}

const Button = ({ children, onClick }: WrappedProps) => (
  <button onClick={onClick}>{children}</button>
);

class ButtonWithCreate extends Component<WrappedProps> {
  handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const { createAnalyticsEvent, onClick } = this.props;
    if (onClick) {
      onClick(e, createAnalyticsEvent!({ action: 'b' }));
    }
  };

  render() {
    return <button onClick={this.handleClick}>{this.props.children}</button>;
  }
}

it('should render the provided component', () => {
  const ButtonWithAnalytics = withAnalyticsEvents()(Button);
  const wrapper = shallow(<ButtonWithAnalytics>Hello</ButtonWithAnalytics>);

  expect(wrapper.html()).toBe('<button>Hello</button>');
});

it('should have descriptive displayName', () => {
  const ButtonWithAnalytics = withAnalyticsEvents()(Button);
  expect(ButtonWithAnalytics.displayName).toBe('WithAnalyticsEvents(Button)');
});

it('should pass a createAnalyticsEvent function prop to the inner component', () => {
  const ButtonWithAnalytics = withAnalyticsEvents()(Button);
  const wrapper = shallow(<ButtonWithAnalytics>Hello</ButtonWithAnalytics>);

  expect(
    typeof wrapper
      .dive()
      .find(Button)
      .prop('createAnalyticsEvent'),
  ).toBe('function');
});

describe('createAnalyticsEvent function prop', () => {
  it('should return a new UI Analytics Event with specified action and payload', () => {
    let analyticsEvent: UIAnalyticsEvent | undefined;

    const ButtonWithAnalytics = withAnalyticsEvents()(ButtonWithCreate);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('ButtonWithCreate').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    if (analyticsEvent) {
      expect(analyticsEvent.payload).toEqual({ action: 'b' });
    }
  });

  it('should retrieve analytics context and handlers from react context and pass through to event', () => {
    let analyticsEvent: UIAnalyticsEvent | undefined;
    const eventHandler = jest.fn();

    const ButtonWithAnalytics = withAnalyticsEvents()(ButtonWithCreate);
    const wrapper = mount(
      <AnalyticsListener onEvent={eventHandler}>
        <AnalyticsContext data={{ a: 'b' }}>
          <AnalyticsContext data={{ c: 'd' }}>
            <AnalyticsContext data={{ a: 'e' }}>
              <ButtonWithAnalytics
                onClick={(e, buttonAnalyticsEvent) => {
                  analyticsEvent = buttonAnalyticsEvent;
                }}
              >
                Hello
              </ButtonWithAnalytics>
            </AnalyticsContext>
          </AnalyticsContext>
        </AnalyticsContext>
      </AnalyticsListener>,
    );

    wrapper.find('ButtonWithCreate').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    if (analyticsEvent) {
      expect(analyticsEvent.context).toEqual([
        { a: 'b' },
        { c: 'd' },
        { a: 'e' },
      ]);
    }
  });
});

describe('create event map', () => {
  it('should patch callback props to create an event when passed a string', () => {
    let analyticsEvent: UIAnalyticsEvent | undefined;
    const ButtonWithAnalytics = withAnalyticsEvents({
      onClick: { action: 'clicked' },
    })(Button);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('Button').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    if (analyticsEvent) {
      expect(analyticsEvent.payload).toEqual({ action: 'clicked' });
    }
  });

  it('should patch callback props to create an event when passed a function', () => {
    let analyticsEvent: UIAnalyticsEvent | undefined;
    const ButtonWithAnalytics = withAnalyticsEvents({
      onClick: createEvent => createEvent({ action: 'clicked' }),
    })(Button);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('Button').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    if (analyticsEvent) {
      expect(analyticsEvent.payload).toEqual({ action: 'clicked' });
    }
  });

  it('should pass component props to create event map functions', () => {
    let analyticsEvent: UIAnalyticsEvent | undefined;
    const ButtonWithAnalytics = withAnalyticsEvents({
      onClick: (createEvent, props) =>
        createEvent({ action: 'clicked', efg: props.abc }),
    })(Button);
    const wrapper = mount(
      <ButtonWithAnalytics
        abc="xyz"
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('Button').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    if (analyticsEvent) {
      expect(analyticsEvent.payload).toEqual({ action: 'clicked', efg: 'xyz' });
    }
  });
});

it('should forward the ref of inner component', () => {
  const spy = jest.fn();
  const ButtonWithAnalytics = withAnalyticsEvents()(ButtonWithCreate);
  mount(
    <div>
      <ButtonWithAnalytics ref={spy}>Hello</ButtonWithAnalytics>
    </div>,
  );
  expect(spy).toHaveBeenCalled();
  const [ref] = spy.mock.calls[0];
  expect(ref).toBeInstanceOf(ButtonWithCreate);
});

it('should always pass analytics events', () => {
  const spy = jest.fn();
  const ButtonWithAnalytics = withAnalyticsEvents({
    onClick: createEvent => createEvent({ action: 'clicked' }).fire(),
  })(Button);
  const wrapper = mount(
    <AnalyticsListener onEvent={spy}>
      <ButtonWithAnalytics>Click me</ButtonWithAnalytics>
    </AnalyticsListener>,
  );
  wrapper.find(Button).simulate('click');
  expect(spy).toHaveBeenCalled();
});

it('should update patched prop callbacks when the original callback changes', () => {
  const ButtonWithAnalytics = withAnalyticsEvents({
    onClick: createEvent =>
      createEvent({ action: 'clicked', time: Date.now() }),
  })(Button);

  interface ButtonState {
    count: number;
  }

  class Counter extends React.Component<{}, ButtonState> {
    state = { count: 0 };

    render() {
      const { count } = this.state;
      return (
        <ButtonWithAnalytics
          onClick={() => this.setState({ count: count + 1 })}
        >
          {count}
        </ButtonWithAnalytics>
      );
    }
  }

  const wrapper = mount<{}, ButtonState>(<Counter />);
  // when button is mounted the handler is
  // onClick={() => this.setState({ count: 0 + 1 })}
  wrapper.setState({ count: 5 });
  // after the state change the handler is
  // onClick={() => this.setState({ count: 5 + 1 })}
  wrapper.find(Button).simulate('click');
  expect(wrapper.state().count).toBe(6);
});

it('should not update patched prop callbacks across renders when the original callback has not changed', () => {
  interface ChangeCounterProps extends WithAnalyticsEventsProps {
    onClick: () => void;
  }

  interface ChangeCounterState {
    count: number;
  }

  class ChangeCounter extends React.Component<
    ChangeCounterProps,
    ChangeCounterState
  > {
    renderCount = 0;
    state = {
      renderCount: 0,
      count: 0,
    };

    UNSAFE_componentWillReceiveProps(nextProps: ChangeCounterProps) {
      if (this.props.onClick !== nextProps.onClick) {
        this.setState({ count: this.state.count + 1 });
      }
    }

    render() {
      this.renderCount++;

      return this.state.count;
    }
  }

  const ChangeCounterWithAnalytics = withAnalyticsEvents({
    onClick: {
      action: 'clicked',
      time: Date.now(),
    },
  })(ChangeCounter);

  const onClick = () => {};
  const wrapper = mount(<ChangeCounterWithAnalytics onClick={onClick} />);
  const counterWrapper = wrapper.find(ChangeCounter);

  expect(wrapper.text()).toBe('0');
  // @ts-ignore
  expect(counterWrapper.instance().renderCount).toBe(1);

  // Re-rendering the component with the same prop callback should not change its patched ref value
  wrapper.setProps({ onClick });
  expect(wrapper.text()).toBe('0');
  // @ts-ignore
  expect(counterWrapper.instance().renderCount).toBe(2);

  const newOnClick = () => {};

  // Setting a new prop callback value should update the patched ref value though
  wrapper.setProps({ onClick: newOnClick });
  expect(wrapper.text()).toBe('1');
  // @ts-ignore
  expect(counterWrapper.instance().renderCount).toBe(3);

  // Make sure setting the same new prop callback does not change the ref value again
  // (This would occur if the implementation only kept the original prop callback value to check against)
  wrapper.setProps({ onClick: newOnClick });
  expect(wrapper.text()).toBe('1');
  // @ts-ignore
  expect(counterWrapper.instance().renderCount).toBe(4);
});
