import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('no-invalid-storybook-decorator-usage tests', () => {
	tester.run('no-invalid-storybook-decorator-usage', rule, {
		valid: [
			{
				code: `withPlatformFeatureGates({})(<SampleComponent/>)`,
			},
		],
		invalid: [
			{
				code: `const flags = {'uip.sample.color': true}; withPlatformFeatureGates(flags)(<SampleComponent/>)`,
				errors: [{ messageId: 'onlyObjectExpression' }],
			},
		],
	});
});
