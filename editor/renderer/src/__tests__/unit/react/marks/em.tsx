import React from 'react';
import { shallow } from 'enzyme';
import Em from '../../../../react/marks/em';

describe('Renderer - React/Marks/Em', () => {
  const mark = shallow(
    <Em dataAttributes={{ 'data-renderer-mark': true }}>This is italic</Em>,
  );

  it('should wrap content with <em>-tag', () => {
    expect(mark.is('em')).toEqual(true);
  });

  it('should output correct html', () => {
    expect(mark.html()).toEqual(
      '<em data-renderer-mark="true">This is italic</em>',
    );
  });
});
