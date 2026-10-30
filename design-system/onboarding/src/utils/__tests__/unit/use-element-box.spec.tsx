import React from 'react';

import { replaceRaf } from 'raf-stub';

import { act, fireEvent, render } from '@atlassian/testing-library/testing-library/react';

import { ElementBox } from '../../use-element-box';

replaceRaf();

// Element measurements are deferred with `setTimeout(0)` to avoid content shifting,
// so flush pending timers before asserting on the measured box.
const flushDeferredMeasurement = () =>
	act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
	});

const commonBoundingClientRectValues = {
	left: 2,
	right: 0,
	bottom: 0,
	x: 0,
	y: 0,
	toJSON() {
		return JSON.stringify(this);
	},
};

const getBoundingClientRectValues: DOMRect[] = [
	{
		width: 100,
		height: 250,
		top: 5,
		...commonBoundingClientRectValues,
	},
	{
		width: 50,
		height: 300,
		top: 10,
		...commonBoundingClientRectValues,
	},
];

describe('use-element-box', () => {
	it('correctly provides element dimensions on initial render', async () => {
		const element = document.createElement('div');

		jest
			.spyOn(element, 'getBoundingClientRect')
			.mockImplementationOnce(() => getBoundingClientRectValues[0]);

		let box = {};

		render(
			<ElementBox element={element}>
				{(nextBox) => {
					if (nextBox) {
						box = nextBox;
					}

					return null;
				}}
			</ElementBox>,
		);
		await flushDeferredMeasurement();

		expect(box).toEqual({
			width: 100,
			height: 250,
			left: 2,
			top: 5,
		});
	});

	it('listens to resizes and updates element position to match', async () => {
		const element = document.createElement('div');

		jest
			.spyOn(element, 'getBoundingClientRect')
			.mockImplementationOnce(() => getBoundingClientRectValues[0])
			.mockImplementationOnce(() => getBoundingClientRectValues[1]);

		let box = {};

		render(
			<ElementBox element={element}>
				{(nextBox) => {
					if (nextBox) {
						box = nextBox;
					}

					return null;
				}}
			</ElementBox>,
		);
		await flushDeferredMeasurement();

		// eslint-disable-next-line testing-library/no-unnecessary-act
		act(() => {
			fireEvent(window, new Event('resize'));
			(window.requestAnimationFrame as any).step();
		});

		expect(element.getBoundingClientRect).toHaveBeenCalledTimes(2);
		expect(box).toEqual({
			width: 50,
			height: 300,
			top: 10,
			left: 2,
		});
	});

	it('updates dimensions correctly when the target element is swapped out', async () => {
		let element: HTMLElement = document.createElement('div');
		const elementNext = document.createElement('span');
		let box = {};

		jest
			.spyOn(element, 'getBoundingClientRect')
			.mockImplementation(() => getBoundingClientRectValues[0]);

		const { rerender } = render(
			<ElementBox element={element}>
				{(nextBox) => {
					if (nextBox) {
						box = nextBox;
					}

					return null;
				}}
			</ElementBox>,
		);
		await flushDeferredMeasurement();

		expect(box).toEqual({
			width: 100,
			height: 250,
			left: 2,
			top: 5,
		});
		expect(element.getBoundingClientRect).toHaveBeenCalledTimes(1);

		jest
			.spyOn(elementNext, 'getBoundingClientRect')
			.mockImplementation(() => getBoundingClientRectValues[1]);

		rerender(
			<ElementBox element={elementNext}>
				{(nextBox) => {
					if (nextBox) {
						box = nextBox;
					}

					return null;
				}}
			</ElementBox>,
		);
		await flushDeferredMeasurement();

		expect(box).toEqual({
			width: 50,
			height: 300,
			top: 10,
			left: 2,
		});
		expect(elementNext.getBoundingClientRect).toHaveBeenCalledTimes(1);
	});
});
