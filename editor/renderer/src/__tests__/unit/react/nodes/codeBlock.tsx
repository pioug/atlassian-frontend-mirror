import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import CodeBlock from '../../../../react/nodes/codeBlock';
import { CodeBlock as AkCodeBlock } from '@atlaskit/code';

const textSample = 'window.alert';
const render = (overrides = {}) => {
  return mountWithIntl(
    <CodeBlock
      language="javascript"
      allowCopyToClipboard={false}
      text={textSample}
      {...overrides}
    />,
  );
};
describe('Renderer - React/Nodes/CodeBlock', () => {
  it('should render @atlaskit/code component', () => {
    const node = render();
    const codeBlockWrapper = node.find(AkCodeBlock);
    expect(codeBlockWrapper).toHaveLength(1);
    expect(codeBlockWrapper.at(0).prop('text')).toBe(textSample);
    node.unmount();
  });

  it('should render CopyButton component if allowCopyToClipboard is enabled', () => {
    const node = render({ allowCopyToClipboard: true });
    expect(node.find('CopyButton')).toHaveLength(1);
    node.unmount();
  });

  it('should not render CopyButton component if allowCopyToClipboard is disabled', () => {
    const node = render();
    expect(node.find('CopyButton').exists()).toBe(false);
    node.unmount();
  });
});
