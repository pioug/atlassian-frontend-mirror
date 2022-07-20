import React from 'react';

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
              <TrelloLogo appearance="brand" />
            </td>
            <td>
              <TrelloWordmark appearance="brand" />
            </td>
            <td>
              <TrelloIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoTrello;
