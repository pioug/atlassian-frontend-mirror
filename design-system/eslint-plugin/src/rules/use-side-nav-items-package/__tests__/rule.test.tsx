// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import { tests as sideNavItems } from './_side-nav-items';

ruleTester.run('use-side-nav-items-package', rule, {
	valid: [...sideNavItems.valid],
	invalid: [...sideNavItems.invalid],
});
