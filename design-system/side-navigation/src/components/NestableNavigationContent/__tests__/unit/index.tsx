import React, { Fragment, useEffect, useState } from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import { Box, Text } from '@atlaskit/primitives';

import * as raf from '../../../../__tests__/unit/__utils__/raf';
import { ButtonItem, GoBackItem } from '../../../Item';
import { default as NestingItem } from '../../../NestingItem';
import { default as NestingTransitionProvider } from '../../index';

raf.replace();

// FIXME: Jest 29 upgrade - This test suite is failing in both unit test & react 18 unit tests
// suggestion to fix issues - use replaceRaf directly, use act() and waitFor()
describe.skip('NestingTransitionProvider', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	const completeAnimations = () => {
		act(() => raf.step());
		act(() => {
			jest.runAllTimers();
		});
	};

	it('should have tabIndex set as -1', () => {
		const { getByTestId } = render(
			<NestingTransitionProvider testId="side-nav">
				<ButtonItem>Hello World</ButtonItem>
			</NestingTransitionProvider>,
		);
		const nestableNavContent = getByTestId('side-nav');
		const actualTabIndex = nestableNavContent.getAttribute('tabIndex');
		expect(actualTabIndex).toEqual('-1');
	});

	it('should focus on nesting container', () => {
		const { getByTestId } = render(
			<NestingTransitionProvider testId="side-nav">
				<NestingItem id="1" title="Hello Nested" testId="filter-nesting-item">
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);
		const nestableNavContent = getByTestId('side-nav');
		const filterNestingItem = getByTestId('filter-nesting-item--item') as HTMLDivElement;
		const rightClick = { button: 1 };
		fireEvent.click(filterNestingItem, rightClick);
		expect(nestableNavContent).toHaveFocus();
		expect(nestableNavContent).toHaveFocus();
	});

	it('should render the top level navigation', () => {
		const { queryByText } = render(
			<NestingTransitionProvider>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		expect(queryByText('Hello World')).toBeInTheDocument();
		expect(queryByText('Hello Nested')).toBeInTheDocument();
		expect(queryByText('Nested Hello World')).not.toBeInTheDocument();
	});

	it('should render the second level navigation', () => {
		const { queryByText, getByText } = render(
			<NestingTransitionProvider>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();

		expect(queryByText('Hello World')).not.toBeInTheDocument();
		expect(queryByText('Hello Nested')).not.toBeInTheDocument();
		expect(queryByText('Nested Hello World')).toBeInTheDocument();
	});

	it('should render the third level navigation', () => {
		const { queryByText, getByText } = render(
			<NestingTransitionProvider>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();
		fireEvent.click(getByText('Hello Deeply Nested'));
		completeAnimations();

		expect(queryByText('Nested Hello World')).not.toBeInTheDocument();
		expect(queryByText('Deeply Nested Hello World')).toBeInTheDocument();
	});

	it('should travel to the second level navigation and back to root', () => {
		const { queryByText, getByText } = render(
			<NestingTransitionProvider>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();
		fireEvent.click(getByText('Go back'));
		completeAnimations();

		expect(queryByText('Hello World')).toBeInTheDocument();
		expect(queryByText('Hello Nested')).toBeInTheDocument();
		expect(queryByText('Nested Hello World')).not.toBeInTheDocument();
	});

	it('should travel to the third level navigation and back to root', () => {
		const { queryByText, getByText } = render(
			<NestingTransitionProvider>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();
		fireEvent.click(getByText('Hello Deeply Nested'));
		completeAnimations();
		fireEvent.click(getByText('Go back'));
		completeAnimations();
		fireEvent.click(getByText('Go back'));
		completeAnimations();

		expect(queryByText('Hello World')).toBeInTheDocument();
		expect(queryByText('Hello Nested')).toBeInTheDocument();
		expect(queryByText('Nested Hello World')).not.toBeInTheDocument();
	});

	it('should exit the root items to the left when nesting', () => {
		const { getByTestId, getByText } = render(
			<NestingTransitionProvider testId="nested">
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		act(() => raf.step());

		const actual = getByTestId('nested-anim-exiting').getAttribute('data-exit-to');
		expect(actual).toEqual('left');
	});

	it('should enter the first level navigation from the right when nesting', () => {
		const { getByTestId, getByText } = render(
			<NestingTransitionProvider testId="nested">
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		act(() => raf.step());

		const actual = getByTestId('nested-anim-entering').getAttribute('data-enter-from');
		expect(actual).toEqual('right');
	});

	it('should exit the first level navigation to the right when unnesting', () => {
		const { getByTestId, getByText } = render(
			<NestingTransitionProvider testId="nested">
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();
		fireEvent.click(getByText('Go back'));
		act(() => raf.step());

		const actual = getByTestId('nested-anim-exiting').getAttribute('data-exit-to');
		expect(actual).toEqual('right');
	});

	it('should enter the root navigation from the left when unnesting', () => {
		const { getByTestId, getByText } = render(
			<NestingTransitionProvider testId="nested">
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();
		fireEvent.click(getByText('Go back'));
		act(() => raf.step());

		const actual = getByTestId('nested-anim-entering').getAttribute('data-enter-from');
		expect(actual).toEqual('left');
	});

	it('should not double up nesting when interacting with a nesting item twice', () => {
		const { getByText, queryByText } = render(
			<NestingTransitionProvider testId="nested">
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		// Split clicks out after a frame because no one can click twice in the same frame.
		act(() => raf.step());
		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();
		fireEvent.click(getByText('Go back'));
		completeAnimations();

		expect(queryByText('Nested Hello World')).not.toBeInTheDocument();
	});

	it('should show the second level navigation initially', () => {
		const innerLayer = (
			<Fragment>
				<ButtonItem>Nested Hello World</ButtonItem>
				<NestingItem id="1-1" title="Hello Deeply Nested">
					<ButtonItem>Deeply Nested Hello World</ButtonItem>
				</NestingItem>
			</Fragment>
		);
		const initialStack = ['1'];

		const { queryByText } = render(
			<NestingTransitionProvider initialStack={initialStack}>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					{innerLayer}
				</NestingItem>
			</NestingTransitionProvider>,
		);

		expect(queryByText('Hello World')).not.toBeInTheDocument();
		expect(queryByText('Hello Nested')).not.toBeInTheDocument();
		expect(queryByText('Nested Hello World')).toBeInTheDocument();
	});

	it('should navigate to the second level navigation using id', () => {
		const { getByText, queryByText } = render(
			<NestingTransitionProvider>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem title="Hello Nested" id="1">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem title="Hello Nested" id="1-1">
						<ButtonItem>Most Nested Hello World 1</ButtonItem>
					</NestingItem>
					<NestingItem title="Shouldn't click me" id="1-2">
						<ButtonItem>Most Nested Hello World 2</ButtonItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();
		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();

		expect(getByText('Most Nested Hello World 1')).toBeInTheDocument();
		expect(queryByText('Most Nested Hello World 2')).not.toBeInTheDocument();
	});

	it('should not break with any intermediate elements between nesting items', () => {
		const { queryByText, getByText } = render(
			<NestingTransitionProvider>
				<Box>
					<Box>
						<ButtonItem>Hello World</ButtonItem>
					</Box>
					<Box>
						<NestingItem id="1" title="Hello Nested">
							<Box>
								<ButtonItem>Nested Hello World</ButtonItem>
							</Box>
							<NestingItem id="1-1" title="Hello Deeply Nested">
								<Box>
									<ButtonItem>Deeply Nested Hello World</ButtonItem>
								</Box>
							</NestingItem>
						</NestingItem>
					</Box>
				</Box>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();
		fireEvent.click(getByText('Hello Deeply Nested'));
		completeAnimations();

		expect(queryByText('Nested Hello World')).not.toBeInTheDocument();
		expect(queryByText('Deeply Nested Hello World')).toBeInTheDocument();
	});

	it('should not render a go back item on the root view', () => {
		const { getByTestId, getByText } = render(
			<NestingTransitionProvider testId="provider">
				<NestingItem title="Hello Nested" id="1">
					<ButtonItem>Nested Hello World</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		expect(() => getByTestId('provider--go-back-item')).toThrow();

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();

		expect(getByTestId('provider--go-back-item')).toHaveTextContent('Go back');
	});

	it('should render a default go back item when nothing is specified', () => {
		const { getByTestId, getByText } = render(
			<NestingTransitionProvider testId="provider">
				<NestingItem title="Hello Nested" id="1">
					<ButtonItem>Nested Hello World</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();

		expect(getByTestId('provider--go-back-item')).toHaveTextContent('Go back');
	});

	it('should set a new default go back item when specified at the NestableNavigationContent level', () => {
		const { getByTestId, getByText } = render(
			<NestingTransitionProvider
				testId="provider"
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={{
					GoBackItem: {
						render: (props) => <GoBackItem {...props}>Internationalised</GoBackItem>,
					},
				}}
			>
				<NestingItem title="Hello Nested" id="1">
					<ButtonItem>Nested Hello World</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();

		expect(getByTestId('provider--go-back-item')).toHaveTextContent('Internationalised');
	});

	it('should render the go back item explicitly set at the NestingItem level', () => {
		const { getByTestId, getByText } = render(
			<NestingTransitionProvider
				testId="provider"
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={{
					GoBackItem: {
						render: (props) => <GoBackItem {...props}>Internationalised</GoBackItem>,
					},
				}}
			>
				<NestingItem
					title="Hello Nested"
					id="1"
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					overrides={{
						GoBackItem: {
							render: ({ onClick }) => (
								<GoBackItem testId={'custom-go-back'} onClick={onClick}>
									Custom
								</GoBackItem>
							),
						},
					}}
				>
					<ButtonItem>Nested Hello World</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));
		completeAnimations();

		expect(getByTestId('custom-go-back')).toHaveTextContent('Custom');
	});

	it('should transition correctly with custom async components', async () => {
		const AsyncNestingItem = () => {
			const [isLoading, setIsLoading] = useState(true);

			useEffect(() => {
				setTimeout(() => setIsLoading(false), 250);
			}, []);

			return isLoading ? (
				<Text as="p">test loading</Text>
			) : (
				<NestingItem id="1-1" title="Custom Nesting Item">
					<ButtonItem>Hello world</ButtonItem>
				</NestingItem>
			);
		};

		const { getByText, findByText } = render(
			<NestingTransitionProvider>
				<NestingItem id="root" title="Initial Nesting Item">
					<AsyncNestingItem />
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(await findByText('Initial Nesting Item'));
		completeAnimations();

		fireEvent.click(getByText('Custom Nesting Item'));
		completeAnimations();

		expect(getByText('Hello world')).toBeInTheDocument();
	});

	it('should navigate to children views when controlled', () => {
		const onChange = jest.fn();

		const { getByText } = render(
			<NestingTransitionProvider stack={[]} onChange={onChange}>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Hello Nested'));

		expect(onChange).toHaveBeenCalledWith(['1']);
	});

	it('should be able to navigate back to parent views when controlled', () => {
		const onChange = jest.fn();

		const { getByText } = render(
			<NestingTransitionProvider stack={['1', '1-1']} onChange={onChange}>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		fireEvent.click(getByText('Go back'));

		expect(onChange).toHaveBeenCalledWith(['1']);
	});

	it('should be able initialize on a deeply nested view when controlled', () => {
		const { queryByText } = render(
			<NestingTransitionProvider stack={['1', '1-1', '1-1-1']}>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
						<NestingItem id="1-1-1" title="Hello Very Deeply Nested">
							<ButtonItem>Very Deeply Nested Hello World</ButtonItem>
						</NestingItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		expect(queryByText('Very Deeply Nested Hello World')).toBeInTheDocument();
		expect(queryByText('Nested Hello World')).not.toBeInTheDocument();
	});

	it('should be able to dynamically update the stack when controlled', () => {
		const { queryByText, rerender } = render(
			<NestingTransitionProvider stack={['1']}>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
						<NestingItem id="1-1-1" title="Hello Very Deeply Nested">
							<ButtonItem>Very Deeply Nested Hello World</ButtonItem>
						</NestingItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		expect(queryByText('Nested Hello World')).toBeInTheDocument();
		expect(queryByText('Very Deeply Nested Hello World')).not.toBeInTheDocument();

		rerender(
			<NestingTransitionProvider stack={['1', '1-1', '1-1-1']}>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Hello Nested">
					<ButtonItem>Nested Hello World</ButtonItem>
					<NestingItem id="1-1" title="Hello Deeply Nested">
						<ButtonItem>Deeply Nested Hello World</ButtonItem>
						<NestingItem id="1-1-1" title="Hello Very Deeply Nested">
							<ButtonItem>Very Deeply Nested Hello World</ButtonItem>
						</NestingItem>
					</NestingItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		completeAnimations();

		expect(queryByText('Very Deeply Nested Hello World')).toBeInTheDocument();
		expect(queryByText('Nested Hello World')).not.toBeInTheDocument();
	});

	it('should be able to navigate to sibling views when controlled', () => {
		const { queryByText, rerender } = render(
			<NestingTransitionProvider stack={['1']}>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Sibling 1">
					<ButtonItem>Nested Children 1</ButtonItem>
				</NestingItem>
				<NestingItem id="2" title="Sibling 2">
					<ButtonItem>Nested Children 2</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		expect(queryByText('Nested Children 1')).toBeInTheDocument();
		expect(queryByText('Nested Children 2')).not.toBeInTheDocument();

		rerender(
			<NestingTransitionProvider stack={['2']}>
				<ButtonItem>Hello World</ButtonItem>
				<NestingItem id="1" title="Sibling 1">
					<ButtonItem>Nested Children 1</ButtonItem>
				</NestingItem>
				<NestingItem id="2" title="Sibling 2">
					<ButtonItem>Nested Children 2</ButtonItem>
				</NestingItem>
			</NestingTransitionProvider>,
		);

		completeAnimations();

		expect(queryByText('Nested Children 1')).not.toBeInTheDocument();
		expect(queryByText('Nested Children 2')).toBeInTheDocument();
	});

	it('should take up 100% of its parents dimensions so it doesnt jump around when entering', () => {
		const { getByTestId } = render(
			<NestingTransitionProvider testId="parent">
				<ButtonItem>Hello World</ButtonItem>
			</NestingTransitionProvider>,
		);

		expect(getByTestId('parent-anim-entering')).toHaveStyle({ width: '100%' });
		expect(getByTestId('parent-anim-entering')).toHaveStyle({ height: '100%' });
	});

	const modifierKeys = [
		{
			key: 'Meta',
			code: 'MetaLeft',
		},
		{
			key: 'Shift',
			code: 'ShiftLeft',
		},
		{
			key: 'Alt',
			code: 'AltLeft',
		},
		{
			key: 'Control',
			code: 'ControlLeft',
		},
	];

	modifierKeys.forEach((modifier) => {
		it(`should not travel to the second level navigation when a ${modifier.key} modifier key is detected on click`, () => {
			const { queryByText, getByText } = render(
				<NestingTransitionProvider>
					<ButtonItem>Hello World</ButtonItem>
					<NestingItem id="1" title="Hello Nested">
						<ButtonItem>Nested Hello World</ButtonItem>
						<NestingItem id="1-1" title="Hello Deeply Nested">
							<ButtonItem>Deeply Nested Hello World</ButtonItem>
						</NestingItem>
					</NestingItem>
				</NestingTransitionProvider>,
			);

			fireEvent.keyDown(getByText('Hello Nested'), {
				key: modifier.key,
				code: modifier.code,
			});
			fireEvent.click(getByText('Hello Nested'));

			expect(queryByText('Hello World')).toBeInTheDocument();
			expect(queryByText('Hello Nested')).toBeInTheDocument();
			expect(queryByText('Nested Hello World')).not.toBeInTheDocument();
		});
	});

	modifierKeys.forEach((modifier) => {
		it(`should not travel to the second level navigation when a ${modifier.key} modifier key is detected with keyboard navigation`, () => {
			const { queryByText, getByText } = render(
				<NestingTransitionProvider>
					<ButtonItem>Hello World</ButtonItem>
					<NestingItem id="1" title="Hello Nested">
						<ButtonItem>Nested Hello World</ButtonItem>
						<NestingItem id="1-1" title="Hello Deeply Nested">
							<ButtonItem>Deeply Nested Hello World</ButtonItem>
						</NestingItem>
					</NestingItem>
				</NestingTransitionProvider>,
			);
			getByText('Hello Nested').focus();
			fireEvent.keyDown(getByText('Hello Nested'), {
				key: modifier.key,
				code: modifier.code,
			});
			fireEvent.keyDown(getByText('Hello Nested'), {
				key: 'Enter',
				code: 'Enter',
			});
			expect(queryByText('Hello World')).toBeInTheDocument();
			expect(queryByText('Hello Nested')).toBeInTheDocument();
			expect(queryByText('Nested Hello World')).not.toBeInTheDocument();
		});
	});
});
