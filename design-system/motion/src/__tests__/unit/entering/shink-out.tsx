import React from 'react';

import { act, render } from '@testing-library/react';

import ExitingPersistence from '../../../entering/exiting-persistence';
import ShrinkOut from '../../../entering/shrink-out';
import { easeIn } from '../../../utils/curves';
import { smallDurationMs } from '../../../utils/durations';
import { ComponentStub } from '../../__utils__/component-stub';
import * as raf from '../../__utils__/raf';

jest.mock('../../../utils/accessibility');
raf.replace();

describe('<ShrinkOut />', () => {
	beforeEach(() => {
		jest.useRealTimers();
	});

	it('should do nothing on initial mount', () => {
		const { getByTestId } = render(
			<ExitingPersistence>
				<ShrinkOut>
					{(props) => (
						<ComponentStub
							testId="target"
							box={{ offsetHeight: 25, offsetWidth: 100 }}
							{...props}
						/>
					)}
				</ShrinkOut>
			</ExitingPersistence>,
		);

		expect(getByTestId('target')).not.toHaveAttribute('style');
	});

	it('should fix exiting elements size ready for the next frame', () => {
		const { rerender, getByTestId } = render(
			<ExitingPersistence>
				<ShrinkOut>
					{(props) => (
						<ComponentStub
							testId="target"
							box={{ offsetHeight: 25, offsetWidth: 100 }}
							{...props}
						/>
					)}
				</ShrinkOut>
			</ExitingPersistence>,
		);

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		expect(getByTestId('target')).toHaveStyle({ height: '25px' });
		expect(getByTestId('target')).toHaveStyle({ width: '100px' });
	});

	it('should apply border box when exiting to prevent sizing changing', () => {
		const { rerender, getByTestId } = render(
			<ExitingPersistence>
				<ShrinkOut>
					{(props) => (
						<ComponentStub
							testId="target"
							box={{ offsetHeight: 25, offsetWidth: 100 }}
							{...props}
						/>
					)}
				</ShrinkOut>
			</ExitingPersistence>,
		);

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		expect(getByTestId('target')).toHaveStyle({ boxSizing: 'border-box' });
	});

	it('should mark width and margin as styles that will change when exiting', () => {
		const { rerender, getByTestId } = render(
			<ExitingPersistence>
				<ShrinkOut>
					{(props) => (
						<ComponentStub
							testId="target"
							box={{ offsetHeight: 25, offsetWidth: 100 }}
							{...props}
						/>
					)}
				</ShrinkOut>
			</ExitingPersistence>,
		);

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		expect(getByTestId('target')).toHaveStyle({ willChange: 'width,margin' });
	});

	it('should transition down to take no horizontal space after two frames', () => {
		const { rerender, getByTestId } = render(
			<ExitingPersistence>
				<ShrinkOut>
					{(props) => (
						<ComponentStub
							testId="target"
							box={{ offsetHeight: 25, offsetWidth: 100 }}
							{...props}
						/>
					)}
				</ShrinkOut>
			</ExitingPersistence>,
		);
		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		raf.step();
		raf.step();

		expect(getByTestId('target')).toHaveStyle({
			transitionProperty: 'width,margin',
		});
		expect(getByTestId('target')).toHaveStyle({ width: '0px' });
		expect(getByTestId('target')).toHaveStyle({ margin: '0px' });
	});

	it('should take small duration to complete exiting', () => {
		const { rerender, getByTestId } = render(
			<ExitingPersistence>
				<ShrinkOut>
					{(props) => (
						<ComponentStub
							testId="target"
							box={{ offsetHeight: 25, offsetWidth: 100 }}
							{...props}
						/>
					)}
				</ShrinkOut>
			</ExitingPersistence>,
		);
		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		raf.step();
		raf.step();

		expect(getByTestId('target')).toHaveStyle({
			transitionDuration: `${smallDurationMs}ms`,
		});
	});

	it('should ease in to exiting', () => {
		const { rerender, getByTestId } = render(
			<ExitingPersistence>
				<ShrinkOut>
					{(props) => (
						<ComponentStub
							testId="target"
							box={{ offsetHeight: 25, offsetWidth: 100 }}
							{...props}
						/>
					)}
				</ShrinkOut>
			</ExitingPersistence>,
		);
		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		raf.step();
		raf.step();

		expect(getByTestId('target').style.transitionTimingFunction).toEqual(easeIn);
	});

	it('should callback when finished exiting', () => {
		jest.useFakeTimers();
		const callback = jest.fn();
		const { rerender } = render(
			<ExitingPersistence>
				<ShrinkOut onFinish={callback}>
					{(props) => (
						<ComponentStub
							testId="target"
							box={{ offsetHeight: 25, offsetWidth: 100 }}
							{...props}
						/>
					)}
				</ShrinkOut>
			</ExitingPersistence>,
		);
		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		raf.step();
		raf.step();
		act(() => {
			jest.advanceTimersByTime(smallDurationMs);
		});

		expect(callback).toHaveBeenCalledWith('exiting');
		jest.useRealTimers();
	});

	it('should be removed from the DOM when finished exiting', () => {
		jest.useFakeTimers();
		const callback = jest.fn();
		const { rerender, baseElement } = render(
			<ExitingPersistence>
				<ShrinkOut onFinish={callback}>
					{(props) => (
						<ComponentStub
							testId="target"
							box={{ offsetHeight: 25, offsetWidth: 100 }}
							{...props}
						/>
					)}
				</ShrinkOut>
			</ExitingPersistence>,
		);
		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		raf.step();
		raf.step();
		act(() => {
			jest.advanceTimersByTime(smallDurationMs);
		});

		expect(baseElement.querySelector('[data-testid="target"]')).toEqual(null);
		jest.useRealTimers();
	});
});
