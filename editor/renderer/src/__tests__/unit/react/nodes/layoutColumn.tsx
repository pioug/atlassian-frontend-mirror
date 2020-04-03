import React from 'react';
import { shallow } from 'enzyme';
import LayoutColumn from '../../../../react/nodes/layoutColumn';

describe('Renderer - React/Nodes/LayoutColumn', () => {
  const layoutColumn = shallow(
    <LayoutColumn>
      <p>test</p>
    </LayoutColumn>,
  );

  it('should wrap content with div-tag', () => {
    expect(layoutColumn.is('div')).toEqual(true);
  });
});
