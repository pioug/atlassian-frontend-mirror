import last from 'lodash/last';
import merge from 'lodash/merge';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { DEFAULT_SOURCE, GasPayload } from '@atlaskit/analytics-gas-types';
import { LINKING_PLATFORM_CONTEXT } from '@atlaskit/analytics-namespaced-context';

import {
  getSources,
  getExtraAttributes,
  getPackageInfo,
  getComponents,
} from '../helpers/extract-data-from-event';
import { FabricChannel } from '../types';

const listenerVersion = process.env._PACKAGE_VERSION_ as string;

export default (event: UIAnalyticsEvent): GasPayload => {
  const sources = getSources(event, LINKING_PLATFORM_CONTEXT);
  const packages = getPackageInfo(event, LINKING_PLATFORM_CONTEXT);
  const components = getComponents(event, LINKING_PLATFORM_CONTEXT);
  const extraAttributes = getExtraAttributes(event, LINKING_PLATFORM_CONTEXT);

  const { packageName, packageVersion } = last(packages) || ({} as any);
  const packageHierarchy = packages.map((p) =>
    p.packageVersion ? `${p.packageName}@${p.packageVersion}` : p.packageName,
  );

  const tags: Set<string> = new Set(event.payload.tags || []);
  tags.add(FabricChannel.linkingPlatform);

  const payload = {
    name: event.payload.name,
    action: event.payload.action,
    actionSubject: event.payload.actionSubject,
    actionSubjectId: event.payload.actionSubjectId,
    eventType: event.payload.eventType,
    attributes: {
      packageName,
      packageVersion,
      listenerVersion,
      sourceHierarchy: sources.join('.') || undefined,
      componentHierarchy: components.join('.') || undefined,
      packageHierarchy: packageHierarchy.join(',') || undefined,
      ...merge(extraAttributes, event.payload.attributes),
    },
    tags: Array.from(tags),
    source: last(sources) || DEFAULT_SOURCE,
    nonPrivacySafeAttributes: event.payload.nonPrivacySafeAttributes,
  };

  return payload;
};
