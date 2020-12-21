import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import { OpsGenieIcon, OpsGenieLogo, OpsGenieWordmark } from '../../src';

const LogoOpsgenie = () => (
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
            <OpsGenieLogo
              textColor={N700}
              iconColor={B200}
              iconGradientStart={B400}
              iconGradientStop={B200}
            />
          </td>
          <td>
            <OpsGenieWordmark textColor={N700} />
          </td>
          <td>
            <OpsGenieIcon
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

export default LogoOpsgenie;
