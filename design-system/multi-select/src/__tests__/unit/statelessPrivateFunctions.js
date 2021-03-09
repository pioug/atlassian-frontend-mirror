import React from 'react';
import { mount } from 'enzyme';

import { MultiSelectStateless } from '../..';

/* eslint-disable jest/no-disabled-tests */
describe('@atlaskit/multi-select - stateless', () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('private functions', () => {
    const onFilterChangeSpy = jest.fn();
    const onOpenChangeSpy = jest.fn();
    const onSelectedSpy = jest.fn();
    const onRemovedSpy = jest.fn();
    let wrapper;
    let instance;
    const selectItems = [
      {
        heading: 'test',
        items: [
          { value: 1, content: 'Test1' },
          { value: 2, content: 'Test 2' },
          { value: 3, content: 'Third test' },
        ],
      },
    ];
    const selectedItems = [selectItems[0].items[1]];

    beforeEach(() => {
      wrapper = mount(
        <MultiSelectStateless
          isOpen
          items={selectItems}
          onFilterChange={onFilterChangeSpy}
          onOpenChange={onOpenChangeSpy}
          onRemoved={onRemovedSpy}
          onSelected={onSelectedSpy}
          selectedItems={selectedItems}
        />,
      );
      instance = wrapper.instance();
    });

    afterEach(() => {
      onFilterChangeSpy.mockClear();
      onOpenChangeSpy.mockClear();
      onSelectedSpy.mockClear();
      onRemovedSpy.mockClear();
      wrapper.setProps({ filterValue: '' });
      wrapper.setProps({ selectedItems });
    });

    describe('handleTriggerClick', () => {
      it('default behavior', () => {
        const args = { event: {}, isOpen: true, inputNode: instance.inputNode };
        instance.handleTriggerClick({});
        expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);
        expect(onOpenChangeSpy).toHaveBeenCalledWith(args);
      });

      it('disabled select', () => {
        wrapper.setProps({ isDisabled: true });
        instance.handleTriggerClick({});
        expect(onOpenChangeSpy).not.toHaveBeenCalled();
        wrapper.setProps({ isDisabled: false });
      });
    });

    it('handleItemRemove', () => {
      const args = {};
      instance.handleItemRemove(args);
      expect(onRemovedSpy).toHaveBeenCalledTimes(1);
      expect(onRemovedSpy).toHaveBeenCalledWith(args);
    });

    it('removeLatestItem', () => {
      const spy = jest.spyOn(instance, 'handleItemRemove');
      instance.removeLatestItem();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(onRemovedSpy).toHaveBeenCalledWith(selectedItems[0]);
    });

    describe('handleKeyboardInteractions', () => {
      it('should call onOpenChange when there was no value and Backspace was pressed', () => {
        const event = { key: 'Backspace', target: { value: '' } };
        instance.handleKeyboardInteractions(event);
        expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);
        expect(onOpenChangeSpy).toHaveBeenCalledWith({
          event,
          isOpen: true,
          inputNode: instance.inputNode,
        });
      });

      it('should call removeLatestItem when there was no value and Backspace was pressed', () => {
        const spy = jest.spyOn(instance, 'removeLatestItem');
        const event = { key: 'Backspace', target: { value: '' } };
        instance.handleKeyboardInteractions(event);
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should call focusNextItem when ArrowDown is pressed and Select is open', () => {
        const spy = jest.spyOn(instance, 'focusNextItem');
        const preventDefaultSpy = jest.fn();
        const event = { key: 'ArrowDown', preventDefault: preventDefaultSpy };
        instance.handleKeyboardInteractions(event);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      });

      it('should call focusNextItem when ArrowDown is pressed and Select is closed', () => {
        wrapper.setProps({ isOpen: false });
        const spy = jest.spyOn(instance, 'focusNextItem');
        const preventDefaultSpy = jest.fn();
        const event = { key: 'ArrowDown', preventDefault: preventDefaultSpy };
        instance.handleKeyboardInteractions(event);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      });

      it('should call onOpenChange when ArrowDown is pressed and Select is closed', () => {
        wrapper.setProps({ isOpen: false });
        const spy = jest.spyOn(instance, 'onOpenChange');
        const preventDefaultSpy = jest.fn();
        const event = { key: 'ArrowDown', preventDefault: preventDefaultSpy };
        instance.handleKeyboardInteractions(event);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      });

      it('should call focusPreviousItem when ArrowUp is pressed and Select is open', () => {
        const spy = jest.spyOn(instance, 'focusPreviousItem');
        const preventDefaultSpy = jest.fn();
        const event = { key: 'ArrowUp', preventDefault: preventDefaultSpy };
        instance.handleKeyboardInteractions(event);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      });

      it('should NOT call focusPreviousItem when ArrowUp is pressed and Select is closed', () => {
        wrapper.setProps({ isOpen: false });
        const spy = jest.spyOn(instance, 'focusPreviousItem');
        const preventDefaultSpy = jest.fn();
        const event = { key: 'ArrowUp', preventDefault: preventDefaultSpy };
        instance.handleKeyboardInteractions(event);
        expect(spy).not.toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      });

      it('should call handleItemSelect when Enter is pressed and an item is focused and Select is open', () => {
        wrapper.setState({ focusedItemIndex: 0 });
        const spy = jest.spyOn(instance, 'handleItemSelect');
        const preventDefaultSpy = jest.fn();
        const event = { key: 'Enter', preventDefault: preventDefaultSpy };
        instance.handleKeyboardInteractions(event);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      });

      it('should NOT call handleItemSelect when Enter is pressed and no item is focused and Select is open', () => {
        const spy = jest.spyOn(instance, 'handleItemSelect');
        const preventDefaultSpy = jest.fn();
        const event = { key: 'Enter', preventDefault: preventDefaultSpy };
        instance.handleKeyboardInteractions(event);
        expect(spy).not.toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      });

      it('should NOT call handleItemSelect when Enter is pressed and Select is closed', () => {
        wrapper.setProps({ isOpen: false });
        wrapper.setState({ focusedItemIndex: 0 });
        const spy = jest.spyOn(instance, 'handleItemSelect');
        const preventDefaultSpy = jest.fn();
        const event = { key: 'Enter', preventDefault: preventDefaultSpy };
        instance.handleKeyboardInteractions(event);
        expect(spy).not.toHaveBeenCalled();
        expect(preventDefaultSpy).not.toHaveBeenCalled();
      });

      it('should call handleItemCreate when Enter is pressed and shouldAllowCreateItem is true', () => {
        wrapper.setState({ focusedItemIndex: null });
        const spy = jest.spyOn(instance, 'handleItemCreate');
        const preventDefaultSpy = jest.fn();
        const event = { key: 'Enter', preventDefault: preventDefaultSpy };

        wrapper.setProps({ shouldAllowCreateItem: false });
        instance.handleKeyboardInteractions(event);
        expect(spy).not.toHaveBeenCalled();

        wrapper.setProps({ shouldAllowCreateItem: true });
        instance.handleKeyboardInteractions(event);
        expect(spy).toHaveBeenCalledTimes(1);

        expect(preventDefaultSpy).toHaveBeenCalledTimes(2);
      });
    });

    describe('handleOnChange', () => {
      it.skip('should call onFilterChange every time the value is changed', () => {
        const value1 = '1';
        const value2 = '2';
        let event = { key: '', currentTarget: { value: value1 } };
        instance.handleOnChange(event);
        expect(onFilterChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterChangeSpy).toHaveBeenCalledWith(value1);
        onFilterChangeSpy.mockClear();

        wrapper.setProps({ filterValue: value1 });
        event = { key: '', currentTarget: { value: value2 } };
        instance.handleOnChange(event);
        expect(onFilterChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterChangeSpy).toHaveBeenCalledWith(value2);
      });

      it('should not call onFilterChange when value is the same', () => {
        const value = '1';
        const event = { key: '', currentTarget: { value } };
        wrapper.setProps({ filterValue: value });
        instance.handleOnChange(event);
        expect(onFilterChangeSpy).not.toHaveBeenCalled();
      });

      it.skip('should reset focus if shouldAllowCreateItem is set to true', () => {
        const event = { key: '', currentTarget: { value: '1' } };
        wrapper.setProps({ shouldAllowCreateItem: true });
        wrapper.setState({ focusedItemIndex: 1 });
        instance.handleOnChange(event);
        expect(wrapper.state().focusedItemIndex).toBe(undefined);
      });
    });

    describe('onFocus', () => {
      it('default behavior', () => {
        wrapper.setState({ isFocused: false });
        instance.onFocus();
        expect(wrapper.state().isFocused).toBe(true);
      });

      it('disabled select', () => {
        wrapper.setState({ isFocused: false });
        wrapper.setProps({ isDisabled: true });
        instance.onFocus();
        expect(wrapper.state().isFocused).toBe(false);
      });
    });

    describe('onBlur', () => {
      it('default behavior', () => {
        wrapper.setState({ isFocused: true });
        instance.onBlur();
        expect(wrapper.state().isFocused).toBe(false);
      });

      it('disabled select', () => {
        wrapper.setState({ isFocused: true });
        wrapper.setProps({ isDisabled: true });
        instance.onBlur();
        expect(wrapper.state().isFocused).toBe(true);
      });
    });

    describe('getPlaceholder', () => {
      const items = [
        { value: 1, content: 'Test1' },
        { value: 2, content: 'Test 2' },
        { value: 3, content: 'Third test' },
      ];
      const placeholder = 'Test!';

      it('should return "placeholder" text for the empty select', () => {
        wrapper.setProps({ isOpen: false });
        wrapper.setProps({ selectedItems: [] });
        wrapper.setProps({ placeholder });
        expect(instance.getPlaceholder()).toBe(placeholder);
      });

      it('should return null if some items are selected', () => {
        wrapper.setProps({ isOpen: false });
        wrapper.setProps({ selectedItems: [items[0]] });
        wrapper.setProps({ placeholder });
        expect(instance.getPlaceholder()).toBe(undefined);
      });

      it('should return null if the select is opened', () => {
        wrapper.setProps({ isOpen: true });
        wrapper.setProps({ selectedItems: [] });
        wrapper.setProps({ placeholder });
        expect(instance.getPlaceholder()).toBe(undefined);
      });
    });

    describe('handleItemSelect', () => {
      const item = selectItems[0].items[0];
      const attrs = { event: {} };

      it('should call onSelected when called', () => {
        instance.handleItemSelect(item, attrs);
        expect(onSelectedSpy).toHaveBeenCalledTimes(1);
      });

      it('should call onOpenChange when called', () => {
        instance.handleItemSelect(item, attrs);
        expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);
        expect(onOpenChangeSpy).toHaveBeenCalledWith({
          isOpen: false,
          event: attrs.event,
        });
      });

      it('should call onFilterChange with empty string when called', () => {
        instance.handleItemSelect(item, attrs);
        expect(onFilterChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterChangeSpy).toHaveBeenCalledWith('');
      });
    });

    describe('handleItemCreate', () => {
      beforeEach(() => {
        wrapper.setProps({ shouldAllowCreateItem: true });
      });

      it('should call onNewItemCreated prop when there is a new value', () => {
        const spy = jest.fn();
        const testValue = 'test';
        wrapper.setProps({ onNewItemCreated: spy, filterValue: testValue });
        instance.handleItemCreate({});
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ value: testValue });
      });

      it('should call handleItemSelect when the value match the existing value', () => {
        const spyCreate = jest.fn();
        const spySelect = jest.spyOn(instance, 'handleItemSelect');
        const testValue = 'Test1';

        wrapper.setProps({
          onNewItemCreated: spyCreate,
          filterValue: testValue,
        });
        instance.handleItemCreate({});
        expect(spyCreate).not.toHaveBeenCalled();
        expect(spySelect).toHaveBeenCalledTimes(1);
        expect(spySelect).toHaveBeenCalledWith(
          { value: 1, content: 'Test1' },
          { event: {} },
        );
      });
    });

    describe('getAllVisibleItems', () => {
      it('should return all visible items', () => {
        const items = [
          { value: 1, content: 'Test1' },
          { value: 2, content: 'Test 2' },
          { value: 3, content: 'Third test' },
          { value: 4, content: 'Something different' },
        ];

        wrapper.setProps({
          items: [{ heading: '', items }],
          filterValue: 'test',
          selectedItems: [items[0]],
        });
        expect(instance.getAllVisibleItems(wrapper.prop('items'))).toEqual([
          items[1],
          items[2],
        ]);
      });
    });
  });
});
