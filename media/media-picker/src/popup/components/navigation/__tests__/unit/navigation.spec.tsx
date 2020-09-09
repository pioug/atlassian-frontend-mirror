import { shallow } from 'enzyme';
import React from 'react';
import Dropdown from '@atlaskit/dropdown-menu';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import {
  mountWithIntlContext,
  fakeIntl,
  nextTick,
} from '@atlaskit/media-test-helpers';
import {
  getComponentClassWithStore,
  mockStore,
  mockState,
} from '@atlaskit/media-test-helpers';
import { Navigation, default as ConnectedNavigation } from '../../navigation';
import {
  changeAccount,
  changeCloudAccountFolder,
  startAuth,
  requestUnlinkCloudAccount,
} from '../../../../actions';
import {
  Path,
  ServiceName,
  ServiceAccountWithType,
  ServiceAccountLink,
} from '../../../../domain';
import {
  FolderViewerNavigation,
  ControlsWrapper,
  Controls,
  ControlButton,
  BreadCrumbs,
  BreadCrumbLink,
  BreadCrumbLinkLabel,
  BreadCrumbLinkSeparator,
  AccountItemButton,
  AccountDropdownWrapper,
} from '../../styled';

const ConnectedNavigationWithStore = getComponentClassWithStore(
  ConnectedNavigation,
);

const createConnectedComponent = () => {
  const store = mockStore();
  const dispatch = store.dispatch;
  const component = mountWithIntlContext(
    <ConnectedNavigationWithStore store={store} />,
  ).find(Navigation);

  return { component, dispatch };
};

describe('<Navigation />', () => {
  const SERVICE_NAME: ServiceName = 'upload';
  const SERVICE_NAME_GOOGLE: ServiceName = 'google';
  const SERVICE_NAME_DROPBOX: ServiceName = 'dropbox';
  const ACCOUNT_ID: string = 'accountId';
  const ACCOUNT_ID_GOOGLE = 'meatgoogle';
  const ACCOUNT_ID_DROPBOX = 'meatdropbox';
  const PATH: Path = [{ id: 'folderId', name: 'folderName' }];
  const SERVICE: ServiceAccountLink = {
    name: SERVICE_NAME,
    accountId: ACCOUNT_ID,
  };
  const SERVICE_GOOGLE: ServiceAccountLink = {
    name: SERVICE_NAME_GOOGLE,
    accountId: ACCOUNT_ID_GOOGLE,
  };
  const SERVICE_DROPBOX: ServiceAccountLink = {
    name: SERVICE_NAME_DROPBOX,
    accountId: ACCOUNT_ID_DROPBOX,
  };
  const ACCOUNTS: Promise<ServiceAccountWithType[]> = Promise.resolve([
    {
      displayName: 'me@google.com',
      id: 'meatgoogle',
      status: 'available',
      type: 'google',
    },
    {
      displayName: 'you@google.com',
      id: 'youatgoogle',
      status: 'available',
      type: 'google',
    },
    {
      displayName: 'me@dropbox.com',
      id: 'meatdropbox',
      status: 'available',
      type: 'dropbox',
    },
    {
      displayName: 'you@dropbox.com',
      id: 'youatdropbox',
      status: 'available',
      type: 'dropbox',
    },
  ] as ServiceAccountWithType[]);
  let onStartAuth = jest.fn();
  let onChangeAccount = jest.fn();
  let onUnlinkAccount = jest.fn();
  let onChangePath = jest.fn();

  beforeEach(() => {
    onStartAuth = jest.fn();
    onChangeAccount = jest.fn();
    onUnlinkAccount = jest.fn();
    onChangePath = jest.fn();
  });

  describe('Connected Navigation component', () => {
    it('should dispatch an action when onChangeAccount is called', () => {
      const { component, dispatch } = createConnectedComponent();
      component.props().onChangeAccount(SERVICE_NAME, ACCOUNT_ID);
      expect(dispatch).toBeCalledWith(changeAccount(SERVICE_NAME, ACCOUNT_ID));
    });

    it('should dispatch an action when onChangePath is called', () => {
      const { component, dispatch } = createConnectedComponent();
      component.props().onChangePath(SERVICE_NAME, ACCOUNT_ID, PATH);
      expect(dispatch).toBeCalledWith(
        changeCloudAccountFolder(SERVICE_NAME, ACCOUNT_ID, PATH),
      );
    });

    it('should dispatch an action when onStartAuth is called', () => {
      const { component, dispatch } = createConnectedComponent();
      component.props().onStartAuth(SERVICE_NAME);
      expect(dispatch).toBeCalledWith(startAuth(SERVICE_NAME));
    });

    it('should dispatch an action when onUnlinkAccount is called', () => {
      const { component, dispatch } = createConnectedComponent();
      component.props().onUnlinkAccount(SERVICE_NAME, ACCOUNT_ID);
      expect(dispatch).toBeCalledWith(
        requestUnlinkCloudAccount({ name: SERVICE_NAME, id: ACCOUNT_ID }),
      );
    });

    it('should pass all required state through to component props', () => {
      const { component } = createConnectedComponent();
      const props = component.props();

      expect(props.accounts).toEqual(mockState.accounts);
      expect(props.path).toEqual(mockState.view.path);
      expect(props.service).toEqual(mockState.view.service);
    });
  });

  describe('#render()', () => {
    it('should render correct components', () => {
      const element = shallow(
        <Navigation
          accounts={ACCOUNTS}
          path={PATH}
          service={SERVICE}
          onChangeAccount={jest.fn()}
          onChangePath={onChangePath}
          onStartAuth={onStartAuth}
          onUnlinkAccount={onUnlinkAccount}
          intl={fakeIntl}
        />,
      );

      expect(element.find(FolderViewerNavigation)).toHaveLength(1);
      expect(element.find(ControlsWrapper)).toHaveLength(1);
      expect(element.find(Controls)).toHaveLength(1);
      expect(element.find(ControlButton)).toHaveLength(1);
      expect(element.find(ControlButton).prop('iconBefore')).toEqual(
        <RefreshIcon label="refresh" />,
      );
      expect(element.find(AccountDropdownWrapper)).toHaveLength(1);
      expect(element.find(Dropdown)).toHaveLength(1);
      expect(element.find(DropdownMenu).prop('trigger')).toEqual(
        <AccountItemButton
          iconBefore={<SettingsIcon label="account settings" />}
          isSelected={false}
        />,
      );
      expect(element.find(BreadCrumbs)).toHaveLength(1);
      expect(element.find(BreadCrumbLink)).toHaveLength(2);
      expect(element.find(BreadCrumbLinkLabel)).toHaveLength(2);
      expect(element.find(BreadCrumbLinkSeparator)).toHaveLength(2);
    });

    it('should respond to click on Refresh', () => {
      const element = shallow(
        <Navigation
          accounts={ACCOUNTS}
          path={PATH}
          service={SERVICE}
          onChangeAccount={jest.fn()}
          onChangePath={onChangePath}
          onStartAuth={onStartAuth}
          onUnlinkAccount={onUnlinkAccount}
          intl={fakeIntl}
        />,
      );

      element.find(ControlButton).simulate('click');
      expect(onChangePath).toBeCalledWith(SERVICE_NAME, ACCOUNT_ID, PATH);
    });

    it('should respond to openChange on Accounts DropDown', () => {
      const element = shallow(
        <Navigation
          accounts={ACCOUNTS}
          path={PATH}
          service={SERVICE}
          onChangeAccount={jest.fn()}
          onChangePath={onChangePath}
          onStartAuth={onStartAuth}
          onUnlinkAccount={onUnlinkAccount}
          intl={fakeIntl}
        />,
      );

      element.find(Dropdown).simulate('openChange', { isOpen: true });

      expect(element.find(DropdownMenu).prop('trigger')).toEqual(
        <AccountItemButton
          iconBefore={<SettingsIcon label="account settings" />}
          isSelected={true}
        />,
      );
    });
  });

  describe('#getAccountsDropdownItems()', () => {
    it('should retrieve available Google Accounts', async () => {
      const component = shallow(
        <Navigation
          accounts={ACCOUNTS}
          path={PATH}
          service={SERVICE_GOOGLE}
          onChangeAccount={onChangeAccount}
          onChangePath={onChangePath}
          onStartAuth={onStartAuth}
          onUnlinkAccount={onUnlinkAccount}
          intl={fakeIntl}
        />,
      );

      await nextTick();

      expect(component.find(DropdownItem).get(0).props.children.type).toEqual(
        'b',
      ); // This checks that the active element is wrapped into a "b" element
      expect(
        component.find(DropdownItem).get(0).props.children.props.children,
      ).toEqual('me@google.com');
      expect(component.find(DropdownItem).get(1).props.children).toEqual(
        'you@google.com',
      );
      expect(
        component.find(DropdownItem).get(2).props.children.props.defaultMessage,
      ).toEqual('Add account');
      expect(
        component.find(DropdownItem).get(3).props.children.props.defaultMessage,
      ).toEqual('Unlink Account');
    });

    it('should retrieve available Dropbox Accounts', async () => {
      const component = shallow(
        <Navigation
          accounts={ACCOUNTS}
          path={PATH}
          service={SERVICE_DROPBOX}
          onChangeAccount={onChangeAccount}
          onChangePath={onChangePath}
          onStartAuth={onStartAuth}
          onUnlinkAccount={onUnlinkAccount}
          intl={fakeIntl}
        />,
      );

      await nextTick();

      expect(component.find(DropdownItem).get(0).props.children.type).toEqual(
        'b',
      ); // This checks that the active element is wrapped into a "b" element
      expect(
        component.find(DropdownItem).get(0).props.children.props.children,
      ).toEqual('me@dropbox.com');
      expect(component.find(DropdownItem).get(1).props.children).toEqual(
        'you@dropbox.com',
      );
      expect(
        component.find(DropdownItem).get(2).props.children.props.defaultMessage,
      ).toEqual('Add account');
      expect(
        component.find(DropdownItem).get(3).props.children.props.defaultMessage,
      ).toEqual('Unlink Account');
    });

    it('should switch active account when clicking on inactive one', async () => {
      const component = shallow(
        <Navigation
          accounts={ACCOUNTS}
          path={PATH}
          service={SERVICE_DROPBOX}
          onChangeAccount={onChangeAccount}
          onChangePath={onChangePath}
          onStartAuth={onStartAuth}
          onUnlinkAccount={onUnlinkAccount}
          intl={fakeIntl}
        />,
      );

      await nextTick();

      component.find(DropdownItem).get(1).props.onClick(); // Find second item (inactive one)

      expect(onChangeAccount).toBeCalledWith('dropbox', 'youatdropbox');
    });

    it('can re-render component on new account and service', async () => {
      const accountGoog0 = (await ACCOUNTS)[0];
      const accountGoog1 = (await ACCOUNTS)[1];
      const accountDb = (await ACCOUNTS)[2];

      const component = shallow(
        <Navigation
          accounts={Promise.resolve([accountGoog0])}
          path={PATH}
          service={SERVICE_GOOGLE}
          onChangeAccount={onChangeAccount}
          onChangePath={onChangePath}
          onStartAuth={onStartAuth}
          onUnlinkAccount={onUnlinkAccount}
          intl={fakeIntl}
        />,
      );

      await nextTick();

      expect(component.contains(<b>me@google.com</b>)).toBeTruthy();

      component.setProps({
        accounts: Promise.resolve([accountDb]),
        service: SERVICE_DROPBOX,
      });

      await nextTick();

      expect(component.contains(<b>me@dropbox.com</b>)).toBeTruthy();
      expect(component.contains(<b>me@google.com</b>)).toBeFalsy();

      component.setProps({
        accounts: Promise.resolve([accountGoog0, accountGoog1]),
        service: SERVICE_GOOGLE,
      });

      await nextTick();

      expect(component.contains(<b>me@google.com</b>)).toBeTruthy();
      expect(component.contains('you@google.com')).toBeTruthy();
    });
  });
});
