import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import {
  JiraSoftwareIcon,
  JiraSoftwareLogo,
  JiraSoftwareWordmark,
} from '../../src';

const LogoJiraSoftware = () => {
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
              <JiraSoftwareLogo
                textColor={N700}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <JiraSoftwareWordmark textColor={N700} />
            </td>
            <td>
              <JiraSoftwareIcon
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

export default LogoJiraSoftware;
