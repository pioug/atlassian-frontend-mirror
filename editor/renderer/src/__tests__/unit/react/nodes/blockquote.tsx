import React from 'react';
import { shallow } from 'enzyme';
import Blockquote from '../../../../react/nodes/blockquote';

describe('Renderer - React/Nodes/Blockquote', () => {
  const blockquote = shallow(<Blockquote>This is a blockquote</Blockquote>);

  it('should wrap content with <blockquote>-tag', () => {
    expect(blockquote.is('blockquote')).toEqual(true);
  });
});
