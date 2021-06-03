import React from 'react';

import { mount, render, shallow } from 'enzyme';

import { ItemPrimitiveBase } from '../../primitives';

const TestComponent = (props) => <div>Test Component {props.className}</div>;
const BeforeOrAfterComponent = (props) => (
  <div>Before/After Component {props.spacing}</div>
);

describe('ItemPrimitiveBase', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      isSelected: false,
      isActive: false,
      isHover: false,
      isFocused: false,
      spacing: 'default',
      text: 'item content',
      theme: {
        context: 'default',
        mode: {
          item: jest.fn().mockReturnValue({
            default: {},
          }),
        },
      },
    };
  });

  it('should fetch component style', () => {
    shallow(<ItemPrimitiveBase {...defaultProps} />);

    expect(defaultProps.theme.mode.item).toHaveBeenCalledTimes(1);
  });

  it('should render a div container element by default', () => {
    expect(render(<ItemPrimitiveBase {...defaultProps} />).get(0).tagName).toBe(
      'div',
    );
  });

  it('should render only component prop if present', () => {
    const wrapper = mount(
      <ItemPrimitiveBase {...defaultProps} component={TestComponent} />,
    );

    expect(wrapper.find(TestComponent).length).toBe(1);
    expect(wrapper.find('a').length).toBe(0);
    expect(wrapper.find('button').length).toBe(0);
  });

  it('should pass all relevant component props to the custom component', () => {
    const innerRef = React.createRef();
    const wrapper = mount(
      <ItemPrimitiveBase
        {...defaultProps}
        innerRef={innerRef}
        component={TestComponent}
      />,
    );
    const componentWrapper = wrapper.find(TestComponent);

    const {
      isActive,
      isFocused,
      isHover,
      isSelected,
      theme,
      ...props
    } = defaultProps;

    expect(componentWrapper.props()).toMatchObject({
      innerRef,
      dataset: {
        'data-testid': 'NavigationItem',
      },
      ...props,
    });
  });

  it('should render an anchor element if href prop is present', () => {
    const wrapper = mount(
      <ItemPrimitiveBase {...defaultProps} href={'<a>test</test>'} />,
    );

    expect(wrapper.find('a').length).toBe(1);
    expect(wrapper.find(TestComponent).length).toBe(0);
    expect(wrapper.find('button').length).toBe(0);
  });

  it('should pass expected props to anchor if href prop is present', () => {
    const onClick = () => {};
    const target = 'target';
    const href = '<a>test</a>';

    const wrapper = mount(
      <ItemPrimitiveBase
        {...defaultProps}
        onClick={onClick}
        href={href}
        target={target}
      />,
    );

    const anchorWrapper = wrapper.find('a');

    expect(anchorWrapper.props()).toEqual(
      expect.objectContaining({
        href,
        onClick,
        target,
      }),
    );
    expect(anchorWrapper.prop('innerRef')).toBeUndefined();
  });

  it('should render a button element if onClick prop is present', () => {
    const wrapper = mount(
      <ItemPrimitiveBase {...defaultProps} onClick={() => {}} />,
    );

    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('a').length).toBe(0);
    expect(wrapper.find(TestComponent).length).toBe(0);
  });

  it('should pass expected props to button if onClick prop is present', () => {
    const onClick = () => {};

    const wrapper = mount(
      <ItemPrimitiveBase {...defaultProps} onClick={onClick} />,
    );

    expect(wrapper.find('button').prop('onClick')).toBe(onClick);
    expect(wrapper.find('button').prop('innerRef')).toBeUndefined();
  });

  it('should always render text prop', () => {
    const wrapper = mount(<ItemPrimitiveBase {...defaultProps} />);
    expect(wrapper.text()).toBe(wrapper.prop('text'));
  });

  it('should render Before with expected props if present', () => {
    const wrapper = mount(
      <ItemPrimitiveBase {...defaultProps} before={BeforeOrAfterComponent} />,
    );
    expect(wrapper.find(BeforeOrAfterComponent).props()).toEqual({
      isActive: false,
      isHover: false,
      isSelected: false,
      spacing: 'default',
      isFocused: false,
      isDragging: false,
    });
  });

  it('should render After with expected props if present', () => {
    const AfterComponent = () => <div>after</div>;
    const wrapper = mount(
      <ItemPrimitiveBase {...defaultProps} after={AfterComponent} />,
    );

    expect(wrapper.find(AfterComponent).props()).toEqual({
      isActive: false,
      isHover: false,
      isSelected: false,
      spacing: 'default',
      isFocused: false,
      isDragging: false,
    });
  });

  it('should render Before, text and After components in right order', () => {
    const BeforeComponent = (props) => props.spacing;
    const AfterComponent = () => <div>after</div>;

    const wrapper = shallow(
      <ItemPrimitiveBase
        {...defaultProps}
        before={BeforeComponent}
        after={AfterComponent}
      />,
    );

    expect(wrapper.childAt(0).find(BeforeComponent)).toHaveLength(1);
    expect(wrapper.childAt(1).text()).toEqual(defaultProps.text);
    expect(wrapper.childAt(2).find(AfterComponent)).toHaveLength(1);
  });

  it('should allow applying custom styles', () => {
    const styles = () => ({
      itemBase: {
        color: 'itemBase-fake-color',
      },
      beforeWrapper: {
        color: 'beforeWrapper-fake-color',
      },
      contentWrapper: {
        color: 'contentWrapper-fake-color',
      },
      textWrapper: {
        color: 'textWrapper-fake-color',
      },
      subTextWrapper: {
        color: 'subTextWrapper-fake-color',
      },
      afterWrapper: {
        color: 'afterWrapper-fake-color',
      },
    });
    const AfterComponent = () => <div>after</div>;

    const wrapper = mount(
      <ItemPrimitiveBase
        {...defaultProps}
        styles={styles}
        subText="subtext"
        before={BeforeOrAfterComponent}
        after={AfterComponent}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  [
    { subject: 'the default element', props: {} },
    { subject: 'an anchor', props: { href: '/' } },
    { subject: 'a button', props: { onClick: jest.fn() } },
  ].forEach(({ subject, props }) => {
    it(`should apply a default dataset to ${subject} when dataset is not provided`, () => {
      expect(
        render(<ItemPrimitiveBase {...defaultProps} {...props} />).data(),
      ).toEqual({ testid: 'NavigationItem' });
    });

    it(`should apply a custom dataset to ${subject} when dataset is provided`, () => {
      expect(
        render(
          <ItemPrimitiveBase
            {...defaultProps}
            {...props}
            dataset={{ 'data-foo': 'foo', 'data-bar': 'bar' }}
          />,
        ).data(),
      ).toEqual({
        foo: 'foo',
        bar: 'bar',
      });
    });
  });
});
