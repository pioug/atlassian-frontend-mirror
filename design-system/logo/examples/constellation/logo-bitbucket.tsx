import React from 'react';

import { BitbucketIcon, BitbucketLogo, BitbucketWordmark } from '../../src';

const LogoBitbucket = () => (
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
            <BitbucketLogo />
          </td>
          <td>
            <BitbucketWordmark />
          </td>
          <td>
            <BitbucketIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoBitbucket;
