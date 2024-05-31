import {
	type ExtensionDefinition,
	type BodiedExtensionDefinition,
	type InlineExtensionDefinition,
	type DataConsumerAttributes,
	type DataConsumerDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithAppliedMark } from '../types';

export const dataConsumer =
	(attrs: DataConsumerAttributes) =>
	(maybeNode: ExtensionDefinition | BodiedExtensionDefinition | InlineExtensionDefinition) => {
		return applyMark<DataConsumerDefinition>(
			{ type: 'dataConsumer', attrs },
			maybeNode,
		) as WithAppliedMark<typeof maybeNode, DataConsumerDefinition>;
	};
