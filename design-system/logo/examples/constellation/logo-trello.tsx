import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import { TrelloIcon, TrelloLogo, TrelloWordmark } from '../../src';

const LogoTrello = () => {
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
              <TrelloLogo
                textColor={N700}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <TrelloWordmark textColor={N700} />
            </td>
            <td>
              <TrelloIcon
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

export default LogoTrello;
