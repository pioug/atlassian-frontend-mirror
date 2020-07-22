import React from 'react';

import { AtlassianIcon, AtlassianLogo, AtlassianWordmark } from '../../src';

const LogoAtlassian = () => (
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
            <AtlassianLogo />
          </td>
          <td>
            <AtlassianWordmark />
          </td>
          <td>
            <AtlassianIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoAtlassian;
