jest.autoMockOff();

import transformer from '../15.0.0-size-removal';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Remove size prop', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import Checkbox from '@atlaskit/checkbox';

      const SimpleCheckbox = () => {
        return <Checkbox size="large" />;
      }
    `,
		`
      import React from 'react';
      import Checkbox from '@atlaskit/checkbox';

      const SimpleCheckbox = () => {
        return <Checkbox />;
      }
    `,
		'should remove size prop from default import',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { Checkbox } from '@atlaskit/checkbox';

      const SimpleCheckbox = () => {
        return <Checkbox size="large" />;
      }
    `,
		`
      import React from 'react';
      import { Checkbox } from '@atlaskit/checkbox';

      const SimpleCheckbox = () => {
        return <Checkbox />;
      }
    `,
		'should remove size prop from named import',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { Checkbox } from '@foo/bar';

      const SimpleCheckbox = () => {
        return <Checkbox size="large" />;
      }
    `,
		`
      import React from 'react';
      import { Checkbox } from '@foo/bar';

      const SimpleCheckbox = () => {
        return <Checkbox size="large" />;
      }
    `,
		'should do nothing if not correct import',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { Checkbox as AkCheckbox } from '@atlaskit/checkbox';

      const SimpleCheckbox = () => {
        return <AkCheckbox size="large" />;
      }
    `,
		`
      import React from 'react';
      import { Checkbox as AkCheckbox } from '@atlaskit/checkbox';

      const SimpleCheckbox = () => {
        return <AkCheckbox />;
      }
    `,
		'should remove size prop with aliased import',
	);
});
