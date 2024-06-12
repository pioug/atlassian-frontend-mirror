// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import transformer from '../11.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('apply all needed codemods for version 11.0.0 major bump', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import React from "react";
    import DropdownMenu, {
      DropdownItemGroupCheckbox as MyComponent, DropdownItemCheckbox, DropdownItem, DropdownItemRadio,
    } from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu
        trigger="Click to open"
        triggerType="button"
        items={[]}
        onItemActivated={() => {}}
        onPositioned={() => {}}
        position="bottom left"
        shouldFitContainer={false}
        boundariesElement={document.body}
        isMenuFixed
        shouldAllowMultiline>
        <DropdownItem
            isHidden
            autoFocus
            isCompact
          >Cut</DropdownItem>
        <DropdownItemCheckbox
          isHidden
          autoFocus
          isCompact
        >Copy</DropdownItemCheckbox>
        <DropdownItemRadio
          isHidden
          autoFocus
          isCompact
        >Paste</DropdownItemRadio>
      </DropdownMenu>
    );
    `,
		`
    import React from "react";
    import DropdownMenu, {
      DropdownItemCheckboxGroup as MyComponent, DropdownItemCheckbox, DropdownItem, DropdownItemRadio,
    } from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu
        trigger="Click to open"
        placement="bottom-start"
        shouldTitleWrap
        shouldDescriptionWrap>
        <DropdownItem>Cut</DropdownItem>
        <DropdownItemCheckbox>Copy</DropdownItemCheckbox>
        <DropdownItemRadio>Paste</DropdownItemRadio>
      </DropdownMenu>
    );
    `,
		'should not change anything when items is not used ',
	);
});
