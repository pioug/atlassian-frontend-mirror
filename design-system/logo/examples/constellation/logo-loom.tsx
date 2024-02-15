import React from 'react';

import { LoomIcon, LoomLogo } from '../../src';

const LogoLoom = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Icon</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <LoomLogo appearance="brand" />
            </td>
            <td>
              <LoomIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoLoom;
