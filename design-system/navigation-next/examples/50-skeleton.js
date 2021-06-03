import React, { Component, Fragment } from 'react';

import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import ReportsIcon from '@atlaskit/icon/glyph/graph-line';
import IssuesIcon from '@atlaskit/icon/glyph/issue';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors, gridSize as gridSizeFn } from '@atlaskit/theme';

import {
  ContainerHeader,
  dark,
  GlobalNav,
  GlobalNavigationSkeleton,
  HeaderSection,
  Item,
  ItemAvatar,
  LayoutManager,
  light,
  MenuSection,
  modeGenerator,
  NavigationProvider,
  settings,
  SkeletonContainerView,
  ThemeProvider,
} from '../src';

const gridSize = gridSizeFn();

const customThemeMode = modeGenerator({
  product: {
    text: colors.N0,
    background: colors.G500,
  },
});

const themeModes = { light, dark, settings, custom: customThemeMode };

const GlobalNavigation = () => (
  <GlobalNav primaryItems={[]} secondaryItems={[]} />
);

export default class Example extends Component {
  state = {
    themeMode: 'light',
    shouldShowContainer: true,
    shouldRenderSkeleton: true,
  };

  renderNavigation = () => {
    return (
      <Fragment>
        <HeaderSection>
          {({ css }) => (
            <div
              css={{
                ...css,
                paddingBottom: gridSize * 2.5,
              }}
            >
              <ContainerHeader
                before={(itemState) => (
                  <ItemAvatar
                    itemState={itemState}
                    appearance="square"
                    size="large"
                  />
                )}
                text="Container title"
                subText="Container description"
              />
            </div>
          )}
        </HeaderSection>
        <MenuSection>
          {({ className }) => (
            <div className={className}>
              <Item before={DashboardIcon} text="Dashboards" />
              <Item before={BacklogIcon} text="Backlog" />
              <Item before={IssuesIcon} text="Issues and filters" />
              <Item before={ReportsIcon} text="Reports" />
            </div>
          )}
        </MenuSection>
      </Fragment>
    );
  };

  renderGlobalNavigationSkeleton = () => <GlobalNavigationSkeleton />;

  renderSkeleton = () => {
    const { shouldShowContainer } = this.state;
    return (
      <SkeletonContainerView
        type={shouldShowContainer ? 'container' : 'product'}
      />
    );
  };

  handleThemeModeChange = ({ target: { value: themeMode } }) => {
    this.setState({ themeMode });
  };

  handleShowContainerChange = () => {
    this.setState({ shouldShowContainer: !this.state.shouldShowContainer });
  };

  handleRenderSkeletonChange = () => {
    this.setState({ shouldRenderSkeleton: !this.state.shouldRenderSkeleton });
  };

  render() {
    const { shouldRenderSkeleton, shouldShowContainer, themeMode } = this.state;
    const renderer = shouldRenderSkeleton
      ? this.renderSkeleton
      : this.renderNavigation;
    return (
      <NavigationProvider>
        <ThemeProvider
          theme={(theme) => ({
            ...theme,
            mode: themeModes[themeMode],
          })}
        >
          <LayoutManager
            globalNavigation={
              shouldRenderSkeleton
                ? this.renderGlobalNavigationSkeleton
                : GlobalNavigation
            }
            productNavigation={renderer}
            containerNavigation={shouldShowContainer ? renderer : null}
          >
            <div css={{ padding: '32px 40px' }}>
              <p>
                <label htmlFor="should-render-skeleton-toggle">
                  <input
                    checked={shouldRenderSkeleton}
                    id="should-render-skeleton-toggle"
                    onChange={this.handleRenderSkeletonChange}
                    type="checkbox"
                  />{' '}
                  Render skeleton
                </label>
              </p>
              <p>
                <label htmlFor="should-show-container-toggle">
                  <input
                    checked={shouldShowContainer}
                    id="should-show-container-toggle"
                    onChange={this.handleShowContainerChange}
                    type="checkbox"
                  />{' '}
                  Show container navigation
                </label>
              </p>
              <p>
                <select onChange={this.handleThemeModeChange} value={themeMode}>
                  <option value="light">Light mode</option>
                  <option value="dark">Dark mode</option>
                  <option value="settings">Settings mode</option>
                  <option value="custom">Custom mode</option>
                </select>
              </p>
            </div>
          </LayoutManager>
        </ThemeProvider>
      </NavigationProvider>
    );
  }
}
