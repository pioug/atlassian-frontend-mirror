import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';

import { extractInlineViewPropsFromObject } from './extractPropsFromObject';
import { BuildInlineProps } from './types';

import { buildTaskIcon, buildTaskLozenge } from '../utils/task';

export type BuildInlineTaskProps = BuildInlineProps<
  InlineCardResolvedViewProps
>;

export function extractInlineViewPropsFromTask(
  json: any,
): InlineCardResolvedViewProps {
  const props = extractInlineViewPropsFromObject(json);
  return {
    ...props,
    ...buildTaskLozenge(json),
    ...buildTaskIcon(json),
  };
}
