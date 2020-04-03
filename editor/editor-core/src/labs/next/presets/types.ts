import { FeatureFlags } from '../../../plugins/feature-flags-context/types';

export interface EditorPresetProps {
  excludes?: Set<string>;
  experimental?: Array<string>;
  featureFlags?: FeatureFlags;
}
