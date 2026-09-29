import { act, renderHook, waitFor } from '@testing-library/react';

import { mockExp } from '@atlassian/experiment-test-utils/mock-exp';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import mockDocument from '../../../../__fixtures__/document-entity';
import { useSmartCardState } from '../../../store';
import useRovoConfig from '../../use-rovo-config';
import useOneClickChatSpotlightEligibility from '../index';
import * as suppression from '../suppression';

jest.mock('../../use-rovo-config');
jest.mock('../../../store');

const gate = 'platform_sl_one_click_chat_spotlight_v2_fg';
const experiment = 'platform_sl_one_click_chat_spotlight_v2_exp';
const config = {
	product: 'CONFLUENCE' as const,
	rovoOptions: { isRovoEnabled: true, isRovoLLMEnabled: true },
};
const card = { status: 'resolved' as const, details: mockDocument };
const actions = { hide: false, rovoChatAction: { optIn: true } };
let storage: suppression.SpotlightSuppression;

beforeEach(() => {
	jest.mocked(useRovoConfig).mockReturnValue(config);
	jest.mocked(useSmartCardState).mockReturnValue(card as ReturnType<typeof useSmartCardState>);
	storage = {
		read: jest.fn(() => ({ impressions: [] })),
		impress: jest.fn(() => true),
		dismiss: jest.fn(() => true),
	};
	jest.spyOn(suppression, 'getSuppressionStore').mockReturnValue(storage);
});

afterEach(() => jest.restoreAllMocks());

const render = (onInteraction = jest.fn(), enabled = true) => {
	(enabled ? passGate : failGate)(gate);
	return renderHook(() =>
		useOneClickChatSpotlightEligibility({
			url: 'https://private.example/document',
			actionOptions: actions,
			isOpportunity: true,
			onInteraction,
		}),
	);
};

it.each([true, false, null])('evaluates cohort %s with browser storage', async (value) => {
	mockExp(experiment, { isEnabled: value });
	const { result } = render();
	await waitFor(() => expect(wasExperimentExposed(experiment)).toBe(true));
	expect(result.current.isEligible).toBe(value === true);
	expect(result.current.reason).toBe(
		value === true ? 'eligible' : value === false ? 'control' : 'experiment_unavailable',
	);
});

it('does not evaluate the experiment with the gate off', () => {
	const { result } = render(jest.fn(), false);
	expect(result.current.reason).toBe('gate_off');
	expect(wasExperimentExposed(experiment)).toBe(false);
	expect(suppression.getSuppressionStore).not.toHaveBeenCalled();
});

it('does not expose suppressed users', async () => {
	jest.mocked(storage.read).mockReturnValue({ impressions: [Date.now()] });
	const { result } = render();
	await waitFor(() => expect(result.current.reason).toBe('shown_today'));
	expect(wasExperimentExposed(experiment)).toBe(false);
});

it('fails closed when browser storage is unavailable', () => {
	jest.mocked(suppression.getSuppressionStore).mockReturnValue(undefined);
	const { result } = render();
	expect(result.current.isEligible).toBe(false);
	expect(wasExperimentExposed(experiment)).toBe(false);
});

it('does not treat a public resolution as provider authorization', async () => {
	jest.mocked(useSmartCardState).mockReturnValue({
		...card,
		details: { ...card.details, meta: { ...card.details.meta, visibility: 'public' } },
	} as ReturnType<typeof useSmartCardState>);
	const { result } = render();
	await waitFor(() => expect(result.current.reason).toBe('provider_unauthorized'));
	expect(wasExperimentExposed(experiment)).toBe(false);
});

it('reserves only one spotlight across multiple links', async () => {
	mockExp(experiment, { isEnabled: true });
	const first = render();
	const second = renderHook(() =>
		useOneClickChatSpotlightEligibility({
			url: 'https://private.example/second',
			actionOptions: actions,
			isOpportunity: true,
			onInteraction: jest.fn(),
		}),
	);
	await waitFor(() =>
		expect(first.result.current.isEligible || second.result.current.isEligible).toBe(true),
	);
	expect(
		[first.result.current.isEligible, second.result.current.isEligible].filter(Boolean),
	).toHaveLength(1);
});

it.each(['onClick', 'onDismiss'] as const)(
	'records impression and %s once per interaction',
	async (finish) => {
		mockExp(experiment, { isEnabled: true });
		const onInteraction = jest.fn();
		const { result } = render(onInteraction);
		await waitFor(() => expect(result.current.isEligible).toBe(true));
		expect(onInteraction).not.toHaveBeenCalled();
		act(() => {
			result.current.onShown();
			result.current.onShown();
		});
		act(() => {
			result.current[finish]();
			result.current[finish]();
		});
		expect(onInteraction.mock.calls).toEqual([
			['impression'],
			[finish === 'onClick' ? 'clicked' : 'dismissed'],
		]);
		expect(storage.impress).toHaveBeenCalledTimes(1);
		expect(storage.dismiss).toHaveBeenCalledTimes(finish === 'onDismiss' ? 1 : 0);
	},
);

it('closes without an impression if persistence fails', async () => {
	mockExp(experiment, { isEnabled: true });
	jest.mocked(storage.impress).mockReturnValue(false);
	const onInteraction = jest.fn();
	const { result } = render(onInteraction);
	await waitFor(() => expect(result.current.isEligible).toBe(true));
	act(() => result.current.onShown());
	expect(result.current.reason).toBe('suppression_unavailable');
	expect(onInteraction).not.toHaveBeenCalled();
});

it('reads suppression again at the next qualifying opportunity', async () => {
	passGate(gate);
	mockExp(experiment, { isEnabled: true });
	const { result, rerender } = renderHook(
		({ visible }) =>
			useOneClickChatSpotlightEligibility({
				url: 'https://private.example/document',
				actionOptions: actions,
				isOpportunity: visible,
				onInteraction: jest.fn(),
			}),
		{ initialProps: { visible: true } },
	);
	await waitFor(() => expect(result.current.isEligible).toBe(true));
	act(() => result.current.onShown());
	jest.mocked(storage.read).mockReturnValue({ impressions: [Date.now()] });
	rerender({ visible: false });
	rerender({ visible: true });
	await waitFor(() => expect(result.current.reason).toBe('shown_today'));
});
