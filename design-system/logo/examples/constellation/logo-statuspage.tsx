import React from 'react';

import { StatuspageIcon, StatuspageLogo, StatuspageWordmark } from '../../src';

const LogoStatusPage = () => {
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
              <StatuspageLogo appearance="brand" />
            </td>
            <td>
              <StatuspageWordmark appearance="brand" />
            </td>
            <td>
              <StatuspageIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoStatusPage;
