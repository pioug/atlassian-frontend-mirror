import React from 'react';
import { shallow } from 'enzyme';
import Strike from '../../../../react/marks/strike';

describe('Renderer - React/Marks/Strike', () => {
  const mark = shallow(
    <Strike dataAttributes={{ 'data-renderer-mark': true }}>
      Strike this
    </Strike>,
  );

  it('should wrap content with <span>-tag', () => {
    expect(mark.is('span')).toEqual(true);
  });

  it('should output correct html', () => {
    expect(mark.html()).toEqual(
      '<span data-renderer-mark="true" style="text-decoration:line-through">Strike this</span>',
    );
  });
});
