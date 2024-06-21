// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import { tests as xcss } from './_xcss';

ruleTester.run('use-latest-xcss-syntax-typography', rule, {
	valid: xcss.valid,
	invalid: xcss.invalid,
});
