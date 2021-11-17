/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Arrow from '@atlaskit/icon/glyph/arrow-right';
import Lozenge from '@atlaskit/lozenge';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

const jiraItemStyles = css({
  display: 'flex',
  width: 105,
  alignItems: 'center',
});

export default () => (
  <DropdownMenu defaultOpen trigger="To do">
    <DropdownItemGroup>
      <DropdownItem
        elemAfter={
          <div css={jiraItemStyles}>
            <Arrow label="" size="small" />
            <Lozenge appearance="inprogress">in progress</Lozenge>
          </div>
        }
      >
        Status project
      </DropdownItem>
      <DropdownItem
        elemAfter={
          <div css={jiraItemStyles}>
            <Arrow label="" size="small" />
            <Lozenge appearance="success">Done</Lozenge>
          </div>
        }
      >
        Move to done
      </DropdownItem>
      <DropdownItem>View workflow</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
