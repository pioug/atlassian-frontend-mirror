import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('ensure-use-sync-external-store-server-snapshot', () => {
	tester.run('ensure-use-sync-external-store-server-snapshot', rule, {
		valid: [
			{
				code: `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);`,
			},
			{
				code: `useSyncExternalStore(subscribe, getSnapshot, getSnapshot);`,
			},
			{
				code: `useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);`,
			},
			{
				code: `useSyncExternalStore(
					subscribe,
					getSnapshot,
					() => null,
				);`,
			},
			{
				code: `React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);`,
			},
			{
				code: `someOtherFunction(a, b);`,
			},
			{
				code: `useSomethingElse(subscribe, getSnapshot);`,
			},
		],
		invalid: [
			{
				code: `useSyncExternalStore(subscribe, getSnapshot);`,
				errors: [
					{
						messageId: 'missingServerSnapshot',
					},
				],
			},
			{
				code: `useSyncExternalStore(subscribe);`,
				errors: [
					{
						messageId: 'missingServerSnapshot',
					},
				],
			},
			{
				code: `useSyncExternalStore();`,
				errors: [
					{
						messageId: 'missingServerSnapshot',
					},
				],
			},
			{
				code: `React.useSyncExternalStore(subscribe, getSnapshot);`,
				errors: [
					{
						messageId: 'missingServerSnapshot',
					},
				],
			},
			{
				code: `const value = useSyncExternalStore(
					store.subscribe,
					store.getSnapshot,
				);`,
				errors: [
					{
						messageId: 'missingServerSnapshot',
					},
				],
			},
		],
	});
});
