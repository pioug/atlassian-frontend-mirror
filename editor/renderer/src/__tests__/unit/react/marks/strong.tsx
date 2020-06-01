import React from 'react';
import { shallow } from 'enzyme';
import Strong from '../../../../react/marks/strong';

describe('Renderer - React/Marks/Strong', () => {
  const mark = shallow(
    <Strong dataAttributes={{ 'data-renderer-mark': true }}>
      This is strong
    </Strong>,
  );

  it('should wrap content with <strong>-tag', () => {
    expect(mark.is('strong')).toEqual(true);
  });

  it('should output correct html', () => {
    expect(mark.html()).toEqual(
      '<strong data-renderer-mark="true">This is strong</strong>',
    );
  });
});
