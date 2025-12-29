import React from 'react';
import { mount, shallow } from 'enzyme';
import {
	ArchiveSidebarHeader,
	type HeaderProps,
} from '../../../../../viewers/archiveSidebar/archive-sidebar-header';
import { CustomButtonItem } from '../../../../../viewers/archiveSidebar/custom-button-item';
import HomeIcon from '@atlaskit/icon/core/home';
import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';

describe('ArchiveSidebarHeader', () => {
	function mountBaseComponent(props: HeaderProps) {
		return mount(<ArchiveSidebarHeader {...props} />);
	}

	it('should render CustomButtonItem element', () => {
		const el = mountBaseComponent({
			folderName: 'folder_a',
			onHeaderClick: () => {},
		});
		expect(el.find(CustomButtonItem)).toHaveLength(1);
	});
	it('should call passed in callback when Item is clicked', () => {
		const spy = jest.fn();
		const el = shallow(<ArchiveSidebarHeader folderName={'folder_a'} onHeaderClick={spy} />);
		el.find(CustomButtonItem).simulate('click');
		expect(spy).toBeCalledTimes(1);
	});
	it('should render HomeIcon', () => {
		const el = mountBaseComponent({
			folderName: '',
			onHeaderClick: () => {},
		});
		expect(el.find(HomeIcon)).toHaveLength(1);
	});
	it('should render ArrowLeftIcon', () => {
		const el = mountBaseComponent({
			folderName: 'folder_a',
			onHeaderClick: () => {},
		});
		expect(el.find(ArrowLeftIcon)).toHaveLength(1);
	});
});
