import React from 'react';
import { render } from '@testing-library/react';
import Paragraph from '../../../../react/nodes/paragraph';
import ReactSerializer from '../../../../react';

describe('Renderer - React/Nodes/Paragraph', () => {
  let serialiser = new ReactSerializer({});

  it('should wrap content with <p>-tag', () => {
    const { container } = render(
      <Paragraph
        marks={[]}
        serializer={serialiser}
        nodeType="paragraph"
        dataAttributes={{ 'data-renderer-start-pos': 0 }}
      >
        This is a paragraph
      </Paragraph>,
    );
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('should render <br> tags in empty paragraphs', () => {
    const { container } = render(
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

    const paragraphs = container.querySelectorAll('p');

    expect(paragraphs[0].innerHTML).toEqual('&nbsp;');
    expect(paragraphs[0]).toHaveAttribute('data-renderer-start-pos', '0');
    expect(paragraphs[2].innerHTML).toEqual('&nbsp;');
    expect(paragraphs[2]).toHaveAttribute('data-renderer-start-pos', '19');
  });
});
