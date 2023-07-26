export type GetWorkspaceDetailsResponse = {
  results: [
    {
      id: string;
    },
  ];
};

export type ObjectSchema = {
  id: string;
  name: string;
};

export type ObjectSchemaOption = {
  label: string;
  value: string;
};

export type FetchObjectSchemaResponse = ObjectSchema;

export type FetchObjectSchemasResponse = {
  startAt: number;
  maxResults: number;
  total: number;
  values: ObjectSchema[];
  isLast: boolean;
};

export type AqlValidateResponse = {
  isValid: boolean;
  errorMessages: string[];
  errors: {};
};

// These are to enforce the field "name" property and keep everything typed
export const objectSchemaKey = 'objectSchema' as const;
export const aqlKey = 'aql' as const;

export type SearchForm = {
  [objectSchemaKey]: ObjectSchemaOption | undefined | null;
  [aqlKey]: string;
};
