import React from 'react';

import {
  BitbucketIcon,
  BitbucketLogo,
  CompassIcon,
  CompassLogo,
  ConfluenceIcon,
  ConfluenceLogo,
  JiraIcon,
  JiraLogo,
  JiraServiceManagementIcon,
  JiraServiceManagementLogo,
  JiraSoftwareIcon,
  JiraSoftwareLogo,
  OpsgenieIcon,
  OpsgenieLogo,
} from '@atlaskit/logo';

import { CustomProductHome, ProductHome } from '../../src';

import atlassianIconUrl from './assets/atlassian-icon.png';
import atlassianLogoUrl from './assets/atlassian-logo.png';

export const BitbucketProductHome = () => (
  <ProductHome
    onClick={console.log}
    siteTitle="Extranet"
    icon={BitbucketIcon}
    logo={BitbucketLogo}
    testId="bitbucket-product-home"
  />
);

export const ConfluenceProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={ConfluenceIcon}
    logo={ConfluenceLogo}
    href="#"
    testId="confluence-product-home"
  />
);

export const JiraProductHome = () => (
  <ProductHome
    onClick={console.log}
    siteTitle="Extranet"
    aria-label={'Jira'}
    icon={JiraIcon}
    logo={JiraLogo}
    testId="jira-product-home"
  />
);

export const JiraServiceManagementProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={JiraServiceManagementIcon}
    logo={JiraServiceManagementLogo}
    href="#"
    testId="jsm-product-home"
  />
);

export const JiraSoftwareProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={JiraSoftwareIcon}
    logo={JiraSoftwareLogo}
    href="#"
    testId="jsw-product-home"
  />
);

export const OpsGenieProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    onClick={console.log}
    icon={OpsgenieIcon}
    logo={OpsgenieLogo}
    testId="opsgenie-product-home"
  />
);

export const CompassProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={CompassIcon}
    logo={CompassLogo}
    href="#"
    testId="confluence-product-home"
  />
);

export const DefaultProductHome = JiraProductHome;

export const DefaultCustomProductHome = () => (
  <CustomProductHome
    href="#"
    siteTitle="Extranet"
    iconAlt="Custom icon"
    iconUrl={atlassianIconUrl}
    logoAlt="Custom logo"
    logoUrl={atlassianLogoUrl}
    testId="custom-product-home"
  />
);
