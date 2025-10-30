// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import { tests as spotlight } from './_spotlight';

ruleTester.run('use-spotlight-package', rule, {
	valid: [...spotlight.valid],
	invalid: [...spotlight.invalid],
});
