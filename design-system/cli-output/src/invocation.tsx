export type InvocationEnvironment = Record<string, string | undefined>;

/**
 * Resolve the command text shown in follow-up examples for source and published CLIs.
 */
export const resolveInvocation = ({
	argv1,
	isDev,
	environment,
	environmentVariable,
	publishedInvocation,
}: {
	argv1: string;
	isDev: boolean;
	environment?: InvocationEnvironment;
	environmentVariable?: string;
	publishedInvocation: string;
}): string => {
	const env = environment ?? process.env;
	const configured =
		env.ATLASSIAN_CLI_DISPLAY_INVOCATION ??
		(environmentVariable ? env[environmentVariable] : undefined);
	if (configured) return configured;
	if (!isDev) return publishedInvocation;
	return `node ${/\s/.test(argv1) ? JSON.stringify(argv1) : argv1}`;
};
