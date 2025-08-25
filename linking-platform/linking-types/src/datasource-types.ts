/*
 Basic types
*/

export interface BooleanType {
	type: 'boolean';
	value: boolean;
}

export interface NumberType {
	type: 'number';
	value: number;
}

export interface StringType {
	type: 'string';
	value: string;
}

export interface DateType {
	type: 'date';
	value: string; // ISO Format like 2023-03-16T14:04:02.200+0000
}

export interface TimeType {
	type: 'time';
	value: string; // ISO Format like 2023-03-16T14:04:02.200+0000
}

export interface DateTimeType {
	type: 'datetime';
	value: string; // ISO Format like 2023-03-16T14:04:02.200+0000
}

/*
 Complex object types
 */

export interface Tag {
	color?:
		| 'standard'
		| 'green'
		| 'lime'
		| 'blue'
		| 'red'
		| 'purple'
		| 'magenta'
		| 'grey'
		| 'teal'
		| 'orange'
		| 'yellow'
		| 'limeLight'
		| 'orangeLight'
		| 'magentaLight'
		| 'greenLight'
		| 'blueLight'
		| 'redLight'
		| 'purpleLight'
		| 'greyLight'
		| 'tealLight'
		| 'yellowLight';
	id?: string;
	text: string;
	url?: string;
}

export interface TagType {
	type: 'tag';
	value: Tag;
}

export interface User {
	atlassianUserId?: string;
	avatarSource?: string;
	displayName?: string;
	url?: string;
}

export interface UserType {
	type: 'user';
	value: User;
}

export interface Status {
	id?: string;
	// based on https://atlassian.design/components/lozenge/code#Lozenge-appearance to enable FE to map to the right UI configuration
	style?: {
		appearance?: 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success';
		isBold?: boolean;
	};
	text: string;
	transitionId?: string;
}

export interface StatusType {
	type: 'status';
	value: Status;
}

export interface Link {
	// There are different ways we want to represent a link.
	// This will control those specific variations. Like `key` will show bold/gray link.
	style?: {
		appearance?: 'default' | 'key';
	};
	text?: string;
	url: string;
}

export interface LinkType {
	type: 'link';
	value: Link;
}

export interface Icon {
	id?: string;
	label?: string;
	source: string;
	text?: string;
}

export interface IconType {
	type: 'icon';
	value: Icon;
}

export type DatasourceType =
	| BooleanType
	| DateTimeType
	| DateType
	| IconType
	| LinkType
	| NumberType
	| RichTextType
	| StatusType
	| StringType
	| TagType
	| TimeType
	| UserType;

export interface DatasourceResponseSchemaProperty {
	isList?: boolean;
	key: string;
	title: string;
	type: DatasourceType['type'];
}

export interface DatasourceDataResponseItem {
	// Property key.data: Any value type from any type OR array of values from collection type
	[key: string]: {
		data: DatasourceType['value'] | DatasourceType['value'][];
	};
}

// TODO Uncomment and refine these when EDM-5980 or EDM-5885 being worked on.

export interface DatasourceParameters {
	[key: string]: any;
}

export interface DatasourceDataRequest {
	fields?: string[];
	includeSchema?: boolean;
	pageCursor?: string;
	pageSize: number;
	parameters: DatasourceParameters;
}

export interface DatasourceResponseParameter {
	description: string;
	isList?: boolean;
	isRequired?: boolean;
	key: string;
	type: DatasourceType['type'];
}

interface DatasourceResponse<TData> {
	data: TData;
	meta: DatasourceMeta;
}

export interface DatasourceDetailsResponse extends DatasourceResponse<DatasourceDetails> {}

export interface DatasourceDataResponse extends DatasourceResponse<DatasourceData> {}

export type Visibility = 'public' | 'restricted' | 'other' | 'not_found';
export type Access = 'granted' | 'forbidden' | 'unauthorized' | 'not_found';

export interface AuthService {
	displayName: string;
	key: string;
	url: string;
}

export type DatasourceDetails = {
	ari: string;
	description: string;
	id: string;
	name: string;
	parameters: DatasourceResponseParameter[];
	schema: DatasourceDetailsSchema;
};

export type DatasourceData = {
	items: DatasourceDataResponseItem[];
	nextPageCursor?: string;
	schema?: DatasourceDataSchema;
	totalCount?: number;
};

export type DatasourceDataSchema = {
	defaultProperties?: string[];
	properties: DatasourceResponseSchemaProperty[];
};

export type DatasourceDetailsSchema = {
	defaultProperties: string[];
	properties: DatasourceResponseSchemaProperty[];
};

export type DatasourceMeta = {
	[k: string]: any;
	access: Access;
	auth?: AuthService[];
	visibility: Visibility;
};

export type DatasourceTableStatusType =
	| 'empty'
	| 'forbidden'
	| 'loading'
	| 'resolved'
	| 'rejected'
	| 'unauthorized';

export type DatasourceDetailsRequest = {
	parameters: DatasourceParameters;
};

export interface RichText {
	text: string;
	type: 'adf';
}

export interface RichTextType {
	type: 'richtext';
	value: RichText;
}
