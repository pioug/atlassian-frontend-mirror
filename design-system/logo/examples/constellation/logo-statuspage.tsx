import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import { StatuspageIcon, StatuspageLogo, StatuspageWordmark } from '../../src';

const LogoStatusPage = () => {
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
              <StatuspageLogo
                textColor={N700}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <StatuspageWordmark textColor={N700} />
            </td>
            <td>
              <StatuspageIcon
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

export default LogoStatusPage;
