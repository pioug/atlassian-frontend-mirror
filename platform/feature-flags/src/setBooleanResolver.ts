import { globalVar } from './globalVar';
import { PFF_GLOBAL_KEY } from './resolvers';
import { type FeatureFlagResolverBoolean } from './resolvers';

export function setBooleanResolver(resolver: FeatureFlagResolverBoolean): void {
	globalVar[PFF_GLOBAL_KEY].booleanResolver = resolver;
}
