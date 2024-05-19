import React from 'react';

import { Code } from '@atlaskit/code';
import { B200 } from '@atlaskit/theme/colors';

import {
  AtlasIcon,
  AtlasLogo,
  AtlassianAccessIcon,
  AtlassianAccessLogo,
  AtlassianAdminIcon,
  AtlassianAdministrationIcon,
  AtlassianAdministrationLogo,
  AtlassianAdminLogo,
  AtlassianAnalyticsIcon,
  AtlassianAnalyticsLogo,
  AtlassianIcon,
  AtlassianLogo,
  AtlassianMarketplaceIcon,
  AtlassianMarketplaceLogo,
  AtlassianStartLogo,
  AtlassianWordmark,
  BitbucketIcon,
  BitbucketLogo,
  BitbucketWordmark,
  CompassIcon,
  CompassLogo,
  CompassWordmark,
  ConfluenceIcon,
  ConfluenceLogo,
  ConfluenceWordmark,
  GuardIcon,
  GuardLogo,
  HalpIcon,
  HalpLogo,
  HalpWordmark,
  JiraAlignIcon,
  JiraAlignLogo,
  JiraAlignWordmark,
  JiraIcon,
  JiraLogo,
  JiraProductDiscoveryIcon,
  JiraProductDiscoveryLogo,
  JiraServiceManagementIcon,
  JiraServiceManagementLogo,
  JiraServiceManagementWordmark,
  JiraSoftwareIcon,
  JiraSoftwareLogo,
  JiraSoftwareWordmark,
  JiraWordmark,
  JiraWorkManagementIcon,
  JiraWorkManagementLogo,
  JiraWorkManagementWordmark,
  LoomIcon,
  LoomLogo,
  OpsgenieIcon,
  OpsgenieLogo,
  OpsgenieWordmark,
  RovoIcon,
  RovoLogo,
  StatuspageIcon,
  StatuspageLogo,
  StatuspageWordmark,
  TrelloIcon,
  TrelloLogo,
  TrelloWordmark,
} from '../src';

const appearances = ['brand', 'neutral', 'inverse'];

const buildRows = (
  Logo?: any,
  Wordmark?: any,
  Icon?: any,
  inheritSupported: boolean = true,
) => {
  return (
    <>
      <tr>
        <td>
          <span>
            {inheritSupported
              ? 'Default (inherit behaviour - deprecated, not brand-friendly)'
              : 'New logo - inherit behaviour not supported. Appearance prop enforced'}
          </span>
        </td>
        <td>{inheritSupported && Logo && <Logo />}</td>
        <td>{inheritSupported && Wordmark && <Wordmark />}</td>
        <td>{inheritSupported && Icon && <Icon />}</td>
      </tr>
      {appearances.map((appearance) => {
        return (
          <tr
            key={appearance}
            style={{ background: appearance === 'inverse' ? B200 : '' }}
          >
            <td>
              <span>
                <Code>{appearance}</Code>
              </span>
            </td>
            <td>{Logo && <Logo appearance={appearance} />}</td>
            <td>{Wordmark && <Wordmark appearance={appearance} />}</td>
            <td>{Icon && <Icon appearance={appearance} />}</td>
          </tr>
        );
      })}
    </>
  );
};

export default () => (
  <div>
    <table>
      <thead>
        <tr>
          <th>Appearance</th>
          <th>Logo</th>
          <th>Wordmark</th>
          <th>Icon</th>
        </tr>
      </thead>
      <tbody>
        {buildRows(AtlassianLogo, AtlassianWordmark, AtlassianIcon)}
        {buildRows(AtlassianStartLogo)}
        {buildRows(AtlassianAnalyticsLogo, null, AtlassianAnalyticsIcon, false)}
        {buildRows(BitbucketLogo, BitbucketWordmark, BitbucketIcon)}
        {buildRows(CompassLogo, CompassWordmark, CompassIcon)}
        {buildRows(ConfluenceLogo, ConfluenceWordmark, ConfluenceIcon)}
        {buildRows(HalpLogo, HalpWordmark, HalpIcon)}
        {buildRows(JiraAlignLogo, JiraAlignWordmark, JiraAlignIcon)}
        {buildRows(JiraLogo, JiraWordmark, JiraIcon)}
        {buildRows(JiraProductDiscoveryLogo, null, JiraProductDiscoveryIcon)}
        {buildRows(
          JiraServiceManagementLogo,
          JiraServiceManagementWordmark,
          JiraServiceManagementIcon,
        )}
        {buildRows(JiraSoftwareLogo, JiraSoftwareWordmark, JiraSoftwareIcon)}
        {buildRows(
          JiraWorkManagementLogo,
          JiraWorkManagementWordmark,
          JiraWorkManagementIcon,
        )}
        {buildRows(LoomLogo, null, LoomIcon)}
        {buildRows(OpsgenieLogo, OpsgenieWordmark, OpsgenieIcon)}
        {buildRows(StatuspageLogo, StatuspageWordmark, StatuspageIcon)}
        {buildRows(TrelloLogo, TrelloWordmark, TrelloIcon)}
        {buildRows(AtlasLogo, null, AtlasIcon, false)}
        {buildRows(AtlassianMarketplaceLogo, null, AtlassianMarketplaceIcon)}
        {buildRows(GuardLogo, null, GuardIcon)}
        {buildRows(RovoLogo, null, RovoIcon)}
        {buildRows(AtlassianAdminLogo, null, AtlassianAdminIcon)}
        {buildRows(
          AtlassianAdministrationLogo,
          null,
          AtlassianAdministrationIcon,
        )}
        {buildRows(AtlassianAccessLogo, null, AtlassianAccessIcon)}
      </tbody>
    </table>
  </div>
);
