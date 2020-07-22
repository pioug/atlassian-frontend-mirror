import React from 'react';

import {
  JiraServiceDeskIcon,
  JiraServiceDeskLogo,
  JiraServiceDeskWordmark,
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
            <JiraServiceDeskLogo />
          </td>
          <td>
            <JiraServiceDeskWordmark />
          </td>
          <td>
            <JiraServiceDeskIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoJiraServiceDesk;
