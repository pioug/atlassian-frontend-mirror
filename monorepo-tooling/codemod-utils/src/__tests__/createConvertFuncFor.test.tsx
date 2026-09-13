import { createConvertFuncFor, createTransformer } from '../utils';
import { isEmpty } from '../utils/support';

const addIsRemovableFlag = createConvertFuncFor(
	'@atlaskit/tag',
	'removeButtonText',
	'isRemovable',
	(value) => isEmpty(value),
);

const transformer = createTransformer([addIsRemovableFlag]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Update isRemovable prop', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from "react";
      import Tag from "@atlaskit/tag";

      export default () => <Tag text="Removable button"/>;
    `,
		`
      import React from "react";
      import Tag from "@atlaskit/tag";

      export default () => <Tag text="Removable button"/>;
    `,
		'should not add isRemovable flag when no removeButtonText defined',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from "react";
      import Tag from "@atlaskit/tag";

      export default () => <Tag text="Removable button" removeButtonText=""/>;
    `,
		`
      import React from "react";
      import Tag from "@atlaskit/tag";

      export default () => <Tag text="Removable button" removeButtonText=""/>;
    `,
		'should not adding isRemovable flag when removeButtonText has empty text',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from "react";
      import Tag from "@atlaskit/tag";

      export default () => <Tag text="Removable button" removeButtonText="Remove" />;
    `,
		`
      import React from "react";
      import Tag from "@atlaskit/tag";

      export default () => <Tag text="Removable button" isRemovable removeButtonText="Remove" />;
    `,
		'should add isRemovable flag when there is a removeButtonText defined',
	);
});
