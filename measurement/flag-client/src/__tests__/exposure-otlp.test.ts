/**
 * @jest-environment node
 */

import type { ResourceIdentity } from '../exposure/attribution';
import {
	encodeExportLogsRequest,
	numberValue,
	unixNanoFromMillis,
	type ExposureRecord,
	type OtlpKeyValue,
	type QueuedRecord,
} from '../exposure/otlp';
import { PACKAGE_NAME } from '../version';

function record(
	resource: string | ResourceIdentity,
	scopeVersion: string,
	flagKey: string,
): ExposureRecord {
	return {
		resource: typeof resource === 'string' ? { serviceName: resource } : resource,
		scopeVersion,
		logRecord: {
			timeUnixNano: '1',
			severityNumber: 1,
			severityText: 'TRACE',
			eventName: 'flag-evaluated',
			attributes: [{ key: 'feature_flag.key', value: { stringValue: flagKey } }],
		},
	};
}

const flagKeys = (logRecords: readonly QueuedRecord['logRecord'][]): unknown[] =>
	logRecords.map((logRecord) => (logRecord.attributes as readonly OtlpKeyValue[])[0]?.value);

describe('encodeExportLogsRequest', () => {
	it('groups records by service name, then scope version, preserving order', () => {
		const request = encodeExportLogsRequest([
			record('jira-frontend', '0.1.0', 'a'),
			record('$all', '0.1.0', 'b'),
			record('jira-frontend', '0.0.9', 'c'),
			record('jira-frontend', '0.1.0', 'd'),
		]);

		expect(request.resourceLogs).toHaveLength(2);
		const [jira, all] = request.resourceLogs;
		expect(jira?.resource.attributes).toEqual([
			{ key: 'service.name', value: { stringValue: 'jira-frontend' } },
		]);
		expect(all?.resource.attributes).toEqual([
			{ key: 'service.name', value: { stringValue: '$all' } },
		]);
		expect(jira?.scopeLogs.map((scopeLogs) => scopeLogs.scope.version)).toEqual(['0.1.0', '0.0.9']);
		expect(flagKeys(jira?.scopeLogs[0]?.logRecords ?? [])).toEqual([
			{ stringValue: 'a' },
			{ stringValue: 'd' },
		]);
		expect(flagKeys(all?.scopeLogs[0]?.logRecords ?? [])).toEqual([{ stringValue: 'b' }]);
	});

	it('separates records whose identities differ only in optional members', () => {
		const current: ResourceIdentity = {
			serviceName: 'jira-frontend',
			environmentType: 'staging',
			serviceVersion: '1.2.3',
		};
		const reclaimed: ResourceIdentity = { ...current, serviceVersion: '1.2.2' };
		const request = encodeExportLogsRequest([
			record(current, '0.1.0', 'a'),
			record(reclaimed, '0.1.0', 'b'),
			record({ ...current }, '0.1.0', 'c'),
		]);

		expect(request.resourceLogs).toHaveLength(2);
		const [first, second] = request.resourceLogs;
		expect(first?.resource.attributes).toEqual([
			{ key: 'service.name', value: { stringValue: 'jira-frontend' } },
			{ key: 'service.version', value: { stringValue: '1.2.3' } },
			{ key: 'deployment.environment.name', value: { stringValue: 'staging' } },
			{ key: 'deployment.environment_type', value: { stringValue: 'staging' } },
		]);
		expect(flagKeys(first?.scopeLogs[0]?.logRecords ?? [])).toEqual([
			{ stringValue: 'a' },
			{ stringValue: 'c' },
		]);
		expect(second?.resource.attributes).toContainEqual({
			key: 'service.version',
			value: { stringValue: '1.2.2' },
		});
		expect(flagKeys(second?.scopeLogs[0]?.logRecords ?? [])).toEqual([{ stringValue: 'b' }]);
	});

	it('identifies the browser SDK in every scope', () => {
		const [resourceLogs] = encodeExportLogsRequest([
			record('jira-frontend', '0.1.0', 'a'),
		]).resourceLogs;

		expect(resourceLogs?.scopeLogs[0]?.scope).toEqual({
			name: PACKAGE_NAME,
			version: '0.1.0',
			attributes: [
				{ key: 'atl.feature_flag.sdk.platform', value: { stringValue: 'browser' } },
				{ key: 'atl.feature_flag.sdk.type', value: { stringValue: PACKAGE_NAME } },
			],
		});
	});

	it('encodes an empty batch as an empty request', () => {
		expect(encodeExportLogsRequest([])).toEqual({ resourceLogs: [] });
	});
});

describe('OTLP value encoding', () => {
	it.each([
		[0, { intValue: '0' }],
		[-3, { intValue: '-3' }],
		[Number.MAX_SAFE_INTEGER, { intValue: '9007199254740991' }],
		[87.5, { doubleValue: 87.5 }],
		[1e21, { doubleValue: 1e21 }],
	])('encodes %s as %j', (value, expected) => {
		expect(numberValue(value)).toEqual(expected);
	});

	it('converts epoch milliseconds to a nanosecond decimal string', () => {
		expect(unixNanoFromMillis(1_786_964_600_123)).toBe('1786964600123000000');
	});
});
