import React from 'react';

import { CompassIcon, CompassLogo, CompassWordmark } from '../../src';

const LogoCompass = () => {
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
              <CompassLogo appearance="brand" />
            </td>
            <td>
              <CompassWordmark appearance="brand" />
            </td>
            <td>
              <CompassIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoCompass;
