import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

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
              <CompassLogo
                textColor={N700}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <CompassWordmark textColor={N700} />
            </td>
            <td>
              <CompassIcon
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

export default LogoCompass;
