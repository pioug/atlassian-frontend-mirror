import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('test no-sparse-checkout rule', () => {
	tester.run('no-sparse-checkout', rule, {
		valid: [
			{
				code: `
					const config = {
						clone: alias.afmClone({ sparseCheckout: false })
					};
				`,
				filename: 'hello/foo.ts',
			},
			{
				code: `
					const config = {
						clone: alias.afmClone({ cloneDepth: 1})
					};
				`,
				filename: 'hello/foo.ts',
			},
		],
		invalid: [
			{
				code: `
					const config = {
						clone: alias.afmClone({ sparseCheckout: true })
					};
				`,
				filename: 'hello/foo.ts',
				errors: [{ messageId: 'noSparseCheckout' }],
			},
			{
				code: `
					const config = {
						clone: alias.afmClone({ 
							cloneDepth: 'full',
							sparseCheckout: true 
						})
					};
				`,
				filename: 'hello/foo.ts',
				errors: [{ messageId: 'noSparseCheckout' }],
			},
		],
	});
});
