import { mount, shallow } from 'enzyme';
import React from 'react';
import { Popper as PopperCompo } from '../..';

jest.mock('popper.js', () => {
  const PopperJS = require.requireActual('popper.js');

  return class Popper {
    static placements = PopperJS.placements;

    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {},
      };
    }
  };
});

const Content = () => <div className="content">Hello</div>;

const referenceElement = document.createElement('div');

const mountPopper = (props: { referenceElement: HTMLDivElement }) =>
  mount(
    <PopperCompo {...props}>
      {({ ref, style, placement, arrowProps }) => (
        <div ref={ref} style={style} data-placement={placement}>
          <div {...arrowProps} />
        </div>
      )}
    </PopperCompo>,
  );

test('Popper should be defined', () => {
  const wrapper = mountPopper({ referenceElement });
  expect(wrapper).not.toBeNull();
});

test('Popper should be pass its children', () => {
  expect(shallow(<PopperCompo />).children()).toHaveLength(1);
});

test('should render content into popup', () => {
  const wrapper = mount(
    <PopperCompo referenceElement={referenceElement}>
      {({ ref, style, placement }) => (
        <div ref={ref} style={style} data-placement={placement}>
          <Content />
        </div>
      )}
    </PopperCompo>,
  );
  expect(wrapper.find(Content)).toHaveLength(1);
});

describe('should generate modifiers prop correctly', () => {
  const defaultModifiers = {
    flip: {
      enabled: true,
      behavior: ['bottom', 'top', 'bottom'],
      boundariesElement: 'viewport',
    },
    hide: { enabled: true },
    offset: { enabled: true, offset: '0, 8px' },
    preventOverflow: {
      enabled: true,
      escapeWithReference: false,
      boundariesElement: 'window',
    },
  };

  test('with default props', () => {
    var wrapperDefault = shallow(<PopperCompo />);
    expect(wrapperDefault.props().positionFixed).toBe(true); // positionFixed should persistently True
    expect(wrapperDefault.props().modifiers).toEqual(defaultModifiers);
  });

  test('with offset props', () => {
    const wrapper = shallow(<PopperCompo placement="top-start" offset={0} />);
    expect(wrapper.props().positionFixed).toBe(true); // positionFixed should persistently True
    expect(wrapper.props().modifiers).toEqual({
      flip: {
        enabled: true,
        behavior: ['top', 'bottom', 'top'],
        boundariesElement: 'viewport',
      },
      hide: { enabled: true },
      offset: { enabled: true, offset: 0 },
      preventOverflow: {
        enabled: true,
        escapeWithReference: false,
        boundariesElement: 'window',
      },
    });
  });

  test('with custom modifiers props', () => {
    const modifiers = {
      offset: {
        enabled: true,
        offset: '8px, 8px',
      },
      hide: {
        enabled: false,
      },
    };
    const wrapper = shallow(<PopperCompo modifiers={modifiers} />);
    const expected = { ...defaultModifiers, ...modifiers };
    expect(wrapper.props().modifiers).toEqual(expected);
  });

  test('with offset and modifiers props, modifiers props should get higher prioprity', () => {
    const modifiers = {
      offset: {
        enabled: false,
        offset: '16px, 16px',
      },
      hide: {
        enabled: false,
      },
    };
    const wrapper = shallow(<PopperCompo offset={0} modifiers={modifiers} />);
    const expected = { ...defaultModifiers, ...modifiers };
    expect(wrapper.props().modifiers).toEqual(expected);
  });
});
