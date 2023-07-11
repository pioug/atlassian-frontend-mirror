export interface GetWorkspaceDetailsResponse {
  results: [
    {
      id: string;
    },
  ];
}

export interface ObjectSchema {
  id?: string;
  name?: string;
}

export interface FetchObjectSchemasResponse {
  startAt: number;
  maxResults: number;
  total: number;
  values: ObjectSchema[];
  isLast: boolean;
}

export interface AqlValidateResponse {
  isValid: boolean;
  errorMessages: string[];
  errors: {};
}
