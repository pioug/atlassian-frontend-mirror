import React, { type FC } from 'react';

import { render, screen } from '@testing-library/react';

import { ROOT_ID } from '../../../NestableNavigationContent';
import { NestedContext } from '../../../NestableNavigationContent/context';
import { default as NestingItem } from '../../../NestingItem';
import { ButtonItem, CustomItem, type CustomItemComponentProps, LinkItem } from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Item', () => {
	const callbacks = {
		currentStackId: ROOT_ID,
		onNest: jest.fn(),
		onUnNest: jest.fn(),
		stack: [],
		parentId: ROOT_ID,
		forceShowTopScrollIndicator: false,
		childIds: jest.spyOn(React, 'useRef').mockReturnValue({ current: new Set<string>() }) as any,
	};

	it('should render a ButtonItem when contained in an active nested view', () => {
		const { rerender } = render(
			<NestedContext.Provider value={{ ...callbacks }}>
				<NestingItem id="1" title="Nest">
					<ButtonItem>Hello world</ButtonItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.queryByText('Hello world')).not.toBeInTheDocument();

		rerender(
			<NestedContext.Provider value={{ ...callbacks, currentStackId: '1' }}>
				<NestingItem id="1" title="Nest">
					<ButtonItem>Hello world</ButtonItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.getByText('Hello world')).toBeInTheDocument();
	});

	it('should render a LinkItem when contained in an active nested view', () => {
		const { rerender } = render(
			<NestedContext.Provider value={{ ...callbacks }}>
				<NestingItem id="1" title="Nest">
					<LinkItem href="www.atlassian.com">Hello world</LinkItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.queryByText('Hello world')).not.toBeInTheDocument();

		rerender(
			<NestedContext.Provider value={{ ...callbacks, currentStackId: '1' }}>
				<NestingItem id="1" title="Nest">
					<LinkItem href="www.atlassian.com">Hello world</LinkItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.getByText('Hello world')).toBeInTheDocument();
	});

	it('should render a CustomItem when contained in an active nested view', () => {
		const CustomButton: FC<CustomItemComponentProps> = (props) => (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			<div {...props}>Hello world</div>
		);

		const { rerender } = render(
			<NestedContext.Provider value={{ ...callbacks }}>
				<NestingItem id="1" title="Nest">
					<CustomItem component={CustomButton} />
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.queryByText('Hello world')).not.toBeInTheDocument();

		rerender(
			<NestedContext.Provider value={{ ...callbacks, currentStackId: '1' }}>
				<NestingItem id="1" title="Nest">
					<CustomItem component={CustomButton} />
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.getByText('Hello world')).toBeInTheDocument();
	});
});
