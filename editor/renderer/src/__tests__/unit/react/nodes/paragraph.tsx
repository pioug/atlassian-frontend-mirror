import React from 'react';
import { shallow, mount } from 'enzyme';
import Paragraph from '../../../../react/nodes/paragraph';

describe('Renderer - React/Nodes/Paragraph', () => {
  it('should wrap content with <p>-tag', () => {
    const paragraph = shallow(<Paragraph>This is a paragraph</Paragraph>);
    expect(paragraph.is('p')).toEqual(true);
  });

  it('should render <br> tags in empty paragraphs', () => {
    const render = mount(
      <>
        <Paragraph />
        <Paragraph>This is a paragraph</Paragraph>
        <Paragraph />
      </>,
    );

    const paragraphs = render.find(Paragraph);

    expect(paragraphs.at(0).html()).toEqual('<p>&nbsp;</p>');
    expect(paragraphs.at(2).html()).toEqual('<p>&nbsp;</p>');
  });
});
