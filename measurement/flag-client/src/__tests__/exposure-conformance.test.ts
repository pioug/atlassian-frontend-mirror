/**
 * @jest-environment node
 */

/**
 * Conformance adapter for the shared exposure fixtures in `sdks/exposure-test-vectors/`.
 *
 * The fixtures are server-producer records, so the browser profile compares only what it derives
 * from equivalent inputs. Resource, Instrumentation Scope, trace context, source, and SDK metadata
 * are producer facts this profile defines differently; the source is asserted against the browser
 * profile instead. The browser profile also spells the client-generated reason `not_initialized`,
 * and accepts either spelling in the fixtures, so the server spelling can change without breaking
 * this adapter.
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { NO_COMPLETED_ATTEMPT, resolveExposureIdentity } from '../exposure/attribution';
import { mapExposureRecord } from '../exposure/mapper';
import type { OtlpKeyValue, OtlpLogRecord } from '../exposure/otlp';
import type { FlagContextValue, FlagResult, HoldoutAllocationMetadata } from '../types';
import {
	detailsFor,
	fallbackDetails,
	IDENTITY,
	INITIALIZED,
	plainAttributes,
	user,
	type PlainValue,
} from './_utils/exposure-test-helper';

/**
 * Vendored copy of `sdks/exposure-test-vectors/` (JSON files only) from the
 * feature-flag-platform repository, shared with the server SDKs.
 */
const VECTORS = join(__dirname, '__fixtures__', 'exposure-test-vectors');
const NOT_COMPARED = new Set(['atl.feature_flag.result.source', 'atl.feature_flag.sdk_metadata']);
const NOT_INITIALIZED_SPELLINGS = new Set(['not_initialised', 'not_initialized']);
const BROWSER_NOT_INITIALIZED = 'not_initialized';

interface ParityCase {
	readonly caseId: string;
	readonly input: {
		readonly reason: string;
		readonly variant: string | null;
		readonly token: string | null;
		readonly updatedAt: string | null;
	};
	readonly expected: Record<string, PlainValue>;
	readonly omitted: readonly string[];
}

interface HoldoutCase {
	readonly caseId: string;
	readonly allocation: HoldoutAllocationMetadata | null;
	readonly counterfactual: boolean;
	readonly expected: Record<string, PlainValue>;
}

interface WholeRecordFixture {
	readonly caseId: string;
	readonly exposure: {
		readonly resourceLogs: readonly {
			readonly scopeLogs: readonly {
				readonly logRecords: readonly (OtlpLogRecord & { readonly traceId?: string })[];
			}[];
		}[];
	} | null;
}

function readJson<T>(relativePath: string): T {
	return JSON.parse(readFileSync(join(VECTORS, relativePath), 'utf8')) as T;
}

const parityCases = readJson<{ cases: ParityCase[] }>('ordinary/parity.json').cases;
const holdoutCases = readJson<{ cases: HoldoutCase[] }>('ordinary/holdout-allocations.json').cases;

const wholeRecordFixtures = readdirSync(VECTORS)
	.filter((name) => name.endsWith('.json'))
	.sort()
	.flatMap((name) => {
		// A suppressed read has no exposure; the client-level suppression tests cover it.
		const fixture = readJson<WholeRecordFixture>(name);
		return (fixture.exposure?.resourceLogs ?? []).flatMap((resourceLogs) =>
			resourceLogs.scopeLogs.flatMap((scopeLogs) =>
				scopeLogs.logRecords.map((logRecord) => ({ name, logRecord })),
			),
		);
	});

describe('ordinary exposure parity', () => {
	describe.each([false, true])('manual = %s', (manual) => {
		it.each(parityCases)('$caseId', (parityCase) => {
			const { variant, token, updatedAt } = parityCase.input;
			const notInitialized = NOT_INITIALIZED_SPELLINGS.has(parityCase.input.reason);
			const reason = notInitialized ? BROWSER_NOT_INITIALIZED : parityCase.input.reason;
			const result: FlagResult | null =
				variant === null
					? null
					: {
							returnType: 'BOOLEAN',
							value: true,
							useCodeDefault: false,
							metadata: { matchReason: reason, variationId: variant },
						};
			const record = mapExposureRecord({
				details: result === null ? fallbackDetails('flag-a', reason) : detailsFor('flag-a', result),
				flagResult: result,
				user: user(),
				identity: IDENTITY,
				initialization: notInitialized ? NO_COMPLETED_ATTEMPT : INITIALIZED,
				...(token === null
					? {}
					: { clientVersion: updatedAt === null ? { token } : { token, updatedAt } }),
				manual,
				epochMillis: 0,
			});
			const attributes = plainAttributes(record.logRecord.attributes);
			const {
				'atl.feature_flag.result.source': _serverSource,
				'feature_flag.result.reason': _serverReason,
				...expected
			} = parityCase.expected;

			expect(attributes).toMatchObject(expected);
			expect(attributes['feature_flag.result.reason']).toBe(reason);
			expect(attributes['atl.feature_flag.result.source']).toBe(
				notInitialized ? 'fallback' : 'bootstrap',
			);
			expect(attributes['atl.feature_flag.exposure.manual']).toBe(manual);
			for (const key of parityCase.omitted) expect(attributes).not.toHaveProperty(key);
		});
	});
});

describe('holdout allocation parity', () => {
	describe.each([false, true])('manual = %s', (manual) => {
		it.each(holdoutCases)('$caseId', ({ allocation, counterfactual, expected }) => {
			const result: FlagResult = {
				returnType: 'BOOLEAN',
				value: true,
				useCodeDefault: false,
				metadata: {
					matchReason: counterfactual ? 'aa_test_match' : 'ss_cohort_match',
					variationId: 'on',
					holdoutAllocation: allocation,
				},
			};
			const record = mapExposureRecord({
				details: detailsFor('flag-a', result),
				flagResult: result,
				user: user(),
				identity: IDENTITY,
				initialization: INITIALIZED,
				manual,
				epochMillis: 0,
			});
			const holdoutAttributes = Object.fromEntries(
				Object.entries(plainAttributes(record.logRecord.attributes)).filter(([key]) =>
					key.startsWith('atl.feature_flag.holdout_allocation.'),
				),
			);

			// Exact equality also rules out holdout attributes the fixture doesn't expect.
			expect(holdoutAttributes).toEqual(expected);
		});
	});
});

describe('shared whole-record fixtures', () => {
	it('covers every fixture that contains an exposure record', () => {
		expect(wholeRecordFixtures.length).toBeGreaterThan(0);
	});

	it.each(wholeRecordFixtures)('$name', ({ logRecord }) => {
		const expected = plainAttributes(logRecord.attributes);
		const record = mapExposureRecord(inputFromFixture(expected, logRecord.timeUnixNano));

		expect(record.logRecord).toMatchObject({
			timeUnixNano: logRecord.timeUnixNano,
			severityNumber: logRecord.severityNumber,
			severityText: logRecord.severityText,
			eventName: logRecord.eventName,
		});
		expect(record.logRecord).not.toHaveProperty('traceId');
		// An initialized browser client always has a target app, so a fixture without a set ID has no
		// equivalent browser input for it.
		const ignored = 'feature_flag.set.id' in expected ? [] : ['feature_flag.set.id'];
		expect(sortedComparable(record.logRecord.attributes, ignored)).toEqual(
			sortedComparable(logRecord.attributes, ignored),
		);
		expect(plainAttributes(record.logRecord.attributes)['atl.feature_flag.result.source']).toBe(
			'bootstrap',
		);
	});
});

/** Rebuild the browser inputs that correspond to a server fixture record's attributes. */
function inputFromFixture(attributes: Record<string, PlainValue>, timeUnixNano: string) {
	const text = (key: string): string | undefined => {
		const value = attributes[key];
		return typeof value === 'string' ? value : undefined;
	};
	const variationId = text('feature_flag.result.variant') ?? null;
	const ruleId = text('atl.feature_flag.rule_id');
	const targetApps = attributes['atl.feature_flag.target_apps'];
	const flagVersion = text('feature_flag.version');
	const errorMessage = text('feature_flag.error.message');
	const result: FlagResult = {
		returnType: 'BOOLEAN',
		value: true,
		useCodeDefault: false,
		metadata: {
			matchReason: text('feature_flag.result.reason') ?? '',
			variationId,
			ruleId: ruleId ?? null,
			...(Array.isArray(targetApps) ? { targetApps: targetApps.filter(isString) } : {}),
			...(flagVersion === undefined ? {} : { flagVersion }),
			...(errorMessage === undefined ? {} : { errorMessage }),
		},
	};
	const token = text('atl.feature_flag.client.version.token');
	const updatedAt = text('atl.feature_flag.client.version.updated_at');
	const identifiers: Record<string, string> = {};
	const contextAttributes: Record<string, FlagContextValue> = {};
	for (const [key, value] of Object.entries(attributes)) {
		if (key.startsWith('atl.identifiers.') && typeof value === 'string') {
			identifiers[key.slice('atl.identifiers.'.length)] = value;
		} else if (key.startsWith('atl.attributes.') && !Array.isArray(value)) {
			contextAttributes[key.slice('atl.attributes.'.length)] = value as FlagContextValue;
		}
	}
	const targetApp = text('feature_flag.set.id');

	return {
		details: detailsFor(text('feature_flag.key') ?? '', result),
		flagResult: result,
		user: user(identifiers, contextAttributes),
		identity:
			targetApp === undefined
				? IDENTITY
				: resolveExposureIdentity({ targetApp, environmentType: 'prod' }),
		initialization: INITIALIZED,
		...(token === undefined
			? {}
			: { clientVersion: updatedAt === undefined ? { token } : { token, updatedAt } }),
		manual: attributes['atl.feature_flag.exposure.manual'] === true,
		epochMillis: Number(BigInt(timeUnixNano) / BigInt(1_000_000)),
	};
}

function sortedComparable(
	attributes: readonly OtlpKeyValue[],
	ignored: readonly string[],
): [string, unknown][] {
	return attributes
		.filter(({ key }) => !NOT_COMPARED.has(key) && !ignored.includes(key))
		.map(({ key, value }): [string, unknown] => [key, value])
		.sort(([left], [right]) => left.localeCompare(right));
}

function isString(value: PlainValue): value is string {
	return typeof value === 'string';
}
