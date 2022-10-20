import { code, emoji, p } from '@atlaskit/adf-utils/builders';

import { AttributeSpec, EventType } from '../codegen-analytics/types';

export const EVENT_TYPE_COLORS: Record<
  EventType,
  'neutral' | 'purple' | 'blue' | 'red' | 'yellow' | 'green'
> = {
  ui: 'yellow',
  screen: 'yellow',
  operational: 'yellow',
  track: 'yellow',
};

export const formatAttributeType = (attr: AttributeSpec) => {
  const suffix = attr.required === false ? ' | NULL' : '';

  if (Array.isArray(attr.type)) {
    return p(code(`${attr.type.join(' | ')}${suffix}`));
  }
  return p(code(`${attr.type}${suffix}`));
};

export const formatBooleanAsEmoji = (bool?: boolean) => {
  const shortName = bool ? 'check_mark' : 'cross_mark';

  return emoji({
    shortName: `:${shortName}:`,
    id: `atlassian-${shortName}`,
    text: `:${shortName}:`,
  });
};
