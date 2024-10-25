import React from 'react';

import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { injectable } from 'react-magnetic-di';

import { mockTransformedRules } from './common/mocks';
import { renderWithDi } from './common/test-utils';
import type { ManualRule, RuleQuery } from './common/types';
import { invokeManuallyTriggeredRule } from './services';

import { ManualRulesContainer, type ManualRulesContainerProps, useManualRules } from './index';

const ChildComp = (props: JSX.IntrinsicElements['div']) => <div {...props} title="childComp" />;
const InvokeButton = (props: JSX.IntrinsicElements['button']) => (
	<button {...props} title="invokeButton" />
);

describe('ManualRulesContainer', () => {
	const env = 'dev';
	const site = 'ari:cloud:platform::site/123';
	const object = 'ari:cloud:opsgenie::alert/123';
	const query: RuleQuery = { objects: [object] };

	beforeEach(() => {
		jest.resetAllMocks();
	});

	const mockUseManualRules = (initialising: boolean, error: any, rules: ManualRule[]): jest.Mock =>
		jest.fn().mockImplementation(() => [async () => {}, initialising, error, rules]);

	const renderWithInvokeButton = (
		ruleId: number,
		objects: string[],
		customProps: Partial<ManualRulesContainerProps> = {},
		customDeps?: any[],
	) =>
		renderWithDi(
			<ManualRulesContainer {...{ env, site, query, ...customProps }}>
				{({ invokeRuleOrShowDialog }) => (
					<InvokeButton onClick={() => invokeRuleOrShowDialog(ruleId, objects)} />
				)}
			</ManualRulesContainer>,
			customDeps ?? [],
		);

	const clickInvokeButton = async () => {
		await act(async () => {
			fireEvent(
				screen.getByTitle('invokeButton'),
				new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
				}),
			);
		});
	};

	test('should render the children provided', () => {
		renderWithDi(
			<ManualRulesContainer {...{ env, site, query }}>{() => <ChildComp />}</ManualRulesContainer>,
			[],
		);
		expect(screen.getAllByTitle('childComp')).toHaveLength(1);
	});
	test('should appropriately pass the initialised value to children', () => {
		const mockHook = mockUseManualRules(true, null, []);

		renderWithDi(
			<ManualRulesContainer {...{ env, site, query }}>
				{({ initialised }) => (initialised ? <ChildComp /> : <InvokeButton />)}
			</ManualRulesContainer>,
			[injectable(useManualRules, mockHook)],
		);

		expect(screen.getAllByTitle('childComp')).toHaveLength(1);
	});
	test('should appropriately pass the errors value to children', () => {
		const mockHook = mockUseManualRules(true, 'someError', []);

		renderWithDi(
			<ManualRulesContainer {...{ env, site, query }}>
				{({ error }) => error && <ChildComp>{error}</ChildComp>}
			</ManualRulesContainer>,
			[injectable(useManualRules, mockHook)],
		);

		const childComp = screen.getAllByTitle('childComp');
		expect(childComp).toHaveLength(1);
		expect(childComp[0]).toHaveTextContent('someError');
	});
	test('Should trigger started callback when the rule begins execution with a valid rule', async () => {
		const mockHook = mockUseManualRules(true, null, mockTransformedRules);
		const handlerMock = jest.fn();
		renderWithInvokeButton(
			0,
			['TEST-1'],
			{
				onRuleInvocationLifecycleStarted: handlerMock,
			},
			[injectable(useManualRules, mockHook)],
		);

		await clickInvokeButton();
		expect(handlerMock).toHaveBeenCalled();
	});
	test('Should trigger failure callback on rule does not exist error', async () => {
		const mockHook = mockUseManualRules(true, null, []);
		const handlerMock = jest.fn();
		renderWithInvokeButton(
			0,
			['TEST-1'],
			{
				onRuleInvocationFailure: handlerMock,
			},
			[injectable(useManualRules, mockHook)],
		);
		await clickInvokeButton();
		expect(handlerMock).toHaveBeenCalled();
	});
	test('Should trigger failure callback if the api reports a failure', async () => {
		const mockHook = mockUseManualRules(true, null, mockTransformedRules);
		// pick arbitrary invalid response
		const failureResponse = {
			'TEST-1': 'INVALID_LICENSE',
		};

		const handlerMock = jest.fn();

		const mockInvokeManuallyTriggeredRule = jest.fn().mockReturnValue(failureResponse);
		renderWithInvokeButton(
			0,
			['TEST-1'],
			{
				onRuleInvocationFailure: handlerMock,
			},
			[
				injectable(useManualRules, mockHook),
				injectable(invokeManuallyTriggeredRule, mockInvokeManuallyTriggeredRule),
			],
		);
		await clickInvokeButton();

		expect(mockInvokeManuallyTriggeredRule).toHaveBeenCalledTimes(1);

		expect(handlerMock).toHaveBeenCalled();
	});

	test('Should trigger failure callback if the api reports a partial success/failure', async () => {
		const mockHook = mockUseManualRules(true, null, mockTransformedRules);
		const successfulResponse = {
			'TEST-1': 'SUCCESS',
			'TEST-2': 'INVALID_LICENSE',
		};

		const handlerMock = jest.fn();

		const mockInvokeManuallyTriggeredRule = jest.fn().mockImplementation(() => successfulResponse);
		renderWithInvokeButton(
			0,
			['TEST-1', 'TEST-2'],
			{
				onRuleInvocationFailure: handlerMock,
			},
			[
				injectable(useManualRules, mockHook),
				injectable(invokeManuallyTriggeredRule, mockInvokeManuallyTriggeredRule),
			],
		);

		await clickInvokeButton();
		expect(mockInvokeManuallyTriggeredRule).toHaveBeenCalledTimes(1);

		// expect callback with success and failure appropriately handled.
		expect(handlerMock).toHaveBeenCalledWith(0, ['TEST-1'], ['TEST-2']);
	});
	//
	test('Should trigger success callback if the api reports a complete success', async () => {
		const mockHook = mockUseManualRules(true, null, mockTransformedRules);
		const successfulResponse = {
			'TEST-1': 'SUCCESS',
			'TEST-2': 'SUCCESS',
		};

		const handlerMock = jest.fn();

		const mockInvokeManuallyTriggeredRule = jest.fn().mockImplementation(() => successfulResponse);
		renderWithInvokeButton(
			0,
			['TEST-1', 'TEST-2'],
			{
				onRuleInvocationSuccess: handlerMock,
			},
			[
				injectable(useManualRules, mockHook),
				injectable(invokeManuallyTriggeredRule, mockInvokeManuallyTriggeredRule),
			],
		);

		await clickInvokeButton();
		expect(mockInvokeManuallyTriggeredRule).toHaveBeenCalledTimes(1);

		// expect callback with success and failure appropriately handled.
		expect(handlerMock).toHaveBeenCalledWith(0, ['TEST-1', 'TEST-2']);
	});
	test('Should trigger done callback if the api reports a success', async () => {
		const mockHook = mockUseManualRules(true, null, mockTransformedRules);
		// pick arbitrary invalid response
		const successfulResponse = {
			'TEST-1': 'SUCCESS',
		};

		const handlerMock = jest.fn();

		const mockInvokeManuallyTriggeredRule = jest.fn().mockImplementation(() => successfulResponse);
		renderWithInvokeButton(
			0,
			['TEST-1'],
			{
				onRuleInvocationLifecycleDone: handlerMock,
			},
			[
				injectable(useManualRules, mockHook),
				injectable(invokeManuallyTriggeredRule, mockInvokeManuallyTriggeredRule),
			],
		);

		await clickInvokeButton();
		expect(mockInvokeManuallyTriggeredRule).toHaveBeenCalledTimes(1);

		// expect callback with success and failure appropriately handled.
		expect(handlerMock).toHaveBeenCalledWith(0, ['TEST-1']);
	});
	test('Should trigger done callback if the api reports a failure', async () => {
		const mockHook = mockUseManualRules(true, null, mockTransformedRules);
		// pick arbitrary invalid response
		const successfulResponse = {
			'TEST-1': 'INVALID_LICENSE',
		};

		const handlerMock = jest.fn();

		const mockInvokeManuallyTriggeredRule = jest.fn().mockImplementation(() => successfulResponse);
		renderWithInvokeButton(
			0,
			['TEST-1'],
			{
				onRuleInvocationLifecycleDone: handlerMock,
			},
			[
				injectable(useManualRules, mockHook),
				injectable(invokeManuallyTriggeredRule, mockInvokeManuallyTriggeredRule),
			],
		);

		await clickInvokeButton();
		expect(mockInvokeManuallyTriggeredRule).toHaveBeenCalledTimes(1);

		// expect callback with success and failure appropriately handled.
		expect(handlerMock).toHaveBeenCalledWith(0, ['TEST-1']);
	});
	test('Should display dialog if a rule has inputs', async () => {
		const mockHook = mockUseManualRules(true, null, mockTransformedRules);

		renderWithInvokeButton(1, ['TEST-1'], undefined, [injectable(useManualRules, mockHook)]);

		await clickInvokeButton();
		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeVisible();
		});

		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
	test('Should execute rule if continue is clicked', async () => {
		const mockHook = mockUseManualRules(true, null, mockTransformedRules);
		const successfulResponse = {
			'TEST-1': 'SUCCESS',
		};

		const mockInvokeManuallyTriggeredRule = jest.fn().mockImplementation(() => successfulResponse);

		renderWithInvokeButton(1, ['TEST-1'], undefined, [
			injectable(useManualRules, mockHook),
			injectable(invokeManuallyTriggeredRule, mockInvokeManuallyTriggeredRule),
		]);

		await clickInvokeButton();
		await waitFor(() => {
			expect(screen.queryByText('Continue')).toBeVisible();
		});

		await act(async () => {
			fireEvent(
				screen.getByText('Continue'),
				new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
				}),
			);
		});

		expect(mockInvokeManuallyTriggeredRule).toHaveBeenCalledTimes(1);
	});
});
