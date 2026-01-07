import React from 'react';

import { render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';

import { NestedContext } from '../../../NestableNavigationContent/context';
import LoadingItems from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<LoadingItems />', () => {
	const markup = (loading: boolean = true) => (
		<LoadingItems testId="test" isLoading={loading} fallback={<div>loading...</div>}>
			<div>hello, world</div>
		</LoadingItems>
	);

	it('should not affect position when entering', () => {
		render(markup());

		expect(screen.getByTestId('test--entering')).not.toHaveCompiledCss('position', 'absolute');
	});

	it('should position itself absolutely when exiting', () => {
		const { rerender } = render(markup());

		rerender(markup(false));

		expect(screen.getByTestId('test--exiting')).toHaveCompiledCss('position', 'absolute');
	});

	it('should take up all the available space when exiting', () => {
		const { rerender } = render(markup());

		rerender(markup(false));

		expect(screen.getByTestId('test--exiting')).toHaveCompiledCss('top', '0');
		expect(screen.getByTestId('test--exiting')).toHaveCompiledCss('left', '0');
		expect(screen.getByTestId('test--exiting')).toHaveCompiledCss('right', '0');
	});

	it('should position entering elements over exiting elements', () => {
		const { rerender } = render(markup());

		rerender(markup(false));

		expect(screen.getByTestId('test--exiting')).toHaveCompiledCss('z-index', '1');
		expect(screen.getByTestId('test--entering')).toHaveCompiledCss('z-index', '2');
	});

	it.skip('should use medium duration', () => {
		const { rerender } = render(markup());

		rerender(markup(false));

		expect(screen.getByTestId('test--exiting')).toHaveCompiledCss('animation-duration', '175ms');
	});

	it('should render nothing when not apart of the active view', () => {
		render(
			<NestedContext.Provider
				value={{
					currentStackId: '1',
					parentId: '2',
					onNest: __noop,
					onUnNest: __noop,
					stack: [],
					forceShowTopScrollIndicator: false,
					childIds: jest
						.spyOn(React, 'useRef')
						.mockReturnValue({ current: new Set<string>() }) as any,
				}}
			>
				{markup()}
			</NestedContext.Provider>,
		);

		expect(screen.queryByTestId('test--entering')).not.toBeInTheDocument();
	});
});
