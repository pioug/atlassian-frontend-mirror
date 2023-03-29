import { GraphQLError } from './graphqlUtils';

const IGNORED_ERRORS = [
  // Error categories from pf-directory
  'NotPermitted',
  'Gone',
  // Error categories from AGG
  'TEAMS_FORBIDDEN',
  'TEAMS_TEAM_DELETED',
];

function isIgnoredError(error?: GraphQLError): boolean {
  return !!error && !!error.reason && IGNORED_ERRORS.includes(error.reason);
}

export const getErrorAttributes = (error?: GraphQLError) => {
  return {
    errorMessage: error?.message,
    errorStatus: error?.code,
    errorReason: error?.reason || 'default',
    errorSource: error?.source,
    isSLOFailure: !isIgnoredError(error),
    traceId: error?.traceId ?? undefined,
  };
};
