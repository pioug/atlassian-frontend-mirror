/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import type { UnsupportedContentTooltipPayload } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export type Props = InlineNodeViewComponentProps & {
	children?: React.ReactNode;
	dispatchAnalyticsEvent?: (payload: UnsupportedContentTooltipPayload) => void;
	node?: PMNode;
};

export const UnsupportedInlineNodeView = (props: Props) => {
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <UnsupportedInline {...props} />;
};
