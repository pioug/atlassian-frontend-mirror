import React, { MouseEvent } from 'react';

import { mount, shallow } from 'enzyme';

import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';

import DrawerPrimitive from '../../primitives';
import ContentOverrides from '../../primitives/content';
import SidebarOverrides from '../../primitives/sidebar';
import { Slide } from '../../transitions';
import { DrawerWidth } from '../../types';

const DrawerContent = () => <code>Drawer contents</code>;

describe('Drawer primitive', () => {
  const commonProps = {
    testId: 'test',
    width: 'wide' as DrawerWidth,
    in: true,
    shouldUnmountOnExit: false,
    onClose: () => null,
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render given icon in large size if exists', () => {
    const props = { ...commonProps, icon: () => <span>Icon</span> };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect((wrapper.find(props.icon).props() as any).size).toBe('large');
  });

  it('should render arrow left if icon prop does NOT exist', () => {
    const props = { ...commonProps };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    expect(wrapper.find(ArrowLeft).length).toBe(1);
  });

  it('should remount the node if receives shouldUnmountOnExit prop', () => {
    const props = { ...commonProps, shouldUnmountOnExit: true };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect(wrapper.getDOMNode()).not.toBe(null);

    wrapper.setProps({ in: false });
    jest.runTimersToTime(20000);
    wrapper.update();

    expect(wrapper.getDOMNode()).toBe(null);
  });

  it('should NOT remount the node if shouldUnmountOnExit is false', () => {
    const props = { ...commonProps };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect(wrapper.getDOMNode()).not.toBe(null);

    wrapper.setProps({ in: false });
    jest.runTimersToTime(20000);
    wrapper.update();

    expect(wrapper.getDOMNode()).not.toBe(null);
  });

  it('should render with medium width', () => {
    const props = { ...commonProps, width: 'medium' as DrawerWidth };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect(wrapper.find(DrawerPrimitive).props().width).toBe('medium');
  });

  it('should call onClose when the icon is clicked', () => {
    const onClose = jest.fn();
    const props = { ...commonProps, onClose };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    const event = { target: 'button' };
    const callsBeforeIconClick = Array.prototype.concat(onClose.mock.calls);

    const handler = wrapper.find('IconButton').prop('onClick');
    if (handler) {
      handler((event as unknown) as MouseEvent);
    }

    const callsAfterIconClick = onClose.mock.calls;

    expect({ callsBeforeIconClick, callsAfterIconClick }).toEqual({
      callsBeforeIconClick: [],
      callsAfterIconClick: [[event]],
    });
  });

  it('should call onCloseComplete when the Slide has exited', () => {
    const onCloseComplete = jest.fn();
    const props = { ...commonProps, in: true, onCloseComplete };
    const wrapper = shallow(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    const node = 'div';
    const callsBeforeExited = Array.prototype.concat(
      onCloseComplete.mock.calls,
    );

    const handler = wrapper.find(Slide).props().onExited;
    if (handler) {
      handler((node as unknown) as HTMLElement);
    }

    const callsAfterExited = onCloseComplete.mock.calls;

    expect({
      callsBeforeExited,
      callsAfterExited,
    }).toEqual({
      callsBeforeExited: [],
      callsAfterExited: [[node]],
    });
  });

  it('should call onOpenComplete when the Slide has finished entering (entered)', () => {
    const onOpenComplete = jest.fn();
    const props = { ...commonProps, in: true, onOpenComplete };
    const wrapper = shallow(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    const node = document.createElement('div');

    const handler = wrapper.find(Slide).props().onEntered;
    if (handler) {
      handler(node);
    }

    expect(handler).toHaveBeenLastCalledWith(node);
  });

  describe('overrides', () => {
    const overrides = [
      {
        name: 'Sidebar',
        defaultComponent: SidebarOverrides.component,
        component: jest.fn(),
        cssFn: jest.fn(),
      },
      {
        name: 'Content',
        defaultComponent: ContentOverrides.component,
        component: jest.fn(),
        cssFn: jest.fn(),
      },
    ];

    overrides.forEach(({ name, component, defaultComponent, cssFn }) => {
      it(`should be able to override the ${name} component by providing a component override`, () => {
        const props = {
          ...commonProps,
          overrides: {
            [name]: {
              component,
            },
          },
        };
        const wrapper = shallow(
          <DrawerPrimitive {...props}>
            <DrawerContent />
          </DrawerPrimitive>,
        );

        expect(wrapper.find(component)).toHaveLength(1);
        expect(wrapper.find(defaultComponent)).toHaveLength(0);
      });
      it(`should be able to override the style of the ${name} component by providing a cssFn override`, () => {
        const props = {
          ...commonProps,
          overrides: {
            [name]: {
              cssFn,
            },
          },
        };
        const wrapper = shallow(
          <DrawerPrimitive {...props}>
            <DrawerContent />
          </DrawerPrimitive>,
        );

        const cssFnProp = wrapper.find(defaultComponent).props().cssFn;
        expect(cssFn).not.toHaveBeenCalled();
        cssFnProp({});
        expect(cssFn).toHaveBeenCalled();
      });
    });
  });
});
