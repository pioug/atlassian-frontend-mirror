/* eslint-disable react/prop-types */
import React from 'react';
import { AtlassianIcon } from '@atlaskit/logo';
import Lorem from 'react-lorem-component';
import Page from '@atlaskit/page';
import Navigation, { AkContainerTitle } from '../../../src';
import RouterLinkComponent from './RouterLinkComponent';
import RouterLinkItem from './RouterLinkItem';

const PageNavigation = ({ title, currentPath }) => (
  <Page
    navigation={
      <Navigation
        containerHeaderComponent={() => (
          <AkContainerTitle
            href="/iframe.html"
            icon={<AtlassianIcon label="atlassian" />}
            linkComponent={RouterLinkComponent}
            text="AtlasCat"
          />
        )}
        globalPrimaryIcon={<AtlassianIcon label="Home" size="small" />}
        globalPrimaryItemHref="/iframe.html"
        linkComponent={RouterLinkComponent}
      >
        <RouterLinkItem
          text="Page 1"
          to="/page1"
          isSelected={currentPath === '/page1'}
        />
        <RouterLinkItem
          text="Page 2"
          to="/page2"
          isSelected={currentPath === '/page2'}
        />
        <RouterLinkItem
          text="Page 3"
          to="/page3"
          isSelected={currentPath === '/page3'}
        />
        <RouterLinkItem
          text="Page 4"
          to="/page4"
          isSelected={currentPath === '/page4'}
        />
      </Navigation>
    }
  >
    <div>
      <h1>{title}</h1>
      <Lorem count="30" />
    </div>
  </Page>
);

export default PageNavigation;
