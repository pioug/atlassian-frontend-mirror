import React from 'react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';
import Arrow from '@atlaskit/icon/glyph/arrow-right';
import Lozenge from '@atlaskit/lozenge';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

const jiraItemStyles: React.CSSProperties = {
  width: 105,
};

export default () => (
  <DropdownMenu defaultOpen trigger="To do">
    <DropdownItemGroup>
      <DropdownItem
        elemAfter={
          <Box alignItems="center" UNSAFE_style={jiraItemStyles}>
            <Arrow label="" size="small" />
            <Lozenge appearance="inprogress">in progress</Lozenge>
          </Box>
        }
      >
        Status project
      </DropdownItem>
      <DropdownItem
        elemAfter={
          <Box alignItems="center" UNSAFE_style={jiraItemStyles}>
            <Arrow label="" size="small" />
            <Lozenge appearance="success">Done</Lozenge>
          </Box>
        }
      >
        Move to done
      </DropdownItem>
      <DropdownItem>View workflow</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
