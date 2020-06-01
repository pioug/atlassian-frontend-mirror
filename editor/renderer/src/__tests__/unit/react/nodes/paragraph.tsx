import React from 'react';
import { shallow, mount } from 'enzyme';
import Paragraph from '../../../../react/nodes/paragraph';
import ReactSerializer from '../../../../react';

describe('Renderer - React/Nodes/Paragraph', () => {
  let serialiser = new ReactSerializer({});

  it('should wrap content with <p>-tag', () => {
    const paragraph = shallow(
      <Paragraph
        marks={[]}
        serializer={serialiser}
        nodeType="paragraph"
        dataAttributes={{ 'data-renderer-start-pos': 0 }}
      >
        This is a paragraph
      </Paragraph>,
    );
    expect(paragraph.is('p')).toEqual(true);
  });

  it('should render <br> tags in empty paragraphs', () => {
    const render = mount(
      <>
        <Paragraph
          marks={[]}
          serializer={serialiser}
          nodeType="paragraph"
          dataAttributes={{ 'data-renderer-start-pos': 0 }}
        />
        <Paragraph
          marks={[]}
          serializer={serialiser}
          nodeType="paragraph"
          dataAttributes={{ 'data-renderer-start-pos': 1 }}
        >
          This is a paragraph
        </Paragraph>
        <Paragraph
          marks={[]}
          serializer={serialiser}
          nodeType="paragraph"
          dataAttributes={{ 'data-renderer-start-pos': 19 }}
        />
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
