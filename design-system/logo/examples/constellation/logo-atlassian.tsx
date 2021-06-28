import React from 'react';

import { B200, B400 } from '@atlaskit/theme/colors';

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
              <AtlassianLogo
                textColor={B400}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <AtlassianWordmark textColor={B400} />
            </td>
            <td>
              <AtlassianIcon
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoAtlassian;
