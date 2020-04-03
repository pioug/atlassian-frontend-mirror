import React from 'react';
import { mount } from 'enzyme';
import { FieldBaseStateless } from '@atlaskit/field-base';
import { MultiSelectStateless } from '../..';

import { name } from '../../version.json';

describe(`${name} - stateless`, () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('invalid component', () => {
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
          isInvalid
          isOpen
          invalidMessage="invalid message"
          items={selectItems}
          selectedItems={selectedItems}
        />,
      );
    });

    it('should pass isInvalid property to field base', () => {
      expect(wrapper.find(FieldBaseStateless).prop('isInvalid')).toBe(true);
    });

    it('should pass invalidMessage property to field base', () => {
      expect(wrapper.find(FieldBaseStateless).prop('invalidMessage')).toBe(
        'invalid message',
      );
    });

    it('should set isDialogOpen property on field base', () => {
      expect(wrapper.find(FieldBaseStateless).prop('isDialogOpen')).toBe(true);
    });
  });
});
