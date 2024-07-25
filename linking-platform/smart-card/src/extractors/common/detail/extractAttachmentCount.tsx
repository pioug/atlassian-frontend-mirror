import React from 'react';
import { N600 } from '@atlaskit/theme/colors';
import AttachmentIcon from '@atlaskit/icon/core/migration/attachment';
import { token } from '@atlaskit/tokens';

import { type JsonLd } from 'json-ld-types';
import { type LinkDetail } from './types';

export type LinkAttachmentType =
	| JsonLd.Data.Document
	| JsonLd.Data.Task
	| JsonLd.Data.TaskType
	| JsonLd.Data.Project;

export const extractAttachmentCount = (jsonLd: LinkAttachmentType): LinkDetail | undefined => {
	const attachmentCount = jsonLd['atlassian:attachmentCount'];
	if (attachmentCount) {
		return {
			text: attachmentCount.toString(),
			icon: (
				<AttachmentIcon
					LEGACY_size="small"
					label="attachments"
					color={token('color.icon.subtle', N600)}
				/>
			),
		};
	}
};
