import React, { Component } from 'react';

import { asyncComponent } from 'react-async-component';

import Avatar from '@atlaskit/avatar';
import AddIcon from '@atlaskit/icon/glyph/add';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { JiraIcon } from '@atlaskit/logo';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

import {
  GlobalNav,
  LayoutManager,
  modeGenerator,
  NavigationProvider,
  SkeletonContainerView,
  ThemeProvider,
} from '../src';

/**
 * Data
 */
const globalNavPrimaryItems = [
  {
    id: 'jira',
    icon: ({ label }) => <JiraIcon size="medium" label={label} />,
    label: 'Jira',
  },
  { id: 'search', icon: SearchIcon, label: 'Search' },
  { id: 'create', icon: AddIcon, label: 'Add' },
];

const globalNavSecondaryItems = [
  { id: 'icon', icon: QuestionCircleIcon, label: 'Help', size: 'small' },
  {
    id: 'avatar',
    icon: () => (
      <Avatar
        borderColor="transparent"
        isActive={false}
        isHover={false}
        size="small"
      />
    ),
    label: 'Profile',
    size: 'small',
  },
];

// ==============================
// Render components
// ==============================

function makeTestComponent(key, element) {
  return () => <div data-webdriver-test-key={key}>{element}</div>;
}

const GlobalNavigation = makeTestComponent(
  'global-navigation',
  <GlobalNav
    primaryItems={globalNavPrimaryItems}
    secondaryItems={globalNavSecondaryItems}
  />,
);

const customThemeMode = modeGenerator({
  product: {
    text: colors.N0,
    background: colors.G500,
  },
});

// ==============================
// Skeletons
// ==============================
const ProductSkeleton = () => <SkeletonContainerView type="product" />;
const PageContentSkeleton = () => (
  <div style={{ padding: 30 }}>...You will add your page skeleton here...</div>
);

// ==============================
// Async components
// ==============================
const AsyncProductNavigation = asyncComponent({
  resolve: () =>
    import('./shared/components/ProductNavigation').then(
      ({ default: ProductNavigation }) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            return resolve(ProductNavigation);
          }, 5000);
        });
      },
    ),
  LoadingComponent: () => <ProductSkeleton />,
});

const AsyncContent = asyncComponent({
  resolve: () =>
    import('./shared/components/PageContent').then(({ default: Content }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve(makeTestComponent('content', <Content />));
        }, 2000);
      });
    }),
  LoadingComponent: () => <PageContentSkeleton />,
});

export default class NavigationWithDynamicLoad extends Component {
  render() {
    return (
      <NavigationProvider>
        <ThemeProvider theme={(theme) => ({ ...theme, mode: customThemeMode })}>
          <LayoutManager
            globalNavigation={GlobalNavigation}
            productNavigation={AsyncProductNavigation}
            containerNavigation={null}
          >
            <AsyncContent />
          </LayoutManager>
        </ThemeProvider>
      </NavigationProvider>
    );
  }
}
