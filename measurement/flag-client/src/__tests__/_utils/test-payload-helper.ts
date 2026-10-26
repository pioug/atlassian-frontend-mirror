import { FlagClient } from '../../client';
import type {
	BulkEvaluationPayload,
	FlagClientOptions,
	FlagContextValue,
	FlagResult,
	FlagUser,
} from '../../types';
import bulkEvaluationFixturesJson from '../__fixtures__/bulk-evaluation-fixtures.json';

export const TEST_CLIENT_OPTIONS: FlagClientOptions = {
	targetApp: 'jira-frontend',
	environmentType: 'dev',
};

const bulkEvaluationFixtures = loadBulkEvaluationFixtures();

/** A user whose identifiers default to `AtlassianAccountId = "abc"`. */
export function testUser(
	identifiers: Record<string, string> = { AtlassianAccountId: 'abc' },
	attributes?: Record<string, FlagContextValue>,
): FlagUser {
	return attributes === undefined ? { identifiers } : { identifiers, attributes };
}

/**
 * A flag-map payload with the supported schema version and the shared `selected-value` flags and
 * request context.
 */
export function validPayload(
	overrides: Partial<BulkEvaluationPayload> = {},
): BulkEvaluationPayload {
	const fixture = bulkEvaluationPayloadFixture('selected-value');
	return {
		vs: '1',
		flags: fixture.flags,
		requestContext: fixture.requestContext,
		...overrides,
	};
}

/**
 * A shared server SDK bulk fixture, unmodified.
 *
 * These payloads still carry `status`, `requestContext`, and `sdkMetadata`, which the client must
 * accept and ignore. They omit `vs` until the server SDK payload gains it, which exercises the
 * absent-`vs` path.
 */
export function bulkEvaluationPayloadFixture(
	name: BulkEvaluationFixtureName,
): BulkEvaluationPayload {
	const scenario = bulkEvaluationFixtures.scenarios.find((candidate) => candidate.name === name);
	if (scenario === undefined) {
		throw new Error(`Unknown bulk evaluation fixture: ${name}`);
	}

	return structuredClone(scenario.expectedPayload) as BulkEvaluationPayload;
}

export function mutableValidPayload(
	overrides: Partial<MutableBulkEvaluationPayload> = {},
): MutableBulkEvaluationPayload {
	return {
		vs: '1',
		flags: {
			'flag-a': result({ returnType: 'BOOLEAN', value: true }),
		},
		requestContext: { identifiers: { AtlassianAccountId: 'abc' }, attributes: {} },
		...overrides,
	};
}

export function result(overrides: Record<string, unknown> = {}): FlagResult {
	return {
		returnType: 'BOOLEAN',
		value: true,
		useCodeDefault: false,
		metadata: {
			identifierType: 'AtlassianAccountId',
			matchReason: 'ss_cohort_match',
			variationId: 'variation-on',
			ruleId: 'rule-a',
		},
		...overrides,
	} as FlagResult;
}

export function invalidPayload(overrides: Record<string, unknown>): unknown {
	return {
		...validPayload(),
		...overrides,
	};
}

/** Construct and successfully initialize a client, asserting the initialization result. */
export function initializedClient(
	payload: BulkEvaluationPayload = validPayload(),
	user: FlagUser = testUser(),
): FlagClient {
	const client = new FlagClient(TEST_CLIENT_OPTIONS);
	expect(client.initialize(() => payload, user)).toEqual({ initialized: true });
	return client;
}

interface MutableBulkEvaluationPayload {
	vs?: '1';
	requestContext: {
		identifiers: Record<string, string>;
		attributes: Record<string, FlagContextValue>;
	};
	flags: Record<string, FlagResult>;
}

type BulkEvaluationFixtureName =
	| 'selected-value'
	| 'safe-code-default'
	| 'not-initialised'
	| 'partial';

interface BulkEvaluationFixtures {
	scenarios: Array<{
		name: BulkEvaluationFixtureName;
		expectedPayload: BulkEvaluationPayload;
	}>;
}

/**
 * Vendored copy of `sdks/evaluation-test-vectors/bulk-evaluation-fixtures.json` from the
 * feature-flag-platform repository, shared with the server SDKs.
 */
function loadBulkEvaluationFixtures(): BulkEvaluationFixtures {
	return bulkEvaluationFixturesJson as unknown as BulkEvaluationFixtures;
}
