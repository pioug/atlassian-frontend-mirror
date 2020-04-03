import React from 'react';
import { shallow } from 'enzyme';
import Hardbreak from '../../../../react/nodes/hardBreak';

describe('Renderer - React/Nodes/HardBreak', () => {
  it('should render a <br> tag', () => {
    expect(shallow(<Hardbreak />).is('br')).toEqual(true);
  });

  it('should render two <br> tags if last child node is a hardBreak ', () => {
    expect(shallow(<Hardbreak forceNewLine={true} />).html()).toEqual(
      '<br/><br/>',
    );
  });
});
