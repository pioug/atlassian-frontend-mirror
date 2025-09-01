import { act, renderHook } from '@testing-library/react';

import * as InteractionContextModule from '../interaction-context';
import * as InteractionMetricsModule from '../interaction-metrics';

import { useUFOReportError } from './index';

describe('useUFOReportError', () => {
	const mockAddError = jest.spyOn(InteractionMetricsModule, 'addError');
	const mockAddErrorToAll = jest.spyOn(InteractionMetricsModule, 'addErrorToAll');
	const mockGetActiveInteraction = jest.spyOn(InteractionMetricsModule, 'getActiveInteraction');
	const mockUseInteractionContext = jest.spyOn(InteractionContextModule, 'useInteractionContext');

	const errorBase = {
		name: 'ErrorName',
		errorMessage: 'Something went wrong',
		errorStack: 'stack',
		forcedError: false,
	} as InteractionMetricsModule.InteractionError;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns a function', () => {
		mockGetActiveInteraction.mockReturnValue(undefined as any);
		mockUseInteractionContext.mockReturnValue(null as any);

		const { result } = renderHook(() => useUFOReportError());
		expect(typeof result.current).toBe('function');
	});

	it('calls addError when there is an active interaction', () => {
		mockGetActiveInteraction.mockReturnValue({ id: 'abc123' } as any);
		mockUseInteractionContext.mockReturnValue({ labelStack: [{ name: 'label' }] } as any);

		const { result } = renderHook(() => useUFOReportError());
		act(() => {
			result.current(errorBase);
		});

		expect(mockAddError).toHaveBeenCalledTimes(1);
		expect(mockAddError).toHaveBeenCalledWith(
			'abc123',
			'ErrorName',
			[{ name: 'label' }],
			'ErrorName',
			'Something went wrong',
			'stack',
			false,
		);
		expect(mockAddErrorToAll).not.toHaveBeenCalled();
	});

	it('falls back to addErrorToAll when there is no active interaction', () => {
		mockGetActiveInteraction.mockReturnValue(undefined);
		mockUseInteractionContext.mockReturnValue({ labelStack: [{ name: 'root' }] } as any);

		const { result } = renderHook(() => useUFOReportError());
		act(() => {
			result.current(errorBase);
		});

		expect(mockAddErrorToAll).toHaveBeenCalledTimes(1);
		expect(mockAddErrorToAll).toHaveBeenCalledWith(
			'ErrorName',
			[{ name: 'root' }],
			'ErrorName',
			'Something went wrong',
			'stack',
		);
		expect(mockAddError).not.toHaveBeenCalled();
	});

	it('passes null labelStack when interaction context is null', () => {
		mockGetActiveInteraction.mockReturnValue({ id: 'id-1' } as any);
		mockUseInteractionContext.mockReturnValue(null);

		const { result } = renderHook(() => useUFOReportError());
		act(() => {
			result.current(errorBase);
		});

		expect(mockAddError).toHaveBeenCalledWith(
			'id-1',
			'ErrorName',
			null,
			'ErrorName',
			'Something went wrong',
			'stack',
			false,
		);
	});

	it('supports optional fields on InteractionError', () => {
		mockGetActiveInteraction.mockReturnValue(undefined);
		mockUseInteractionContext.mockReturnValue({ labelStack: [] } as any);

		const { result } = renderHook(() => useUFOReportError());
		act(() => {
			result.current({ name: 'E', errorMessage: 'm' } as any);
		});

		expect(mockAddErrorToAll).toHaveBeenCalledWith('E', [], 'E', 'm', undefined);
	});
});
