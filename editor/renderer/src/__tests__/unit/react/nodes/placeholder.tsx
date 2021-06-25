import React from 'react';
import { shallow } from 'enzyme';
import Placeholder from '../../../../react/nodes/placeholder';

describe('Renderer - React/Nodes/Placeholder', () => {
  it('should create an empty <span>-tag', () => {
    const placeholder = shallow(
      <Placeholder text="hi" allowPlaceholderText={false} />,
    );

    expect(placeholder.find('span').prop('data-placeholder')).toBeUndefined();
  });

  it('should not create an empty <span>-tag', () => {
    const placeholder = shallow(<Placeholder text="hi" allowPlaceholderText />);

    expect(placeholder.find('span').prop('data-placeholder')).toEqual('hi');
  });
});
