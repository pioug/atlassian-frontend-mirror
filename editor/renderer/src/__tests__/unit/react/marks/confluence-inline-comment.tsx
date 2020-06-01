import React from 'react';
import { mount } from 'enzyme';
import ConfluenceInlineComment from '../../../../react/marks/confluence-inline-comment';

describe('Renderer - React/Marks/ConfluenceInlineComment', () => {
  const create = () =>
    mount(
      <ConfluenceInlineComment
        dataAttributes={{ 'data-renderer-mark': true }}
        reference="this-is-reference-hash"
      >
        wrapped text
      </ConfluenceInlineComment>,
    );

  it('should wrap content with <span>-tag', () => {
    const mark = create();
    expect(mark.find('span').length).toEqual(1);
    mark.unmount();
  });

  it('should set data-reference to attrs.reference', () => {
    const mark = create();
    expect(mark.find('span').props()).toHaveProperty(
      'data-reference',
      'this-is-reference-hash',
    );
    expect(mark.find('span').props()).toHaveProperty(
      'data-mark-type',
      'confluenceInlineComment',
    );
    mark.unmount();
  });
});
