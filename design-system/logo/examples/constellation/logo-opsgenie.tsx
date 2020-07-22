import React from 'react';

import { OpsGenieIcon, OpsGenieLogo, OpsGenieWordmark } from '../../src';

const LogoOpsgenie = () => (
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
            <OpsGenieLogo />
          </td>
          <td>
            <OpsGenieWordmark />
          </td>
          <td>
            <OpsGenieIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoOpsgenie;
