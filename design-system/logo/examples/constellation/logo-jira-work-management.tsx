import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import {
  JiraWorkManagementIcon,
  JiraWorkManagementLogo,
  JiraWorkManagementWordmark,
} from '../../src';

const LogoJiraWorkManagement = () => {
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
              <JiraWorkManagementLogo
                textColor={N700}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <JiraWorkManagementWordmark textColor={N700} />
            </td>
            <td>
              <JiraWorkManagementIcon
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

export default LogoJiraWorkManagement;
