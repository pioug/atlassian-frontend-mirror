import React from 'react';
import { mount } from 'enzyme';
import CodeBlock from '../../../../react/nodes/codeBlock';
import { AkCodeBlock } from '@atlaskit/code';

describe('Renderer - React/Nodes/CodeBlock', () => {
  it('should render @atlaskit/code component', () => {
    const node = mount(<CodeBlock language="javascript">foo</CodeBlock>);
    expect(node.find(AkCodeBlock)).toHaveLength(1);
    node.unmount();
  });
});
