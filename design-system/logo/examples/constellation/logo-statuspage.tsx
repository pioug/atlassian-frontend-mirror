import React from 'react';

import { StatuspageIcon, StatuspageLogo, StatuspageWordmark } from '../../src';

const LogoStatusPage = () => (
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
            <StatuspageLogo />
          </td>
          <td>
            <StatuspageWordmark />
          </td>
          <td>
            <StatuspageIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoStatusPage;
