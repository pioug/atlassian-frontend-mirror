import React from 'react';

import CheckIcon from '@atlaskit/icon/glyph/check';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
  <div onClick={(e) => e.preventDefault()}>
    <DropdownMenu trigger="Filter cities" triggerType="button">
      <DropdownItemGroup>
        <DropdownItem isHidden>Not visible</DropdownItem>
        <DropdownItem>Adelaide</DropdownItem>
        <DropdownItem href="/hello-there" title="A place west of Sydney">
          Perth
        </DropdownItem>
        <DropdownItem description="It's a popular destination in Australia">
          Melbourne
        </DropdownItem>
        <DropdownItem
          target="_blank"
          href="http://atlassian.com"
          description="Opens in a new window"
        >
          Darwin
        </DropdownItem>
        <DropdownItem
          shouldAllowMultiline
          description="Sydney, capital of New South Wales and one of Australia's largest cities, is best known for its harbourfront Sydney Opera House, with a distinctive sail-like design. Massive Darling Harbour and the smaller Circular Quay port are hubs of waterside life, with the arched Harbour Bridge and esteemed Royal Botanic Garden nearby. Sydney Tower’s outdoor platform, the Skywalk, offers 360-degree views of the city and suburbs."
        >
          Sydney, capital of New South Wales and one of Australia's largest
          cities.
        </DropdownItem>
        <DropdownItem elemAfter={<CheckIcon label="" />}>Canberra</DropdownItem>
        <DropdownItem elemBefore={<CheckIcon label="" />}>Hobart</DropdownItem>
        <DropdownItem
          elemBefore={<CheckIcon label="" />}
          elemAfter={<CheckIcon label="" />}
        >
          Gold Coast
        </DropdownItem>
        <DropdownItem isSelected>Newcastle</DropdownItem>
        <DropdownItem isDisabled>Cairns</DropdownItem>
        <DropdownItem isCompact>Brisbane</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  </div>
);
