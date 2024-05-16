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

    const aiSummaryAction = await findByTestId('smart-action-ai-summary-action-summarise-action');
    expect(aiSummaryAction).toBeInTheDocument();

  });

  it('sorts list of actions', async () => {
    const { findAllByRole, findByTestId } = setup();

    const buttons = await findAllByRole('button');
    const copyLinkAction = await findByTestId('smart-action-copy-link-action');
    const downloadAction = await findByTestId('smart-action-download-action');
    const followAction = await findByTestId('smart-action-follow-action');
    const previewAction = await findByTestId('smart-action-preview-action');
    const aiSummaryAction = await findByTestId(
      'smart-action-ai-summary-action-summarise-action',
    );
    const automationAction = await findByTestId('smart-action-automation-action');

    expect(buttons.length).toBe(6);
    expect(buttons[0]).toBe(previewAction);
    expect(buttons[1]).toBe(copyLinkAction);
    expect(buttons[2]).toBe(aiSummaryAction);
    expect(buttons[3]).toBe(downloadAction);
    expect(buttons[4]).toBe(followAction);
    expect(buttons[5]).toBe(automationAction);
  });
});
