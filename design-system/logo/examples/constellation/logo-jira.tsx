import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import { JiraIcon, JiraLogo, JiraWordmark } from '../../src';

const LogoJira = () => {
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
              <JiraLogo
                textColor={N700}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <JiraWordmark textColor={N700} />
            </td>
            <td>
              <JiraIcon
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

export default LogoJira;
