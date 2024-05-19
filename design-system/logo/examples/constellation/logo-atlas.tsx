/** @jsx jsx */

import { css, jsx } from '@compiled/react';

import { AtlasIcon, AtlasLogo } from '../../src';

const tableStyle = css({
  width: '415px',
});

const LogoAtlas = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Icon</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td css={tableStyle}>
              <AtlasLogo appearance="brand" />
            </td>
            <td>
              <AtlasIcon appearance="brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogoAtlas;
