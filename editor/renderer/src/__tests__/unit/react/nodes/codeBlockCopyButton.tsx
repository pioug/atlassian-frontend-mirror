import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';

const mockCopyTextToClipboard = jest.fn();
jest.mock('../../../../react/utils/clipboard', () => {
  const module = jest.requireActual('../../../../react/utils/clipboard');
  return {
    ...module,
    copyTextToClipboard: (text: string) => mockCopyTextToClipboard(text),
  };
});

import CopyButton from '../../../../react/nodes/codeBlock/components/codeBlockCopyButton';

const render = () => {
  return mountWithIntl(<CopyButton content={'Some code'} />);
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
    ).toEqual('Copy as text');
  });
});
