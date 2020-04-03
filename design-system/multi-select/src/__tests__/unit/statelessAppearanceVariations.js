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

  describe('appearance variations', () => {
    it('should have appearance prop by default', () => {
      const wrapper = mount(<MultiSelectStateless />);
      expect(wrapper.prop('appearance')).toBe('default');
    });

    it('should correctly map appearance prop to FieldBase', () => {
      const defaultMultiSelect = mount(<MultiSelectStateless />);
      const standardFieldBase = defaultMultiSelect.find(FieldBaseStateless);
      const subtleMultiSelect = mount(
        <MultiSelectStateless appearance="subtle" />,
      );
      const subtleFieldBase = subtleMultiSelect.find(FieldBaseStateless);
      expect(standardFieldBase.prop('appearance')).toBe('standard');
      expect(subtleFieldBase.prop('appearance')).toBe('subtle');
    });
  });
});
