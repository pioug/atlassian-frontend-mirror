import { outdent } from 'outdent';

import { tester } from '../../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-restricted-fedramp-imports', rule, {
	valid: [
		{
			name: 'allows isFedrampModerate from @atlaskit/atlassian-context',
			code: outdent`
				import { isFedrampModerate } from '@atlaskit/atlassian-context';
			`,
		},
		{
			name: 'allows isFedrampModerate from @atlassian/atl-context',
			code: outdent`
				import { isFedrampModerate } from '@atlassian/atl-context';
			`,
		},
		{
			name: 'allows unrelated imports from @atlassian/atl-context',
			code: outdent`
				import { getATLContextDomain } from '@atlassian/atl-context';
			`,
		},
		{
			name: 'allows unrelated imports from @atlassian/teams-common',
			code: outdent`
				import { someOtherFunction } from '@atlassian/teams-common';
			`,
		},
		{
			name: 'allows default import from @atlassian/atl-context',
			code: outdent`
				import atlContext from '@atlassian/atl-context';
			`,
		},
	],
	invalid: [
		{
			name: 'disallows isFedRamp from @atlassian/atl-context',
			code: outdent`
				import { isFedRamp } from '@atlassian/atl-context';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isFedRamp', source: '@atlassian/atl-context' },
				},
			],
		},
		{
			name: 'disallows isIsolatedCloud from @atlassian/atl-context',
			code: outdent`
				import { isIsolatedCloud } from '@atlassian/atl-context';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isIsolatedCloud', source: '@atlassian/atl-context' },
				},
			],
		},
		{
			name: 'disallows isFedRamp and isIsolatedCloud together from @atlassian/atl-context',
			code: outdent`
				import { isFedRamp, isIsolatedCloud } from '@atlassian/atl-context';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isFedRamp', source: '@atlassian/atl-context' },
				},
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isIsolatedCloud', source: '@atlassian/atl-context' },
				},
			],
		},
		{
			name: 'disallows isFedRamp from @atlaskit/atlassian-context',
			code: outdent`
				import { isFedRamp } from '@atlaskit/atlassian-context';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isFedRamp', source: '@atlaskit/atlassian-context' },
				},
			],
		},
		{
			name: 'disallows isIsolatedCloud from @atlaskit/atlassian-context',
			code: outdent`
				import { isIsolatedCloud } from '@atlaskit/atlassian-context';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isIsolatedCloud', source: '@atlaskit/atlassian-context' },
				},
			],
		},
		{
			name: 'disallows isFedramp from @atlassian/teams-common',
			code: outdent`
				import { isFedramp } from '@atlassian/teams-common';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isFedramp', source: '@atlassian/teams-common' },
				},
			],
		},
		{
			name: 'disallows isFedRamp mixed with allowed imports from @atlassian/atl-context',
			code: outdent`
				import { isFedRamp, getATLContextDomain } from '@atlassian/atl-context';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isFedRamp', source: '@atlassian/atl-context' },
				},
			],
		},
	],
});
