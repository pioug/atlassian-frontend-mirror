import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { RestartListsAttributesForListOutdented } from '@atlaskit/editor-common/analytics';

export const RESTART_LISTS_ANALYTICS_KEY = 'restartListsAnalytics';

export const getRestartListsAttributes = (
  tr: Transaction,
): RestartListsAttributesForListOutdented =>
  tr.getMeta(RESTART_LISTS_ANALYTICS_KEY) ?? {};

export const storeRestartListsAttributes = (
  tr: Transaction,
  attributes: RestartListsAttributesForListOutdented,
): void => {
  const meta = getRestartListsAttributes(tr);
  tr.setMeta(RESTART_LISTS_ANALYTICS_KEY, {
    ...meta,
    ...attributes,
  });
};
