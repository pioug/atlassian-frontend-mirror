import type { LinkStepMetadata } from '@atlaskit/adf-schema/steps/link-meta-step';
import { LinkMetaStep } from '@atlaskit/adf-schema/steps/link-meta-step';
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';

export function getLinkMetadataFromTransaction(
	tr: Transaction | ReadonlyTransaction,
): LinkStepMetadata {
	return tr.steps.reduce<LinkStepMetadata>((metadata, step) => {
		if (!(step instanceof LinkMetaStep)) {
			return metadata;
		}

		return {
			...metadata,
			...step.getMetadata(),
		};
	}, {});
}
