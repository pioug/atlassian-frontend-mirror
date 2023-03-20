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

export interface TagType {
  type: 'tag';
  value: string;
}

/*
 Complex object types
 */
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
  text: string;
  status: string;
  style?: {
    color: string;
    backgroundColor: string;
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
  linkType?: 'key';
}

export interface LinkType {
  type: 'link';
  value: Link;
}

export interface Icon {
  source: string;
  label?: string;
  url?: string;
}

export interface IconType {
  type: 'icon';
  value: Icon;
}

export type DatasourceType =
  | BooleanType
  | NumberType
  | StringType
  | TagType
  | IconType
  | UserType
  | StatusType
  | LinkType;

export interface DatasourceResponseSchemaProperty {
  key: string;
  title: string;
  type: DatasourceType['type'];
  isList?: boolean;
  isDefault?: boolean;
  isIdentity?: boolean;
}

export interface DatasourceDataResponseItem {
  // Property key: Any value type from any type OR array of such types
  [key: string]: DatasourceType['value'] | DatasourceType['value'][];
}

// TODO Uncomment and refine these when EDM-5980 or EDM-5885 being worked on.
// export interface DatasourceResponseParameter {
//   key: string;
//   type: string; // ex. "String" or "JQLQuery"
//   description: 'string';
// }
//
// export interface DatasourceResponse {
//   id: string; // ARI
//   name: string;
//   description: string;
//   parameters: DatasourceResponseParameter[];
//   schema: {
//     properties: DatasourceResponseSchemaProperty[];
//   };
// }
// export interface DatasourceDataResponse {
//   data: DatasourceDataResponseItem[];
//   nextPage: {
//     cursor: string;
//   };
// }
