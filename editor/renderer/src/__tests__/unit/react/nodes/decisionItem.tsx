import React from 'react';
import { shallow } from 'enzyme';
import { DecisionItem as AkDecisionItem } from '@atlaskit/task-decision';
import DecisionItem from '../../../../react/nodes/decisionItem';

describe('Renderer - React/Nodes/DecisionItem', () => {
  const text: any = 'This is a list item';
  const listItem = shallow(
    <DecisionItem dataAttributes={{ 'data-renderer-start-pos': 0 }}>
      {text}
    </DecisionItem>,
  );

  it('should wrap content with <AkDecisionItem>-tag', () => {
    expect(listItem.is(AkDecisionItem)).toEqual(true);
  });

  it('should render if no children', () => {
    const decisionItem = shallow(
      <DecisionItem dataAttributes={{ 'data-renderer-start-pos': 0 }} />,
    );
    expect(decisionItem.isEmptyRender()).toEqual(false);
  });
});
