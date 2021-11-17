import React from 'react';
import { mount } from 'enzyme';
import FragmentMark from '../../../../react/marks/fragment';

describe('Renderer - React/Marks/Fragment', () => {
  const createMarkElement = (isInline: boolean) =>
    mount(
      <FragmentMark
        isInline={isInline}
        localId="test-local-id"
        name="test-fragment-name"
        dataAttributes={{ 'data-renderer-mark': true }}
        reference="this-is-reference-hash"
      >
        wrapped text
      </FragmentMark>,
    );

  it('should wrap content with <div>-tag for block elements', () => {
    const mark = createMarkElement(false);
    expect(mark.find('div').length).toEqual(1);
    mark.unmount();
  });
  it('should wrap content with <span>-tag for inline elements', () => {
    const mark = createMarkElement(true);
    expect(mark.find('span').length).toEqual(1);
    mark.unmount();
  });

  it('should set data-localId to attrs.localId', () => {
    const mark = createMarkElement(false);
    expect(mark.find('div').props()).toHaveProperty(
      'data-name',
      'test-fragment-name',
    );
    expect(mark.find('div').props()).toHaveProperty(
      'data-localId',
      'test-local-id',
    );
    expect(mark.find('div').props()).toHaveProperty(
      'data-mark-type',
      'fragment',
    );
    mark.unmount();
  });
});
