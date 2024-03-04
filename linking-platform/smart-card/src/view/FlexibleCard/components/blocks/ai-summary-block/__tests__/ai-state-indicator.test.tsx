import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AIStateIndicator from '../ai-state-indicator';
import { AIStateIndicatorProps } from '../ai-state-indicator/types';
import { CONTENT_URL_AI_TROUBLESHOOTING } from '../../../../../../constants';

describe('AIStateIndicator', () => {
  const testId = 'indicator-test';

  const setup = (props?: AIStateIndicatorProps) =>
    render(
      <IntlProvider locale="en">
        <AIStateIndicator state="ready" testId={testId} {...props} />
      </IntlProvider>,
    );

  describe('ready state', () => {
    it('does not render', () => {
      const { container } = setup();
      expect(container.firstChild).toBeNull();
    });
  });

  describe('loading state', () => {
    const state = 'loading';

    it('renders default appearance by default', async () => {
      const { findByTestId } = setup({ state });
      const icon = await findByTestId(`${testId}-loading-icon`);
      const msg = await findByTestId(`${testId}-loading-message`);

      expect(icon).toBeInTheDocument();
      expect(msg).toBeInTheDocument();
    });

    it('renders default appearance', async () => {
      const { findByTestId } = setup({ state, appearance: 'default' });
      const icon = await findByTestId(`${testId}-loading-icon`);
      const msg = await findByTestId(`${testId}-loading-message`);

      expect(icon).toBeInTheDocument();
      expect(msg).toBeInTheDocument();
      expect(msg.textContent).toBe('Atlassian Intelligence is working...');
    });

    it('does not render icon-only appearance', async () => {
      const { container } = setup({
        state,
        appearance: 'icon-only',
      });
      expect(container.firstChild).toBeNull();
    });
  });

  describe('done', () => {
    const state = 'done';

    it('renders default appearance by default', async () => {
      const { findByTestId } = setup({ state });
      const icon = await findByTestId(`${testId}-done-icon`);
      const msg = await findByTestId(`${testId}-done-message`);

      expect(icon).toBeInTheDocument();
      expect(msg).toBeInTheDocument();
    });

    it('renders default appearance', async () => {
      const user = userEvent.setup();
      const { findByTestId } = setup({ state, appearance: 'default' });
      const icon = await findByTestId(`${testId}-done-icon`);
      const msg = await findByTestId(`${testId}-done-message`);
      const tooltipTrigger = await findByTestId(`${testId}-done-info`);

      expect(icon).toBeInTheDocument();
      expect(msg).toBeInTheDocument();
      expect(msg.textContent).toBe('Summarized by Atlassian Intelligence');
      expect(tooltipTrigger).toBeInTheDocument();

      await user.hover(tooltipTrigger);

      const tooltipContent = await findByTestId(`${testId}-done-tooltip`);
      expect(tooltipContent).toBeInTheDocument();
    });

    it('renders icon-only appearance', async () => {
      const { findByTestId, queryByTestId } = setup({
        state,
        appearance: 'icon-only',
      });
      const icon = await findByTestId(`${testId}-done-icon`);
      const msg = queryByTestId(`${testId}-done-message`);

      expect(icon).toBeInTheDocument();
      expect(msg).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    const state = 'error';

    it('renders default appearance by default', async () => {
      const { findByTestId } = setup({ state });
      const icon = await findByTestId(`${testId}-error-icon`);
      const msg = await findByTestId(`${testId}-error-message`);

      expect(icon).toBeInTheDocument();
      expect(msg).toBeInTheDocument();
    });

    it('renders default appearance', async () => {
      const { findByRole, findByTestId } = setup({
        state,
        appearance: 'default',
      });
      const icon = await findByTestId(`${testId}-error-icon`);
      const msg = await findByTestId(`${testId}-error-message`);
      const anchor = await findByRole('link');

      expect(icon).toBeInTheDocument();
      expect(msg).toBeInTheDocument();
      expect(msg.textContent).toBe(
        "Atlassian Intelligence can't provide a response right now. Read more in our support documentation.",
      );
      expect(anchor).toHaveAttribute('href', CONTENT_URL_AI_TROUBLESHOOTING);
    });

    it('does not render icon-only appearance', async () => {
      const { container } = setup({
        state,
        appearance: 'icon-only',
      });
      expect(container.firstChild).toBeNull();
    });
  });
});
