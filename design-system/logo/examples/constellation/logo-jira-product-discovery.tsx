import React from 'react';

import { JiraProductDiscoveryIcon, JiraProductDiscoveryLogo } from '../../src';

const LogoJiraProductDiscovery = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Icon</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <JiraProductDiscoveryLogo appearance="brand" />
            </td>
            <td>
              <JiraProductDiscoveryIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoJiraProductDiscovery;
