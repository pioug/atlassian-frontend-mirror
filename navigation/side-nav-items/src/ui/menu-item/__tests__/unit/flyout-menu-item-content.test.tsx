import React from 'react';

import { failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
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
		failGate('platform-dst-motion-uplift-button');
	});

	it('should preserve the supplied title and accessible name as content loads', async () => {
		const titleId = 'recent-flyout-title';
		const { user, loadContent } = setupComponent({ titleId, isContentLoaded: false });
		await user.click(screen.getByRole('button', { name: 'Recent' }));

		const dialog = screen.getByRole('dialog', { name: 'Recent' });
		expect(dialog).toHaveAttribute('aria-labelledby', titleId);
		expect(screen.getByRole('heading', { name: 'Recent' })).toHaveAttribute('id', titleId);

		loadContent();

		expect(dialog).toHaveAccessibleName('Recent');
		expect(screen.getByRole('heading', { name: 'Recent' })).toHaveAttribute('id', titleId);
		expect(document.querySelectorAll(`[id="${titleId}"]`)).toHaveLength(1);
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

type FixtureProps = Partial<Omit<FlyoutMenuItemContentProps, 'children'>> &
	Pick<React.ComponentProps<typeof FlyoutHeader>, 'autoFocusCloseButton'> & {
		/** Replaces a public loading heading with the loaded FlyoutHeader. */
		isContentLoaded?: boolean;
		/** Keeps an input mounted across the loading transition. */
		showSearch?: boolean;
	};

function FlyoutFixture({
	autoFocusCloseButton,
	isContentLoaded = true,
	showSearch,
	...props
}: FixtureProps) {
	return (
		<ul>
			<FlyoutMenuItem>
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
