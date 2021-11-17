// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import {
  renameDropdownItemGroupCheckbox,
  renameDropdownItemGroupRadio,
  renameDropdownMenuStateless,
} from '../migrates/rename-imports';

const transformDropdownItemGroupRadio = createTransformer([
  renameDropdownItemGroupRadio,
]);
const transformDropdownItemGroupCheckbox = createTransformer([
  renameDropdownItemGroupCheckbox,
]);
const transformDropdownMenuStateless = createTransformer([
  renameDropdownMenuStateless,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('DropdownItemGroupRadio', () => {
  defineInlineTest(
    { default: transformDropdownItemGroupRadio, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu, {
      DropdownItemGroupRadio,
      DropdownItemRadio,
    } from "@atlaskit/dropdown-menu";
    `,
    `
    import React from "react";
    import DropdownMenu, {
      DropdownItemRadioGroup,
      DropdownItemRadio,
    } from "@atlaskit/dropdown-menu";
    `,
    'should convert DropdownItemGroupRadio to DropdownItemRadioGroup',
  );

  defineInlineTest(
    { default: transformDropdownItemGroupRadio, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu, {
      DropdownItemGroupRadio as MyComponent,
      DropdownItemRadio,
    } from "@atlaskit/dropdown-menu";
    `,
    `
    import React from "react";
    import DropdownMenu, {
      DropdownItemRadioGroup as MyComponent,
      DropdownItemRadio,
    } from "@atlaskit/dropdown-menu";
    `,
    'should convert DropdownItemGroupRadio to DropdownItemRadioGroup and handle aliases',
  );
});

describe('DropdownItemGroupCheckbox', () => {
  defineInlineTest(
    { default: transformDropdownItemGroupCheckbox, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu, {
      DropdownItemGroupCheckbox, DropdownItemCheckbox,
    } from "@atlaskit/dropdown-menu";
    `,
    `
    import React from "react";
    import DropdownMenu, {
      DropdownItemCheckboxGroup, DropdownItemCheckbox,
    } from "@atlaskit/dropdown-menu";
    `,
    'should convert DropdownItemGroupCheckbox to DropdownItemCheckboxGroup',
  );

  defineInlineTest(
    { default: transformDropdownItemGroupCheckbox, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu, {
      DropdownItemGroupCheckbox as MyComponent, DropdownItemCheckbox,
    } from "@atlaskit/dropdown-menu";
    `,
    `
    import React from "react";
    import DropdownMenu, {
      DropdownItemCheckboxGroup as MyComponent, DropdownItemCheckbox,
    } from "@atlaskit/dropdown-menu";
    `,
    'should convert DropdownItemGroupCheckbox to DropdownItemCheckboxGroup and should handle aliases',
  );
});

describe('DropdownMenuStateless', () => {
  defineInlineTest(
    { default: transformDropdownMenuStateless, parser: 'tsx' },
    {},
    `
    import {
      DropdownItemGroupRadio,
      DropdownItemRadio,
      DropdownMenuStateless,
    } from "@atlaskit/dropdown-menu"
    `,
    `
    import DropdownMenuStateless, { DropdownItemGroupRadio, DropdownItemRadio } from "@atlaskit/dropdown-menu";
    `,
    'should promote DropdownMenuStateless to be a default DropdownMenuStateless import',
  );

  defineInlineTest(
    { default: transformDropdownMenuStateless, parser: 'tsx' },
    {},
    `
    import {
      DropdownItemGroupRadio,
      DropdownItemRadio,
      DropdownMenuStateless as MyComponent,
    } from "@atlaskit/dropdown-menu"
    `,
    `
    import MyComponent, { DropdownItemGroupRadio, DropdownItemRadio } from "@atlaskit/dropdown-menu";
    `,
    'should promote DropdownMenuStateless with an alias to be a default import ',
  );
});
