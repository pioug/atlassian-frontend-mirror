import React from 'react';

import {
  JiraWorkManagementIcon,
  JiraWorkManagementLogo,
  JiraWorkManagementWordmark,
} from '../../src';

const LogoJiraWorkManagement = () => {
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
              <JiraWorkManagementLogo appearance="brand" />
            </td>
            <td>
              <JiraWorkManagementWordmark appearance="brand" />
            </td>
            <td>
              <JiraWorkManagementIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoJiraWorkManagement;
