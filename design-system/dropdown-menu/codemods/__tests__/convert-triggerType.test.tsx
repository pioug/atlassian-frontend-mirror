// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import convertTriggerType from '../migrates/convert-trigger-type';

const transformer = createTransformer([convertTriggerType]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('update position value', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open">
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open">
      </DropdownMenu>
    );
    `,
    'should not convert when triggerType prop is not provided',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button">
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open">
      </DropdownMenu>
    );
    `,
    'should delete triggerType prop when trigger is a string - type is button',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu 
      trigger={
        <div>
          &lt;button/&gt; trigger
        </div>
      }
      triggerType="button">
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      /* TODO: (from codemod) 
      The usage of the 'trigger', 'triggerType' and 'triggerButtonProps' prop in this component could not be transformed and requires manual intervention.
      Since version 11.0.0, we simplified the API and lean towards to only use 'trigger' prop.
      For more info please reach out to #help-design-system-code. */
      (<DropdownMenu 
      trigger={
        <div>
          &lt;button/&gt; trigger
        </div>
      }
      triggerType="button">
      </DropdownMenu>)
    );
    `,
    'should only add comments triggerType prop when trigger is an object',
  );
});
