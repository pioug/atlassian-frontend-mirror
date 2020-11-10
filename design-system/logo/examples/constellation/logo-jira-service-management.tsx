import React from 'react';

import {
  JiraServiceManagementIcon,
  JiraServiceManagementLogo,
  JiraServiceManagementWordmark,
} from '../../src';

const LogoJiraServiceDesk = () => (
  <div>
    <table>
      <thead>
        <tr>
          <th>Logo</th>
          <th>Wordmark</th>
          <th>Icon</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <JiraServiceManagementLogo />
          </td>
          <td>
            <JiraServiceManagementWordmark />
          </td>
          <td>
            <JiraServiceManagementIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoJiraServiceDesk;
