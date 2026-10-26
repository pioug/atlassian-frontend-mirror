/**
 * OTLP/JSON logs data model and encoder for exposure records. Not part of the public API.
 *
 * Field names and value encodings follow the OTLP/JSON protobuf mapping: 64-bit integers are decimal
 * strings and timestamps are decimal nanosecond strings.
 */
import { PACKAGE_NAME } from '../version';
import type { ResourceIdentity } from './attribution';

export type OtlpAnyValue =
	| { readonly stringValue: string }
	| { readonly boolValue: boolean }
	| { readonly intValue: string }
	| { readonly doubleValue: number }
	| { readonly arrayValue: { readonly values: readonly OtlpAnyValue[] } };

export interface OtlpKeyValue {
	readonly key: string;
	readonly value: OtlpAnyValue;
}

/** One OTLP/JSON `LogRecord` carrying a `flag-evaluated` exposure. */
export interface OtlpLogRecord {
	readonly timeUnixNano: string;
	readonly severityNumber: 1;
	readonly severityText: 'TRACE';
	readonly eventName: 'flag-evaluated';
	readonly attributes: readonly OtlpKeyValue[];
}

/**
 * An OTLP/JSON `LogRecord` read back from storage. Another client version may have written it, so it
 * can carry members and value kinds this client does not write, and it is delivered unchanged.
 */
export interface StoredLogRecord {
	readonly [member: string]: unknown;
}

/**
 * One exposure ready for delivery: its log record plus the Resource and Scope it belongs to.
 *
 * This is the unit that is queued, persisted, and grouped into requests, so a record keeps the scope
 * version of the package that produced it.
 */
export interface ExposureRecord<LogRecord extends OtlpLogRecord | StoredLogRecord = OtlpLogRecord> {
	readonly resource: ResourceIdentity;
	readonly scopeVersion: string;
	readonly logRecord: LogRecord;
}

/** A queued exposure, whose log record this client wrote or read back from storage. */
export type QueuedRecord = ExposureRecord<OtlpLogRecord | StoredLogRecord>;

export interface OtlpScopeLogs {
	readonly scope: {
		readonly name: string;
		readonly version: string;
		readonly attributes: readonly OtlpKeyValue[];
	};
	readonly logRecords: readonly (OtlpLogRecord | StoredLogRecord)[];
}

export interface OtlpResourceLogs {
	readonly resource: { readonly attributes: readonly OtlpKeyValue[] };
	readonly scopeLogs: readonly OtlpScopeLogs[];
}

/** An OTLP/JSON `ExportLogsServiceRequest`. */
export interface ExportLogsServiceRequest {
	readonly resourceLogs: readonly OtlpResourceLogs[];
}

export function stringValue(value: string): OtlpAnyValue {
	return { stringValue: value };
}

export function boolValue(value: boolean): OtlpAnyValue {
	return { boolValue: value };
}

/** An OTLP int64 value; `value` must be a safe integer. */
export function intValue(value: number): OtlpAnyValue {
	return { intValue: String(value) };
}

export function doubleValue(value: number): OtlpAnyValue {
	return { doubleValue: value };
}

/**
 * Encode a JavaScript number whose schema type is "integer or double".
 *
 * Safe integers become `intValue`; every other finite number becomes `doubleValue`, because an
 * unsafe integer has no exact decimal int64 form (`String(1e21)` is `"1e+21"`).
 */
export function numberValue(value: number): OtlpAnyValue {
	return Number.isSafeInteger(value) ? intValue(value) : doubleValue(value);
}

export function stringArrayValue(values: readonly string[]): OtlpAnyValue {
	return { arrayValue: { values: values.map(stringValue) } };
}

/** Convert epoch milliseconds to the decimal nanosecond string OTLP/JSON uses for timestamps. */
export function unixNanoFromMillis(epochMillis: number): string {
	return (BigInt(Math.trunc(epochMillis)) * BigInt(1_000_000)).toString();
}

/** The OTLP Resource attributes for an identity, omitting absent optional members. */
export function resourceAttributes(identity: ResourceIdentity): OtlpKeyValue[] {
	const attributes: OtlpKeyValue[] = [
		{ key: 'service.name', value: stringValue(identity.serviceName) },
	];
	if (identity.serviceVersion !== undefined) {
		attributes.push({ key: 'service.version', value: stringValue(identity.serviceVersion) });
	}
	if (identity.environmentType !== undefined) {
		// The schema allows a tier as the name, and only the name is projected to Splunk.
		attributes.push(
			{ key: 'deployment.environment.name', value: stringValue(identity.environmentType) },
			{ key: 'deployment.environment_type', value: stringValue(identity.environmentType) },
		);
	}
	return attributes;
}

/**
 * Group records into one request: one `resourceLogs` per resource identity and, within it, one
 * `scopeLogs` per scope version, preserving first-seen and record order.
 */
export function encodeExportLogsRequest(
	records: readonly QueuedRecord[],
): ExportLogsServiceRequest {
	const byResource = new Map<
		string,
		{
			readonly identity: ResourceIdentity;
			readonly byScope: Map<string, (OtlpLogRecord | StoredLogRecord)[]>;
		}
	>();
	for (const record of records) {
		const resourceKey = JSON.stringify([
			record.resource.serviceName,
			record.resource.environmentType ?? null,
			record.resource.serviceVersion ?? null,
		]);
		let group = byResource.get(resourceKey);
		if (group === undefined) {
			group = { identity: record.resource, byScope: new Map() };
			byResource.set(resourceKey, group);
		}
		let logRecords = group.byScope.get(record.scopeVersion);
		if (logRecords === undefined) {
			logRecords = [];
			group.byScope.set(record.scopeVersion, logRecords);
		}
		logRecords.push(record.logRecord);
	}

	return {
		resourceLogs: Array.from(byResource.values(), ({ identity, byScope }) => ({
			resource: { attributes: resourceAttributes(identity) },
			scopeLogs: Array.from(byScope, ([scopeVersion, logRecords]) => ({
				scope: {
					name: PACKAGE_NAME,
					version: scopeVersion,
					attributes: [
						{ key: 'atl.feature_flag.sdk.platform', value: stringValue('browser') },
						{ key: 'atl.feature_flag.sdk.type', value: stringValue(PACKAGE_NAME) },
					],
				},
				logRecords,
			})),
		})),
	};
}
