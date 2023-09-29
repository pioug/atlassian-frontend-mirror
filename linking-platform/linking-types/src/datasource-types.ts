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
  id?: string;
  text: string;
}

export interface TagType {
  type: 'tag';
  value: Tag;
}

export interface User {
  atlassianUserId?: string;
  displayName?: string;
  avatarSource?: string;
  url?: string;
}

export interface UserType {
  type: 'user';
  value: User;
}

export interface Status {
  id?: string;
  text: string;
  // based on https://atlassian.design/components/lozenge/code#Lozenge-appearance to enable FE to map to the right UI configuration
  style?: {
    appearance?:
      | 'default'
      | 'inprogress'
      | 'moved'
      | 'new'
      | 'removed'
      | 'success';
    isBold?: boolean;
  };
}

export interface StatusType {
  type: 'status';
  value: Status;
}

export interface Link {
  url: string;
  text?: string;
  // There are different ways we want to represent a link.
  // This will control those specific variations. Like `key` will show bold/gray link.
  style?: {
    appearance?: 'default' | 'key';
  };
}

export interface LinkType {
  type: 'link';
  value: Link;
}

export interface Icon {
  source: string;
  label?: string;
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
  key: string;
  title: string;
  type: DatasourceType['type'];
  isList?: boolean;
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
  parameters: DatasourceParameters;
  pageSize: number;
  pageCursor?: string;
}

export interface DatasourceResponseParameter {
  key: string;
  type: DatasourceType['type'];
  description: string;
  isRequired?: boolean;
}

interface DatasourceResponse<TData> {
  meta: DatasourceMeta;
  data: TData;
}

export interface DatasourceDetailsResponse
  extends DatasourceResponse<DatasourceDetails> {}

export interface DatasourceDataResponse
  extends DatasourceResponse<DatasourceData> {}

export type Visibility = 'public' | 'restricted' | 'other' | 'not_found';
export type Access = 'granted' | 'forbidden' | 'unauthorized' | 'not_found';

export interface AuthService {
  key: string;
  displayName: string;
  url: string;
}

export type DatasourceDetails = {
  ari: string;
  id: string;
  name: string;
  description: string;
  parameters: DatasourceResponseParameter[];
  schema: {
    defaultProperties: string[];
    properties: DatasourceResponseSchemaProperty[];
  };
};

export type DatasourceData = {
  items: DatasourceDataResponseItem[];
  schema?: {
    properties: DatasourceResponseSchemaProperty[];
    defaultProperties?: string[];
  };
  nextPageCursor?: string;
  totalCount?: number;
};

export type DatasourceMeta = {
  access: Access;
  visibility: Visibility;
  auth?: AuthService[];
  [k: string]: any;
};

export type DatasourceTableStatusType =
  | 'empty'
  | 'loading'
  | 'resolved'
  | 'rejected'
  | 'unauthorized';

export type DatasourceDetailsRequest = {
  parameters: DatasourceParameters;
};

export interface RichText {
  type: 'adf';
  text: string;
}

export interface RichTextType {
  type: 'richtext';
  value: RichText;
}
