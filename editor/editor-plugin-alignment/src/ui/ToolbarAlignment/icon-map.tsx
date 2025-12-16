import React from 'react';

import type { MessageDescriptor } from 'react-intl-next';
import { useIntl } from 'react-intl-next';

import { alignmentMessages as messages } from '@atlaskit/editor-common/messages';
import type { GlyphProps, NewCoreIconProps } from '@atlaskit/icon';
import AlignTextCenterIcon from '@atlaskit/icon/core/align-text-center';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AlignTextRightIcon from '@atlaskit/icon/core/align-text-right';

const iconAndMessageMap: {
	[key: string]: {
		Component: React.ComponentType<GlyphProps> | React.ComponentType<NewCoreIconProps>;
		label: MessageDescriptor;
	};
} = {
	start: {
		Component: AlignTextLeftIcon,
		label: messages.alignLeft,
	},
	end: {
		Component: AlignTextRightIcon,
		label: messages.alignRight,
	},
	center: {
		Component: AlignTextCenterIcon,
		label: messages.alignCenter,
	},
};

type Props = {
	alignment: string;
};

export const IconMap = (props: Props): React.JSX.Element => {
	const { Component, label } = iconAndMessageMap[props.alignment];
	const intl = useIntl();
	return <Component label={intl.formatMessage(label)} color="currentColor" spacing="spacious" />;
};
