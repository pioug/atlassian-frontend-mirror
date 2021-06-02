import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import { startAuth } from '../../actions/startAuth';
import { requestUnlinkCloudAccount } from '../../actions/unlinkCloudAccount';
import { changeCloudAccountFolder } from '../../actions/changeCloudAccountFolder';
import { changeAccount } from '../../actions/changeAccount';
import {
  State,
  Path,
  ServiceName,
  ServiceAccountWithType,
  ServiceAccountLink,
} from '../../domain';
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
} from './styled';

const SERVICENAME: { [key: string]: string } = {
  dropbox: 'Dropbox',
  google: 'Google Drive',
};

export interface NavigationStateProps {
  readonly accounts: Promise<ServiceAccountWithType[]>;
  readonly path: Path;
  readonly service: ServiceAccountLink;
}

export interface NavigationDispatchProps {
  readonly onChangeAccount: (
    serviceName: ServiceName,
    accountId: string,
  ) => void;
  readonly onChangePath: (
    serviceName: ServiceName,
    accountId: string,
    path: Path,
  ) => void;
  readonly onStartAuth: (serviceName: ServiceName) => void;
  readonly onUnlinkAccount: (
    serviceName: ServiceName,
    accountId: string,
  ) => void;
}

export type NavigationProps = NavigationStateProps &
  NavigationDispatchProps &
  InjectedIntlProps;

export interface NavigationState {
  readonly dropdownOpen: boolean;
  readonly availableAccounts: ServiceAccountWithType[];
}

export class Navigation extends Component<NavigationProps, NavigationState> {
  state: NavigationState = {
    dropdownOpen: false,
    availableAccounts: [],
  };

  private mounted = false;

  componentWillUnmount() {
    this.mounted = false;
  }

  async componentDidMount() {
    this.mounted = true;
    const { accounts, service } = this.props;
    const availableAccounts = (await accounts).filter(
      (account) => account.type === service.name,
    );
    if (this.mounted) {
      this.setState({
        availableAccounts,
      });
    }
  }

  async componentDidUpdate(prevProps: NavigationProps) {
    const { accounts, service } = this.props;

    if (prevProps.service !== service) {
      const availableAccounts = (await accounts).filter(
        (account) => account.type === service.name,
      );

      if (this.mounted) {
        this.setState({
          availableAccounts,
        });
      }
    }
  }

  render() {
    const { service, path } = this.props;
    const breadcrumbs = this.generateBreadcrumbs(service, path);
    const accountsDropdown = this.getAccountsDropdown();

    return (
      <FolderViewerNavigation>
        {breadcrumbs}
        <ControlsWrapper>
          <Controls>
            <ControlButton
              onClick={this.onRefreshButtonClick}
              iconBefore={<RefreshIcon label="refresh" />}
            />
            {accountsDropdown}
          </Controls>
        </ControlsWrapper>
      </FolderViewerNavigation>
    );
  }

  onRefreshButtonClick = () => {
    const { service, path, onChangePath } = this.props;
    onChangePath(service.name, service.accountId, path);
  };

  getAccountButton(): JSX.Element {
    const { dropdownOpen } = this.state;

    return (
      <AccountItemButton
        isSelected={dropdownOpen}
        iconBefore={<SettingsIcon label="account settings" />}
      />
    );
  }

  onChangeAccountHandler = (type: ServiceName, id: string) => () => {
    const { onChangeAccount } = this.props;
    onChangeAccount(type, id);
  };

  onUnlinkAccountHandler = (name: ServiceName, accountId: string) => () => {
    const { onUnlinkAccount } = this.props;
    onUnlinkAccount(name, accountId);
  };

  onStartAuthHandler = (name: ServiceName) => () => {
    const { onStartAuth } = this.props;
    onStartAuth(name);
  };

  getAccountsDropdownItems() {
    const {
      service,
      intl: { formatMessage },
    } = this.props;
    const { availableAccounts } = this.state;

    const dropdownAccountItems = availableAccounts.map(
      ({ id, displayName, type }) => (
        <DropdownItem key={id} onClick={this.onChangeAccountHandler(type, id)}>
          {id === service.accountId ? <b>{displayName}</b> : displayName}
        </DropdownItem>
      ),
    );
    const dropdownActionItems = [
      <DropdownItem key="add" onClick={this.onStartAuthHandler(service.name)}>
        <FormattedMessage {...messages.add_account} />
      </DropdownItem>,
      <DropdownItem
        key="unlink"
        onClick={this.onUnlinkAccountHandler(service.name, service.accountId)}
      >
        <FormattedMessage {...messages.unlink_account} />
      </DropdownItem>,
    ];

    return [
      <DropdownItemGroup
        key="accounts"
        title={formatMessage(messages.accounts)}
      >
        {dropdownAccountItems}
      </DropdownItemGroup>,
      <DropdownItemGroup key="actions" title={formatMessage(messages.actions)}>
        {dropdownActionItems}
      </DropdownItemGroup>,
    ];
  }

  getAccountsDropdown(): JSX.Element {
    const items = this.getAccountsDropdownItems();

    return (
      <AccountDropdownWrapper>
        <DropdownMenu
          onOpenChange={this.handleOpenChange}
          trigger={this.getAccountButton()}
          position="bottom right"
        >
          {items}
        </DropdownMenu>
      </AccountDropdownWrapper>
    );
  }

  private handleOpenChange = (attrs: any) => {
    this.setState({ dropdownOpen: attrs.isOpen });
  };

  private generateBreadcrumbs(
    service: ServiceAccountLink,
    path: Path,
  ): JSX.Element {
    const serviceName = SERVICENAME[service.name] || service.name;
    const fullPath = [{ id: '', name: serviceName }].concat(path);
    const breadcrumbs = fullPath
      .slice(-2)
      .map((folderReference) => {
        const index = fullPath.indexOf(folderReference);
        return fullPath.slice(0, index + 1);
      })
      .map((path, index, allPaths) => {
        const isLast = index === allPaths.length - 1;
        return this.renderBreadcrumb(service, path, isLast);
      });

    return <BreadCrumbs>{breadcrumbs}</BreadCrumbs>;
  }

  private renderBreadcrumb(
    service: ServiceAccountLink,
    path: Path,
    isLast: boolean,
  ): JSX.Element | null {
    const { onChangePath } = this.props;

    if (path.length === 0) {
      return null;
    }

    const folder = path[path.length - 1];
    const onClick = () =>
      onChangePath(service.name, service.accountId, path.slice(1));

    return (
      <BreadCrumbLink key={folder.id} onClick={onClick} isLast={isLast}>
        <BreadCrumbLinkLabel title={folder.name} isLast={isLast}>
          {folder.name}
        </BreadCrumbLinkLabel>
        <BreadCrumbLinkSeparator isLast={isLast}>/</BreadCrumbLinkSeparator>
      </BreadCrumbLink>
    );
  }
}

export default connect<
  NavigationStateProps,
  NavigationDispatchProps,
  {},
  State
>(
  ({ accounts, view }) => ({
    accounts,
    path: view.path,
    service: view.service,
  }),
  (dispatch) => ({
    onChangeAccount: (serviceName, accountId) =>
      dispatch(changeAccount(serviceName, accountId)),
    onChangePath: (serviceName, accountId, path) =>
      dispatch(changeCloudAccountFolder(serviceName, accountId, [...path])),
    onStartAuth: (serviceName) => dispatch(startAuth(serviceName)),
    onUnlinkAccount: (serviceName, accountId) =>
      dispatch(
        requestUnlinkCloudAccount({
          id: accountId,
          name: serviceName,
        }),
      ),
  }),
)(injectIntl(Navigation));
