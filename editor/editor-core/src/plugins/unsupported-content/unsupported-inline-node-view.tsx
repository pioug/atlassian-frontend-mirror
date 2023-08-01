/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { UnsupportedContentTooltipPayload } from '@atlaskit/editor-common/utils';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';

export type Props = InlineNodeViewComponentProps & {
  node?: PMNode;
  children?: React.ReactNode;
  dispatchAnalyticsEvent?: (payload: UnsupportedContentTooltipPayload) => void;
};

export const UnsupportedInlineNodeView: React.FC<Props> = (props: Props) => {
  return <UnsupportedInline {...props} />;
};
