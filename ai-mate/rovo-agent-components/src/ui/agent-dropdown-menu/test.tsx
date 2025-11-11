import React, { type ComponentPropsWithoutRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, type Injectable } from 'react-magnetic-di';

import { AgentDropdownMenu } from './index';

describe('AgentDropdownMenu', () => {
	const deps: Injectable[] = [];

	afterEach(() => {
		jest.clearAllMocks();
	});

	const moreActions = () => screen.getByRole('button', { name: 'More actions' });

	const renderComponent = (
		props: Partial<ComponentPropsWithoutRef<typeof AgentDropdownMenu>> = {},
	) => {
		return render(
			<DiProvider use={deps}>
				<IntlProvider locale="en">
					<AgentDropdownMenu
						agentId="1"
						isForgeAgent={false}
						loadAgentPermissions={() =>
							Promise.resolve({ isEditEnabled: true, isDeleteEnabled: true, isCreateEnabled: true })
						}
						/** Not sure how to satisfy the compiler
						 *  because there's a union for the `showViewAgentOption` and `doesAgentHaveIdentityAccountId`
						 * 	which don't really work with Partial
						 * */
						{...(props as any)}
					/>
				</IntlProvider>
			</DiProvider>,
		);
	};

	it("calls onDropdownTriggerClick when the 'More actions' button is clicked", async () => {
		const user = userEvent.setup();

		const onDropdownTriggerClick = jest.fn();

		renderComponent({ onDropdownTriggerClick });

		await user.click(moreActions());
		expect(onDropdownTriggerClick).toHaveBeenCalled();
	});

	it("uses the provided testId for the 'More actions' button", async () => {
		const user = userEvent.setup();

		renderComponent({ dropdownMenuTestId: 'test-id' });

		await user.click(moreActions());
		expect(screen.getByTestId('test-id--trigger')).toBeVisible();
	});

	it('does not show view agent option if showViewAgentOption is not enabled', async () => {
		const user = userEvent.setup();

		renderComponent();

		await user.click(moreActions());

		const viewAgentButton = screen.queryByRole('menuitem', {
			name: 'View Agent',
		});
		expect(viewAgentButton).toBeNull();
	});

	it('shows view agent option if showViewAgentOption is enabled', async () => {
		const user = userEvent.setup();

		const onViewAgentClick = jest.fn();

		renderComponent({ showViewAgentOption: true, onViewAgentClick });

		await user.click(moreActions());

		const viewAgentButton = screen.queryByRole('menuitem', {
			name: 'View Agent',
		});
		expect(viewAgentButton).toBeVisible();

		await user.click(viewAgentButton!);
		expect(onViewAgentClick).toHaveBeenCalled();
	});

	it('does not show view agent full profile option if doesAgentHaveIdentityAccountId is not enabled', async () => {
		const user = userEvent.setup();

		renderComponent({ doesAgentHaveIdentityAccountId: false });

		await user.click(moreActions());

		const viewAgentFullProfileButton = screen.queryByRole('menuitem', {
			name: 'View full profile',
		});
		expect(viewAgentFullProfileButton).toBeNull();
	});

	it('shows view agent full profile option if doesAgentHaveIdentityAccountId is enabled', async () => {
		const user = userEvent.setup();

		const onViewAgentFullProfileClick = jest.fn();

		renderComponent({ doesAgentHaveIdentityAccountId: true, onViewAgentFullProfileClick });

		await user.click(moreActions());

		const viewAgentFullProfileButton = screen.queryByRole('menuitem', {
			name: 'View full profile',
		});
		expect(viewAgentFullProfileButton).toBeVisible();

		await user.click(viewAgentFullProfileButton!);
		expect(onViewAgentFullProfileClick).toHaveBeenCalled();
	});

	it("does not show duplicate agent option if it's a forge agent", async () => {
		const user = userEvent.setup();

		renderComponent({ isForgeAgent: true });

		await user.click(moreActions());

		const duplicateAgentButton = screen.queryByRole('menuitem', {
			name: 'Duplicate Agent',
		});
		expect(duplicateAgentButton).toBeNull();
	});

	it('shows duplicate agent option if it is not a forge agent', async () => {
		const user = userEvent.setup();

		const onDuplicateAgent = jest.fn();

		renderComponent({ isForgeAgent: false, onDuplicateAgent });

		await user.click(moreActions());

		const duplicateAgentButton = screen.queryByRole('menuitem', {
			name: 'Duplicate Agent',
		});
		expect(duplicateAgentButton).toBeVisible();

		await user.click(duplicateAgentButton!);
		expect(onDuplicateAgent).toHaveBeenCalled();
	});

	it('does not show duplicate agent option if isAbleToCreateAgents is false', async () => {
		const user = userEvent.setup();
		renderComponent({
			loadAgentPermissions: () =>
				Promise.resolve({ isCreateEnabled: false, isEditEnabled: true, isDeleteEnabled: true }),
		});
		await user.click(moreActions());
		const duplicateAgentButton = screen.queryByRole('menuitem', {
			name: 'Duplicate Agent',
		});
		expect(duplicateAgentButton).toBeNull();
	});

	it('shows copy link to profile option', async () => {
		const user = userEvent.setup();

		const onCopyAgent = jest.fn();

		renderComponent({ onCopyAgent });

		await user.click(moreActions());
		const copyLinkToProfileButton = screen.queryByRole('menuitem', {
			name: 'Copy link',
		});
		expect(copyLinkToProfileButton).toBeVisible();

		await user.click(copyLinkToProfileButton!);
		expect(onCopyAgent).toHaveBeenCalled();

		expect(screen.queryByRole('menuitem', { name: 'Copy link' })).toBeNull();
		expect(screen.queryByRole('menuitem', { name: 'Copied URL' })).toBeVisible();
	});

	it('fetches permissions on mount if loadPermissionsOnMount is enabled', () => {
		const loadAgentPermissions = jest.fn().mockResolvedValue({
			isEditEnabled: true,
			isDeleteEnabled: true,
		});

		renderComponent({ loadAgentPermissions, loadPermissionsOnMount: true });

		expect(loadAgentPermissions).toHaveBeenCalled();
	});

	it('does not fetch permissions on mount if loadPermissionsOnMount is disabled', () => {
		const loadAgentPermissions = jest.fn().mockResolvedValue({
			isEditEnabled: true,
			isDeleteEnabled: true,
		});

		renderComponent({ loadAgentPermissions, loadPermissionsOnMount: false });

		expect(loadAgentPermissions).not.toHaveBeenCalled();
	});

	it('only fetches permissions once', async () => {
		const user = userEvent.setup();

		const loadAgentPermissions = jest
			.fn()
			.mockResolvedValue({ isEditEnabled: true, isDeleteEnabled: false });

		const { rerender } = renderComponent({ loadAgentPermissions, loadPermissionsOnMount: true });

		await user.click(moreActions());

		rerender(
			<DiProvider use={deps}>
				<IntlProvider locale="en">
					<AgentDropdownMenu
						agentId="2"
						isForgeAgent={false}
						loadAgentPermissions={() =>
							Promise.resolve({
								isEditEnabled: false,
								isDeleteEnabled: true,
							})
						}
					/>
				</IntlProvider>
			</DiProvider>,
		);

		expect(loadAgentPermissions).toHaveBeenCalledTimes(1);
	});

	it('shows edit option if user has permission', async () => {
		const user = userEvent.setup();

		const onEditAgent = jest.fn();
		const loadAgentPermissions = jest
			.fn()
			.mockResolvedValue({ isEditEnabled: true, isDeleteEnabled: false });

		renderComponent({ onEditAgent, loadAgentPermissions });

		await user.click(moreActions());

		const editButton = screen.queryByRole('menuitem', {
			name: 'Edit Agent',
		});
		expect(editButton).toBeVisible();

		await user.click(editButton!);
		expect(onEditAgent).toHaveBeenCalled();
	});

	it('does not show edit option if user does not have permission', async () => {
		const user = userEvent.setup();

		const onEditAgent = jest.fn();
		const loadAgentPermissions = jest
			.fn()
			.mockResolvedValue({ isEditEnabled: false, isDeleteEnabled: false });

		renderComponent({ onEditAgent, loadAgentPermissions });

		await user.click(moreActions());

		const editButton = screen.queryByRole('menuitem', {
			name: 'Edit Agent',
		});
		expect(editButton).toBeNull();
	});

	it('shows delete option if user has permission', async () => {
		const user = userEvent.setup();

		const onDeleteAgent = jest.fn();
		const loadAgentPermissions = jest
			.fn()
			.mockResolvedValue({ isEditEnabled: false, isDeleteEnabled: true });

		renderComponent({ onDeleteAgent, loadAgentPermissions });

		await user.click(moreActions());

		const deleteButton = screen.queryByRole('menuitem', {
			name: 'Delete Agent',
		});
		expect(deleteButton).toBeVisible();

		await user.click(deleteButton!);
		expect(onDeleteAgent).toHaveBeenCalled();
	});

	it('does not show delete option if user does not have permission', async () => {
		const user = userEvent.setup();

		const onDeleteAgent = jest.fn();
		const loadAgentPermissions = jest
			.fn()
			.mockResolvedValue({ isEditEnabled: false, isDeleteEnabled: false });

		renderComponent({ onDeleteAgent, loadAgentPermissions });

		await user.click(moreActions());

		const deleteButton = screen.queryByRole('menuitem', {
			name: 'Delete Agent',
		});
		expect(deleteButton).toBeNull();
	});

	it('shows loading spinner while loading permissions', async () => {
		const user = userEvent.setup();

		let resolve: (value: any) => void = () => {};
		const permissionPromise = new Promise((resolveParam) => {
			resolve = resolveParam;
		});
		const loadAgentPermissions = jest.fn().mockResolvedValue(permissionPromise);

		renderComponent({ loadAgentPermissions });

		await user.click(moreActions());

		expect(screen.queryByRole('menuitem', { name: 'Copy link' })).toBeNull();
		expect(
			screen.getByRole('img', {
				name: 'Loading',
			}),
		).toBeInTheDocument();

		resolve({ isEditEnabled: true, isDeleteEnabled: false });

		await waitFor(() => {
			expect(screen.queryByRole('img', { name: 'Loading' })).toBeNull();
		});

		expect(screen.getByRole('menuitem', { name: 'Copy link' })).toBeVisible();
	});
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<DiProvider use={deps}>
				<IntlProvider locale="en">
					<AgentDropdownMenu
						agentId="1"
						isForgeAgent={false}
						loadAgentPermissions={() =>
							Promise.resolve({ isEditEnabled: true, isDeleteEnabled: true })
						}
					/>
				</IntlProvider>
			</DiProvider>,
		);
		await expect(container).toBeAccessible();
	});
});
