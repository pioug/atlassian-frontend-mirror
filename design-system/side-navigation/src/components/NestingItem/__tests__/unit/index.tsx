import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { ButtonItem, type CustomItemComponentProps } from '../../../Item';
import { ROOT_ID } from '../../../NestableNavigationContent';
import { NestedContext } from '../../../NestableNavigationContent/context';
import { default as NestingItem } from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<NestingItem />', () => {
	const callbacks = {
		currentStackId: ROOT_ID,
		onNest: jest.fn(),
		onUnNest: jest.fn(),
		stack: [],
		forceShowTopScrollIndicator: false,
		parentId: ROOT_ID,
		childIds: jest.spyOn(React, 'useRef').mockReturnValue({ current: new Set<string>() }) as any,
	};

	it('should render a title string as the button item when closed', () => {
		render(
			<NestedContext.Provider value={{ ...callbacks }}>
				<NestingItem id="1" title="Nest">
					<ButtonItem>Hello world</ButtonItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.getByText('Nest')).toBeInTheDocument();
		expect(screen.queryByText('Hello world')).not.toBeInTheDocument();
	});

	it('should render custom component as the button item when closed', () => {
		render(
			<NestedContext.Provider value={{ ...callbacks }}>
				<NestingItem id="1" title={<p>Custom Title</p>}>
					<ButtonItem>Hello world</ButtonItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.getByText('Custom Title')).toBeInTheDocument();
	});

	it('should render children when it is the current layer', () => {
		render(
			<NestedContext.Provider value={{ ...callbacks, currentStackId: '1' }}>
				<NestingItem id="1" title="Nest">
					<ButtonItem>Hello world</ButtonItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.queryByText('Nest')).not.toBeInTheDocument();
		expect(screen.getByText('Hello world')).toBeInTheDocument();
	});

	it('should callback once when clicked twice to prevent accidental double clicks', () => {
		const callback = jest.fn();
		const onNest = jest.fn();
		render(
			<NestedContext.Provider value={{ ...callbacks, onNest }}>
				<NestingItem id="1" onClick={callback} title="Nest">
					<ButtonItem>Hello world</ButtonItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		fireEvent.click(screen.getByText('Nest'));
		fireEvent.click(screen.getByText('Nest'));

		expect(onNest).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should callback to nested context with id when clicked', () => {
		const onNest = jest.fn();
		render(
			<NestedContext.Provider value={{ ...callbacks, onNest }}>
				<NestingItem id="1" title="Nest">
					<ButtonItem>Hello world</ButtonItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		fireEvent.click(screen.getByText('Nest'));

		expect(onNest).toHaveBeenCalledWith('1');
	});

	it('should always place a right arrow icon in the button item', () => {
		render(
			<NestedContext.Provider value={{ ...callbacks }}>
				<NestingItem testId="nest" title="Nest" id="more-important">
					<ButtonItem>Hello world</ButtonItem>
				</NestingItem>
			</NestedContext.Provider>,
		);
		expect(screen.getByTestId('nest--item--right-arrow')).toBeInTheDocument();
	});

	it('should customize the after element for the button item', () => {
		render(
			<NestedContext.Provider value={{ ...callbacks }}>
				<NestingItem iconAfter={<span>custom</span>} testId="nest" title="Nest" id="more-important">
					<ButtonItem>Hello world</ButtonItem>
				</NestingItem>
			</NestedContext.Provider>,
		);
		expect(screen.getByText('custom')).toBeInTheDocument();
		expect(screen.getByTestId('nest--item--right-arrow')).toBeInTheDocument();
	});

	it('should pass through extra props to the component', () => {
		const Link = ({ children, ...props }: CustomItemComponentProps & { href: string }) => (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props, @atlaskit/design-system/no-html-anchor
			<a {...props}>{children}</a>
		);

		render(
			<NestedContext.Provider value={{ ...callbacks }}>
				<NestingItem id="hello" title="yeah" href="/my-details" component={Link} testId="target">
					Hello world
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.getByTestId('target--item')).toHaveAttribute('href', '/my-details');
	});
});
