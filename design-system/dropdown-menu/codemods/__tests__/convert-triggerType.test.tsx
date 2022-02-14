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
      <DropdownMenu
      /* TODO: (from codemod)
      The usage of the 'trigger', 'triggerType' and 'triggerButtonProps' prop in this component could not be transformed and requires manual intervention.
      Since version 11.0.0, we have simplified the API and now only use the 'trigger' prop.
      Please refer to https://hello.atlassian.net/wiki/spaces/DST/pages/1330997516/Dropdown+menu+upgrade+guide for more details.
      And feel free to reach out to us on our support channel if you have more queries – #help-design-system. */
      trigger={
        <div>
          &lt;button/&gt; trigger
        </div>
      }
      triggerType="button">
      </DropdownMenu>
    );
    `,
    'should only add comments triggerType prop when trigger is an object',
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
      }>
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu
      /* TODO: (from codemod)
      The usage of the 'trigger', 'triggerType' and 'triggerButtonProps' prop in this component could not be transformed and requires manual intervention.
      Since version 11.0.0, we have simplified the API and now only use the 'trigger' prop.
      Please refer to https://hello.atlassian.net/wiki/spaces/DST/pages/1330997516/Dropdown+menu+upgrade+guide for more details.
      And feel free to reach out to us on our support channel if you have more queries – #help-design-system. */
      trigger={
        <div>
          &lt;button/&gt; trigger
        </div>
      }>
      </DropdownMenu>
    );
    `,
    'should only add comments triggerType prop when trigger is an object',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenuWrapper>
        <DropdownMenu
        trigger={
          <div>
            &lt;button/&gt; trigger
          </div>
        }>
        </DropdownMenu>
      </DropdownMenuWrapper>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenuWrapper>
        <DropdownMenu
        /* TODO: (from codemod)
        The usage of the 'trigger', 'triggerType' and 'triggerButtonProps' prop in this component could not be transformed and requires manual intervention.
        Since version 11.0.0, we have simplified the API and now only use the 'trigger' prop.
        Please refer to https://hello.atlassian.net/wiki/spaces/DST/pages/1330997516/Dropdown+menu+upgrade+guide for more details.
        And feel free to reach out to us on our support channel if you have more queries – #help-design-system. */
        trigger={
          <div>
            &lt;button/&gt; trigger
          </div>
        }>
        </DropdownMenu>
      </DropdownMenuWrapper>
    );
    `,
    'should only add comments that do not appear on the DOM',
  );
});
