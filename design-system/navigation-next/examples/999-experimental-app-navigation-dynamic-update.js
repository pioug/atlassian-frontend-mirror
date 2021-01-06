import React, { Component } from 'react';

import Navigation from '@atlaskit/atlassian-navigation/examples/10-authenticated-example';
import { NavigationSkeleton } from '@atlaskit/atlassian-navigation/skeleton';
import Toggle from '@atlaskit/toggle';

import { LayoutManagerWithViewController, NavigationProvider } from '../src';

const customComponents = {};

const containerCSS = {
  margin: '1rem',
};

const labelCSS = {
  alignItems: 'center',
  display: 'flex',
};

const Layout = ({ children, globalNavigation }) => (
  <NavigationProvider>
    <LayoutManagerWithViewController
      customComponents={customComponents}
      experimental_horizontalGlobalNav
      globalNavigation={globalNavigation}
    >
      <div css={containerCSS}>{children}</div>
    </LayoutManagerWithViewController>
  </NavigationProvider>
);

class ExperimentalAppNavigationDynamicUpdate extends Component {
  state = {
    showSkeleton: true,
  };

  render() {
    const { showSkeleton } = this.state;

    const onChange = () => {
      this.setState({ showSkeleton: !showSkeleton });
    };

    return (
      <Layout globalNavigation={showSkeleton ? NavigationSkeleton : Navigation}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
        <label css={labelCSS}>
          <Toggle isChecked={showSkeleton} name="toggle" onChange={onChange} />
          <span>Toggle navigation</span>
        </label>
      </Layout>
    );
  }
}

export default ExperimentalAppNavigationDynamicUpdate;
