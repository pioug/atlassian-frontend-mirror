import type { BodiedExtensionDefinition } from '@atlaskit/adf-schema/bodied-extension';
import type { ExtensionDefinition } from '@atlaskit/adf-schema/extension';
import type { FragmentAttributes, FragmentDefinition } from '@atlaskit/adf-schema/fragment';
import type { InlineExtensionDefinition } from '@atlaskit/adf-schema/inline-extension';
import type { TableDefinition } from '@atlaskit/adf-schema/tableNodes';

import type { WithAppliedMark } from '../types';
import { applyMark } from '../utils/apply-mark';

export const fragment =
	(attrs: FragmentAttributes) =>
	(
		maybeNode:
			| TableDefinition
			| ExtensionDefinition
			| BodiedExtensionDefinition
			| InlineExtensionDefinition,
	) => {
		return applyMark<FragmentDefinition>({ type: 'fragment', attrs }, maybeNode) as WithAppliedMark<
			typeof maybeNode,
			FragmentDefinition
		>;
	};
