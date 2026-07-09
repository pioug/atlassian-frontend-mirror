import outdent from 'outdent';

import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

const file = (_slug: string, name = 'src/foo.ts') => `/repo/pkg/${name}`;

describe('no-direct-web-storage-usage', () => {
	tester.run('no-direct-web-storage-usage', rule, {
		valid: [
			// ----- Skipped file kinds: tests / examples -----
			{
				name: 'test file in a CSM-owned package: rule self-skips',
				code: `localStorage.setItem('k', 'v');`,
				filename: file('csm-ai', 'src/__tests__/foo.test.ts'),
			},
			{
				name: 'example file in a CSM-owned package: rule self-skips',
				code: `localStorage.setItem('k', 'v');`,
				filename: file('csm-ai', 'examples/basic.tsx'),
			},
			// ----- Allowed providers from @atlassian/browser-storage-controls -----
			{
				name: 'CSM AI team: AtlBrowserStorageLocal static call',
				code: outdent`
					import { AtlBrowserStorageLocal } from '@atlassian/browser-storage-controls/web-storage-service';
					AtlBrowserStorageLocal.setItem('k', 'v');
					AtlBrowserStorageLocal.getItem('k');
					AtlBrowserStorageLocal.removeItem('k');
					AtlBrowserStorageLocal.clear();
					AtlBrowserStorageLocal.key(0);
				`,
				filename: file('csm-ai'),
			},
			{
				name: 'CSM AI Exp team: AtlBrowserStorageSession static call',
				code: outdent`
					import { AtlBrowserStorageSession } from '@atlassian/browser-storage-controls/web-storage-service';
					AtlBrowserStorageSession.setItem('k', 'v');
					AtlBrowserStorageSession.getItem('k');
				`,
				filename: file('csm-ai-exp'),
			},
			{
				name: 'Boysenberry team: AtlBrowserStorage* via bracket notation',
				code: outdent`
					import { AtlBrowserStorageLocal } from '@atlassian/browser-storage-controls/web-storage-service';
					AtlBrowserStorageLocal['setItem']('k', 'v');
					AtlBrowserStorageLocal['getItem']('k');
				`,
				filename: file('boysenberry'),
			},
			{
				name: 'CSM AI team: arrow-function parameter named localStorage is NOT a violation',
				code: outdent`
					const f = (localStorage) => localStorage + 1;
					f(42);
				`,
				filename: file('csm-ai'),
			},
			{
				name: 'CSM AI team: arrow-function parameter named sessionStorage is NOT a violation',
				code: outdent`
					const f = (sessionStorage) => sessionStorage + 1;
					f(42);
				`,
				filename: file('csm-ai'),
			},
			{
				name: 'CSM AI: destructure rename from window.globalThis is NOT flagged (non-idiomatic qualifier)',
				code: `const { localStorage: storage } = window.globalThis;`,
				filename: file('csm-ai'),
			},
			{
				name: 'Dropbears team: AtlBrowserStorage* instantiated then used',
				code: outdent`
					import { AtlBrowserStorageLocal } from '@atlassian/browser-storage-controls/web-storage-service';
					const myStore = new AtlBrowserStorageLocal();
					myStore.setItem('k', 'v');
				`,
				filename: file('dropbears'),
			},
			// ----- Identifiers that happen to share a name -----
			{
				name: 'CSM AI team: unrelated identifier `localStorage` as object property key is ignored',
				code: `const lookup = { localStorage: 1 };`,
				filename: file('csm-ai'),
			},
		],

		invalid: [
			// ----- One test per default-scoped CSM team -----
			{
				name: 'Boysenberry team: localStorage.setItem flagged',
				code: `localStorage.setItem('k', 'v');`,
				filename: file('boysenberry'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'Dropbears team: sessionStorage.getItem flagged',
				code: `const v = sessionStorage.getItem('k');`,
				filename: file('dropbears'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'sessionStorage' },
					},
				],
			},
			{
				name: 'CSM AI team: localStorage.clear flagged',
				code: `localStorage.clear();`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI Exp team: window.localStorage.setItem flagged',
				code: `window.localStorage.setItem('k', 'v');`,
				filename: file('csm-ai-exp'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			// ----- Window / globalThis qualified -----
			{
				name: 'CSM AI: globalThis.sessionStorage.getItem flagged',
				code: `globalThis.sessionStorage.getItem('k');`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'sessionStorage' },
					},
				],
			},
			{
				name: 'CSM AI: globalThis.window.localStorage.setItem flagged',
				code: `globalThis.window.localStorage.setItem('k', 'v');`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			// ----- Property-only access (not a call) -----
			{
				name: 'CSM AI: window.localStorage.length flagged',
				code: `const n = window.localStorage.length;`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: localStorage.length passed as an argument is flagged',
				code: `someFunc(localStorage.length);`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: window.localStorage.length passed as an argument is flagged',
				code: `someFunc(window.localStorage.length);`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: localStorage returned as an arrow-function expression body is flagged',
				code: `const f = () => localStorage;`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: globalThis.window.localStorage assigned to a variable flagged',
				code: `const storage = globalThis.window.localStorage;`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: globalThis.window.localStorage.length flagged (chained property read)',
				code: `const n = globalThis.window.localStorage.length;`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: globalThis.window?.sessionStorage assigned to a variable flagged (optional chain)',
				code: `const storage = globalThis.window?.sessionStorage;`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'sessionStorage' },
					},
				],
			},
			// ----- Bracket notation -----
			{
				name: 'CSM AI: localStorage["length"] flagged',
				code: `const n = localStorage["length"];`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			// ----- Dot-notation non-method property access -----
			{
				name: 'CSM AI: localStorage.length flagged (dot notation)',
				code: `const n = localStorage.length;`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			// ----- Variable assignment / destructuring -----
			{
				name: 'CSM AI: const storage = localStorage flagged',
				code: `const storage = localStorage;`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: destructuring from window flagged twice',
				code: outdent`
					const { localStorage } = window;
					localStorage.getItem('k');
				`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: destructuring rename from window flagged: const { localStorage: storage } = window',
				code: `const { localStorage: storage } = window;`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: destructuring rename from globalThis flagged: const { sessionStorage: s } = globalThis',
				code: `const { sessionStorage: s } = globalThis;`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'sessionStorage' },
					},
				],
			},
			// ----- Passed as a value -----
			{
				name: 'CSM AI: passing localStorage as a function argument flagged',
				code: `someFn(localStorage);`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: returning sessionStorage from a function flagged',
				code: `function f() { return sessionStorage; }`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'sessionStorage' },
					},
				],
			},
			{
				name: 'CSM AI: shorthand destructuring from window flagged: const { localStorage } = window',
				code: `const { localStorage } = window;`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: non-native method on native storage flagged: localStorage.get',
				code: `localStorage.get('k');`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
			{
				name: 'CSM AI: computed dynamic method on native storage flagged: localStorage[dynamicKey]()',
				code: `localStorage[dynamicKey]();`,
				filename: file('csm-ai'),
				errors: [
					{
						messageId: 'noDirectStorageUse',
						data: { name: 'localStorage' },
					},
				],
			},
		],
	});
});
