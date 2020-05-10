import React from 'react';
import { shallow, mount } from 'enzyme';
import Paragraph from '../../../../react/nodes/paragraph';

describe('Renderer - React/Nodes/Paragraph', () => {
  it('should wrap content with <p>-tag', () => {
    const paragraph = shallow(
      <Paragraph dataAttributes={{ 'data-renderer-start-pos': 0 }}>
        This is a paragraph
      </Paragraph>,
    );
    expect(paragraph.is('p')).toEqual(true);
  });

  it('should render <br> tags in empty paragraphs', () => {
    const render = mount(
      <>
        <Paragraph dataAttributes={{ 'data-renderer-start-pos': 0 }} />
        <Paragraph dataAttributes={{ 'data-renderer-start-pos': 1 }}>
          This is a paragraph
        </Paragraph>
        <Paragraph dataAttributes={{ 'data-renderer-start-pos': 19 }} />
      </>,
    );

    const paragraphs = render.find(Paragraph);

    expect(paragraphs.at(0).html()).toEqual(
      '<p data-renderer-start-pos="0">&nbsp;</p>',
    );
    expect(paragraphs.at(2).html()).toEqual(
      '<p data-renderer-start-pos="19">&nbsp;</p>',
    );
  });
});
