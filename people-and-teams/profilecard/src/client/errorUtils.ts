import { GraphQLError } from './graphqlUtils';

const IGNORED_ERRORS = ['NotPermitted', 'Gone'];

function isIgnoredError(error: GraphQLError): boolean {
  return !!error && IGNORED_ERRORS.includes(error.reason);
}

export const getErrorAttributes = (error?: any) => {
  const traceId: string | null | undefined = !!error
    ? (error.response as Response | undefined)?.headers?.get('atl-traceid')
    : undefined;

  return {
    errorStatus: error?.code,
    errorReason: error?.reason,
    isSLOFailure: !isIgnoredError(error),
    traceId: traceId ?? undefined,
  };
};
