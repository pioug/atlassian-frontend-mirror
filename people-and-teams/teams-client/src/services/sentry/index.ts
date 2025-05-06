export {
	addBreadcrumb,
	logException,
	logErrorMessage,
	logInfoMessage,
	createErrorHandler,
	logExceptionWithPackageContext,
	logErrorMessageWithPackageContext,
	logInfoMessageWithPackageContext,
	createErrorHandlerWithPackageContext,
} from './main';

export { useTeamsSentryClientSetup } from './utils/use-teams-sentry-client-setup';

export type { CreateErrorHandler, SentryClient } from './types';
