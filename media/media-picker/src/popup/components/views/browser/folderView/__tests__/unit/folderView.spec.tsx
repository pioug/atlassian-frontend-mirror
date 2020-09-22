import AkButton from '@atlaskit/button/custom-theme-button';
import { ShallowWrapper, shallow } from 'enzyme';
import React from 'react';

import { FolderViewer, FolderViewerProps } from '../../folderView';
import { ServiceFile } from '../../../../../../domain';
import { FileCreateDate, FileSize } from '../../styled';

describe('<FolderViewer />', () => {
  let date: Date;
  let serviceFileItem: ServiceFile;
  let props: FolderViewerProps;

  beforeEach(() => {
    date = new Date(2019, 5, 2);
    serviceFileItem = {
      id: 'some-id',
      mimeType: 'some-mime-type',
      name: 'some-name',
      size: 42,
      date: date.getTime(),
    };
    props = {
      path: [],
      service: {
        accountId: 'some-service-account-id',
        name: 'google',
      },
      items: [],
      selectedItems: [],
      isLoading: false,
      onFileClick: jest.fn(),
      onFolderClick: jest.fn(),
      onLoadMoreClick: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render loading button given folder is loading', () => {
    const wrapper = shallow(
      <FolderViewer
        {...props}
        isLoading={true}
        currentCursor="some-current-cursor"
      />,
    );

    const buttons = wrapper.find(AkButton);
    expect(buttons).toHaveLength(1);

    const button = buttons.first();
    expect((button.props() as any).children).toEqual('Loading...');
  });

  it('should not call onLoadMoreClick handler given folder is loading', () => {
    const wrapper: ShallowWrapper<
      FolderViewerProps,
      {},
      FolderViewer
    > = shallow(
      <FolderViewer
        {...props}
        isLoading={true}
        currentCursor="some-current-cursor"
      />,
    );

    const buttons = wrapper.find(AkButton);
    const button = buttons.first();

    button.simulate('click');
    expect(wrapper.instance().props.onLoadMoreClick).not.toBeCalled();
  });

  it('should render load more button given next page cursor', () => {
    const wrapper = shallow(
      <FolderViewer {...props} nextCursor="some-next-cursor" />,
    );

    const buttons = wrapper.find(AkButton);
    expect(buttons).toHaveLength(1);

    const button = buttons.first();
    expect((button.props() as any).children).toEqual('Load more');
  });

  it('should call onLoadMoreClick handler given next page cursor', () => {
    const wrapper: ShallowWrapper<
      FolderViewerProps,
      {},
      FolderViewer
    > = shallow(<FolderViewer {...props} nextCursor="some-next-cursor" />);

    const buttons = wrapper.find(AkButton);
    const button = buttons.first();

    button.simulate('click');
    expect(wrapper.instance().props.onLoadMoreClick).toBeCalled();
  });

  describe('When it receives a file', () => {
    it('should render the filesize information', () => {
      const newProps = {
        ...props,
        items: [serviceFileItem],
      };
      const wrapper = shallow(
        <FolderViewer {...newProps} nextCursor="some-next-cursor" />,
      );

      expect(wrapper.find(FileSize).html()).toContain('42 B');
    });

    it('should format date the file adding day, month and year if file was created before today', () => {
      const newProps = {
        ...props,
        items: [serviceFileItem],
      };
      const wrapper = shallow(
        <FolderViewer {...newProps} nextCursor="some-next-cursor" />,
      );

      expect(wrapper.find(FileCreateDate).html()).toContain('2 Jun 2019');
    });

    it('should format date the file adding hour, minutes and time marker string if file was created today', () => {
      jest.spyOn(Date.prototype, 'toDateString').mockReturnValue('1');

      const newProps = {
        ...props,
        items: [serviceFileItem],
      };
      const wrapper = shallow(
        <FolderViewer {...newProps} nextCursor="some-next-cursor" />,
      );

      expect(wrapper.find(FileCreateDate).html()).toContain('0:00 AM');
    });
  });
});
