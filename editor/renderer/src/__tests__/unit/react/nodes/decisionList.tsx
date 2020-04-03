import React from 'react';
import { shallow } from 'enzyme';
import { DecisionList as AkDecisionList } from '@atlaskit/task-decision';
import DecisionList from '../../../../react/nodes/decisionList';

describe('Renderer - React/Nodes/DecisionList', () => {
  it('should match rendered AkDecisionList', () => {
    const text: any = 'This is a list item';
    const decisionList = shallow(<DecisionList>{text}</DecisionList>);
    expect(decisionList.is(AkDecisionList)).toEqual(true);
  });

  it('should not render if no children', () => {
    const decisionList = shallow(<DecisionList />);
    expect(decisionList.isEmptyRender()).toEqual(true);
  });
});
