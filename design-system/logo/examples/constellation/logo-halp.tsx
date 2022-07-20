import React from 'react';

import { HalpIcon, HalpLogo, HalpWordmark } from '../../src';

const LogoHalp = () => (
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
            <HalpLogo appearance="brand" />
          </td>
          <td>
            <HalpWordmark appearance="brand" />
          </td>
          <td>
            <HalpIcon appearance="brand" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoHalp;
