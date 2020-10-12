import React from 'react';
import { mount } from 'enzyme';

import {
  FlashAnimation,
  Props,
  flashStyle,
} from '../../../components/FlashAnimation';

jest.useFakeTimers();

describe('Flash', () => {
  const renderFlash = (props: Partial<Props> = {}) => (
    <FlashAnimation {...props}>
      <span>my background will flash</span>
    </FlashAnimation>
  );

  it('should not include flash class', () => {
    const flash = mount(renderFlash());
    expect(flash.find('div').prop('className')).not.toMatch(flashStyle);
  });

  it('should include flash class', () => {
    const flash = mount(renderFlash({ flash: true }));
    expect(flash.find('div').prop('className')).toMatch(flashStyle);
  });
});
