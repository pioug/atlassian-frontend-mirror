import React from 'react';

import { JiraCoreIcon, JiraCoreLogo, JiraCoreWordmark } from '../../src';

const LogoJiraCore = () => (
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
            <JiraCoreLogo />
          </td>
          <td>
            <JiraCoreWordmark />
          </td>
          <td>
            <JiraCoreIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoJiraCore;
