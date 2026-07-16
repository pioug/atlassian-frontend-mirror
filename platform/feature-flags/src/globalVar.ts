import { PFF_GLOBAL_KEY } from './resolvers';
import { type FeatureFlagResolverBoolean } from './resolvers';

type WindowFeatureFlagVars = {
	[PFF_GLOBAL_KEY]: {
		booleanResolver?: FeatureFlagResolverBoolean;
	};
};

const DEFAULT_PFF_GLOBAL: WindowFeatureFlagVars[typeof PFF_GLOBAL_KEY] = {
	booleanResolver: undefined,
};

export const globalVar = (typeof window !== 'undefined'
	? window
	: globalThis) as unknown as WindowFeatureFlagVars;

globalVar[PFF_GLOBAL_KEY] = globalVar[PFF_GLOBAL_KEY] || DEFAULT_PFF_GLOBAL;
