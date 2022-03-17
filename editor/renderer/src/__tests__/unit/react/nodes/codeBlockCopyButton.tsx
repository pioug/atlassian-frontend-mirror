import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { CopyTextContext } from '../../../../react/nodes/copy-text-provider';
import CopyButton from '../../../../react/nodes/codeBlockCopyButton';

const mockCopyTextToClipboard = jest.fn();

const render = () => {
  return mountWithIntl(
    <CopyTextContext.Provider
      value={{
        copyTextToClipboard: mockCopyTextToClipboard,
      }}
    >
      <CopyButton content={'Some code'} />
    </CopyTextContext.Provider>,
  );
};

describe('CopyButton', () => {
  it('should call CopyTextToClipboard on click', () => {
    const copyButton = render();
    copyButton.find('button.copy-to-clipboard').simulate('click');

    expect(mockCopyTextToClipboard).toHaveBeenCalledWith('Some code');
  });

  it('should update the component on click and mouseLeave', () => {
    const copyButton = render();
    copyButton.find('button.copy-to-clipboard').simulate('click');

    expect(
      copyButton.find('button.copy-to-clipboard').props().className,
    ).toContain('clicked');
    expect(
      copyButton.find('button.copy-to-clipboard').props()['aria-label'],
    ).toEqual('Copied!');

    copyButton.find('div').at(1).simulate('mouseleave');

    copyButton.update();

    expect(
      copyButton.find('button.copy-to-clipboard').props().className,
    ).not.toContain('clicked');
    expect(
      copyButton.find('button.copy-to-clipboard').props()['aria-label'],
    ).toEqual('Copy');
  });
});
