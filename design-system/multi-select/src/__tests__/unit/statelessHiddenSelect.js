import React from 'react';
import { mount } from 'enzyme';

import { MultiSelectStateless } from '../..';

describe('@atlaskit/multi-select - stateless', () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
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
    const selectedItems = [selectItems[0].items[1]];

    beforeEach(() => {
      wrapper = mount(
        <MultiSelectStateless
          isOpen
          id="testId"
          name="testName"
          items={selectItems}
          selectedItems={selectedItems}
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
      it('should render optgroups inside select tag', () => {
        expect(wrapper.find('select').find('optgroup').length).toBe(1);
      });

      it('optgroups should have label attribute', () => {
        const label = selectItems[0].heading;
        expect(
          wrapper.find('select').find(`optgroup[label="${label || ''}"]`)
            .length,
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

    it('should pass selected values into the select tag', () => {
      const items = [
        { value: 1, content: 'Test1' },
        { value: 2, content: 'Test 2' },
        { value: 3, content: 'Third test' },
      ];
      const itemsValues = [items[0].value, items[1].value, items[2].value];
      const hiddenSelect = wrapper.find('select');
      expect(hiddenSelect.props().value).toEqual([selectedItems[0].value]);

      wrapper.setProps({ selectedItems: items });
      wrapper.update();
      expect(wrapper.find('select').props().value).toEqual(itemsValues);
    });

    it('select tag should have "multiple" attribute', () => {
      expect(wrapper.find('select[multiple]').length).toBe(1);
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
});
