export class HttpError extends Error {
  code: number;
  traceId?: string | null;
  constructor(code: number, reason: string, traceId?: string | null) {
    super(reason);
    this.code = code;
    this.traceId = traceId;
  }
}

type KnownErrorExtensions = {
  errorNumber?: number;
};

type ErrorExtensions = KnownErrorExtensions & Record<string, any>;

type ErrorCategory =
  | 'NotFound'
  | 'NotPermitted'
  | 'MalformedInput'
  | 'Internal'
  | 'Gone';

export class DirectoryGraphQLError extends Error {
  category: ErrorCategory;
  type: string;
  path: string;
  errorNumber?: number;
  extensions: Record<string, any>;

  constructor(
    message: string,
    category: ErrorCategory,
    type: string,
    extensions: ErrorExtensions = {},
    path: (string | number)[] = [],
  ) {
    super(message);
    this.category = category;
    this.type = type;
    this.path = path.join('.');
    const { errorNumber, ...unknownExtension } = extensions;
    this.errorNumber = extensions.errorNumber;
    this.extensions = unknownExtension;
  }
}

export class DirectoryGraphQLErrors extends Error {
  errors: DirectoryGraphQLError[];
  traceId?: string | null;
  constructor(errors: unknown, traceId: string | null) {
    super('DirectoryGraphQLErrors');
    this.traceId = traceId;

    if (Array.isArray(errors)) {
      this.errors = errors.map(
        (error) =>
          new DirectoryGraphQLError(
            error.message,
            error.category,
            error.type,
            error.extensions,
            error.path,
          ),
      );
    } else {
      this.errors = [];
    }
  }
}

type KnownAggErrorExtensions = {
  statusCode?: number;
  errorType?: string;
  classification?: string;
};
type AggErrorExtensions = KnownAggErrorExtensions & Record<string, any>;

export class AGGError extends Error {
  path: string;
  extensions: Record<string, any>;
  statusCode?: number;
  errorType?: string;
  classification?: string;
  constructor(
    message: string,
    extensions: AggErrorExtensions,
    path: (string | number)[] = [],
  ) {
    super(message);
    this.path = path?.join('.');
    const { statusCode, errorType, classification, ...unknownExtension } =
      extensions;
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.classification = classification;
    this.extensions = unknownExtension;
  }
}

export class AGGErrors extends Error {
  errors: AGGError[];
  traceId?: string | null;
  constructor(errors: unknown, traceId: string | null) {
    super('AGGErrors');
    this.traceId = traceId;

    if (Array.isArray(errors)) {
      this.errors = errors.map(
        (error) => new AGGError(error.message, error.extensions, error.path),
      );
    } else {
      this.errors = [];
    }
  }
}
