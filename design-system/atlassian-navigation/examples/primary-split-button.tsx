import React, { type Ref } from 'react';

import {
  UNSAFE_BUTTON as Button,
  UNSAFE_ICON_BUTTON as IconButton,
} from '@atlaskit/button/unsafe';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

import {
  AtlassianNavigation,
  PrimaryButton,
  PrimaryDropdownButton,
  PrimarySplitButton,
} from '../src';

export default () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={() => null}
    primaryItems={[
      <PrimaryDropdownButton isHighlighted>Services</PrimaryDropdownButton>,
      <PrimaryButton>What's next</PrimaryButton>,
      <PrimarySplitButton isHighlighted>
        <Button>Explore</Button>
        <DropdownMenu
          trigger={({ triggerRef, ...triggerProps }) => (
            <IconButton
              ref={triggerRef as Ref<HTMLButtonElement>}
              {...triggerProps}
              icon={<ChevronDownIcon label="Open link issue options" />}
            >
              ''
            </IconButton>
          )}
        >
          <DropdownItemGroup>
            <DropdownItem>Option one</DropdownItem>
            <DropdownItem>Option two</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      </PrimarySplitButton>,
      <PrimaryDropdownButton>Issues</PrimaryDropdownButton>,
      <PrimarySplitButton>
        <Button>Open something</Button>
        <DropdownMenu
          trigger={({ triggerRef, ...triggerProps }) => (
            <IconButton
              ref={triggerRef as Ref<HTMLButtonElement>}
              {...triggerProps}
              icon={
                <ChevronDownIcon label="Select what sort of something to open" />
              }
            >
              ''
            </IconButton>
          )}
        >
          <DropdownItemGroup>
            <DropdownItem>Option one</DropdownItem>
            <DropdownItem>Option two</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      </PrimarySplitButton>,
    ]}
  />
);
