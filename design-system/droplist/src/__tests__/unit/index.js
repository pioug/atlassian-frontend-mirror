import React from 'react';

import { mount, shallow } from 'enzyme';

import Item, { ItemGroup } from '@atlaskit/item';
import Layer from '@atlaskit/layer';
import Spinner from '@atlaskit/spinner';

import { DroplistWithoutAnalytics as Droplist } from '../../components/Droplist';
import DroplistWithAnalytics from '../../index';
import { Content, Trigger } from '../../styled/Droplist';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

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

const itemsList = (
  <ItemGroup heading="test1">
    <Item>Some text</Item>
  </ItemGroup>
);

describe('@atlaskit/droplist - core', () => {
  it('should be possible to create a component', () => {
    expect(shallow(<Droplist>test</Droplist>)).not.toBe(undefined);
  });

  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <Droplist trigger="text" isOpen maxHeight={100}>
          {itemsList}
        </Droplist>,
      );
    });

    it('should render Layer component', () => {
      const layer = wrapper.find(Layer);
      // Check that layer received our content
      expect(layer.find(ItemGroup).length).toBe(1);
      expect(layer.find(Trigger).length).toBe(1);
    });

    it('should pass required properties to Layer', () => {
      const layer = wrapper.find(Layer);
      expect(layer.prop('offset')).toBe('0, 8px');
      expect(layer.prop('position')).toBe('bottom left');
      expect(layer.prop('autoFlip')).toBe(wrapper.props().shouldFlip);
      expect(layer.prop('boundariesElement')).toBe('viewport');
      expect(layer.prop('content')).not.toBe(undefined);
    });

    it('should render dropdown list content with height of maxHeight', () => {
      expect(wrapper.find(Content).at(0).prop('maxHeight')).toBe(100);
    });

    it('should render droplist content', () => {
      // We passed a group as content so we should be able to find one
      expect(wrapper.find(ItemGroup).length).toBe(1);
    });

    it('should render trigger', () => {
      const triggerWrapper = wrapper.find(Trigger);
      expect(triggerWrapper.text()).toBe('text');
    });
  });

  describe('max height (appearance prop)', () => {
    it('should constrain max height on content by default', () => {
      expect(
        mount(<Droplist isOpen />)
          .find(Content)
          .prop('isTall'),
      ).toBe(false);
    });
    it('should not set max height if appearance = tall', () => {
      expect(
        mount(<Droplist isOpen appearance="tall" />)
          .find(Content)
          .prop('isTall'),
      ).toBe(true);
    });
  });

  describe('onOpenChange', () => {
    it('should be open when the isOpen property set to true', () => {
      const wrapper = mount(<Droplist trigger="text">{itemsList}</Droplist>);
      const hasItemGroup = () => wrapper.find(ItemGroup).length === 1;
      const isContentVisible = () => wrapper.find(Content).length === 1;

      expect(hasItemGroup()).toBe(false);
      expect(isContentVisible()).toBe(false);

      wrapper.setProps({ isOpen: true });
      expect(hasItemGroup()).toBe(true);
      expect(isContentVisible()).toBe(true);
    });

    it('should not call onOpenChange when closed', () => {
      const onOpenSpy = jest.fn();
      mount(
        <Droplist trigger="text" isOpen={false} onOpenChange={onOpenSpy}>
          {itemsList}
        </Droplist>,
      );

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
      });
      document.dispatchEvent(event);

      expect(onOpenSpy).not.toHaveBeenCalled();
    });

    it('should set isOpen property to false when Escape key pressed', () => {
      const onOpenSpy = jest.fn();
      mount(
        <Droplist trigger="text" isOpen onOpenChange={onOpenSpy}>
          {itemsList}
        </Droplist>,
      );

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
      });
      document.dispatchEvent(event);
      expect(onOpenSpy).toHaveBeenCalledWith({ isOpen: false, event });
    });

    it('should set isOpen property to false when Esc key pressed (emulating IE/Edge)', () => {
      const onOpenSpy = jest.fn();
      mount(
        <Droplist trigger="text" isOpen onOpenChange={onOpenSpy}>
          {itemsList}
        </Droplist>,
      );

      const event = new KeyboardEvent('keydown', {
        key: 'Esc',
      });
      document.dispatchEvent(event);
      expect(onOpenSpy).toHaveBeenCalledWith({ isOpen: false, event });
    });
  });

  describe('loading', () => {
    it('should show a Spinner (and no Groups) when it is loading and open', () => {
      const wrapper = mount(
        <Droplist isLoading isOpen>
          {itemsList}
        </Droplist>,
      );
      expect(wrapper.find(Spinner).length).toBe(1);
      expect(wrapper.find(ItemGroup).length).toBe(0);
    });

    it('should not show a Spinner when it is loading but not open', () => {
      const wrapper = mount(<Droplist isLoading>{itemsList}</Droplist>);
      expect(wrapper.find(Spinner).length).toBe(0);
    });
  });
});

describe('DroplistWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<DroplistWithAnalytics />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
