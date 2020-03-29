import React, { FC } from 'react';
import { shallow, mount } from 'enzyme';
import { AnalyticsContext, withAnalyticsContext } from '../..';

interface ButtonProps {
  children?: React.ReactNode;
}

describe('withAnalyticsContext', () => {
  let Button: FC<ButtonProps>;

  beforeEach(() => {
    Button = ({ children }) => <button>{children}</button>;
  });

  it('should render the provided component', () => {
    const ButtonWithContext = withAnalyticsContext()(Button);
    const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

    expect(wrapper.html()).toBe('<button>Hello</button>');
  });

  it('should have descriptive displayName', () => {
    const ButtonWithContext = withAnalyticsContext()(Button);

    expect(ButtonWithContext.displayName).toBe('WithAnalyticsContext(Button)');
  });

  it('should wrap inner component with analytics context component', () => {
    const ButtonWithContext = withAnalyticsContext()(Button);
    const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

    expect(
      wrapper.equals(
        <AnalyticsContext data={{}}>
          <Button>Hello</Button>
        </AnalyticsContext>,
      ),
    ).toBe(true);
  });

  it('should pass analyticsContext prop data to analytics context component', () => {
    const ButtonWithContext = withAnalyticsContext()(Button);
    const wrapper = shallow(
      <ButtonWithContext analyticsContext={{ name: 'specialButton' }}>
        Hello
      </ButtonWithContext>,
    );

    expect(
      wrapper.equals(
        <AnalyticsContext data={{ name: 'specialButton' }}>
          <Button>Hello</Button>
        </AnalyticsContext>,
      ),
    ).toBe(true);
  });

  it('should pass default data to analytics context when no prop exists', () => {
    const ButtonWithContext = withAnalyticsContext({
      name: 'button',
    })(Button);
    const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

    expect(
      wrapper.equals(
        <AnalyticsContext data={{ name: 'button' }}>
          <Button>Hello</Button>
        </AnalyticsContext>,
      ),
    ).toBe(true);
  });

  it('should pass an empty object to analytics context if no default or prop value defined', () => {
    const ButtonWithContext = withAnalyticsContext()(Button);
    const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

    expect(
      wrapper.equals(
        <AnalyticsContext data={{}}>
          <Button>Hello</Button>
        </AnalyticsContext>,
      ),
    ).toBe(true);
  });

  it('should forward the ref of inner component', () => {
    const spy = jest.fn();

    class Button extends React.Component<ButtonProps> {
      render() {
        return <button>click here</button>;
      }
    }

    const ButtonWithContext = withAnalyticsContext()(Button);
    // div is required otherwise ref doesn't work
    mount(
      <div>
        <ButtonWithContext ref={spy} />
      </div>,
    );
    expect(spy).toHaveBeenCalled();
    const [ref] = spy.mock.calls[0];
    expect(ref).toBeInstanceOf(Button);
  });
});
