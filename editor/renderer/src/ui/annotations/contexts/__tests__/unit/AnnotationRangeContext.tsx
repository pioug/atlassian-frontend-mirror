import { renderHook, act } from '@testing-library/react-hooks';
import type { ReactNode } from 'react';
import React from 'react';

import {
	AnnotationRangeProvider,
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../../AnnotationRangeContext';

type Props = {
	children?: ReactNode;
};

describe('Annotations: AnnotationRangeContext', () => {
	const range = new Range();
	const setStartBeforeMock = jest.fn();
	const setEndAfterMock = jest.fn();

	beforeEach(() => {
		// @ts-ignore
		document.createRange = () => {
			return {
				setStartBefore: setStartBeforeMock,
				setEndAfter: setEndAfterMock,
				...document.createRange,
			};
		};
	});

	it('should not have setHoverTarget callback when comments on media is disabled', () => {
		const wrapper = ({ children }: Props) => (
			<AnnotationRangeProvider allowCommentsOnMedia={false}>{children}</AnnotationRangeProvider>
		);
		const { result } = renderHook(() => useAnnotationRangeDispatch(), {
			wrapper,
		});

		expect(result.current.setHoverTarget).not.toBeDefined();
	});

	it('should have setHoverTarget callback when comments on media is enabled', () => {
		const wrapper = ({ children }: Props) => (
			<AnnotationRangeProvider allowCommentsOnMedia={true}>{children}</AnnotationRangeProvider>
		);
		const { result } = renderHook(() => useAnnotationRangeDispatch(), {
			wrapper,
		});

		expect(result.current.setHoverTarget).toBeDefined();
	});

	it('should not set range when setHoverTarget is called and no media element found', () => {
		const wrapper = ({ children }: Props) => (
			<AnnotationRangeProvider allowCommentsOnMedia={true}>{children}</AnnotationRangeProvider>
		);

		const { result } = renderHook(
			() => ({ ...useAnnotationRangeState(), ...useAnnotationRangeDispatch() }),
			{
				wrapper,
			},
		);

		const element = document.createElement('div').appendChild(document.createElement('div'));

		act(() => {
			result.current.setHoverTarget!(element);
		});

		expect(result.current.range).toBe(null);
	});

	it('should set range when setHoverTarget is called and media element found', () => {
		const wrapper = ({ children }: Props) => (
			<AnnotationRangeProvider allowCommentsOnMedia={true}>{children}</AnnotationRangeProvider>
		);

		const { result } = renderHook(
			() => ({ ...useAnnotationRangeState(), ...useAnnotationRangeDispatch() }),
			{
				wrapper,
			},
		);

		const mediaMockNode = document.createElement('div');
		mediaMockNode.setAttribute('class', 'media-card-inline-player');
		const element = document.createElement('div');
		element.appendChild(mediaMockNode);

		act(() => {
			result.current.setHoverTarget!(element);
		});

		expect(setStartBeforeMock).toHaveBeenCalled();
		expect(setEndAfterMock).toHaveBeenCalled();
		expect(result.current.range).not.toBe(null);
	});

	it('should set range as selection type when using setRange', () => {
		const wrapper = ({ children }: Props) => (
			<AnnotationRangeProvider allowCommentsOnMedia={true}>{children}</AnnotationRangeProvider>
		);
		const { result } = renderHook(
			() => ({ ...useAnnotationRangeState(), ...useAnnotationRangeDispatch() }),
			{ wrapper },
		);

		expect(result.current.range).toBe(null);
		expect(result.current.type).toBe(null);

		act(() => {
			result.current.setRange(range);
		});

		expect(result.current.range).toBe(range);
		expect(result.current.type).toBe('selection');
	});

	it('should clear selection range when using clearSelectionRange', () => {
		const wrapper = ({ children }: Props) => (
			<AnnotationRangeProvider allowCommentsOnMedia={true}>{children}</AnnotationRangeProvider>
		);
		const { result } = renderHook(
			() => ({ ...useAnnotationRangeState(), ...useAnnotationRangeDispatch() }),
			{ wrapper },
		);

		act(() => {
			result.current.setRange(range);
		});

		expect(result.current.range).toBe(range);
		expect(result.current.type).toBe('selection');

		act(() => {
			result.current.clearSelectionRange();
		});

		expect(result.current.range).toBe(null);
		expect(result.current.type).toBe(null);
	});

	it('should not clear selection range when using clearHoverSelection', () => {
		const wrapper = ({ children }: Props) => (
			<AnnotationRangeProvider allowCommentsOnMedia={true}>{children}</AnnotationRangeProvider>
		);
		const { result } = renderHook(
			() => ({ ...useAnnotationRangeState(), ...useAnnotationRangeDispatch() }),
			{ wrapper },
		);

		act(() => {
			result.current.setRange(range);
		});

		expect(result.current.range).toBe(range);
		expect(result.current.type).toBe('selection');

		act(() => {
			result.current.clearHoverRange();
		});

		expect(result.current.range).toBe(range);
		expect(result.current.type).toBe('selection');
	});
});
