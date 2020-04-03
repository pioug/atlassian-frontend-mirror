import React from 'react';
import { shallow } from 'enzyme';
import Rule from '../../../../react/nodes/rule';

describe('Renderer - React/Nodes/Rule', () => {
  const rule = shallow(<Rule />);

  it('should create a <hr>-tag', () => {
    expect(rule.name()).toEqual('hr');
  });
});
