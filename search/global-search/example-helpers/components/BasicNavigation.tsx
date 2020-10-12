import React from 'react';
import Navigation from '@atlaskit/global-navigation';
import { AtlassianIcon } from '@atlaskit/logo';

export interface Props {
  searchDrawerContent: React.ComponentType;
  drawerIsOpen?: boolean;
}

export interface State {
  openDrawer: string | null;
}

export default class BasicNavigation extends React.Component<Props, State> {
  static defaultProps = {
    drawerIsOpen: true,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      openDrawer: props.drawerIsOpen ? 'search' : null,
    };
  }

  openDrawer = () => {
    this.setState({
      openDrawer: 'search',
    });
  };

  closeDrawer = () => {
    this.setState({
      openDrawer: null,
    });
  };

  render() {
    return (
      <Navigation
        productIcon={AtlassianIcon}
        productHref="#"
        isSearchDrawerOpen={!!this.state.openDrawer}
        onSearchClick={this.openDrawer}
        searchDrawerContents={this.props.searchDrawerContent}
        onSearchDrawerClose={this.closeDrawer}
        profileIconUrl="http://api.adorable.io/avatar/32/luke"
        profileItems={() => null}
      />
    );
  }
}
