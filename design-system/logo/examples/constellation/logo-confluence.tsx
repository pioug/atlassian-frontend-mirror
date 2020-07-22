import React from 'react';

import { ConfluenceIcon, ConfluenceLogo, ConfluenceWordmark } from '../../src';

const LogoConfluence = () => (
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
            <ConfluenceLogo />
          </td>
          <td>
            <ConfluenceWordmark />
          </td>
          <td>
            <ConfluenceIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoConfluence;
