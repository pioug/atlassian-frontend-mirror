import React from 'react';
import { render, screen, userEvent } from '@atlassian/testing-library';
import {
	ArchiveSidebarHeader,
	type HeaderProps,
} from '../../../../../viewers/archiveSidebar/archive-sidebar-header';

describe('ArchiveSidebarHeader', () => {
	const renderBaseComponent = (props: HeaderProps) => render(<ArchiveSidebarHeader {...props} />);

	it('should render CustomButtonItem element', async () => {
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
