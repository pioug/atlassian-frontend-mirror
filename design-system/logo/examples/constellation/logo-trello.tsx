import React from 'react';

import { TrelloIcon, TrelloLogo, TrelloWordmark } from '../../src';

const LogoTrello = () => (
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
            <TrelloLogo />
          </td>
          <td>
            <TrelloWordmark />
          </td>
          <td>
            <TrelloIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoTrello;
