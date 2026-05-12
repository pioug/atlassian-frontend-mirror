import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { ViewportDetector } from '../../viewportDetector';

const observeMock = jest.fn();
const disconnectMock = jest.fn();
let intersectionTrigger: () => void;
const IntersectionObserverMock = jest.fn((intersectionCallback) => {
	const entries: Partial<IntersectionObserverEntry>[] = [
		{ isIntersecting: false },
		{ isIntersecting: true },
		{ isIntersecting: true },
	];
	intersectionTrigger = () => {
		intersectionCallback(entries, { disconnect: disconnectMock });
	};
	return {
		observe: observeMock,
		disconnect: disconnectMock,
	};
});
(global as any).IntersectionObserver = IntersectionObserverMock;

const setup = () => {
	const callBack = jest.fn();
	const cardEl = document.createElement('div');
	render(
		<ViewportDetector onVisible={callBack} cardEl={cardEl}>
			<span>Hi!</span>
		</ViewportDetector>,
	);
	return { callBack, cardEl };
};

describe('ViewportDetector logic:', () => {
	beforeEach(() => jest.clearAllMocks());

	it('should capture and report a11y violations', async () => {
		const cardEl = document.createElement('div');
		const { container } = render(
			<ViewportDetector onVisible={jest.fn()} cardEl={cardEl}>
				<span>Hi!</span>
			</ViewportDetector>,
		);
		await expect(container).toBeAccessible();
	});

	describe('ViewportDetector', () => {
		it('should observe cardEl', () => {
			const { cardEl } = setup();

			expect(observeMock).toBeCalledTimes(1);
			expect(observeMock).toHaveBeenNthCalledWith(1, cardEl);
		});

		it('should call callback & disconnect when observe node(s) in viewport', () => {
			const { callBack } = setup();
			expect(screen.getByText('Hi!')).toBeInTheDocument();
			expect(observeMock).toHaveBeenCalledTimes(1);

			intersectionTrigger();

			expect(callBack).toBeCalledTimes(1);
			expect(disconnectMock).toBeCalledTimes(1);
		});
	});
});
