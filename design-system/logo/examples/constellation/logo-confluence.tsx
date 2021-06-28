import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import { ConfluenceIcon, ConfluenceLogo, ConfluenceWordmark } from '../../src';

const LogoConfluence = () => {
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
              <ConfluenceLogo
                textColor={N700}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <ConfluenceWordmark textColor={N700} />
            </td>
            <td>
              <ConfluenceIcon
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

export default LogoConfluence;
