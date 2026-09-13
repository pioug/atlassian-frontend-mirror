import { createTransformer, replaceImportStatementFor } from '../utils';

const convertMap = {
	Button: '@atlaskit/button/standard-button',
	LoadingButton: '@atlaskit/button/loading-button',
	ButtonTypes: '@atlaskit/button/types',
	default: '@atlaskit/button/standard-button',
	'*': '@atlaskit/button',
};

const replaceImportStatement = replaceImportStatementFor('@atlaskit/button', convertMap);

const transformer = createTransformer([replaceImportStatement]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Update entry point for importing', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from "react";
      import Button, { ButtonTypes } from "@atlaskit/button";

      export default () => <Button text="Removable button"/>;
    `,
		`
      import React from "react";
      import Button from "@atlaskit/button/standard-button";
      import ButtonTypes from "@atlaskit/button/types";

      export default () => <Button text="Removable button"/>;
    `,
		'should change entry point for importing with multiple import entities',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from "react";
      import Button, { LoadingButton, ButtonTypes } from "@atlaskit/button";

      export default () => (
        <>
          <LoadingButton text="submit" />
          <Button text="Removable button"/>
        </>
      );
    `,
		`
      import React from "react";
      import Button from "@atlaskit/button/standard-button";
      import LoadingButton from "@atlaskit/button/loading-button";
      import ButtonTypes from "@atlaskit/button/types";

      export default () => (
        <>
          <LoadingButton text="submit" />
          <Button text="Removable button"/>
        </>
      );
    `,
		'should change entry point for importing with multiple import entities',
	);
});
