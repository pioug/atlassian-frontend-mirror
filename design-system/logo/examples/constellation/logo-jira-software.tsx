import React from 'react';

import {
  JiraSoftwareIcon,
  JiraSoftwareLogo,
  JiraSoftwareWordmark,
} from '../../src';

const LogoJiraSoftware = () => {
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
              <JiraSoftwareLogo appearance="brand" />
            </td>
            <td>
              <JiraSoftwareWordmark appearance="brand" />
            </td>
            <td>
              <JiraSoftwareIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoJiraSoftware;
