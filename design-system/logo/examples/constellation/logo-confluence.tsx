import React from 'react';

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
              <ConfluenceLogo appearance="brand" />
            </td>
            <td>
              <ConfluenceWordmark appearance="brand" />
            </td>
            <td>
              <ConfluenceIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoConfluence;
