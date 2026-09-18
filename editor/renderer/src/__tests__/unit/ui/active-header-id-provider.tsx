import React from 'react';

import { render } from '@testing-library/react';

import {
	ActiveHeaderIdConsumer,
	ActiveHeaderIdProvider,
} from '../../../ui/active-header-id-provider';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ActiveHeaderIdProvider', () => {
	const firstSpy = jest.fn();
	const secondSpy = jest.fn();
	const thirdSpy = jest.fn();
	const Example = ({ activeHeaderId }: any) => (
		<div>
			<ActiveHeaderIdProvider value={activeHeaderId}>
				<ActiveHeaderIdConsumer
					nestedHeaderIds={['test1', 'test2', 'test3']}
					onNestedHeaderIdMatch={firstSpy}
				/>
				<ActiveHeaderIdConsumer
					nestedHeaderIds={['test4', 'test5', 'test6']}
					onNestedHeaderIdMatch={secondSpy}
				/>
				<ActiveHeaderIdConsumer nestedHeaderIds={[]} onNestedHeaderIdMatch={thirdSpy} />
			</ActiveHeaderIdProvider>
		</div>
	);

	it('should not call any callback when nestedHeaderIds is undefined', () => {
		render(<Example />);

		expect(firstSpy).toHaveBeenCalledTimes(0);
		expect(secondSpy).toHaveBeenCalledTimes(0);
		expect(thirdSpy).toHaveBeenCalledTimes(0);
	});

	it(`should call onNestedHeaderIdMatch on the right consumers`, () => {
		const { rerender } = render(<Example activeHeaderId="test1" />);
		expect(firstSpy).toHaveBeenCalledTimes(1);
		expect(secondSpy).toHaveBeenCalledTimes(0);
		expect(thirdSpy).toHaveBeenCalledTimes(0);

		// re-rendering with the same active header must not fire again
		rerender(<Example activeHeaderId="test1" />);
		expect(firstSpy).toHaveBeenCalledTimes(1);
		expect(secondSpy).toHaveBeenCalledTimes(0);
		expect(thirdSpy).toHaveBeenCalledTimes(0);

		// nor must an unrelated prop change
		rerender(<Example activeHeaderId="test1" foo="bar" />);
		expect(firstSpy).toHaveBeenCalledTimes(1);
		expect(secondSpy).toHaveBeenCalledTimes(0);
		expect(thirdSpy).toHaveBeenCalledTimes(0);

		firstSpy.mockReset();

		rerender(<Example activeHeaderId="test4" />);
		expect(firstSpy).toHaveBeenCalledTimes(0);
		expect(secondSpy).toHaveBeenCalledTimes(1);
		expect(thirdSpy).toHaveBeenCalledTimes(0);

		secondSpy.mockReset();

		rerender(<Example activeHeaderId={undefined} />);
		expect(firstSpy).toHaveBeenCalledTimes(0);
		expect(secondSpy).toHaveBeenCalledTimes(0);
		expect(thirdSpy).toHaveBeenCalledTimes(0);
	});
});
