import React from 'react';

import { OpsgenieIcon, OpsgenieLogo, OpsgenieWordmark } from '../../src';

const LogoOpsgenie = () => {
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
              <OpsgenieLogo appearance="brand" />
            </td>
            <td>
              <OpsgenieWordmark appearance="brand" />
            </td>
            <td>
              <OpsgenieIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoOpsgenie;
