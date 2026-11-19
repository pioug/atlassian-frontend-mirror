import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import {
	ArchiveSidebarHeader,
	type HeaderProps,
} from '../../../../../viewers/archiveSidebar/archive-sidebar-header';

describe('ArchiveSidebarHeader', () => {
	const renderBaseComponent = (props: HeaderProps) => render(<ArchiveSidebarHeader {...props} />);

	describe.each([
		{ gateState: 'off', setGate: failGate },
		{ gateState: 'on', setGate: passGate },
	])('when platform_media_viewer_remove_nav3 is $gateState', ({ setGate }) => {
		beforeEach(() => {
			setGate('platform_media_viewer_remove_nav3');
		});

		it('should render an accessible CustomButtonItem element', async () => {
			renderBaseComponent({
				folderName: 'folder_a',
				onHeaderClick: () => {},
			});
			expect(screen.getByRole('button')).toBeInTheDocument();
			await expect(document.body).toBeAccessible();
		});

		it('should call passed in callback when Item is clicked', async () => {
			const spy = jest.fn();
			renderBaseComponent({ folderName: 'folder_a', onHeaderClick: spy });
			await userEvent.click(screen.getByRole('button'));
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	it('should render HomeIcon', () => {
		renderBaseComponent({
			folderName: '',
			onHeaderClick: () => {},
		});
		expect(screen.getByLabelText('Home')).toBeInTheDocument();
	});

	it('should render ArrowLeftIcon', () => {
		renderBaseComponent({
			folderName: 'folder_a',
			onHeaderClick: () => {},
		});
		expect(screen.getByLabelText('Back')).toBeInTheDocument();
	});
});
