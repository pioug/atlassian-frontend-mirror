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
      DropdownItemGroupCheckbox as MyComponent, DropdownItemCheckbox,
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
        shouldAllowMultiline>
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu, {
      DropdownItemCheckboxGroup as MyComponent, DropdownItemCheckbox,
    } from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu
        trigger="Click to open"
        placement="bottom-start"
        shouldTitleWrap
        shouldDescriptionWrap>
      </DropdownMenu>
    );
    `,
    'should not change anything when items is not used ',
  );
});
