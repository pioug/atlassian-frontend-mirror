import React from 'react';

import type { MessageDescriptor } from 'react-intl-next';
import { useIntl } from 'react-intl-next';

import { alignmentMessages as messages } from '@atlaskit/editor-common/messages';
import type { GlyphProps, NewCoreIconProps } from '@atlaskit/icon';
import AlignTextCenterIcon from '@atlaskit/icon/core/migration/align-text-center--editor-align-center';
import AlignTextLeftIcon from '@atlaskit/icon/core/migration/align-text-left--editor-align-left';
import AlignTextRightIcon from '@atlaskit/icon/core/migration/align-text-right--editor-align-right';

const iconAndMessageMap: {
	[key: string]: {
		Component: React.ComponentType<React.PropsWithChildren<GlyphProps | NewCoreIconProps>>;
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

export const IconMap = (props: Props) => {
	const { Component, label } = iconAndMessageMap[props.alignment];
	const intl = useIntl();
	return <Component label={intl.formatMessage(label)} color="currentColor" spacing="spacious" />;
};
