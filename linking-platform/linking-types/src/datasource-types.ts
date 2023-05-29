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
  | NumberType
  | StringType
  | IconType
  | StatusType
  | DateType
  | TimeType
  | DateTimeType
  | TagType
  | UserType
  | LinkType;

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

export interface DatasourceResponse {
  ari: string;
  id: string;
  name: string;
  description: string;
  parameters: DatasourceResponseParameter[];
  schema: {
    properties: DatasourceResponseSchemaProperty[];
    defaultProperties: string[];
  };
}

export interface DatasourceDataResponse {
  data: DatasourceDataResponseItem[];
  schema?: {
    properties: DatasourceResponseSchemaProperty[];
  };
  nextPageCursor?: string;
  totalIssues?: number;
}

export type DatasourceTableStatusType =
  | 'empty'
  | 'loading'
  | 'resolved'
  | 'rejected';

export type DatasourceDetailsRequest = {
  parameters: DatasourceParameters;
};
