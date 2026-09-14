import type { BreakoutMarkAttrs, BreakoutMarkDefinition } from '@atlaskit/adf-schema/breakout';
import type { CodeBlockDefinition } from '@atlaskit/adf-schema/code-block';
import type { LayoutSectionDefinition } from '@atlaskit/adf-schema/layout-section';
import { applyMark } from '../utils/apply-mark';
import type { WithAppliedMark } from '../types';

export const breakout =
	(attrs: BreakoutMarkAttrs) => (maybeNode: CodeBlockDefinition | LayoutSectionDefinition) => {
		return applyMark<BreakoutMarkDefinition>(
			{ type: 'breakout', attrs },
			maybeNode,
		) as WithAppliedMark<typeof maybeNode, BreakoutMarkDefinition>;
	};
