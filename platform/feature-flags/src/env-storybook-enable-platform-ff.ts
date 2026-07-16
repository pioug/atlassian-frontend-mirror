import { hasProcessEnv } from './resolvers';

export const ENV_STORYBOOK_ENABLE_PLATFORM_FF: boolean = hasProcessEnv
	? // Use global "process" variable and process.env['FLAG_NAME'] syntax, so it can be replaced by webpack DefinePlugin
		process.env['STORYBOOK_ENABLE_PLATFORM_FF'] === 'true'
	: false;
