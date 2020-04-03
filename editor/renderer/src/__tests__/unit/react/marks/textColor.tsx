import React from 'react';
import { shallow } from 'enzyme';
import TextColor from '../../../../react/marks/textColor';

describe('Renderer - React/Marks/TextColor', () => {
  const mark = shallow(
    <TextColor color="#ff0000">This is a red text</TextColor>,
  );

  it('should wrap content with <span>-tag', () => {
    expect(mark.is('span')).toEqual(true);
  });

  it('should output correct html', () => {
    expect(mark.html()).toEqual(
      '<span style="color:#ff0000">This is a red text</span>',
    );
  });
});
