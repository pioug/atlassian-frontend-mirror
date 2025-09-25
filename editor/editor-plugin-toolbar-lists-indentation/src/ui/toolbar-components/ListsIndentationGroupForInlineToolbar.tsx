import {
	LISTS_INDENTATION_GROUP,
	LISTS_INDENTATION_GROUP_INLINE,
	TEXT_SECTION,
	TEXT_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

export const getListsIndentationGroupForInlineToolbar = (): RegisterComponent[] => {
	return [
		{
			type: LISTS_INDENTATION_GROUP_INLINE.type,
			key: LISTS_INDENTATION_GROUP_INLINE.key,
			parents: [
				{
					type: TEXT_SECTION.type,
					key: TEXT_SECTION.key,
					rank: TEXT_SECTION_RANK[LISTS_INDENTATION_GROUP.key],
				},
			],
		},
	];
};
