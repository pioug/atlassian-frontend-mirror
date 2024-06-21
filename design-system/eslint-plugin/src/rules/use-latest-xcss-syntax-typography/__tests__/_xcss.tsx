import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';
import { error } from '../index';

const valid: string[] = [
	outdent`
    // ignores valid styles
    import { xcss } from '@atlaskit/primitives';

    const containerStyles = xcss({
      display: 'block',
      width: '8px',
    });
  `,
];

const invalid = [
	{
		code: outdent`
    // it raises a violation for xcss call with typography properties using identifier syntax
    import { xcss } from '@atlaskit/primitives';

    const paddingStyles = xcss({ fontWeight: '12 / 8' });
  `,
		errors: [error],
	},
	{
		code: outdent`
      // it raises a violation for xcss call with typography properties using literal syntax with camel case
      import { xcss } from '@atlaskit/primitives';

      const paddingStyles = xcss({ 'lineHeight': '12 / 8' });
    `,
		errors: [error],
	},
	{
		code: outdent`
      // it raises a violation for xcss call with nested typography properties
      import { xcss } from '@atlaskit/primitives';

      const paddingStyles = xcss({ padding: 'space.100', ':hover': { lineHeight: '12 / 8' } });
    `,
		errors: [error],
	},
];

export const tests: Tests = {
	valid,
	invalid,
};
