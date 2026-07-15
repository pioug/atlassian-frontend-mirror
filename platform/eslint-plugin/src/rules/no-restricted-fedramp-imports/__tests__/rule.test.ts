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
			name: 'allows default import from @atlassian/atl-context',
			code: outdent`
				import atlContext from '@atlassian/atl-context';
			`,
		},
		{
			name: 'allows unrelated imports from @atlaskit/atlassian-context/cloud-provider',
			code: outdent`
				import { someOtherFunction } from '@atlaskit/atlassian-context/cloud-provider';
			`,
		},
		{
			name: 'allows unrelated imports from @atlaskit/atlassian-context/is-fedramp',
			code: outdent`
				import { someOtherFunction } from '@atlaskit/atlassian-context/is-fedramp';
			`,
		},
		{
			name: 'allows unrelated imports from @atlaskit/atlassian-context/is-isolated-cloud',
			code: outdent`
				import { someOtherFunction } from '@atlaskit/atlassian-context/is-isolated-cloud';
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
		{
			name: 'disallows isGoogleCloudPlatform from @atlaskit/atlassian-context',
			code: outdent`
				import { isGoogleCloudPlatform } from '@atlaskit/atlassian-context';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isGoogleCloudPlatform', source: '@atlaskit/atlassian-context' },
				},
			],
		},
		{
			name: 'disallows isGoogleCloudPlatform from @atlaskit/atlassian-context/cloud-provider',
			code: outdent`
				import { isGoogleCloudPlatform } from '@atlaskit/atlassian-context/cloud-provider';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: {
						name: 'isGoogleCloudPlatform',
						source: '@atlaskit/atlassian-context/cloud-provider',
					},
				},
			],
		},
		{
			name: 'disallows isGoogleCloudPlatform mixed with allowed imports from @atlaskit/atlassian-context',
			code: outdent`
				import { isGoogleCloudPlatform, getATLContextDomain } from '@atlaskit/atlassian-context';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isGoogleCloudPlatform', source: '@atlaskit/atlassian-context' },
				},
			],
		},
		{
			name: 'disallows isFedRamp from @atlaskit/atlassian-context/is-fedramp',
			code: outdent`
				import { isFedRamp } from '@atlaskit/atlassian-context/is-fedramp';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: { name: 'isFedRamp', source: '@atlaskit/atlassian-context/is-fedramp' },
				},
			],
		},
		{
			name: 'disallows isIsolatedCloud from @atlaskit/atlassian-context/is-isolated-cloud',
			code: outdent`
				import { isIsolatedCloud } from '@atlaskit/atlassian-context/is-isolated-cloud';
			`,
			errors: [
				{
					messageId: 'noRestrictedFedrampImports',
					data: {
						name: 'isIsolatedCloud',
						source: '@atlaskit/atlassian-context/is-isolated-cloud',
					},
				},
			],
		},
	],
});
