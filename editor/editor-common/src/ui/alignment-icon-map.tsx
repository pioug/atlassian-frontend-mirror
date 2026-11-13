import React from 'react';

import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

import AlignTextCenterIcon from '@atlaskit/icon/core/align-text-center';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AlignTextRightIcon from '@atlaskit/icon/core/align-text-right';
import type { GlyphProps, IconSize, NewCoreIconProps } from '@atlaskit/icon/types';

import { alignmentMessages as messages } from '../messages/alignment';

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
	alignment: 'start' | 'end' | 'center';
	size?: IconSize;
};

export const AlignmentIconMap = (props: Props): React.JSX.Element => {
	const { Component, label } = iconAndMessageMap[props.alignment] ?? iconAndMessageMap.center;
	const intl = useIntl();
	return (
		<Component
			label={intl.formatMessage(label)}
			color="currentColor"
			spacing="spacious"
			size={props.size ?? 'medium'}
		/>
	);
};
