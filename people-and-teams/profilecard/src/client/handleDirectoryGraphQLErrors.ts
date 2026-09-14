import { DirectoryGraphQLErrors } from '../util/DirectoryGraphQLErrors';

export const handleDirectoryGraphQLErrors = (errors: unknown, traceId: string | null): void => {
	throw new DirectoryGraphQLErrors(errors, traceId);
};
