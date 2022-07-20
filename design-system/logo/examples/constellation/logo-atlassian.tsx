import React from 'react';

import { AtlassianIcon, AtlassianLogo, AtlassianWordmark } from '../../src';

const LogoAtlassian = () => {
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
              <AtlassianLogo appearance="brand" />
            </td>
            <td>
              <AtlassianWordmark appearance="brand" />
            </td>
            <td>
              <AtlassianIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoAtlassian;
