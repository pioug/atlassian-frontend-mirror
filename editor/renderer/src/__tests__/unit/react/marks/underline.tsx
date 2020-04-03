import React from 'react';
import { shallow } from 'enzyme';
import Underline from '../../../../react/marks/underline';

describe('Renderer - React/Marks/Underline', () => {
  const mark = shallow(<Underline>This is underlined</Underline>);

  it('should wrap content with <u>-tag', () => {
    expect(mark.is('u')).toEqual(true);
  });

  it('should output correct html', () => {
    expect(mark.html()).toEqual('<u>This is underlined</u>');
  });
});
