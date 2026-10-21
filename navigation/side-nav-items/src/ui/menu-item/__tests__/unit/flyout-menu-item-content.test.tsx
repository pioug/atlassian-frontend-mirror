import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { waitFor } from '@atlassian/testing-library/wait-for';

import { FlyoutHeader } from '../../flyout-menu-item/flyout-header';
import { FlyoutMenuItem } from '../../flyout-menu-item/flyout-menu-item';
import {
	FlyoutMenuItemContent,
	type FlyoutMenuItemContentProps,
} from '../../flyout-menu-item/flyout-menu-item-content';
import { FlyoutMenuItemTrigger } from '../../flyout-menu-item/flyout-menu-item-trigger';

describe('FlyoutMenuItemContent', () => {
	beforeEach(() => {
		failGate('platform-dst-top-layer');
	});

	it.each([true, false])(
		'should name the outer dialog from its generated heading when isDefaultOpen is %s',
		async (isDefaultOpen) => {
			const { user } = setupComponent({ isDefaultOpen });
			if (!isDefaultOpen) {
				await user.click(screen.getByRole('button', { name: 'Recent' }));
			}

			const dialog = screen.getByRole('dialog', { name: 'Recent' });
			const heading = screen.getByRole('heading', { name: 'Recent' });
			expect(heading.id).toBeTruthy();
			expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
			await expect(dialog).toBeAccessible();
		},
	);

	it('should preserve the supplied title and accessible name as content loads', async () => {
		const titleId = 'recent-flyout-title';
		const { user, loadContent } = setupComponent({ titleId, isContentLoaded: false });
		await user.click(screen.getByRole('button', { name: 'Recent' }));

		const dialog = screen.getByRole('dialog', { name: 'Recent' });
		expect(dialog).toHaveAttribute('aria-labelledby', titleId);
		expect(screen.getByRole('heading', { name: 'Recent' })).toHaveAttribute('id', titleId);
		await expect(dialog).toBeAccessible();

		loadContent();

		expect(dialog).toHaveAccessibleName('Recent');
		expect(screen.getByRole('heading', { name: 'Recent' })).toHaveAttribute('id', titleId);
		expect(document.querySelectorAll(`[id="${titleId}"]`)).toHaveLength(1);
		await expect(dialog).toBeAccessible();
	});

	it('should preserve input focus when delayed content arrives in flyout', async () => {
		const { loadContent, user } = setupComponent({
			autoFocusCloseButton: true,
			isContentLoaded: false,
			showSearch: true,
		});
		await user.click(screen.getByRole('button', { name: 'Recent' }));
		await flushFocusFrames();
		const input = screen.getByRole('textbox', { name: 'Search' });
		await user.click(input);

		loadContent();
		await flushFocusFrames();

		expect(input).toHaveFocus();
		await user.keyboard('{Escape}');
		await waitFor(() => expect(screen.getByRole('button', { name: 'Recent' })).toHaveFocus());
	});
});

describe.each([false, true])(
	'FlyoutMenuItemContent label when platform-dst-top-layer is %s',
	(isTopLayer) => {
		beforeEach(() => {
			if (isTopLayer) {
				passGate('platform-dst-top-layer');
			} else {
				failGate('platform-dst-top-layer');
			}
		});

		it('should name the dialog from the label when there is no FlyoutHeader', async () => {
			passGate('navx-5263-a11y-flyout-dialog-name');
			render(<LabelledFlyoutFixture hasHeader={false} />);

			const dialog = screen.getByRole('dialog', { name: 'Recent' });
			const labelElement = document.getElementById(dialog.getAttribute('aria-labelledby')!);
			expect(labelElement).toHaveAttribute('hidden');
			await expect(dialog).toBeAccessible();
		});

		it('should not duplicate ids when a FlyoutHeader is also rendered', async () => {
			passGate('navx-5263-a11y-flyout-dialog-name');
			render(<LabelledFlyoutFixture hasHeader />);

			const heading = screen.getByRole('heading', { name: 'Header title' });
			const dialog = screen.getByRole('dialog', { name: 'Recent' });
			expect(document.querySelectorAll(`[id="${heading.id}"]`)).toHaveLength(1);
			await expect(dialog).toBeAccessible();
		});

		it('should ignore the label when navx-5263-a11y-flyout-dialog-name is disabled', () => {
			failGate('navx-5263-a11y-flyout-dialog-name');
			render(<LabelledFlyoutFixture hasHeader={false} />);

			const titleId = screen.getByRole('dialog').getAttribute('aria-labelledby');
			expect(document.getElementById(titleId!)).toBeNull();
		});
	},
);

type FixtureProps = Partial<Omit<FlyoutMenuItemContentProps, 'children'>> &
	Pick<React.ComponentProps<typeof FlyoutHeader>, 'autoFocusCloseButton'> & {
		/** Replaces a public loading heading with the loaded FlyoutHeader. */
		isContentLoaded?: boolean;
		/** Opens the flyout before any trigger interaction, as in the reported VR fixtures. */
		isDefaultOpen?: boolean;
		/** Keeps an input mounted across the loading transition. */
		showSearch?: boolean;
	};

function FlyoutFixture({
	autoFocusCloseButton,
	isDefaultOpen,
	isContentLoaded = true,
	showSearch,
	...props
}: FixtureProps) {
	return (
		<ul>
			<FlyoutMenuItem isDefaultOpen={isDefaultOpen}>
				<FlyoutMenuItemTrigger>Recent</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent {...props}>
					{isContentLoaded ? (
						<FlyoutHeader
							autoFocusCloseButton={autoFocusCloseButton}
							title="Recent"
							closeButtonLabel="Close menu"
						/>
					) : (
						<h2 id={props.titleId}>Recent</h2>
					)}
					{showSearch && <input aria-label="Search" />}
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>
		</ul>
	);
}

function LabelledFlyoutFixture({ hasHeader }: { hasHeader: boolean }) {
	return (
		<ul>
			<FlyoutMenuItem isDefaultOpen>
				<FlyoutMenuItemTrigger>Recent</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent label="Recent">
					{hasHeader && <FlyoutHeader title="Header title" closeButtonLabel="Close menu" />}
					<p>Flyout content</p>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>
		</ul>
	);
}

async function flushFocusFrames() {
	// AFM installs raf-stub globally in setup-raf.js.
	const animationFrameMock = requestAnimationFrame as typeof requestAnimationFrame & {
		step: () => void;
	};
	// Let the popup activate its focus trap before asserting the final focus target.
	await act(async () => {
		animationFrameMock.step();
		// Flush any pending focus restoration before checking the final focus target.
		await new Promise<void>((resolve) => setTimeout(resolve, 0));
		animationFrameMock.step();
	});
}

function setupComponent(props: FixtureProps) {
	const user = userEvent.setup();
	const result = render(<FlyoutFixture {...props} />);
	return {
		...result,
		user,
		loadContent: () => result.rerender(<FlyoutFixture {...props} isContentLoaded />),
	};
}
