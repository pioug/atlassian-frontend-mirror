import getPayloadSize, { type PayloadSizeResult } from './utils/get-payload-size';

type PayloadSizeMetadataProperties = Record<string, unknown> & {
	'event:payloadSizeUsedSafeSerializer'?: boolean;
	'event:payloadSizeSerializationFailed'?: boolean;
};

function annotatePayloadSizeMetadata(
	properties: PayloadSizeMetadataProperties,
	result: PayloadSizeResult,
): void {
	if (result.usedSafeSerializer) {
		properties['event:payloadSizeUsedSafeSerializer'] = true;
	}

	if (result.serializationFailed) {
		properties['event:payloadSizeSerializationFailed'] = true;
	}
}

export function getPayloadSizeAndAnnotate(properties: PayloadSizeMetadataProperties): number {
	const result = getPayloadSize(properties, { includeMetadata: true });
	annotatePayloadSizeMetadata(properties, result);
	return result.sizeInKb;
}
