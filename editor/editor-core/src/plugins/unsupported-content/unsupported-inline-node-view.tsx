/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import { Node as PMNode } from 'prosemirror-model';
import { UnsupportedContentTooltipPayload } from '@atlaskit/editor-common/utils';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import { InlineNodeViewComponentProps } from '../../nodeviews/getInlineNodeViewProducer';

export type Props = InlineNodeViewComponentProps & {
  node?: PMNode;
  children?: React.ReactNode;
  dispatchAnalyticsEvent?: (payload: UnsupportedContentTooltipPayload) => void;
};

export const UnsupportedInlineNodeView: React.FC<Props> = (props: Props) => {
  return <UnsupportedInline {...props} />;
};
