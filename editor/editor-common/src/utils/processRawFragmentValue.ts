import { Fragment, type Node, type Schema } from '@atlaskit/editor-prosemirror/model';

import type { DispatchAnalyticsEvent } from '../analytics';
import type { ProviderFactory } from '../provider-factory';
import type { ReplaceRawValue, Transformer } from '../types';

import { processRawValue } from './processRawValue';

export function processRawFragmentValue(
	schema: Schema,
	value?: ReplaceRawValue[],
	providerFactory?: ProviderFactory,
	sanitizePrivateContent?: boolean,
	contentTransformer?: Transformer<string>,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
): Fragment | undefined {
	if (!value) {
		return;
	}

	const adfEntities = value
		.map((item) =>
			processRawValue(
				schema,
				item,
				providerFactory,
				sanitizePrivateContent,
				contentTransformer,
				dispatchAnalyticsEvent,
			),
		)
		.filter((item) => Boolean(item)) as Node[];

	if (adfEntities.length === 0) {
		return;
	}

	return Fragment.from(adfEntities);
}
