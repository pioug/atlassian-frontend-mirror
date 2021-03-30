import React from 'react';
import { mount } from 'enzyme';
import DataConsumer from '../../../../react/marks/data-consumer';

describe('Renderer - React/Marks/DataConsumer', () => {
  const sourcesArr = ['foo', 'bar'];
  const create = (inline: boolean = false) =>
    mount(
      <DataConsumer
        isInline={inline}
        sources={sourcesArr}
        dataAttributes={{ 'data-renderer-mark': true }}
        reference="this-is-reference-hash"
      >
        wrapped text
      </DataConsumer>,
    );

  it('should wrap content with <div>-tag', () => {
    const mark = create();
    expect(mark.find('div').length).toEqual(1);
    mark.unmount();
  });
  it('should wrap content with <span>-tag when inline', () => {
    const mark = create(true);
    expect(mark.find('span').length).toEqual(1);
    mark.unmount();
  });

  it('should set data-source to attrs.sources', () => {
    const mark = create();
    expect(mark.find('div').props()).toHaveProperty(
      'data-source',
      JSON.stringify(sourcesArr),
    );
    expect(mark.find('div').props()).toHaveProperty(
      'data-mark-type',
      'dataConsumer',
    );
    mark.unmount();
  });
});
