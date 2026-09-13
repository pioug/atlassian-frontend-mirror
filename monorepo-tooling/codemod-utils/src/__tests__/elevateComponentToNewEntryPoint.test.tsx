import { createTransformer, elevateComponentToNewEntryPoint } from '../utils';

const elevateInlineEditableTextfield = elevateComponentToNewEntryPoint(
	'@atlaskit/inline-edit',
	'@atlaskit/inline-edit/inline-editable-textfield',
	'InlineEditableTextfield',
);

const transformer = createTransformer([elevateInlineEditableTextfield]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Move component to new entry point', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from "react";
      import { InlineEditableTextfield } from "@atlaskit/inline-edit";

      export default () => <InlineEditableTextfield validate={() => {}} />;
    `,
		`
      import React from "react";
      import InlineEditableTextfield from "@atlaskit/inline-edit/inline-editable-textfield";

      export default () => <InlineEditableTextfield validate={() => {}} />;
    `,
		'should lift up the InlineEditableTextfield to default',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from "react";
      import { InlineEditableTextfield as AKInlineEditableTextfield} from "@atlaskit/inline-edit";

      export default () => <AKInlineEditableTextfield validate={() => {}} />;
    `,
		`
      import React from "react";
      import AKInlineEditableTextfield from "@atlaskit/inline-edit/inline-editable-textfield";

      export default () => <AKInlineEditableTextfield validate={() => {}} />;
    `,
		'should lift up the InlineEditableTextfield to default - alias',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from "react";
      import { InlineEditStateless } from "@atlaskit/inline-edit";

      export default () => <InlineEditStateless validate={() => {}} />;
    `,
		`
      import React from "react";
      import { InlineEditStateless } from "@atlaskit/inline-edit";

      export default () => <InlineEditStateless validate={() => {}} />;
    `,
		'should only lift up InlineEditableTextfield',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from "react";
      import { InlineEditStateless, InlineEditableTextfield } from "@atlaskit/inline-edit";

      export default () => (
        <>
          <InlineEditableTextfield />
          <InlineEditStateless validate={() => {}} />
        </>
      );
    `,
		`
      import React from "react";
      import { InlineEditStateless } from "@atlaskit/inline-edit";
      import InlineEditableTextfield from "@atlaskit/inline-edit/inline-editable-textfield";

      export default () => (
        <>
          <InlineEditableTextfield />
          <InlineEditStateless validate={() => {}} />
        </>
      );
    `,
		'should lift up what needed to',
	);
});
