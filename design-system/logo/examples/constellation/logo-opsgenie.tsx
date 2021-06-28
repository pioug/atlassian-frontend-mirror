import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

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
              <OpsgenieLogo
                textColor={N700}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <OpsgenieWordmark textColor={N700} />
            </td>
            <td>
              <OpsgenieIcon
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

export default LogoOpsgenie;
