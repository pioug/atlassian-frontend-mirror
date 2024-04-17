import type { CardProps } from '@atlaskit/smart-card';

import type { Providers } from '../provider-factory';

export interface CardOptions {
  provider?: Providers['cardProvider'];
  resolveBeforeMacros?: string[];
  allowBlockCards?: boolean;
  allowDatasource?: boolean;
  allowEmbeds?: boolean;
  allowResizing?: boolean;
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6348 Internal documentation for deprecation (no external access)}
   *
   * Prefer `actionOptions` prop.
   */
  showServerActions?: boolean;
  actionOptions?: CardProps['actionOptions'];
  useAlternativePreloader?: boolean;
  allowAlignment?: boolean;
  allowWrapping?: boolean;
  showUpgradeDiscoverability?: boolean;
  /**
   * Customises the outbound link to configure user preferences
   */
  userPreferencesLink?: string;
}
