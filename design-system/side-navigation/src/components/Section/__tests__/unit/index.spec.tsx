import React from 'react';

import { render, screen } from '@testing-library/react';

import { ROOT_ID } from '../../../NestableNavigationContent';
import { NestedContext } from '../../../NestableNavigationContent/context';
import { default as NestingItem } from '../../../NestingItem';
import { HeadingItem, Section } from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Section', () => {
	const callbacks = {
		currentStackId: ROOT_ID,
		onNest: jest.fn(),
		onUnNest: jest.fn(),
		stack: [],
		parentId: ROOT_ID,
		forceShowTopScrollIndicator: false,
		childIds: jest.spyOn(React, 'useRef').mockReturnValue({ current: new Set<string>() }) as any,
	};

	it('should render a Section when contained in an active nested view', () => {
		const { rerender } = render(
			<NestedContext.Provider value={{ ...callbacks }}>
				<NestingItem id="1" title="Nest">
					<Section>Hello world</Section>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.queryByText('Hello world')).not.toBeInTheDocument();

		rerender(
			<NestedContext.Provider value={{ ...callbacks, currentStackId: '1' }}>
				<NestingItem id="1" title="Nest">
					<Section>Hello world</Section>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.getByText('Hello world')).toBeInTheDocument();
	});

	it('should render a HeadingItem when contained in an active nested view', () => {
		const { rerender } = render(
			<NestedContext.Provider value={{ ...callbacks }}>
				<NestingItem id="1" title="Nest">
					<HeadingItem>Hello world</HeadingItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.queryByText('Hello world')).not.toBeInTheDocument();

		rerender(
			<NestedContext.Provider value={{ ...callbacks, currentStackId: '1' }}>
				<NestingItem id="1" title="Nest">
					<HeadingItem>Hello world</HeadingItem>
				</NestingItem>
			</NestedContext.Provider>,
		);

		expect(screen.getByText('Hello world')).toBeInTheDocument();
	});
});
