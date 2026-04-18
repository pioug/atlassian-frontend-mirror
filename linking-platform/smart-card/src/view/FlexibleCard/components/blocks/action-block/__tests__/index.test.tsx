import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { type SmartLinkStatus } from '../../../../../../constants';
import { InternalActionName } from '../../../../../../constants';
import * as useAISummary from '../../../../../../state/hooks/use-ai-summary';
import ActionBlock from '../index';
import type { ActionBlockProps } from '../types';
jest.mock('../../../../../../state/hooks/use-invoke', () => jest.fn());
jest.mock('../../../../../../state/hooks/use-resolve', () => jest.fn());
jest.mock('../../../../../../state/hooks/use-rovo-chat', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue({
		isRovoChatEnabled: true,
		sendPromptMessage: jest.fn(),
	}),
}));

/**
 * In real code RovoChatAction is only added to context when kill switch is on (extractors/flexible/actions/index.ts).
 * Use this when testing with kill switch off to match production context (no Rovo in actions).
 */
const getContextWithoutRovo = () => {
	if (!context.actions) return context;
	const restActions = { ...context.actions };
	delete (restActions as Record<string, unknown>)[InternalActionName.RovoChatAction];
	return { ...context, actions: restActions };
};

describe('ActionBlock', () => {
	const setup = (
		props?: Partial<ActionBlockProps>,
		status?: SmartLinkStatus,
		dataContext = context,
	) =>
		render(<ActionBlock {...props} />, {
			wrapper: getFlexibleCardTestWrapper(dataContext, undefined, status),
		});

	it('renders ActionBlock', async () => {
		setup();
		const block = await screen.findByTestId('smart-block-action');
		expect(block).toBeInTheDocument();
	});

	it('renders list of actions', async () => {
		setup(undefined, undefined, getContextWithoutRovo());

		const downloadAction = await screen.findByTestId('smart-action-download-action');
		expect(downloadAction).toBeInTheDocument();

		const followAction = await screen.findByTestId('smart-action-follow-action');
		expect(followAction).toBeInTheDocument();

		const previewAction = await screen.findByTestId('smart-action-preview-action');
		expect(previewAction).toBeInTheDocument();

		const aiSummaryAction = await screen.findByTestId(
			'smart-action-ai-summary-action-summarise-action',
		);
		expect(aiSummaryAction).toBeInTheDocument();

		const viewRelatedLinksAction = await screen.findByTestId(
			'smart-action-view-related-links-action',
		);
		expect(viewRelatedLinksAction).toBeInTheDocument();
	});

	it('sorts list of actions', async () => {
		setup(undefined, undefined, getContextWithoutRovo());

		const buttons = await screen.findAllByRole('button');
		const copyLinkAction = await screen.findByTestId('smart-action-copy-link-action');
		const downloadAction = await screen.findByTestId('smart-action-download-action');
		const followAction = await screen.findByTestId('smart-action-follow-action');
		const previewAction = await screen.findByTestId('smart-action-preview-action');
		const aiSummaryAction = await screen.findByTestId(
			'smart-action-ai-summary-action-summarise-action',
		);
		const automationAction = await screen.findByTestId('smart-action-automation-action');
		const viewRelatedLinksAction = await screen.findByTestId(
			'smart-action-view-related-links-action',
		);

		// When experiment is off/undefined, Rovo is filtered out → 7 actions
		expect(buttons.length).toBe(7);
		expect(buttons[0]).toBe(previewAction);
		expect(buttons[1]).toBe(copyLinkAction);
		expect(buttons[2]).toBe(aiSummaryAction);
		expect(buttons[3]).toBe(downloadAction);
		expect(buttons[4]).toBe(followAction);
		expect(buttons[5]).toBe(automationAction);
		expect(buttons[6]).toBe(viewRelatedLinksAction);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	describe('isAny3pRovoActionsExperimentOn', () => {
		it('renders actions excluding Rovo when isAny3pRovoActionsExperimentOn is false', async () => {
			setup({ isAny3pRovoActionsExperimentOn: false }, undefined, getContextWithoutRovo());

			await screen.findByTestId('smart-action-preview-action');
			await screen.findByTestId('smart-action-ai-summary-action-summarise-action');
			expect(screen.queryByTestId('smart-action-rovo-chat-action-1')).not.toBeInTheDocument();
			// No Rovo in context (kill switch off) → 7 actions
			expect(screen.getAllByRole('button').length).toBe(7);
		});

		it('renders actions excluding Rovo when isAny3pRovoActionsExperimentOn is undefined', async () => {
			setup(undefined, undefined, getContextWithoutRovo());

			await screen.findByTestId('smart-action-preview-action');
			await screen.findByTestId('smart-action-ai-summary-action-summarise-action');
			expect(screen.queryByTestId('smart-action-rovo-chat-action-1')).not.toBeInTheDocument();
			// No Rovo in context (kill switch off) → 7 actions
			expect(screen.getAllByRole('button').length).toBe(7);
		});

		ffTest.off('platform_sl_3p_auth_rovo_action_kill_switch', '', () => {
			it('renders actions excluding Rovo when experiment is on but kill switch is off', async () => {
				// When kill switch is off, extractor never adds Rovo → use context without Rovo
				setup({ isAny3pRovoActionsExperimentOn: true }, undefined, getContextWithoutRovo());

				await screen.findByTestId('smart-action-preview-action');
				await screen.findByTestId('smart-action-ai-summary-action-summarise-action');
				expect(screen.queryByTestId('smart-action-rovo-chat-action-1')).not.toBeInTheDocument();
				// No Rovo in context → 7 actions
				expect(screen.getAllByRole('button').length).toBe(7);
			});
		});

		ffTest.on('platform_sl_3p_auth_rovo_action_kill_switch', '', () => {
			it('renders only RovoChatAction when experiment and kill switch on and Rovo action in context', async () => {
				jest.spyOn(useAISummary, 'useAISummary').mockReturnValue({
					summariseUrl: jest.fn(),
					state: { status: 'done', content: 'this is a summary' },
				});

				setup({ isAny3pRovoActionsExperimentOn: true });

				const rovoAction = await screen.findByTestId('smart-action-rovo-chat-action-1');
				expect(rovoAction).toBeInTheDocument();
				// RovoChatAction renders 3 prompt buttons
				expect(screen.getAllByRole('button').length).toBe(3);
			});

			it('renders other actions (excluding Rovo) when experiment and kill switch on but no Rovo in context', async () => {
				jest.spyOn(useAISummary, 'useAISummary').mockReturnValue({
					summariseUrl: jest.fn(),
					state: { status: 'done', content: 'this is a summary' },
				});

				const contextWithoutRovo = {
					...context,
					actions: {
						...context.actions,
						[InternalActionName.RovoChatAction]: undefined,
					},
				};
				setup({ isAny3pRovoActionsExperimentOn: true }, undefined, contextWithoutRovo);

				await screen.findByTestId('smart-action-preview-action');
				expect(screen.queryByTestId('smart-action-rovo-chat-action-1')).not.toBeInTheDocument();
				// All actions except Rovo (7)
				expect(screen.getAllByRole('button').length).toBe(7);
			});
		});
	});
});
