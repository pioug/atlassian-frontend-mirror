import React from 'react';
import { shallow, mount } from 'enzyme';
import FieldBase, { Label } from '@atlaskit/field-base';
import Droplist, { Group, Item } from '@atlaskit/droplist';
import UpIcon from '@atlaskit/icon/glyph/arrow-up';
import Spinner from '@atlaskit/spinner';

import { StatelessSelect } from '../..';
import InitialLoadingElement from '../../styled/InitialLoading';
import Content from '../../styled/Content';
import Trigger from '../../styled/Trigger';

import { name } from '../../version.json';

describe(name, () => {
  const animStub = window.cancelAnimationFrame;

  let rootElement;

  /**
   * Some of these tests check the focused element via `document.activeElement`.
   *
   * The default `mount()` method mounts into a div but doesn't attach it to the DOM.
   *
   * In order for `document.activeElement` to function as intended we need to explicitly
   * mount it into the DOM. We do this using the `attachTo` property.
   *
   * We mount to a div instead of `document.body` directly to avoid a react render warning.
   */
  beforeAll(() => {
    rootElement = document.createElement('div');
    document.body.appendChild(rootElement);
  });

  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  afterAll(() => {
    document.body.removeChild(rootElement);
    rootElement = undefined;
  });

  describe('render', () => {
    it('sanity check', () => {
      expect(shallow(<StatelessSelect />).exists()).toBe(true);
    });

    it('should render Label when the prop is set', () => {
      expect(mount(<StatelessSelect />).find(Label).length).toBe(0);
      expect(mount(<StatelessSelect label="test" />).find(Label).length).toBe(
        1,
      );
    });

    it('should render Droplist', () => {
      expect(mount(<StatelessSelect />).find(Droplist).length).toBe(1);
    });

    it('should render Fieldbase inside Droplist', () => {
      expect(mount(<StatelessSelect />).find(FieldBase).length).toBe(1);
      expect(
        mount(<StatelessSelect />)
          .find(Droplist)
          .find(FieldBase).length,
      ).toBe(1);
    });

    it('should render placeholder in trigger if there is no selected item', () => {
      expect(mount(<StatelessSelect placeholder="test" />).text()).toBe('test');
    });

    it('should render selected items`s content instead of placeholder', () => {
      const select = mount(
        <StatelessSelect
          placeholder="test"
          selectedItem={{ content: 'selected' }}
        />,
      );
      expect(select.text()).not.toBe('test');
      expect(select.text()).toBe('selected');
    });

    it('should render selectedItems elemBefore', () => {
      const select = mount(
        <StatelessSelect
          placeholder="test"
          selectedItem={{ elemBefore: <UpIcon label="up" /> }}
        />,
      );
      expect(select.find(UpIcon).length).toBe(1);
    });

    it('should render groups and items inside Droplist (when open)', () => {
      const selectItems = [
        {
          heading: 'test',
          items: [
            { value: 1, content: '1' },
            { value: 2, content: '2' },
          ],
        },
      ];
      const select = mount(<StatelessSelect items={selectItems} isOpen />);
      expect(select.find(Group).length).toBe(1);
      expect(select.find(Item).length).toBe(2);
      expect(select.find(Group).find(Item).length).toBe(2);
    });

    it('should only render groups with at least one match when filtering', () => {
      const selectItems = [
        {
          heading: 'group 1',
          items: [
            { value: 1, content: '1' },
            { value: 2, content: '2' },
          ],
        },
        {
          heading: 'group 2',
          items: [
            { value: 3, content: '3' },
            { value: 4, content: '4' },
          ],
        },
      ];
      const select = mount(
        <StatelessSelect items={selectItems} isOpen filterValue="1" />,
      );
      expect(select.find(Group).length).toBe(1);
      expect(select.find(Group).find(Item).length).toBe(1);
    });

    it('should not render any groups when there is not a single match when filtering', () => {
      const selectItems = [
        {
          heading: 'group 1',
          items: [
            { value: 1, content: '1' },
            { value: 2, content: '2' },
          ],
        },
        {
          heading: 'group 2',
          items: [
            { value: 3, content: '3' },
            { value: 4, content: '4' },
          ],
        },
      ];
      const select = mount(
        <StatelessSelect items={selectItems} isOpen filterValue="5" />,
      );
      expect(select.find(Group).length).toBe(0);
      expect(select.find(Group).find(Item).length).toBe(0);
    });
  });

  describe('props managements', () => {
    let select;

    afterEach(() => {
      select.unmount();
      select = undefined;
    });

    it('should pass props to Label', () => {
      select = mount(<StatelessSelect label="test" isRequired id="test2" />);
      const labelProps = select.find(Label).props();
      expect(labelProps.isRequired).toBe(true);
      expect(labelProps.label).toBe('test');
      expect(labelProps.htmlFor).toBe('test2');
    });

    describe('shouldFocus prop', () => {
      it('should focus inputNode when set to true', () => {
        select = mount(<StatelessSelect />, { attachTo: rootElement });
        expect(document.activeElement).not.toBe(select.instance().triggerNode);
        select.setProps({ shouldFocus: true });
        expect(document.activeElement).toBe(select.instance().triggerNode);
      });
    });

    it('should pass props to Droplist', () => {
      const func = () => {};
      select = mount(
        <StatelessSelect
          position="top right"
          isOpen
          onOpenChange={func}
          droplistShouldFitContainer={false}
          shouldFlip={false}
          maxHeight={300}
        />,
      );
      const droplistProps = select.find(Droplist).props();
      expect(droplistProps.position).toBe('top right');
      expect(droplistProps.isOpen).toBe(true);
      expect(droplistProps.isTriggerNotTabbable).toBe(true);
      expect(droplistProps.shouldFitContainer).toBe(false);
      expect(droplistProps.isKeyboardInteractionDisabled).toBe(true);
      expect(droplistProps.isTriggerDisabled).toBe(true);
      expect(droplistProps.shouldFlip).toBe(false);
      expect(droplistProps.maxHeight).toBe(300);
    });

    it('should pass props to fieldBase', () => {
      select = mount(
        <StatelessSelect isDisabled isInvalid isOpen invalidMessage="foobar" />,
      );
      const fieldbaseProps = select.find(FieldBase).props();
      expect(fieldbaseProps.isDisabled).toBe(true);
      expect(fieldbaseProps.isInvalid).toBe(true);
      expect(fieldbaseProps.isPaddingDisabled).toBe(true);
      expect(fieldbaseProps.isFitContainerWidthEnabled).toBe(true);
      expect(fieldbaseProps.invalidMessage).toBe('foobar');
    });

    it('should pass props to Item', () => {
      const selectItems = [
        {
          heading: 'test',
          items: [
            {
              value: 1,
              content: 'Test1',
              description: 'Descr',
              isDisabled: true,
              elemBefore: '1',
              elemAfter: '2',
              tooltipDescription: 'first',
            },
          ],
        },
      ];
      select = mount(
        <StatelessSelect
          isOpen
          id="testId"
          name="testName"
          items={selectItems}
        />,
      );
      const itemProps = select.find(Item).props();
      expect(itemProps.description).toBe('Descr');
      expect(itemProps.isDisabled).toBe(true);
      expect(itemProps.elemBefore).toBe('1');
      expect(itemProps.elemAfter).toBe('2');
      expect(itemProps.tooltipDescription).toBe('first');
    });
  });

  describe('hidden select', () => {
    let wrapper;
    const selectItems = [
      {
        heading: 'test',
        items: [
          { value: 1, content: 'Test1' },
          { value: 2, content: 'Test 2' },
          { value: 3, content: 'Third test', isDisabled: true },
        ],
      },
    ];
    const selectedItem = selectItems[0].items[1];

    beforeEach(() => {
      wrapper = mount(
        <StatelessSelect
          isOpen
          id="testId"
          name="testName"
          items={selectItems}
          selectedItem={selectedItem}
        />,
      );
    });

    it('should render a select tag', () => {
      expect(wrapper.find('select').length).toBe(1);
    });

    it('select tag should be invisible', () => {
      expect(wrapper.find('select').props().style.display).toBe('none');
    });

    describe('optgroups', () => {
      it('should render optgroups inside a select tag', () => {
        expect(wrapper.find('select').find('optgroup').length).toBe(1);
      });

      it('optgroups should have the label attribute', () => {
        const label = selectItems[0].heading;
        expect(
          wrapper.find('select').find(`optgroup[label="${label}"]`).length,
        ).toBe(1);
      });

      describe('options', () => {
        it('should render options inside optgroups', () => {
          expect(
            wrapper.find('select').find('optgroup').find('option').length,
          ).toBe(3);
        });

        it('should have "disabled" attribute if the option is disabled', () => {
          expect(
            wrapper.find('select').find('optgroup').find('option[disabled]')
              .length,
          ).toBe(1);
        });

        it('should have "value" attribute', () => {
          const firstValue = selectItems[0].items[0].value;
          const optgroup = wrapper.find('select').find('optgroup');
          expect(optgroup.find('option[value]').length).toBe(3);
          expect(optgroup.find(`option[value=${firstValue}]`).length).toBe(1);
        });

        it('should render content inside', () => {
          const firstContent = selectItems[0].items[0].content;
          const optgroup = wrapper.find('select').find('optgroup');
          expect(optgroup.find('option[value]').at(0).text()).toBe(
            firstContent,
          );
        });
      });
    });

    it('should pass selected value into the select tag', () => {
      const item = { value: 1, content: 'Test1' };
      const hiddenSelect = wrapper.find('select');
      expect(hiddenSelect.props().value).toEqual(selectedItem.value);

      wrapper.setProps({ selectedItem: item });
      expect(wrapper.find('select').props().value).toEqual(item.value);
    });

    it('select tag should have "readOnly" attribute', () => {
      expect(wrapper.find('select[readOnly]').length).toBe(1);
    });

    it('should pass id into the select tag', () => {
      expect(wrapper.find('select').props().id).toBe(wrapper.prop('id'));
    });

    it('should pass name into the select tag', () => {
      expect(wrapper.find('select').props().name).toBe(wrapper.prop('name'));
    });
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
    const selectedItem = selectItems[0].items[1];

    beforeEach(() => {
      wrapper = mount(
        <StatelessSelect
          isOpen
          items={selectItems}
          onFilterChange={onFilterChangeSpy}
          onOpenChange={onOpenChangeSpy}
          onSelected={onSelectedSpy}
          selectedItem={selectedItem}
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
      wrapper.setProps({ selectedItem });
    });

    describe('handleTriggerClick', () => {
      it('default behavior', () => {
        wrapper.setProps({ isOpen: false });
        const args = { event: {}, isOpen: true };
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

      it('should close select when it was open before', () => {
        wrapper.setProps({ isOpen: true });
        const args = { event: {}, isOpen: false };
        instance.handleTriggerClick({});
        expect(onOpenChangeSpy).toHaveBeenCalled();
        expect(onOpenChangeSpy).toHaveBeenCalledWith(args);
      });

      it('should focus the autocomplete textfield', () => {
        // Mount a new instance using attachTo for access to document.activeElement
        const focusWrapper = mount(
          <StatelessSelect
            isOpen
            items={selectItems}
            onFilterChange={onFilterChangeSpy}
            onOpenChange={onOpenChangeSpy}
            onSelected={onSelectedSpy}
            selectedItem={selectedItem}
          />,
          { attachTo: rootElement },
        );
        const focusInstance = focusWrapper.instance();
        focusWrapper.setProps({ isOpen: false, hasAutocomplete: true });
        focusInstance.handleTriggerClick({});
        expect(document.activeElement).toBe(focusInstance.inputNode);
        focusWrapper.unmount();
      });
      it('should focus the select after opening', () => {
        // Mount a new instance using attachTo for access to document.activeElement
        const focusWrapper = mount(
          <StatelessSelect
            isOpen
            items={selectItems}
            onFilterChange={onFilterChangeSpy}
            onOpenChange={onOpenChangeSpy}
            onSelected={onSelectedSpy}
            selectedItem={selectedItem}
          />,
          { attachTo: rootElement },
        );
        const focusInstance = focusWrapper.instance();
        focusWrapper.setProps({ isOpen: false });
        focusInstance.handleTriggerClick({});
        expect(document.activeElement).toBe(focusInstance.triggerNode);
        focusWrapper.unmount();
      });
    });

    describe('handleKeyboardInteractions', () => {
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

      it('should NOT call handleNativeSearch when autocompelte is enabled', () => {
        wrapper.setProps({ hasAutocomplete: true });
        const spy = jest.spyOn(instance, 'handleNativeSearch');
        const event = { key: 'j' };
        instance.handleKeyboardInteractions(event);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should NOT call handleNativeSearch when keyUp, keyDown or Enter are pressed', () => {
        wrapper.setProps({ hasAutocomplete: true });
        const spy = jest.spyOn(instance, 'handleNativeSearch');
        const preventDefaultSpy = jest.fn();
        ['Enter', 'ArrowUp', 'ArrowDown'].forEach(eventName => {
          const event = { key: eventName, preventDefault: preventDefaultSpy };
          instance.handleKeyboardInteractions(event);
        });
        expect(spy).not.toHaveBeenCalled();
      });

      it('should call handleNativeSearch when other keys are pressed and autocomplete is not enabled', () => {
        const spy = jest.spyOn(instance, 'handleNativeSearch');
        const event = { key: 'j' };
        instance.handleKeyboardInteractions(event);
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should only select one option, even when there are multiple groups', () => {
        wrapper.setProps({
          items: [
            {
              heading: 'Group 1',
              items: [
                { value: 11, content: 'Group 1 Item 1' },
                { value: 12, content: 'Group 1 Item 2' },
              ],
            },
            {
              heading: 'Group 2',
              items: [
                { value: 21, content: 'Group 2 Item 1' },
                { value: 22, content: 'Group 2 Item 2' },
              ],
            },
          ],
        });
        const event = { key: 'ArrowDown', preventDefault: () => {} };
        instance.handleKeyboardInteractions(event);
        wrapper.update();
        expect(
          wrapper
            .find(Item)
            .getElements()
            .filter(item => item.props.isFocused).length,
        ).toBe(1);
      });
    });

    describe('handleInputOnChange', () => {
      it('should call onFilterChange every time the value is changed', () => {
        const value1 = '1';
        const value2 = '2';
        let event = { key: '', currentTarget: { value: value1 } };
        instance.handleInputOnChange(event);
        expect(onFilterChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterChangeSpy).toHaveBeenCalledWith(value1);
        onFilterChangeSpy.mockClear();

        wrapper.setProps({ filterValue: value1 });
        event = { key: '', currentTarget: { value: value2 } };
        instance.handleInputOnChange(event);
        expect(onFilterChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterChangeSpy).toHaveBeenCalledWith(value2);
      });

      it('should not call onFilterChange when value is the same', () => {
        const value = '1';
        const event = { key: '', currentTarget: { value } };
        wrapper.setProps({ filterValue: value });
        instance.handleInputOnChange(event);
        expect(onFilterChangeSpy).not.toHaveBeenCalled();
      });
    });

    describe('filterItems', () => {
      it('should return items intact if nothing is selected and filter is empty', () => {
        const items = [
          { value: 1, content: 'Test1' },
          { value: 2, content: 'Test 2' },
          { value: 3, content: 'Third test' },
        ];
        wrapper.setProps({ filterValue: '' });
        wrapper.setProps({ selectedItem: {} });
        expect(instance.filterItems(items)).toEqual(items);
      });

      // NOTE: This test is flaky in CI for some reason.
      // it('should return filtered items when nothing is selected', () => {
      //   const items = [
      //     { value: 1, content: 'Test1' },
      //     { value: 2, content: 'Test 2' },
      //     { value: 3, content: 'Third test' },
      //   ];
      //   wrapper.setProps({ filterValue: 'Test1' });
      //   wrapper.setProps({ selectedItem: {} });
      //   expect(instance.filterItems(items)).toEqual([items[0]]);
      //   wrapper.setProps({ filterValue: 'test' });
      //   expect(instance.filterItems(items)).toEqual(items);
      // });

      it('should filter out selected item and return filtered items', () => {
        const items = [
          { value: 1, content: 'Test one' },
          { value: 2, content: 'Test two' },
          { value: 3, content: 'Test three' },
          { value: 4, content: 'This should stay behind' },
        ];
        wrapper.setProps({ filterValue: 'Test' });
        wrapper.setProps({ selectedItem: items[0] });
        expect(instance.filterItems(items)).toEqual([items[1], items[2]]);
      });

      describe('with filterValues', () => {
        it('should filter using filterValues instead of props, if available', () => {
          const items = [
            { content: 'One', value: '1', filterValues: ['1'] },
            { content: 'Two', value: '2', filterValues: ['2', 'three'] },
            { content: 'Three', value: '3' },
          ];
          wrapper.setProps({ selectedItem: {} });

          wrapper.setProps({ filterValue: '1' });
          expect(instance.filterItems(items)).toEqual([items[0]]);

          wrapper.setProps({ filterValue: 'One' });
          expect(instance.filterItems(items)).toEqual([]);

          wrapper.setProps({ filterValue: 'three' });
          expect(instance.filterItems(items)).toEqual([items[1], items[2]]);

          wrapper.setProps({ filterValue: '3' });
          expect(instance.filterItems(items)).toEqual([]);
        });
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

      it('should call onFilterChange with items`s content when called', () => {
        instance.handleItemSelect(item, attrs);
        expect(onFilterChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterChangeSpy).toHaveBeenCalledWith(item.content);
      });
    });

    describe('getNextFocusable', () => {
      it('should return 0 if undefined is passed as a current focus', () => {
        expect(instance.getNextFocusable(undefined, 2)).toBe(0);
      });

      it('should return next item', () => {
        expect(instance.getNextFocusable(0, 2)).toBe(1);
      });

      it('should return 0 if focus is on the last item', () => {
        expect(instance.getNextFocusable(2, 2)).toBe(0);
      });
    });

    describe('getPrevFocusable', () => {
      it('should return previous item', () => {
        expect(instance.getPrevFocusable(1, 2)).toBe(0);
      });

      it('should return length if focus is on the first item', () => {
        expect(instance.getPrevFocusable(0, 2)).toBe(2);
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
          selectedItem: items[0],
        });
        expect(instance.getAllVisibleItems(wrapper.prop('items'))).toEqual([
          items[1],
          items[2],
        ]);
      });
    });

    describe('getAllItems', () => {
      it('should return all items', () => {
        const items = [
          { value: 1, content: 'Test1' },
          { value: 2, content: 'Test 2' },
          { value: 3, content: 'Third test' },
          { value: 4, content: 'Something different' },
        ];

        wrapper.setProps({
          items: [{ heading: '', items }],
          filterValue: 'test',
          selectedItem: items[0],
        });
        expect(instance.getAllItems(wrapper.prop('items'))).toEqual(items);
      });
    });

    describe('getNextNativeSearchItem', () => {
      const items = [
        { content: 'some text' },
        { content: 'another text' },
        { content: 'test text 1' },
        { content: 'test text 2' },
        { content: 'test text 3' },
        { content: 'again another text' },
      ];

      it('should return first matching item after given index', () => {
        expect(instance.getNextNativeSearchItem(items, 't', 0)).toBe(items[2]);
        expect(instance.getNextNativeSearchItem(items, 't', 2)).toBe(items[3]);
      });

      it('should return first matching item in the array if nothing is found after given index', () => {
        expect(instance.getNextNativeSearchItem(items, 't', 4)).toBe(items[2]);
      });

      it('should return undefined if nothing is found', () => {
        expect(instance.getNextNativeSearchItem(items, 'y', 4)).toBe(undefined);
      });
    });

    describe('getItemTrueIndex', () => {
      it('should return the index of the item when there is only one group', () => {
        wrapper = mount(
          <StatelessSelect
            items={[
              {
                heading: 'Group 1',
                items: [
                  { value: 11, content: 'Group 1 Item 1' },
                  { value: 12, content: 'Group 1 Item 2' },
                  { value: 13, content: 'Group 1 Item 3' },
                ],
              },
            ]}
            isOpen
          />,
        );
        instance = wrapper.instance();
        expect(instance.getItemTrueIndex(0, 0)).toBe(0);
        expect(instance.getItemTrueIndex(2, 0)).toBe(2);
      });

      it('should return the index of the item when there are multiple groups', () => {
        wrapper = mount(
          <StatelessSelect
            items={[
              {
                heading: 'Group 1',
                items: [
                  { value: 11, content: 'Group 1 Item 1' },
                  { value: 12, content: 'Group 1 Item 2' },
                  { value: 13, content: 'Group 1 Item 3' },
                ],
              },
              {
                heading: 'Group 2',
                items: [
                  { value: 21, content: 'Group 2 Item 1' },
                  { value: 22, content: 'Group 2 Item 2' },
                  { value: 23, content: 'Group 2 Item 3' },
                  { value: 24, content: 'Group 2 Item 4' },
                ],
              },
            ]}
            isOpen
          />,
        );
        instance = wrapper.instance();
        expect(instance.getItemTrueIndex(0, 0)).toBe(0);
        expect(instance.getItemTrueIndex(2, 0)).toBe(2);
        expect(instance.getItemTrueIndex(0, 1)).toBe(3);
        expect(instance.getItemTrueIndex(3, 1)).toBe(6);
      });
    });

    describe('handleOnBlur', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should close select when handleOnBlur is called', () => {
        wrapper.setProps({ isOpen: true });
        const args = { event: {}, isOpen: false };
        instance.handleOnBlur({});
        expect(onOpenChangeSpy).toHaveBeenCalled();
        expect(onOpenChangeSpy).toHaveBeenCalledWith(args);
      });
      it('should close select when select is blurred', () => {
        wrapper.setProps({ isOpen: true });
        wrapper.find(Trigger).simulate('blur');
        jest.runOnlyPendingTimers();
        expect(onOpenChangeSpy).toHaveBeenCalled();
        expect(onOpenChangeSpy.mock.calls[0][0]).toEqual(
          expect.objectContaining({ isOpen: false }),
        );
      });
    });
  });

  describe('appearance variations', () => {
    it('should have appearance prop by default', () => {
      const wrapper = mount(<StatelessSelect />);
      expect(wrapper.prop('appearance')).toBe('default');
    });

    it('should correctly map appearance prop to FieldBase', () => {
      const defaultMultiSelect = mount(<StatelessSelect />);
      const standardFieldBase = defaultMultiSelect.find(FieldBase);
      const subtleMultiSelect = mount(<StatelessSelect appearance="subtle" />);
      const subtleFieldBase = subtleMultiSelect.find(FieldBase);
      expect(standardFieldBase.prop('appearance')).toBe('standard');
      expect(subtleFieldBase.prop('appearance')).toBe('subtle');
    });
  });

  describe('with JSX item content', () => {
    it('should show a console warning if item.label is not supplied when item.content is JSX', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const badItem = { value: 1, content: <span>One</span> };
      const goodItem = { value: 1, content: <span>One</span>, label: 'One' };
      const keyEvent = { key: 'a' };

      const wrapper = mount(
        <StatelessSelect
          isOpen
          items={[
            {
              heading: 'Group 1',
              items: [goodItem],
            },
          ]}
        />,
      );

      wrapper.simulate('keydown', keyEvent);
      expect(warnSpy).not.toHaveBeenCalled();

      wrapper.setProps({
        items: [
          {
            heading: 'Group 1',
            items: [badItem],
          },
        ],
      });
      wrapper.simulate('keydown', keyEvent);

      expect(warnSpy).toHaveBeenCalledWith(
        'SingleSelect: item.label must be set when item.content is JSX',
      );
    });

    it('should render item label instead of content', () => {
      const item = { value: 1, content: <span>One</span>, label: 'One!' };
      const wrapper = mount(
        <StatelessSelect
          items={[
            {
              items: [item],
            },
          ]}
          selectedItem={item}
        />,
      );
      expect(wrapper.find(Content).find('span').text()).toBe('One!');
    });

    it('should render item label instead of content when hasAutocomplete', () => {
      const item = { value: 1, content: <span>One</span>, label: 'One!' };
      const wrapper = mount(
        <StatelessSelect
          hasAutocomplete
          items={[
            {
              items: [item],
            },
          ]}
          selectedItem={item}
        />,
      );

      expect(wrapper.find('option[value=1]').text()).toBe('One!');
    });
  });

  describe('initial loading state', () => {
    it('should display loading icon and message when conditions are met', () => {
      const wrapper = mount(<StatelessSelect isLoading isOpen />);

      expect(wrapper.find(Spinner).length).toBe(1);
      expect(wrapper.find(InitialLoadingElement).length).toBe(1);
      expect(wrapper.find(InitialLoadingElement).props()['aria-live']).toBe(
        'polite',
      );
      expect(wrapper.find(InitialLoadingElement).props().role).toBe('status');
    });

    it('should accept a custom loading message', () => {
      const wrapper = mount(
        <StatelessSelect
          isLoading
          loadingMessage="Custom loading message here"
          isOpen
        />,
      );

      expect(wrapper.find(InitialLoadingElement).text()).toBe(
        'Custom loading message here',
      );
    });

    it('should not display loading icon and message when select is not open', () => {
      const wrapper = mount(<StatelessSelect isLoading isOpen={false} />);

      expect(wrapper.find(Spinner).length).toBe(0);
      expect(wrapper.find(InitialLoadingElement).length).toBe(0);
    });
  });
});
