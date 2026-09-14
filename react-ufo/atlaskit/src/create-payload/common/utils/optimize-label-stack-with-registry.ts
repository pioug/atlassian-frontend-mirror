import type { LabelStack } from '../../../interaction-context';
import { type UFOSegmentType } from '../../../segment/segment';
import type { getReactUFOPayloadVersion } from '../../utils/get-react-ufo-payload-version';

import type { LabelStackRegistry } from './label-stack-registry';
import { optimizeLabelStack } from './optimize-label-stack';

import { getLabelStackReference } from './index';

/**
 * Optimizes a labelStack with registry-based deduplication.
 * When a registry is provided and the version is '2.0.0', the labelStack string
 * is registered in the lookup table and a numeric index is returned instead of the full string.
 * Falls back to regular optimizeLabelStack when no registry is provided.
 */
export function optimizeLabelStackWithRegistry(
	labelStack: LabelStack,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
	registry: LabelStackRegistry | undefined,
):
	| string
	| number
	| {
			t?: UFOSegmentType | undefined;
			s?: string | undefined;
			n: string;
	  }[] {
	if (registry && reactUFOVersion === '2.0.0') {
		const ref = getLabelStackReference(labelStack);
		return registry.register(ref);
	}
	return optimizeLabelStack(labelStack, reactUFOVersion);
}
