import type { FeatureFlagResolverBoolean } from './resolvers';
import { setBooleanResolver } from './setBooleanResolver';

export function setBooleanFeatureFlagResolver(flagResolver: FeatureFlagResolverBoolean): void {
	setBooleanResolver(flagResolver);
}
