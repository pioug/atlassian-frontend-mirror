import type { ExtensionDefinition } from '@atlaskit/adf-schema/extension';
import type { BodiedExtensionDefinition } from '@atlaskit/adf-schema/bodied-extension';
import type { InlineExtensionDefinition } from '@atlaskit/adf-schema/inline-extension';
import type { TableDefinition } from '@atlaskit/adf-schema/tableNodes';
import type { FragmentAttributes, FragmentDefinition } from '@atlaskit/adf-schema/fragment';
import { applyMark } from '../utils/apply-mark';
import type { WithAppliedMark } from '../types';

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
