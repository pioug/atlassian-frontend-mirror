import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

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
            <HalpLogo
              textColor={N700}
              iconColor={B200}
              iconGradientStart={B400}
              iconGradientStop={B200}
            />
          </td>
          <td>
            <HalpWordmark textColor={N700} />
          </td>
          <td>
            <HalpIcon
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

export default LogoHalp;
