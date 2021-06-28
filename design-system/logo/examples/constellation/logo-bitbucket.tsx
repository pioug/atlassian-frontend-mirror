import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import { BitbucketIcon, BitbucketLogo, BitbucketWordmark } from '../../src';

const LogoBitbucket = () => {
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
              <BitbucketLogo
                textColor={N700}
                iconColor={B200}
                iconGradientStart={B400}
                iconGradientStop={B200}
              />
            </td>
            <td>
              <BitbucketWordmark textColor={N700} />
            </td>
            <td>
              <BitbucketIcon
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

export default LogoBitbucket;
