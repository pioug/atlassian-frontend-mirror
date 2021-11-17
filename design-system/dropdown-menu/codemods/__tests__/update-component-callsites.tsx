// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import {
  updateDropdownItemGroupCheckboxCallsite,
  updateDropdownItemGroupRadioCallsite,
} from '../migrates/update-component-callsites';

const transformDropdownItemGroupRadio = createTransformer([
  updateDropdownItemGroupRadioCallsite,
]);
const transformDropdownItemGroupCheckbox = createTransformer([
  updateDropdownItemGroupCheckboxCallsite,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('DropdownItemGroupRadio', () => {
  defineInlineTest(
    { default: transformDropdownItemGroupRadio, parser: 'tsx' },
    {},
    `
    <DropdownItemGroupRadio id="actions">
      <DropdownItemRadio id="edit" defaultSelected>
        Edit
      </DropdownItemRadio>
      <DropdownItemRadio id="move">Move</DropdownItemRadio>
    </DropdownItemGroupRadio>
    `,
    `
    <DropdownItemRadioGroup id="actions">
      <DropdownItemRadio id="edit" defaultSelected>
        Edit
      </DropdownItemRadio>
      <DropdownItemRadio id="move">Move</DropdownItemRadio>
    </DropdownItemRadioGroup>
    `,
    'should transform DropdownItemGroupRadio to DropdownItemRadioGroup',
  );
});

describe('DropdownItemGroupCheckbox', () => {
  defineInlineTest(
    { default: transformDropdownItemGroupCheckbox, parser: 'tsx' },
    {},
    `
    <DropdownItemGroupCheckbox id="actions">
      <DropdownItemCheckbox id="edit" defaultSelected>
        Edit
      </DropdownItemCheckbox>
      <DropdownItemCheckbox id="move">Move</DropdownItemCheckbox>
    </DropdownItemGroupCheckbox>
    `,
    `
    <DropdownItemCheckboxGroup id="actions">
      <DropdownItemCheckbox id="edit" defaultSelected>
        Edit
      </DropdownItemCheckbox>
      <DropdownItemCheckbox id="move">Move</DropdownItemCheckbox>
    </DropdownItemCheckboxGroup>
    `,
    'should transform DropdownItemGroupCheckbox to DropdownItemCheckboxGroup',
  );
});
