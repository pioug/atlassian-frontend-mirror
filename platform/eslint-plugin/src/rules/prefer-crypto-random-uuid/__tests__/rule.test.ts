import { outdent } from 'outdent';

import { tester } from '../../../__tests__/utils/_tester';
import rule from '../index';

tester.run('prefer-crypto-random-uuid', rule, {
	valid: [
		{
			name: 'crypto.randomUUID() usage',
			code: outdent`
				const id = crypto.randomUUID();
			`,
		},
		{
			name: 'non-uuid imports',
			code: outdent`
				import { v4 } from 'not-uuid';
				const id = v4();
			`,
		},
		{
			name: 'other uuid-named functions',
			code: outdent`
				function uuid() {
					return 'custom-id';
				}
				const id = uuid();
			`,
		},
	],
	invalid: [
		{
			name: 'import { v4 } from uuid',
			code: outdent`
				import { v4 } from 'uuid';
				const id = v4();
			`,
			output: outdent`

				const id = crypto.randomUUID();
			`,
			errors: [
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
			],
		},
		{
			name: 'import { v4 as uuid } from uuid',
			code: outdent`
				import { v4 as uuid } from 'uuid';
				const id = uuid();
			`,
			output: outdent`

				const id = crypto.randomUUID();
			`,
			errors: [
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
			],
		},
		{
			name: 'import uuid from uuid/v4',
			code: outdent`
				import uuid from 'uuid/v4';
				const id = uuid();
			`,
			output: outdent`

				const id = crypto.randomUUID();
			`,
			errors: [
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
			],
		},
		{
			name: 'import { v1 } from uuid',
			code: outdent`
				import { v1 } from 'uuid';
				const id = v1();
			`,
			output: outdent`

				const id = crypto.randomUUID();
			`,
			errors: [
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
			],
		},
		{
			name: 'import from uuid/v1',
			code: outdent`
				import uuid from 'uuid/v1';
				const id = uuid();
			`,
			output: outdent`

				const id = crypto.randomUUID();
			`,
			errors: [
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
			],
		},
		{
			name: 'multiple usages',
			code: outdent`
				import { v4 } from 'uuid';
				const id1 = v4();
				const id2 = v4();
				const id3 = v4();
			`,
			output: outdent`

				const id1 = crypto.randomUUID();
				const id2 = crypto.randomUUID();
				const id3 = crypto.randomUUID();
			`,
			errors: [
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
			],
		},
		{
			name: 'require uuid/v4 (no autofix for require)',
			code: outdent`
				const uuid = require('uuid/v4');
				const id = uuid();
			`,
			errors: [{ messageId: 'preferCryptoRandomUUID' }],
		},
		{
			name: 'require uuid (no autofix for require)',
			code: outdent`
				const { v4 } = require('uuid');
				const id = v4();
			`,
			errors: [{ messageId: 'preferCryptoRandomUUID' }],
		},
		{
			name: 'complex code with other imports',
			code: outdent`
				import path from 'path';
				import { v4 as uuid } from 'uuid';
				import fs from 'fs';

				function generateFile() {
					const filename = uuid();
					return path.join('/tmp', filename);
				}
			`,
			output: outdent`
				import path from 'path';

				import fs from 'fs';

				function generateFile() {
					const filename = crypto.randomUUID();
					return path.join('/tmp', filename);
				}
			`,
			errors: [
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
			],
		},
		{
			name: 'in arrow function',
			code: outdent`
				import { v4 } from 'uuid';
				const getId = () => v4();
			`,
			output: outdent`

				const getId = () => crypto.randomUUID();
			`,
			errors: [
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
			],
		},
		{
			name: 'in object property',
			code: outdent`
				import { v4 as uuid } from 'uuid';
				const obj = {
					id: uuid(),
					name: 'test'
				};
			`,
			output: outdent`

				const obj = {
					id: crypto.randomUUID(),
					name: 'test'
				};
			`,
			errors: [
				{ messageId: 'preferCryptoRandomUUID' },
				{ messageId: 'preferCryptoRandomUUID' },
			],
		},
	],
});

