/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { Code } from '@atlaskit/code';
import { B200 } from '@atlaskit/theme/colors';

import {
  AtlassianIcon,
  AtlassianLogo,
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
  OpsgenieIcon,
  OpsgenieLogo,
  OpsgenieWordmark,
  StatuspageIcon,
  StatuspageLogo,
  StatuspageWordmark,
  TrelloIcon,
  TrelloLogo,
  TrelloWordmark,
} from '../src';

const appearances = ['brand', 'neutral', 'inverse'];

const buildRows = (Logo?: any, Wordmark?: any, Icon?: any) => {
  return (
    <>
      <tr>
        <td>
          <span>
            Default (inherit behaviour - deprecated, not brand-friendly)
          </span>
        </td>
        <td>{Logo && <Logo />}</td>
        <td>{Wordmark && <Wordmark />}</td>
        <td>{Icon && <Icon />}</td>
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
        {buildRows(BitbucketLogo, BitbucketWordmark, BitbucketIcon)}
        {buildRows(CompassLogo, CompassWordmark, CompassIcon)}
        {buildRows(ConfluenceLogo, ConfluenceWordmark, ConfluenceIcon)}
        {buildRows(HalpLogo, HalpWordmark, HalpIcon)}
        {buildRows(JiraAlignLogo, JiraAlignWordmark, JiraAlignIcon)}
        {buildRows(JiraLogo, JiraWordmark, JiraIcon)}
        {buildRows(
          JiraProductDiscoveryLogo,
          () => (
            <div />
          ),
          JiraProductDiscoveryIcon,
        )}
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
        {buildRows(OpsgenieLogo, OpsgenieWordmark, OpsgenieIcon)}
        {buildRows(StatuspageLogo, StatuspageWordmark, StatuspageIcon)}
        {buildRows(TrelloLogo, TrelloWordmark, TrelloIcon)}
      </tbody>
    </table>
  </div>
);
