import React from 'react';

import type { MessageDescriptor } from 'react-intl-next';
import { useIntl } from 'react-intl-next';

import { alignmentMessages as messages } from '@atlaskit/editor-common/messages';
import type { GlyphProps, UNSAFE_NewCoreIconProps } from '@atlaskit/icon';
import AlignCenterIcon from '@atlaskit/icon/core/migration/align-center--editor-align-center';
import AlignLeftIcon from '@atlaskit/icon/core/migration/align-left--editor-align-left';
import AlignRightIcon from '@atlaskit/icon/core/migration/align-right--editor-align-right';

const iconAndMessageMap: {
	[key: string]: {
		Component: React.ComponentType<React.PropsWithChildren<GlyphProps | UNSAFE_NewCoreIconProps>>;
		label: MessageDescriptor;
	};
} = {
	start: {
		Component: AlignLeftIcon,
		label: messages.alignLeft,
	},
	end: {
		Component: AlignRightIcon,
		label: messages.alignRight,
	},
	center: {
		Component: AlignCenterIcon,
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
