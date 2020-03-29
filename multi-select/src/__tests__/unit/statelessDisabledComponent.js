import React from 'react';
import { mount } from 'enzyme';
import { FieldBaseStateless } from '@atlaskit/field-base';
import { MultiSelectStateless } from '../..';
import Trigger from '../../components/Trigger';

import { name } from '../../version.json';

describe(`${name} - stateless`, () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('disabled component', () => {
    let wrapper;
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
          appearance="subtle"
          isDisabled
          items={selectItems}
          selectedItems={selectedItems}
        />,
      );
    });

    it('native select should be "disabled"', () => {
      expect(wrapper.find('select[disabled]').length).toBe(1);
    });

    it('should pass appearance property to field base', () => {
      expect(wrapper.find(FieldBaseStateless).prop('appearance')).toBe(
        'subtle',
      );
    });

    it('should pass isDisabled property to field base', () => {
      expect(wrapper.find(FieldBaseStateless).prop('isDisabled')).toBe(true);
    });

    it('should pass isDisabled property to Trigger sub-component', () => {
      expect(wrapper.find(Trigger).prop('isDisabled')).toBe(true);
    });

    it('should not render input if disabled', () => {
      expect(wrapper.find('input[disabled]').length).toBe(0);
    });
  });
});
