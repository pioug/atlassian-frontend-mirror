import React from 'react';

import {
  JiraServiceManagementIcon,
  JiraServiceManagementLogo,
  JiraServiceManagementWordmark,
} from '../../src';

const LogoJiraServiceManagement = () => {
  return (
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
              <JiraServiceManagementLogo appearance="brand" />
            </td>
            <td>
              <JiraServiceManagementWordmark appearance="brand" />
            </td>
            <td>
              <JiraServiceManagementIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoJiraServiceManagement;
