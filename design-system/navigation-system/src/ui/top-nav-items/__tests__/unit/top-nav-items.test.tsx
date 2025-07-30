import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

import { TopNav } from '../../../page-layout/top-nav/top-nav';
import { TopNavEnd } from '../../../page-layout/top-nav/top-nav-end';
import { TopNavMiddle } from '../../../page-layout/top-nav/top-nav-middle';
import { TopNavStart } from '../../../page-layout/top-nav/top-nav-start';
import { AppSwitcher } from '../../app-switcher';
import { CreateButton } from '../../create-button';
import { Help } from '../../help';
import { CustomLogo } from '../../nav-logo/custom-logo';
import { Search } from '../../search';
import { Settings } from '../../settings';

describe('TopNavigation', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<TopNav>
				<TopNavStart>
					<AppSwitcher label="App switcher" />
					<CustomLogo
						href="http://www.atlassian.design"
						logo={AtlassianLogo}
						icon={AtlassianIcon}
						label="Home page"
					/>
				</TopNavStart>
				<TopNavMiddle>
					<Search label="Search" />
					<CreateButton>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<Help label="Help" />
					<Settings label="Settings" />
				</TopNavEnd>
			</TopNav>,
		);
		await expect(container).toBeAccessible();
	});
});

describe('TopNavStart', () => {
	describe('CustomLogo', () => {
		it('should be accessible', async () => {
			const { container } = render(
				<TopNavStart>
					<CustomLogo
						href="http://www.atlassian.design"
						logo={AtlassianLogo}
						icon={AtlassianIcon}
						label="Atlas"
					/>
				</TopNavStart>,
			);
			await expect(container).toBeAccessible();
		});

		it('should be in the document', () => {
			render(
				<TopNavStart>
					<CustomLogo
						href="http://www.atlassian.design"
						logo={AtlassianLogo}
						icon={AtlassianIcon}
						label="Atlas"
					/>
				</TopNavStart>,
			);
			expect(screen.getByRole('link', { name: 'Atlas' })).toBeVisible();
		});

		it('should trigger the `onClick` when link is clicked', async () => {
			const user = userEvent.setup();
			const onClick = jest.fn();

			render(
				<TopNavStart>
					<CustomLogo
						href="http://www.atlassian.design"
						logo={AtlassianLogo}
						icon={AtlassianIcon}
						onClick={onClick}
						label="Atlas"
					/>
				</TopNavStart>,
			);

			const el = screen.getByRole('link');

			expect(onClick).toHaveBeenCalledTimes(0);
			await user.click(el);
			expect(onClick).toHaveBeenCalledTimes(1);
		});
	});

	describe('AppSwitcher', () => {
		it('should be accessible', async () => {
			const { container } = render(
				<TopNavStart>
					<AppSwitcher label="App switcher" />,
				</TopNavStart>,
			);
			await expect(container).toBeAccessible();
		});

		it('should contain an app switcher', () => {
			render(
				<TopNavStart>
					<AppSwitcher label="App switcher" />
				</TopNavStart>,
			);
			expect(screen.getByRole('button', { name: 'App switcher' })).toBeVisible();
		});

		it('should allow label customization', () => {
			const label = 'label';
			expect(label).not.toBe('App switcher');

			render(
				<TopNavStart>
					<AppSwitcher label={label} />
				</TopNavStart>,
			);
			expect(screen.getByRole('button', { name: label })).toBeVisible();
		});

		it('should trigger the `onClick` when clicked', async () => {
			const user = userEvent.setup();
			const onClick = jest.fn();

			render(
				<TopNavStart>
					<AppSwitcher label="App switcher" onClick={onClick} />
				</TopNavStart>,
			);

			const el = screen.getByRole('button');

			expect(onClick).toHaveBeenCalledTimes(0);
			await user.click(el);
			expect(onClick).toHaveBeenCalledTimes(1);
		});
	});
});

describe('TopNavMiddle', () => {
	describe('Search', () => {
		const searchLabel = 'Search';

		it('should be accessible', async () => {
			const { container } = render(
				<TopNavMiddle>
					<Search label={searchLabel} />
				</TopNavMiddle>,
			);

			await expect(container).toBeAccessible();
		});

		it('should trigger the `onClick` when clicked', async () => {
			const user = userEvent.setup();
			const onClick = jest.fn();

			render(
				<TopNavMiddle>
					<Search label={searchLabel} onClick={onClick} />
				</TopNavMiddle>,
			);

			const el = screen.getByRole('button', { hidden: true, name: searchLabel });

			expect(onClick).toHaveBeenCalledTimes(0);
			await user.click(el);
			expect(onClick).toHaveBeenCalledTimes(1);
		});
	});
});
