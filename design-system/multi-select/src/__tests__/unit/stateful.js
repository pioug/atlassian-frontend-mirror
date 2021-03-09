import React from 'react';
import { mount } from 'enzyme';
import SearchIcon from '@atlaskit/icon/glyph/search';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import MultiSelect, { MultiSelectStateless } from '../..';

describe('@atlaskit/multi-select - smart', () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('render', () => {
    it('should render stateless multi select', () => {
      expect(mount(<MultiSelect />).find(MultiSelectStateless).length).toBe(1);
    });

    it('should pass ExpandIcon to the stateless component if no custom icon provided', () => {
      const wrapper = mount(<MultiSelect />);
      const statelessProps = wrapper.find(MultiSelectStateless).props();
      expect(statelessProps.icon).toEqual(<ExpandIcon label="" />);
    });

    it('should pass all the relevant props to the stateless component', () => {
      const items = [
        {
          heading: 'test',
          items: [
            { value: 1, content: '1' },
            { value: 2, content: '2' },
          ],
        },
      ];
      const wrapper = mount(
        <MultiSelect
          appearance="subtle"
          defaultSelected={[items[0].items[0]]}
          id="id"
          isDefaultOpen
          isDisabled
          shouldFocus
          isInvalid
          invalidMessage="invalid message"
          isRequired
          items={items}
          label="label"
          name="name"
          noMatchesFound="no matches"
          position="top left"
          icon={<SearchIcon label="" />}
          shouldFitContainer
        />,
      );
      const statelessProps = wrapper.find(MultiSelectStateless).props();
      expect(statelessProps.appearance).toBe('subtle');
      expect(statelessProps.id).toBe('id');
      expect(statelessProps.isDisabled).toBe(true);
      expect(statelessProps.isInvalid).toBe(true);
      expect(statelessProps.invalidMessage).toBe('invalid message');
      expect(statelessProps.isOpen).toBe(true);
      expect(statelessProps.isRequired).toBe(true);
      expect(statelessProps.items).toBe(items);
      expect(statelessProps.label).toBe('label');
      expect(statelessProps.name).toBe('name');
      expect(statelessProps.noMatchesFound).toBe('no matches');
      expect(statelessProps.position).toBe('top left');
      expect(statelessProps.selectedItems).toEqual([items[0].items[0]]);
      expect(statelessProps.shouldFitContainer).toBe(true);
      expect(statelessProps.shouldFocus).toBe(true);
      expect(statelessProps.icon).toEqual(<SearchIcon label="" />);
    });
  });

  describe('inner functions', () => {
    let wrapper;
    let instance;
    const onFilterChangeSpy = jest.fn();
    const onOpenChangeSpy = jest.fn();
    const onSelectedChange = jest.fn();
    const items = [
      {
        heading: 'test',
        items: [
          { value: 1, content: '1' },
          { value: 2, content: '2' },
        ],
      },
    ];

    beforeEach(() => {
      wrapper = mount(
        <MultiSelect
          defaultSelected={[items[0].items[0]]}
          items={items}
          onFilterChange={onFilterChangeSpy}
          onOpenChange={onOpenChangeSpy}
          onSelectedChange={onSelectedChange}
        />,
      );
      instance = wrapper.instance();
    });

    afterEach(() => {
      onFilterChangeSpy.mockClear();
      onOpenChangeSpy.mockClear();
      onSelectedChange.mockClear();
    });

    describe('handleOpenChange', () => {
      const attrs = { isOpen: true };

      it('should call onOpenChange when triggered', () => {
        instance.handleOpenChange(attrs);
        expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);
        expect(onOpenChangeSpy).toHaveBeenCalledWith(attrs);
      });

      it('should set isOpen state', () => {
        instance.handleOpenChange(attrs);
        expect(wrapper.state().isOpen).toBe(true);
        instance.handleOpenChange({ isOpen: false });
        expect(wrapper.state().isOpen).toBe(false);
      });

      it('should fire onOpenChange only when isOpen changed', () => {
        instance.handleOpenChange(attrs);
        expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);
        onOpenChangeSpy.mockClear();

        instance.handleOpenChange({ isOpen: false });
        expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);
        onOpenChangeSpy.mockClear();

        instance.handleOpenChange({ isOpen: false });
        expect(onOpenChangeSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe('handleFilterChange', () => {
      const value = 'test';
      it('should call onFilterChange when triggered', () => {
        instance.handleFilterChange(value);
        expect(onFilterChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterChangeSpy).toHaveBeenCalledWith(value);
      });

      it('should set filterValue state', () => {
        instance.handleFilterChange(value);
        expect(wrapper.state().filterValue).toBe(value);
      });
    });

    describe('selectedChange', () => {
      it('should call removeItem when an item was removed', () => {
        const item = items[0].items[0];
        const spy = jest.spyOn(instance, 'removeItem');
        instance.selectedChange(item);
        expect(spy).toHaveBeenCalled();
      });

      it('should call selectItem when an item was added', () => {
        const spy = jest.spyOn(instance, 'selectItem');
        instance.selectedChange({ content: 'something new', value: 2 });
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('removeItem', () => {
      it('should remove the item and set the new selectedItems state', () => {
        const item = items[0].items[0];
        instance.removeItem(item);
        expect(wrapper.state().selectedItems).toEqual([]);
      });

      it('should remove the item and call onSelectedChange', () => {
        const item = items[0].items[0];
        instance.removeItem(item);
        expect(onSelectedChange).toHaveBeenCalledTimes(1);
      });

      it('onSelectedChange should be called with the correct params', () => {
        const item = items[0].items[0];
        instance.removeItem(item);
        expect(onSelectedChange).toHaveBeenCalledWith({
          items: [],
          action: 'remove',
          changed: item,
        });
      });
    });

    describe('selectItem', () => {
      it('should add the item and set the new selectedItems state', () => {
        const item = { content: 'new', value: 2 };
        instance.selectItem(item);
        expect(wrapper.state().selectedItems).toEqual([
          items[0].items[0],
          item,
        ]);
      });

      it('should add the item and call onSelectedChange', () => {
        const item = { content: 'new', value: 2 };
        instance.selectItem(item);
        expect(onSelectedChange).toHaveBeenCalledTimes(1);
      });

      it('onSelectedChange should be called with the correct params', () => {
        const item = { content: 'new', value: 2 };
        instance.selectItem(item);
        expect(onSelectedChange).toHaveBeenCalledWith({
          items: [items[0].items[0], item],
          action: 'select',
          changed: item,
        });
      });
    });

    describe('handleNewItemCreate', () => {
      it('should append new item to the list', () => {
        const newValue = 'new';
        instance.handleNewItemCreate({ value: newValue });
        const { items: itemsList } = wrapper.state().items[0];
        expect(itemsList.length).toBe(3);
        expect(itemsList[2].content).toBe(newValue);
      });

      it('should make new value selected', () => {
        const newValue = 'new';
        instance.handleNewItemCreate({ value: newValue });
        const { selectedItems } = wrapper.state();
        expect(selectedItems.length).toBe(2);
        expect(selectedItems[1].content).toBe(newValue);
      });
    });
  });
});
