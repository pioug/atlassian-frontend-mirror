import React from 'react';

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
              <BitbucketLogo appearance="brand" />
            </td>
            <td>
              <BitbucketWordmark appearance="brand" />
            </td>
            <td>
              <BitbucketIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoBitbucket;
