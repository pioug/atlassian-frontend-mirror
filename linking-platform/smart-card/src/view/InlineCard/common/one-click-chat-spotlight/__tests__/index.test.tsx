import React from 'react';

import { IntlProvider } from 'react-intl';

import { StorageClient } from '@atlaskit/frontend-utilities/StorageClient';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers/intersection-observer';
import { mockExp } from '@atlassian/experiment-test-utils/mock-exp';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { waitFor } from '@atlassian/testing-library/wait-for';

import mockDocument from '../../../../../__fixtures__/document-entity';
import { CardAction } from '../../../../../constants';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import * as suppression from '../../../../../state/hooks/use-one-click-chat-spotlight-eligibility/suppression';
import useRovoChat from '../../../../../state/hooks/use-rovo-chat';
import useRovoConfig from '../../../../../state/hooks/use-rovo-config';
import { useSmartCardState } from '../../../../../state/store';
import type { InternalCardActionOptions } from '../../../../Card/types';
import { HoverCardComponent } from '../../../../HoverCard/components/HoverCardComponent';
import { InlineRovoActionButton } from '../../rovo-actions-cta';

const mockFire = jest.fn();
const mockCreateEvent = jest.fn(
	(_payload: { action: string; actionSubjectId?: string; attributes: Record<string, string> }) => ({
		context: [],
		clone: () => null,
		fire: mockFire,
	}),
);
const spotlightEvents = () =>
	mockCreateEvent.mock.calls
		.map(([event]) => event)
		.filter((event) => event.actionSubjectId === 'oneClickChatSpotlightV2');
const mockNavigate = jest.fn();
jest.mock('@atlaskit/analytics-next/useAnalyticsEvents', () => ({
	useAnalyticsEvents: () => ({ createAnalyticsEvent: mockCreateEvent }),
}));
jest.mock('../../../../../state/hooks/use-rovo-config');
jest.mock('../../../../../state/hooks/use-rovo-chat');
jest.mock('../../../../../state/hooks/use-invoke-client-action');
jest.mock('../../../../../state/store');
jest.mock('../../../../../state/renderers', () => ({ useSmartLinkRenderers: () => ({}) }));
jest.mock('../../../../../state/actions', () => ({
	useSmartCardActions: () => ({ loadMetadata: jest.fn(), register: jest.fn() }),
}));
jest.mock('../../../../HoverCard/components/HoverCardContent', () => ({
	__esModule: true,
	default: () => <div data-testid="preview-content">Preview</div>,
}));

const gate = 'platform_sl_one_click_chat_spotlight_v2_fg';
const experiment = 'platform_sl_one_click_chat_spotlight_v2_exp';
const url = 'https://private.example/secret-document';
const mockInvoke = jest.fn();
const sendPromptMessage = jest.fn();

beforeEach(() => {
	mockSimpleIntersectionObserver();
	mockCreateEvent.mockClear();
	mockFire.mockClear();
	mockInvoke.mockClear();
	sendPromptMessage.mockClear();
	mockNavigate.mockClear();
	jest.mocked(useRovoChat).mockReturnValue({ isRovoChatEnabled: true, sendPromptMessage });
	jest.mocked(useInvokeClientAction).mockReturnValue(mockInvoke);
	jest.spyOn(suppression, 'getSuppressionStore').mockReturnValue({
		read: () => ({ impressions: [] }),
		impress: () => true,
		dismiss: () => true,
	});
});
afterEach(() => jest.restoreAllMocks());

function renderAction(
	provider = 'google-object-provider',
	product: 'CONFLUENCE' | 'JSW' = 'CONFLUENCE',
	actionOptions: InternalCardActionOptions = { hide: false, rovoChatAction: { optIn: true } },
	useAnchor = false,
	withHover = false,
) {
	jest.mocked(useRovoConfig).mockReturnValue({
		product,
		rovoOptions: {
			isRovoEnabled: true,
			isRovoLLMEnabled: true,
		},
	});
	jest.mocked(useSmartCardState).mockReturnValue({
		status: 'resolved',
		details: { ...mockDocument, meta: { ...mockDocument.meta, key: provider } },
	});
	const Wrapper = useAnchor ? 'a' : 'span';
	const action = (
		<Wrapper
			href={useAnchor ? url : undefined}
			role={useAnchor ? undefined : 'presentation'}
			onClick={mockNavigate}
			onKeyPress={mockNavigate}
		>
			<InlineRovoActionButton testId="action" url={url} actionOptions={actionOptions} />
		</Wrapper>
	);
	return render(
		<IntlProvider locale="en">
			{withHover ? <HoverCardComponent url={url}>{action}</HoverCardComponent> : action}
		</IntlProvider>,
	);
}

it.each([
	['google-object-provider', 'CONFLUENCE', 'summarize-document'],
	['github-object-provider', 'JSW', 'explain-code'],
] as const)(
	'invokes the existing %s action from the spotlight',
	async (provider, product, prompt) => {
		passGate(gate);
		mockExp(experiment, { isEnabled: true });
		renderAction(provider, product);
		await screen.findByTestId('one-click-chat-spotlight-v2');
		expect(screen.getByRole('dialog', { name: 'Explore this link with Rovo' })).toBeInTheDocument();
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Dismiss spotlight' })).toBeInTheDocument();
		expect(screen.getByText('Get key decisions and next steps from this link')).toBeInTheDocument();
		await waitFor(() =>
			expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ action: 'viewed' })),
		);
		fireEvent.click(screen.getByRole('button', { name: 'See takeaways' }));
		expect(mockInvoke).toHaveBeenCalledTimes(1);
		expect(mockInvoke).toHaveBeenCalledWith(
			expect.objectContaining({
				prompt,
				actionSubjectId: 'rovoChatPrompt',
				interactionSource: 'spotlightCta',
			}),
		);
		await mockInvoke.mock.calls[0][0].actionFn();
		expect(sendPromptMessage).toHaveBeenCalled();
		const events = spotlightEvents();
		expect(events[1].attributes.interactionSource).toBe('spotlightCta');
		expect(events.map((event) => event.action)).toEqual(['viewed', 'clicked']);
		for (const event of events) {
			expect(Object.keys(event.attributes).sort()).toEqual([
				'appearance',
				'cohort',
				...(event.action === 'clicked' ? ['interactionSource'] : []),
				'product',
				'provider',
				'variant',
			]);
			expect(JSON.stringify(event)).not.toMatch(/secret-document|https:|prompt|title|content/);
		}
		expect(mockFire).toHaveBeenCalledWith('media');
		expect(mockNavigate).not.toHaveBeenCalled();
	},
);

it('emits one dismissal when the spotlight is closed', async () => {
	passGate(gate);
	mockExp(experiment, { isEnabled: true });
	renderAction();
	await screen.findByTestId('one-click-chat-spotlight-v2');
	await waitFor(() =>
		expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ action: 'viewed' })),
	);
	fireEvent.click(screen.getByRole('button', { name: 'Dismiss spotlight' }));
	expect(spotlightEvents().map((event) => event.action)).toEqual(['viewed', 'dismissed']);
	expect(mockInvoke).not.toHaveBeenCalled();
	expect(mockNavigate).not.toHaveBeenCalled();
});

it.each([false, null])('leaves the existing action intact for cohort %s', async (value) => {
	passGate(gate);
	mockExp(experiment, { isEnabled: value });
	renderAction();
	await waitFor(() => expect(suppression.getSuppressionStore).toHaveBeenCalled());
	expect(screen.queryByTestId('one-click-chat-spotlight-v2')).not.toBeInTheDocument();
	fireEvent.click(screen.getByTestId('action'));
	expect(mockInvoke).toHaveBeenCalledTimes(1);
	expect(mockInvoke).toHaveBeenCalledWith(
		expect.objectContaining({ interactionSource: 'inlineAction' }),
	);
	expect(spotlightEvents()).toEqual([]);
});

it.each([
	['google-object-provider', 'summarize-document'],
	['github-object-provider', 'explain-code'],
] as const)(
	'preserves the gate-off %s action and link event handling',
	async (provider, prompt) => {
		failGate(gate);
		mockExp(experiment, { isEnabled: true });
		renderAction(provider, 'CONFLUENCE', undefined, true);
		expect(fireEvent.click(screen.getByTestId('action'))).toBe(false);
		expect(mockInvoke).toHaveBeenCalledTimes(1);
		expect(mockInvoke).toHaveBeenCalledWith(expect.objectContaining({ prompt }));
		await mockInvoke.mock.calls[0][0].actionFn();
		expect(sendPromptMessage).toHaveBeenCalledTimes(1);
		expect(mockNavigate).not.toHaveBeenCalled();
		expect(suppression.getSuppressionStore).not.toHaveBeenCalled();
		expect(screen.queryByTestId('one-click-chat-spotlight-v2')).not.toBeInTheDocument();
		expect(spotlightEvents()).toEqual([]);
	},
);

it.each([false, true])('does not invoke an unavailable Rovo action with gate %s', (enabled) => {
	(enabled ? passGate : failGate)(gate);
	jest.mocked(useRovoChat).mockReturnValue({ isRovoChatEnabled: false, sendPromptMessage });
	renderAction();
	fireEvent.click(screen.getByTestId('action'));
	expect(mockInvoke).not.toHaveBeenCalled();
	expect(suppression.getSuppressionStore).not.toHaveBeenCalled();
	expect(spotlightEvents()).toEqual([]);
});

it('preserves the highlighted action and counts its click once', async () => {
	passGate(gate);
	mockExp(experiment, { isEnabled: true });
	renderAction();
	await screen.findByTestId('one-click-chat-spotlight-v2');
	await waitFor(() => expect(spotlightEvents().map((event) => event.action)).toEqual(['viewed']));
	fireEvent.click(screen.getByTestId('action'));
	expect(mockInvoke).toHaveBeenCalledTimes(1);
	expect(spotlightEvents().map((event) => event.action)).toEqual(['viewed', 'clicked']);
	expect(mockNavigate).not.toHaveBeenCalled();
	expect(spotlightEvents()[1].attributes.interactionSource).toBe('inlineAction');
	expect(mockInvoke).toHaveBeenCalledWith(
		expect.objectContaining({ interactionSource: 'inlineAction' }),
	);
	fireEvent.click(screen.getByTestId('action'));
	expect(spotlightEvents()).toHaveLength(2);
});

it('dismisses with Escape exactly once', async () => {
	passGate(gate);
	mockExp(experiment, { isEnabled: true });
	renderAction();
	await screen.findByTestId('one-click-chat-spotlight-v2');
	await waitFor(() => expect(spotlightEvents().map((event) => event.action)).toEqual(['viewed']));
	fireEvent.keyDown(screen.getByRole('button', { name: 'Dismiss spotlight' }), { key: 'Escape' });
	fireEvent.keyDown(document, { key: 'Escape' });
	expect(spotlightEvents().map((event) => event.action)).toEqual(['viewed', 'dismissed']);
	expect(mockInvoke).not.toHaveBeenCalled();
});

it('keeps the visible spotlight accessible', async () => {
	passGate(gate);
	mockExp(experiment, { isEnabled: true });
	renderAction();
	await screen.findByTestId('one-click-chat-spotlight-v2');
	await expect(document.body).toBeAccessible();
});

it.each(['See takeaways', 'Dismiss spotlight', 'Escape'] as const)(
	'keeps %s working for the same delivery across midnight without another impression',
	async (interaction) => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date(2026, 8, 17, 23, 59));
		const storage = new StorageClient(`spotlight-midnight-${interaction}`);
		const store = suppression.createSuppressionStore(storage);
		jest.mocked(suppression.getSuppressionStore).mockReturnValue(store);
		passGate(gate);
		mockExp(experiment, { isEnabled: true });
		const view = renderAction();
		try {
			await screen.findByTestId('one-click-chat-spotlight-v2');
			await waitFor(() =>
				expect(spotlightEvents().map((event) => event.action)).toEqual(['viewed']),
			);
			const impressions = store.read()?.impressions;
			expect(impressions).toHaveLength(1);
			expect(impressions?.[0]).toBeLessThan(new Date(2026, 8, 18).getTime());
			const card = screen.getByTestId('one-click-chat-spotlight-v2');
			act(() => {
				jest.advanceTimersByTime(60_000);
			});
			expect(screen.getByTestId('one-click-chat-spotlight-v2')).toBe(card);
			expect(spotlightEvents().map((event) => event.action)).toEqual(['viewed']);
			expect(store.read()?.impressions).toEqual(impressions);
			if (interaction === 'Escape') {
				fireEvent.keyDown(screen.getByRole('button', { name: 'Dismiss spotlight' }), {
					key: 'Escape',
				});
			} else {
				fireEvent.click(screen.getByRole('button', { name: interaction }));
			}
			expect(screen.queryByTestId('one-click-chat-spotlight-v2')).not.toBeInTheDocument();
			expect(spotlightEvents().map((event) => event.action)).toEqual([
				'viewed',
				interaction === 'See takeaways' ? 'clicked' : 'dismissed',
			]);
			expect(mockInvoke).toHaveBeenCalledTimes(interaction === 'See takeaways' ? 1 : 0);
			expect(store.read()).toEqual({
				impressions,
				...(interaction === 'See takeaways' ? {} : { dismissedAt: Date.now() }),
			});
		} finally {
			view.unmount();
			storage.removeItem('history');
			jest.useRealTimers();
		}
	},
);

it.each<[string, InternalCardActionOptions]>([
	['hidden', { hide: true, rovoChatAction: { optIn: true } }],
	[
		'excluded',
		{ hide: false, exclude: [CardAction.RovoChatAction], rovoChatAction: { optIn: true } },
	],
])('does not offer a spotlight for a host-%s action', (_reason, options) => {
	passGate(gate);
	mockExp(experiment, { isEnabled: true });
	renderAction('google-object-provider', 'CONFLUENCE', options);
	expect(screen.getByTestId('action')).toBeInTheDocument();
	expect(screen.queryByTestId('one-click-chat-spotlight-v2')).not.toBeInTheDocument();
	expect(suppression.getSuppressionStore).not.toHaveBeenCalled();
	expect(spotlightEvents()).toEqual([]);
});

it.each([false, true])(
	'prevents popup text navigating its enclosing link with top layer %s',
	async (topLayer) => {
		passGate(gate);
		(topLayer ? passGate : failGate)('platform-dst-top-layer');
		mockExp(experiment, { isEnabled: true });
		renderAction('google-object-provider', 'CONFLUENCE', undefined, true);
		await screen.findByTestId('one-click-chat-spotlight-v2');
		const heading = screen.getByText('Get key decisions and next steps from this link');
		if (topLayer) {
			expect(heading.closest('a')).toHaveAttribute('href', url);
		}
		// A cancelled native click cannot activate the enclosing hyperlink.
		expect(fireEvent.click(heading)).toBe(false);
		expect(
			fireEvent.click(screen.getByText('Get key decisions and next steps from this link')),
		).toBe(false);
		expect(mockNavigate).not.toHaveBeenCalled();
		expect(mockInvoke).not.toHaveBeenCalled();
		expect(spotlightEvents().map((event) => event.action)).toEqual(['viewed']);
	},
);

// The parent Smart Link handles keypress; Escape must still reach Popup's keydown listener.
it.each([false, true])(
	'isolates keyboard activation and preserves Escape with top layer %s',
	async (topLayer) => {
		passGate(gate);
		(topLayer ? passGate : failGate)('platform-dst-top-layer');
		mockExp(experiment, { isEnabled: true });
		renderAction('google-object-provider', 'CONFLUENCE', undefined, true);
		await screen.findByTestId('one-click-chat-spotlight-v2');
		const dismiss = screen.getByRole('button', { name: 'Dismiss spotlight' });
		fireEvent.keyPress(dismiss, { key: 'Enter', code: 'Enter', charCode: 13 });
		fireEvent.keyPress(dismiss, { key: ' ', code: 'Space', charCode: 32 });
		expect(mockNavigate).not.toHaveBeenCalled();
		fireEvent.keyDown(dismiss, { key: 'Escape' });
		await waitFor(() =>
			expect(screen.queryByTestId('one-click-chat-spotlight-v2')).not.toBeInTheDocument(),
		);
		expect(spotlightEvents().map((event) => event.action)).toEqual(['viewed', 'dismissed']);
		expect(mockInvoke).not.toHaveBeenCalled();
	},
);

it.each([false, true])(
	'keeps See takeaways actionable inside a hover preview with top layer %s',
	async (topLayer) => {
		passGate(gate);
		(topLayer ? passGate : failGate)('platform-dst-top-layer');
		mockExp(experiment, { isEnabled: true });
		renderAction('google-object-provider', 'CONFLUENCE', undefined, true, true);
		const button = await screen.findByRole('button', { name: 'See takeaways' });
		const user = userEvent.setup();
		await user.hover(button);
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 650));
		});

		expect(screen.queryByTestId('preview-content')).not.toBeInTheDocument();
		await user.click(button);
		expect(mockInvoke).toHaveBeenCalledTimes(1);
		expect(spotlightEvents().map((event) => event.action)).toEqual(['viewed', 'clicked']);
		expect(mockNavigate).not.toHaveBeenCalled();
		await user.unhover(button);
		await user.hover(screen.getByTestId('action'));
		await screen.findByTestId('preview-content');
	},
);

it.each([false, true])(
	'preserves normal hover previews with spotlight gate %s and control cohort',
	async (enabled) => {
		(enabled ? passGate : failGate)(gate);
		mockExp(experiment, { isEnabled: false });
		renderAction('google-object-provider', 'CONFLUENCE', undefined, true, true);
		if (enabled) await waitFor(() => expect(suppression.getSuppressionStore).toHaveBeenCalled());
		const user = userEvent.setup();
		await user.hover(screen.getByTestId('action'));
		await screen.findByTestId('preview-content');
		expect(screen.queryByTestId('one-click-chat-spotlight-v2')).not.toBeInTheDocument();
		await user.click(screen.getByTestId('action'));
		expect(mockInvoke).toHaveBeenCalledTimes(1);
		expect(spotlightEvents()).toEqual([]);
	},
);

it('cancels a pending hover preview when a spotlight claims the page', async () => {
	passGate(gate);
	mockExp(experiment, { isEnabled: false });
	renderAction('google-object-provider', 'CONFLUENCE', undefined, true, true);
	await waitFor(() => expect(suppression.getSuppressionStore).toHaveBeenCalled());
	const user = userEvent.setup();
	await user.hover(screen.getByTestId('action'));
	const owner = Symbol('visible-spotlight');
	expect(suppression.claimSpotlight(owner)).toBe(true);
	try {
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 650));
		});
		expect(screen.queryByTestId('preview-content')).not.toBeInTheDocument();
	} finally {
		suppression.releaseSpotlight(owner);
	}
	await user.unhover(screen.getByTestId('action'));
	await user.hover(screen.getByTestId('action'));
	await screen.findByTestId('preview-content');
});
