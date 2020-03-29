import React, { Component } from 'react';

import { colors } from '@atlaskit/theme';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import { JiraWordmark } from '@atlaskit/logo';
import {
  BackItem,
  GoToItem,
  HeaderSection,
  Item,
  NavigationProvider,
  MenuSection,
  SectionHeading,
  withNavigationViewController,
  // ViewController was coming as type.
  // eslint-disable-next-line no-unused-vars
  ViewController,
  Wordmark,
} from '../../../src';

import { CONTENT_NAV_WIDTH } from '../../../src/common/constants';

const SectionWrapper = props => (
  <div
    css={{
      backgroundColor: colors.N20,
      marginTop: '8px',
      overflow: 'hidden',
      position: 'relative',
      width: `${CONTENT_NAV_WIDTH}px`,
    }}
    {...props}
  />
);

const RootMenu = ({ className }) => (
  <div className={className}>
    <GoToItem
      before={IssuesIcon}
      goTo="issues"
      text="Issues"
      testKey="product-item-issues"
    />
  </div>
);

const IssuesMenu = ({ className }) => (
  <div className={className}>
    <BackItem goTo="root" />
    <SectionHeading>Issues and filters</SectionHeading>
    <Item id="search-issues" text="Search issues" />
  </div>
);

const VIEWS = {
  root: RootMenu,
  issues: IssuesMenu,
};

const Noop = () => null;

class ViewRegistry extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props;
    Object.keys(VIEWS).forEach(viewId => {
      navigationViewController.addView({
        id: viewId,
        type: 'product',
        getItems: () => [],
      });
    });
    navigationViewController.setView('root');
  }

  render() {
    return null;
  }
}

const ProductNavigation = ({
  navigationViewController: {
    state: { activeView },
  },
}) => {
  const CurrentMenu = activeView ? VIEWS[activeView.id] : Noop;
  const id = (activeView && activeView.id) || undefined;
  const parentId =
    activeView && activeView.id === 'issues' ? 'root' : undefined;

  return (
    <SectionWrapper>
      <HeaderSection>
        {({ className }) => (
          <div className={className}>
            <Wordmark wordmark={JiraWordmark} />
          </div>
        )}
      </HeaderSection>
      <MenuSection id={id} parentId={parentId}>
        {CurrentMenu}
      </MenuSection>
    </SectionWrapper>
  );
};

const ConnectedProductNavigation = withNavigationViewController(
  ProductNavigation,
);

const ConnectedViewRegistry = withNavigationViewController(ViewRegistry);

export default () => (
  <NavigationProvider>
    <SectionWrapper>
      <ConnectedViewRegistry />

      <ConnectedProductNavigation />
    </SectionWrapper>
  </NavigationProvider>
);
