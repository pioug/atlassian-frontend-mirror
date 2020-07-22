import React from 'react';

import { JiraIcon, JiraLogo, JiraWordmark } from '../../src';

const LogoJira = () => (
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
            <JiraLogo />
          </td>
          <td>
            <JiraWordmark />
          </td>
          <td>
            <JiraIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoJira;
