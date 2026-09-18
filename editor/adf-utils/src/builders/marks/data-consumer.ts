import type { BodiedExtensionDefinition } from '@atlaskit/adf-schema/bodied-extension';
import type {
	DataConsumerAttributes,
	DataConsumerDefinition,
} from '@atlaskit/adf-schema/data-consumer';
import type { ExtensionDefinition } from '@atlaskit/adf-schema/extension';
import type { InlineExtensionDefinition } from '@atlaskit/adf-schema/inline-extension';

import type { WithAppliedMark } from '../types';
import { applyMark } from '../utils/apply-mark';

export const dataConsumer =
	(attrs: DataConsumerAttributes) =>
	(maybeNode: ExtensionDefinition | BodiedExtensionDefinition | InlineExtensionDefinition) => {
		return applyMark<DataConsumerDefinition>(
			{ type: 'dataConsumer', attrs },
			maybeNode,
		) as WithAppliedMark<typeof maybeNode, DataConsumerDefinition>;
	};
