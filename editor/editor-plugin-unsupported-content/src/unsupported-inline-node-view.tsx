/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import type { UnsupportedContentTooltipPayload } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export type Props = InlineNodeViewComponentProps & {
  node?: PMNode;
  children?: React.ReactNode;
  dispatchAnalyticsEvent?: (payload: UnsupportedContentTooltipPayload) => void;
};

export const UnsupportedInlineNodeView = (props: Props) => {
  return <UnsupportedInline {...props} />;
};
