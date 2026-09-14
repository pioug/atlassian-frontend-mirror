import { uuid } from '@atlaskit/adf-schema/uuid';
import type { Mark, Node, Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { StatusType } from '../types';

export const DEFAULT_STATUS: StatusType = {
	text: '',
	color: 'neutral',
};

export const DEFAULT_STATUS_NEW: StatusType = {
	text: '',
	color: 'neutral',
	style: 'mixedCase',
};

export const getDefaultStatusAttrs = (): StatusType =>
	fg('platform-dst-lozenge-tag-badge-visual-uplifts') ? DEFAULT_STATUS_NEW : DEFAULT_STATUS;

export const createStatusNode = (
	schema: Schema,
	attrs: Partial<StatusType> = {},
	marks?: readonly Mark[],
): Node =>
	schema.nodes.status.createChecked(
		{
			...getDefaultStatusAttrs(),
			localId: uuid.generate(),
			...attrs,
		},
		null,
		marks,
	);
