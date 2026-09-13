import { createRenameFuncFor, createTransformer } from '../utils';

const renameDefaultChecked = createRenameFuncFor(
	'@atlaskit/toggle',
	'isDefaultChecked',
	'defaultChecked',
);

const transformer = createTransformer([renameDefaultChecked]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Update isDefaultChecked prop', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import React from "react";
    import { X as Toggle } from "x";
    () => {
      return (
        <div>
          <Toggle isDefaultChecked={true} />
        </div>
      );
    };
    `,
		`
    import React from "react";
    import { X as Toggle } from "x";
    () => {
      return (
        <div>
          <Toggle isDefaultChecked={true} />
        </div>
      );
    };
    `,
		'should not transform if imports are not present',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import React from "react";
    import Toggle from "@atlaskit/toggle";
    () => {
      return (
        <div>
          <Toggle isDefaultChecked={true} />
        </div>
      );
    };
    `,
		`
    import React from "react";
    import Toggle from "@atlaskit/toggle";
    () => {
      return (
        <div>
          <Toggle defaultChecked={true} />
        </div>
      );
    };
    `,
		'transforms `isDefaultChecked` to `defaultChecked` when `@atlaskit/toggle` is imported',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import React from "react";
    import Toggle from "@atlaskit/toggle";
    () => {
      return (
        <div>
          <Toggle isDefaultChecked={false} />
        </div>
      );
    };
    `,
		`
    import React from "react";
    import Toggle from "@atlaskit/toggle";
    () => {
      return (
        <div>
          <Toggle defaultChecked={false} />
        </div>
      );
    };
    `,
		'transforms `isDefaultChecked` to `defaultChecked` when `@atlaskit/toggle` is imported - without changing the value',
	);
});
