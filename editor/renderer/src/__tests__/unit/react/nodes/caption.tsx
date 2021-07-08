import React from 'react';
import { renderWithIntl } from '../../../__helpers/render';
import Caption from '../../../../react/nodes/caption';

describe('Renderer - React/Nodes/Caption', () => {
  it('renders data-renderer-start-pos', () => {
    const { getByTestId } = renderWithIntl(
      <Caption
        marks={[]}
        serializer={{} as any}
        nodeType="caption"
        dataAttributes={{ 'data-renderer-start-pos': 5 }}
      >
        This is a caption.
      </Caption>,
    );

    const caption = getByTestId('media-caption');

    expect(caption.getAttribute('data-renderer-start-pos')).toEqual('5');
  });
});
