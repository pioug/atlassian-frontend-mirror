import React from 'react';

import {
  JiraSoftwareIcon,
  JiraSoftwareLogo,
  JiraSoftwareWordmark,
} from '../../src';

const LogoJiraSoftware = () => (
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
            <JiraSoftwareLogo />
          </td>
          <td>
            <JiraSoftwareWordmark />
          </td>
          <td>
            <JiraSoftwareIcon />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LogoJiraSoftware;
