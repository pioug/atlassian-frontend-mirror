/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { statusMessages as messages } from '@atlaskit/editor-common/messages';
import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import type { Color, StatusStyle } from '@atlaskit/status/element';
import { Status } from '@atlaskit/status/element';

import type { StatusPluginOptions } from '../types';

const styledStatusStyles = css({
	opacity: 1,
});

const styledStatusPlaceholderStyles = css({
	opacity: 0.5,
});

export interface ContainerProps {
	view: EditorView;
	intl: IntlShape;
	text?: string;
	color: Color;
	style?: StatusStyle;
	localId?: string;
	eventDispatcher?: EventDispatcher;
}

const StatusContainerView = (props: ContainerProps) => {
	const {
		text,
		color,
		localId,
		style,
		intl: { formatMessage },
	} = props;

	const statusText = text ? text : formatMessage(messages.placeholder);

	const handleClick = (event: React.SyntheticEvent) => {
		if (event.nativeEvent.stopImmediatePropagation) {
			event.nativeEvent.stopImmediatePropagation();
		}
		// handling of popup is done in plugin.apply on selection change.
	};

	return (
		<span
			css={text ? styledStatusStyles : styledStatusPlaceholderStyles}
			data-testid="statusContainerView"
		>
			<Status
				text={statusText}
				color={color}
				localId={localId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={style}
				onClick={handleClick}
				isBold={fg('platform-component-visual-refresh')}
			/>
		</span>
	);
};

export const IntlStatusContainerView = injectIntl(StatusContainerView);

export type Props = InlineNodeViewComponentProps & {
	options: StatusPluginOptions | undefined;
};

export const StatusNodeView = (props: Props) => {
	const { view } = props;
	const { text, color, localId, style } = props.node.attrs;

	return (
		<IntlStatusContainerView
			view={view}
			text={text}
			color={color}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			localId={localId}
		/>
	);
};
