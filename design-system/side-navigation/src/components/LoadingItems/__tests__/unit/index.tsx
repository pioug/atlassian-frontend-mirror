import React from 'react';

import { render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';

import { NestedContext } from '../../../NestableNavigationContent/context';
import LoadingItems from '../../index';

describe('<LoadingItems />', () => {
	const markup = (loading: boolean = true) => (
		<LoadingItems testId="test" isLoading={loading} fallback={<div>loading...</div>}>
			<div>hello, world</div>
		</LoadingItems>
	);

	it('should not affect position when entering', () => {
		render(markup());

		expect(screen.getByTestId('test--entering')).not.toHaveStyleDeclaration('position', 'absolute');
	});

	it('should position itself absolutely when exiting', () => {
		const { rerender } = render(markup());

		rerender(markup(false));

		expect(screen.getByTestId('test--exiting')).toHaveStyleDeclaration('position', 'absolute');
	});

	it('should take up all the available space when exiting', () => {
		const { rerender } = render(markup());

		rerender(markup(false));

		expect(screen.getByTestId('test--exiting')).toHaveStyleDeclaration('top', '0');
		expect(screen.getByTestId('test--exiting')).toHaveStyleDeclaration('left', '0');
		expect(screen.getByTestId('test--exiting')).toHaveStyleDeclaration('right', '0');
	});

	it('should position entering elements over exiting elements', () => {
		const { rerender } = render(markup());

		rerender(markup(false));

		expect(screen.getByTestId('test--exiting')).toHaveStyleDeclaration('z-index', '1');
		expect(screen.getByTestId('test--entering')).toHaveStyleDeclaration('z-index', '2');
	});

	it('should use medium duration', () => {
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
