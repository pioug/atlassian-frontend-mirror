import React from 'react';

import { AtlasIcon, AtlasLogo } from '../../src';

const LogoAtlas = () => {
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
              <AtlasLogo appearance="brand" />
            </td>
            <td>
              <AtlasIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoAtlas;
