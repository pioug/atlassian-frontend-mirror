import React from 'react';

import { JiraIcon, JiraLogo, JiraWordmark } from '../../src';

const LogoJira = () => {
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
              <JiraLogo appearance="brand" />
            </td>
            <td>
              <JiraWordmark appearance="brand" />
            </td>
            <td>
              <JiraIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoJira;
