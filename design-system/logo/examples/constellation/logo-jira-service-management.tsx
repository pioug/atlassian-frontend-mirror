import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import {
  JiraServiceManagementIcon,
  JiraServiceManagementLogo,
  JiraServiceManagementWordmark,
} from '../../src';

const LogoJiraServiceManagement = () => {
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
              <JiraServiceManagementLogo
                textColor={N700}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <JiraServiceManagementWordmark textColor={N700} />
            </td>
            <td>
              <JiraServiceManagementIcon
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

export default LogoJiraServiceManagement;
