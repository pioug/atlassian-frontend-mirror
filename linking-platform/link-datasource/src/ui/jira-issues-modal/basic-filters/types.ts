import { type SelectOption } from '../../common/modal/popup-select/types';

export type BasicFilterFieldType = 'project' | 'assignee' | 'type' | 'status';

export type SelectedOptionsMap = {
	[key in BasicFilterFieldType]?: SelectOption[];
};

// These types have been taken from jira-frontend to ensure the colour data return gets mapped correctly for the lozenge
export const appearanceMap = {
	BLUE_GRAY: 'default',
	MEDIUM_GRAY: 'default',
	BROWN: 'default',
	GREEN: 'success',
	YELLOW: 'inprogress',
	WARM_RED: 'removed',
} as const;

export type ColorName = keyof typeof appearanceMap;
export type Appearance = (typeof appearanceMap)[ColorName];

type JQLBuilderResponse<T> = {
	data: {
		jira?: {
			jqlBuilder: T;
		};
	};
	errors?: Array<object>;
};

type HydrateJqlQueryBody = {
	hydrateJqlQuery: {
		fields: Array<{
			jqlTerm: BasicFilterFieldType;
			values: Array<{
				values: Array<AggJqlBuilderFieldNode>;
			}>;
		}>;
	};
};

type FieldValuesBody = {
	fieldValues: {
		totalCount: number;
		pageInfo: {
			endCursor?: string;
		};
		edges: Array<{
			node: AggJqlBuilderFieldNode;
		}>;
	};
};

type JqlBuilderProject = {
	avatar: {
		small: string;
	};
};

type JqlBuilderUser = {
	picture?: string;
};

type JqlBuilderGroup = {
	name: string;
};

type JqlBuilderIssueType = {
	avatar: {
		small: string;
	};
};

type JqlBuilderStatusCategory = {
	colorName: string;
};

export type AggJqlBuilderFieldNode = {
	jqlTerm: string;
	displayName: string;
	project?: JqlBuilderProject;
	user?: JqlBuilderUser;
	issueTypes?: Array<JqlBuilderIssueType>;
	statusCategory?: JqlBuilderStatusCategory;
	group?: JqlBuilderGroup;
};

export type HydrateResponse = JQLBuilderResponse<HydrateJqlQueryBody>;

export type FieldValuesResponse = JQLBuilderResponse<FieldValuesBody>;
