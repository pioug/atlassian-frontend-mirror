import { render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkStatus } from '../../../../../../constants';
import ActionBlock from '../index';
import type { ActionBlockProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
  ...jest.requireActual('../../../../../../state/flexible-ui-context'),
  useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));
jest.mock('../../../../../../state/hooks/use-invoke', () => jest.fn());
jest.mock('../../../../../../state/hooks/use-resolve', () => jest.fn());

describe('ActionBlock', () => {
  const setup = (props?: Partial<ActionBlockProps>) =>
    render(
      <IntlProvider locale="en">
        <ActionBlock status={SmartLinkStatus.Resolved} {...props} />
      </IntlProvider>,
    );

  it('renders ActionBlock', async () => {
    const { findByTestId } = setup();
    const block = await findByTestId('smart-block-action');
    expect(block).toBeInTheDocument();
  });

  it('renders list of actions', async () => {
    const { findByTestId } = setup();

    const downloadAction = await findByTestId('smart-action-download-action');
    expect(downloadAction).toBeInTheDocument();

    const followAction = await findByTestId('smart-action-follow-action');
    expect(followAction).toBeInTheDocument();

    const previewAction = await findByTestId('smart-action-preview-action');
    expect(previewAction).toBeInTheDocument();
  });
});
