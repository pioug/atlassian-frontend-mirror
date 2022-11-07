/** @jsx jsx */

import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

const centeredStyles = css({
  display: 'flex',
  width: '100vw',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
});

export default () => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div css={centeredStyles}>
      <Button
        testId="toggle"
        onClick={() => setLoading((loadingState) => !loadingState)}
      >
        Toggle isLoading
      </Button>
      <DropdownMenu
        trigger="Page actions"
        isOpen
        testId="dropdown"
        isLoading={isLoading}
        placement="bottom-end"
      >
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </div>
  );
};
