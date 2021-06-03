import React from 'react';

import { mount, shallow } from 'enzyme';

import { PopupSelect } from '@atlaskit/select';
import { gridSize } from '@atlaskit/theme/constants';

import {
  BaseSwitcher,
  Control,
  createStyles,
  filterOption,
  Footer,
  getOptionValue,
  isOptionSelected,
} from '../../index';
import Option from '../../Option';

const Target = () => <div>A target</div>;

describe('Switcher', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      navWidth: 240,
      isNavResizing: false,
      options: [
        {
          avatar: 'endeavour',
          id: 'endeavour',
          pathname: '/projects/endeavour',
          text: 'Endeavour',
          subText: 'Software project',
        },
        {
          avatar: 'design-system-support',
          id: 'design-system-support',
          pathname: '/projects/design-system-support',
          text: 'Design System Support',
          subText: 'Service desk project',
        },
      ],
      target: <Target />,
    };
  });

  it('should render correctly', () => {
    expect(shallow(<BaseSwitcher {...baseProps} />)).toMatchSnapshot();
  });

  it('should render a PopupSelect />', () => {
    const wrapper = shallow(<BaseSwitcher {...baseProps} />);
    expect(wrapper.find(PopupSelect)).toHaveLength(1);
  });

  it('should pass expected props to <PopupSelect />', () => {
    const wrapper = shallow(<BaseSwitcher {...baseProps} />);
    expect(wrapper.find(PopupSelect).props()).toEqual(
      expect.objectContaining({
        filterOption,
        isOptionSelected,
        getOptionValue,
        options: wrapper.prop('options'),
        maxMenuWidth: expect.any(Number),
        minMenuWidth: expect.any(Number),
        target: expect.any(Function),
      }),
    );
  });

  it('should pass default components to <PopupSelect /> if components prop is missing', () => {
    const wrapper = shallow(<BaseSwitcher {...baseProps} />);
    expect(wrapper.find(PopupSelect).prop('components')).toEqual({
      Control,
      Option,
    });
  });

  it('should pass merged components to <PopupSelect /> if components prop is present', () => {
    const customComponents = {
      Control: () => <div> overriding control </div>,
      NewComponent: () => <div> new component </div>,
    };

    const wrapper = shallow(
      <BaseSwitcher {...baseProps} components={customComponents} />,
    );

    expect(wrapper.find(PopupSelect).prop('components')).toEqual({
      Control: customComponents.Control,
      Option,
      NewComponent: customComponents.NewComponent,
    });
  });

  it('should pass default styles to <PopupSelect /> if styles prop is missing', () => {
    const wrapper = shallow(<BaseSwitcher {...baseProps} />);
    const styles = wrapper.prop('styles');
    expect(styles).toEqual(
      expect.objectContaining({
        option: expect.any(Function),
      }),
    );
    expect(wrapper.find(PopupSelect).prop('styles')).toEqual(styles);
  });

  it('should pass merged custom styles to <PopupSelect /> if styles prop is present', () => {
    const customStyles = {
      option: (base) => ({
        ...base,
        color: 'green',
        paddingLeft: 16,
        marginBottom: 2,
      }),
      control: (base) => ({
        ...base,
        color: 'red',
      }),
      groupHeading: (base) => ({ ...base, color: 'red' }),
      singleValue: (base) => ({ ...base, color: 'red' }),
    };
    const wrapper = shallow(
      <BaseSwitcher {...baseProps} styles={customStyles} />,
    );
    expect(wrapper.find(PopupSelect).prop('styles')).toEqual(
      expect.objectContaining({
        option: expect.any(Function),
        control: expect.any(Function),
        groupHeading: expect.any(Function),
        singleValue: expect.any(Function),
      }),
    );
  });

  it('should pass footer prop to <PopupSelect /> when present', () => {
    const CustomFooter = () => <button>Footer</button>;
    const wrapper = shallow(
      <BaseSwitcher {...baseProps} footer={<CustomFooter />} />,
    );
    expect(wrapper.find(PopupSelect).prop('footer')).toEqual(<CustomFooter />);
  });

  it('should not pass footer prop to <PopupSelect /> when create and footer are missing', () => {
    const wrapper = shallow(<BaseSwitcher {...baseProps} />);
    expect(wrapper.find(PopupSelect).prop('footer')).toEqual(null);
  });

  it('should pass default footer prop to <PopupSelect /> when create is present', () => {
    const create = {
      onClick: () => {},
      text: 'create text',
    };

    const wrapper = shallow(<BaseSwitcher {...baseProps} create={create} />);

    const popUpSelect = wrapper.find(PopupSelect);
    expect(popUpSelect.prop('footer').type).toEqual(Footer);
    expect(popUpSelect.prop('footer').props).toEqual(
      expect.objectContaining({
        text: create.text,
        onClick: expect.any(Function),
      }),
    );
  });

  it('should close <PopupSelect /> when resizing the nav', () => {
    const wrapper = mount(<BaseSwitcher {...baseProps} />);

    wrapper.instance().selectRef.current.open();
    expect(wrapper.instance().selectRef.current.state.isOpen).toBeTruthy();

    wrapper.setProps({ isNavResizing: true });
    wrapper.instance().forceUpdate();

    expect(wrapper.instance().selectRef.current.state.isOpen).toBeFalsy();
  });

  it('should set correct width to <PopupSelect /> when collapse/expanding the nav', () => {
    const wrapper = mount(<BaseSwitcher {...baseProps} />);
    wrapper.setProps({
      navWidth: 300,
    });
    wrapper.instance().forceUpdate();
    expect(wrapper.find(PopupSelect).props().minMenuWidth).toBe(
      300 - gridSize() * 2,
    );
  });
});

describe('createStyles()', () => {
  let defaultState;
  let defaultStyles;

  beforeEach(() => {
    defaultState = {
      isFocused: false,
      isActive: false,
    };
    defaultStyles = createStyles();
  });

  it('should return an object with option field when using default styles', () => {
    expect(defaultStyles).toEqual({
      option: expect.any(Function),
    });
  });

  it('should return custom styles merged with default styles when given custom styles', () => {
    const customStyles = {
      singleValue: (provided) => ({
        ...provided,
        color: 'red',
      }),
      noOptionsMessage: (provided) => ({
        ...provided,
        color: 'green',
      }),
      groupHeading: (provided) => ({
        ...provided,
        color: 'black',
      }),
    };
    const styles = createStyles(customStyles);
    expect(styles).toMatchObject(customStyles);
    // default option field should be present
    expect(styles.option).toEqual(expect.any(Function));
  });

  it('should return merged default option styles when given custom option styles', () => {
    const customOptionStyles = {
      option: (provided) => ({
        ...provided,
        color: 'red',
        backgroundColor: 'blue',
      }),
    };
    const styles = createStyles(customOptionStyles);
    const { option } = styles;

    expect(option({}, defaultState)).toEqual({
      backgroundColor: 'blue',
      color: 'red',
      alignItems: 'center',
      border: 'none',
      boxSizing: 'border-box',
      cursor: 'default',
      display: 'flex',
      flexShrink: 0,
      fontSize: 'inherit',
      height: 8 * 6,
      outline: 'none',
      paddingRight: 8,
      paddingLeft: 8,
      textAlign: 'left',
      textDecoration: 'none',
      width: '100%',
    });
  });

  it('should return default option styles when isFocused and isActive are false', () => {
    const { option } = defaultStyles;
    expect(option({}, defaultState)).toEqual({
      color: 'inherit',
      backgroundColor: 'transparent',
      alignItems: 'center',
      border: 'none',
      boxSizing: 'border-box',
      cursor: 'default',
      display: 'flex',
      flexShrink: 0,
      fontSize: 'inherit',
      height: 8 * 6,
      outline: 'none',
      paddingRight: 8,
      paddingLeft: 8,
      textAlign: 'left',
      textDecoration: 'none',
      width: '100%',
    });
  });

  it('should return focus option styles when state isFocused is true', () => {
    const { option } = defaultStyles;
    const state = {
      isFocused: true,
      isActive: false,
    };
    expect(option({}, state)).toEqual({
      alignItems: 'center',
      border: 'none',
      backgroundColor: '#EBECF0',
      boxSizing: 'border-box',
      color: 'inherit',
      cursor: 'default',
      display: 'flex',
      flexShrink: 0,
      fontSize: 'inherit',
      height: 8 * 6,
      outline: 'none',
      paddingRight: 8,
      paddingLeft: 8,
      textAlign: 'left',
      textDecoration: 'none',
      width: '100%',
    });
  });

  it('should return active option styles when state isActive is true', () => {
    const { option } = defaultStyles;
    const state = {
      isFocused: false,
      isActive: true,
    };
    expect(option({}, state)).toEqual({
      alignItems: 'center',
      border: 'none',
      backgroundColor: '#DEEBFF',
      boxSizing: 'border-box',
      color: 'inherit',
      cursor: 'default',
      display: 'flex',
      flexShrink: 0,
      fontSize: 'inherit',
      height: 8 * 6,
      outline: 'none',
      paddingRight: 8,
      paddingLeft: 8,
      textAlign: 'left',
      textDecoration: 'none',
      width: '100%',
    });
  });

  it('should return expected option styles when state isFocused and isActive are true', () => {
    const { option } = defaultStyles;
    const state = {
      isFocused: true,
      isActive: true,
    };
    expect(option({}, state)).toEqual({
      alignItems: 'center',
      border: 'none',
      backgroundColor: '#DEEBFF',
      boxSizing: 'border-box',
      color: 'inherit',
      cursor: 'default',
      display: 'flex',
      flexShrink: 0,
      fontSize: 'inherit',
      height: 8 * 6,
      outline: 'none',
      paddingRight: 8,
      paddingLeft: 8,
      textAlign: 'left',
      textDecoration: 'none',
      width: '100%',
    });
  });
});

describe('filterOption()', () => {
  const option = {
    text: 'Design System Support',
  };
  it('should return true when option text contains "input" text', () => {
    expect(filterOption({ data: option }, 'DeSiGn s')).toBe(true);
    expect(filterOption({ data: option }, 'SuPpo')).toBe(true);
  });

  it('should return false when option text does not contain "input" text', () => {
    expect(filterOption({ data: option }, 'blabla')).toBe(false);
    expect(filterOption({ data: option }, 'x')).toBe(false);
    expect(filterOption({ data: option }, 'dx')).toBe(false);
  });
});

describe('isOptionSelected()', () => {
  it('should return false when selected array is empty or undefined', () => {
    const selected = [];
    expect(isOptionSelected({}, selected)).toBe(false);
    expect(isOptionSelected({}, undefined)).toBe(false);
  });
  it('should return false when option id is different than selected id', () => {
    const selected = [{ id: 'my-id' }];
    const option = { id: 'another-id' };
    expect(isOptionSelected(option, selected)).toBe(false);
  });
  it('should return true when option id is equal to selected id', () => {
    const selected = [{ id: 'my-id' }];
    const option = { id: 'my-id' };
    expect(isOptionSelected(option, selected)).toBe(true);
  });
});

describe('getOptionValue()', () => {
  it('should return option id field', () => {
    const option = { id: 'an-id' };
    expect(getOptionValue(option)).toEqual('an-id');
  });
});
