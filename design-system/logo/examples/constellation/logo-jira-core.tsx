import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import { JiraCoreIcon, JiraCoreLogo, JiraCoreWordmark } from '../../src';

const LogoJiraCore = () => (
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
            <JiraCoreLogo
              textColor={N700}
              iconColor={B200}
              iconGradientStart={B400}
              iconGradientStop={B200}
            />
          </td>
          <td>
            <JiraCoreWordmark textColor={N700} />
          </td>
          <td>
            <JiraCoreIcon
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

export default LogoJiraCore;
