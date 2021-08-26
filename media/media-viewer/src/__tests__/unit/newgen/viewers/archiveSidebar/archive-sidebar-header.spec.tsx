import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  ArchiveSidebarHeader,
  HeaderProps,
} from '../../../../../viewers/archiveSidebar/archive-sidebar-header';
import { Item } from '@atlaskit/navigation-next';
import HomeIcon from '@atlaskit/icon/glyph/home';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';

describe('ArchiveSidebarHeader', () => {
  function mountBaseComponent(props: HeaderProps) {
    return mount(<ArchiveSidebarHeader {...props} />);
  }

  it('should render Item element', () => {
    const el = mountBaseComponent({
      folderName: 'folder_a',
      onHeaderClick: () => {},
    });
    expect(el.find(Item)).toHaveLength(1);
  });
  it('should call passed in callback when Item is clicked', () => {
    const spy = jest.fn();
    const el = shallow(
      <ArchiveSidebarHeader folderName={'folder_a'} onHeaderClick={spy} />,
    );
    el.find(Item).simulate('click');
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
