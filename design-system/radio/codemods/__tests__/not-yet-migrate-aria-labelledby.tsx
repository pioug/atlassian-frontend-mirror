jest.autoMockOff();

import transformer from '../not-yet-migrate-aria-labelledby';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Rename `aria-labelledby` prop to `labelId`', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { Radio } from 'foo';

      const SimpleRadio = () => {
        return <Radio aria-labelledby="large" />;
      }
    `,
		`
      import React from 'react';
      import { Radio } from 'foo';

      const SimpleRadio = () => {
        return <Radio aria-labelledby="large" />;
      }
    `,
		'should do nothing with wrong package',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { Foo } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <Foo aria-labelledby="large" />;
      }
    `,
		`
      import React from 'react';
      import { Foo } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <Foo aria-labelledby="large" />;
      }
    `,
		'should do nothing with wrong import',
	);
	['Radio', 'RadioGroup'].forEach((Component) => {
		defineInlineTest(
			{ default: transformer, parser: 'tsx' },
			{},
			`
      import React from 'react';
      import { ${Component} } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <${Component} aria-labelledby="large" />;
      }
    `,
			`
      import React from 'react';
      import { ${Component} } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <${Component} labelId="large" />;
      }
    `,
			'should rename prop',
		);
		defineInlineTest(
			{ default: transformer, parser: 'tsx' },
			{},
			`
      import React from 'react';
      import { ${Component} } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <${Component} baz="qux" aria-labelledby="large" foo="bar" />;
      }
    `,
			`
      import React from 'react';
      import { ${Component} } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <${Component} baz="qux" labelId="large" foo="bar" />;
      }
    `,
			'should not mess up the other props',
		);
	});
});
