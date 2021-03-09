import React from 'react';
import { mount } from 'enzyme';
import Tag from '@atlaskit/tag';

import { MultiSelectStateless } from '../..';

describe('@atlaskit/multi-select - stateless', () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('callbacks', () => {
    const selectItems = [
      {
        heading: 'test',
        items: [
          { value: 1, content: '1' },
          { value: 2, content: '2' },
        ],
      },
    ];

    it('should call onRemoved when an item is removed', () => {
      const spy = jest.fn();
      const select = mount(
        <MultiSelectStateless
          items={selectItems}
          isOpen
          onRemoved={spy}
          selectedItems={[selectItems[0].items[0]]}
        />,
      );
      select.find(Tag).first().props().onAfterRemoveAction();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
