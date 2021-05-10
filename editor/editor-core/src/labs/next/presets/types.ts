import type { FeatureFlags } from '../../../types/feature-flags';

export interface EditorPresetProps {
  excludes?: Set<string>;
  experimental?: Array<string>;
  featureFlags?: FeatureFlags;
}
