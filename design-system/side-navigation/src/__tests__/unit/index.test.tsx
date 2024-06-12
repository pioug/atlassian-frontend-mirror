import React from 'react';

import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { replaceRaf } from 'raf-stub';

import { NestableNavigationContent, NestingItem, Section, SideNavigation } from '../../index';

replaceRaf();

describe('controlled side nav', () => {
	it('calls onUnknownNest on invalid nesting', () => {
		const unknownNestCallback = jest.fn();

		render(
			<SideNavigation label="project" testId="side-navigation-invalid">
				<NestableNavigationContent stack={['1-0']} onUnknownNest={unknownNestCallback}>
					<Section title="Top level">
						<NestingItem id="1" title="Item B">
							1
						</NestingItem>
					</Section>
				</NestableNavigationContent>
			</SideNavigation>,
		);

		expect(unknownNestCallback).toHaveBeenCalledWith(['1-0']);
	});

	it('should not call onUnknownNest when stack is valid', () => {
		const unknownNestCallback = jest.fn();

		render(
			<SideNavigation label="project" testId="side-navigation-invalid">
				<NestableNavigationContent stack={['1']} onUnknownNest={unknownNestCallback}>
					<Section title="Top level">
						<NestingItem id="1" title="Item B">
							1
						</NestingItem>
					</Section>
				</NestableNavigationContent>
			</SideNavigation>,
		);

		expect(unknownNestCallback).not.toHaveBeenCalled();
	});
});

describe('uncontrolled side nav', () => {
	it('calls onUnknownNest on invalid nesting', () => {
		const unknownNestCallback = jest.fn();

		render(
			<SideNavigation label="project" testId="uncontrolled-invalid">
				<NestableNavigationContent
					initialStack={['1', '1-1', '1-2', '1-3']}
					onUnknownNest={unknownNestCallback}
				>
					<Section title="Top level">
						<NestingItem id="1" title="Item A">
							<NestingItem id="1-1" title="Item A-1">
								1-1
							</NestingItem>
						</NestingItem>
					</Section>
				</NestableNavigationContent>
			</SideNavigation>,
		);

		expect(unknownNestCallback).toHaveBeenCalledWith(['1', '1-1', '1-2', '1-3']);
	});

	it('should not call onUnknownNest when stack is valid', () => {
		const unknownNestCallback = jest.fn();

		render(
			<SideNavigation label="project" testId="uncontrolled-invalid">
				<NestableNavigationContent initialStack={['1', '1-1']} onUnknownNest={unknownNestCallback}>
					<Section title="Top level">
						<NestingItem id="1" title="Item A">
							<NestingItem id="1-1" title="Item A-1">
								1-1
							</NestingItem>
						</NestingItem>
					</Section>
				</NestableNavigationContent>
			</SideNavigation>,
		);

		expect(unknownNestCallback).not.toHaveBeenCalled();
	});
});

describe('onUnknownNest after user interaction', () => {
	it('calls onUnknownNest when stack becomes invalid after user interaction', async () => {
		const unknownNestCallback = jest.fn();

		const { getByTestId } = render(
			<SideNavigation label="project">
				<NestableNavigationContent
					initialStack={['1', '1-1', '1-2', '1-3', '1-1']}
					onUnknownNest={unknownNestCallback}
					testId="uncontrolled-invalid"
				>
					<Section title="Top level">
						<NestingItem id="1" title="Item A">
							<NestingItem id="1-1" title="Item A-1">
								1-1
							</NestingItem>
						</NestingItem>
					</Section>
				</NestableNavigationContent>
			</SideNavigation>,
		);
		expect(unknownNestCallback).not.toHaveBeenCalled();

		fireEvent.click(getByTestId('uncontrolled-invalid--go-back-item'));

		act(() => {
			// @ts-ignore mocked as the test starts
			requestAnimationFrame.step();
		});

		await waitFor(() => expect(unknownNestCallback).toHaveBeenCalled());
	});
});
