import React from 'react';

import { render } from '@testing-library/react';

import { ExpandableMenuItem } from '../../expandable-menu-item/expandable-menu-item';
import { ExpandableMenuItemContent } from '../../expandable-menu-item/expandable-menu-item-content';
import { ExpandableMenuItemTrigger } from '../../expandable-menu-item/expandable-menu-item-trigger';
import { MenuList } from '../../menu-list';
import { TopLevelSpacer } from '../../top-level-spacer';

describe('TopLevelSpacer', () => {
	describe('in development', () => {
		const nodeEnv = process.env.NODE_ENV;

		beforeEach(() => {
			process.env.NODE_ENV = 'development';
		});

		afterAll(() => {
			process.env.NODE_ENV = nodeEnv;
		});

		it('should not error when used at the top level', () => {
			expect(() =>
				render(
					<MenuList>
						<TopLevelSpacer />
					</MenuList>,
				),
			).not.toThrow();
		});

		it('should error when used in a nested level', () => {
			// Doing this to make console output cleaner
			const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

			expect(() =>
				render(
					<MenuList>
						<ExpandableMenuItem isExpanded>
							<ExpandableMenuItemTrigger>Expandable</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<TopLevelSpacer />
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
					</MenuList>,
				),
			).toThrow(/TopLevelSpacer should only be used in the top level of the menu/);

			consoleError.mockRestore();
		});
	});

	describe('in production', () => {
		const nodeEnv = process.env.NODE_ENV;

		beforeEach(() => {
			process.env.NODE_ENV = 'production';
		});

		afterAll(() => {
			process.env.NODE_ENV = nodeEnv;
		});

		it('should not error when used at the top level', () => {
			expect(() =>
				render(
					<MenuList>
						<TopLevelSpacer />
					</MenuList>,
				),
			).not.toThrow();
		});

		it('should not error when used in a nested level', () => {
			const consoleError = jest.spyOn(console, 'error');

			expect(() =>
				render(
					<MenuList>
						<ExpandableMenuItem isExpanded>
							<ExpandableMenuItemTrigger>Expandable</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<TopLevelSpacer />
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
					</MenuList>,
				),
			).not.toThrow();

			expect(consoleError).not.toHaveBeenCalled();
		});
	});
});
