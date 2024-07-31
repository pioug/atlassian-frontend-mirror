import React from 'react';

import type { MessageDescriptor } from 'react-intl-next';
import { useIntl } from 'react-intl-next';

import { alignmentMessages as messages } from '@atlaskit/editor-common/messages';
import AlignCenterIcon from '@atlaskit/icon/core/migration/align-center--editor-align-center';
import AlignLeftIcon from '@atlaskit/icon/core/migration/align-left--editor-align-left';
import AlignRightIcon from '@atlaskit/icon/core/migration/align-right--editor-align-right';
import EditorAlignCenterIcon from '@atlaskit/icon/glyph/editor/align-center';
import EditorAlignLeftIcon from '@atlaskit/icon/glyph/editor/align-left';
import EditorAlignRightIcon from '@atlaskit/icon/glyph/editor/align-right';
import type { GlyphProps, UNSAFE_NewIconProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';

const iconAndMessageMap: {
	[key: string]: {
		Component: React.ComponentType<React.PropsWithChildren<GlyphProps | UNSAFE_NewIconProps>>;
		label: MessageDescriptor;
	};
} = {
	start: {
		Component: fg('platform_editor_migration_icon_and_typography')
			? AlignLeftIcon
			: EditorAlignLeftIcon,
		label: messages.alignLeft,
	},
	end: {
		Component: fg('platform_editor_migration_icon_and_typography')
			? AlignRightIcon
			: EditorAlignRightIcon,
		label: messages.alignRight,
	},
	center: {
		Component: fg('platform_editor_migration_icon_and_typography')
			? AlignCenterIcon
			: EditorAlignCenterIcon,
		label: messages.alignCenter,
	},
};

type Props = {
	alignment: string;
};

export const IconMap = (props: Props) => {
	const { Component, label } = iconAndMessageMap[props.alignment];
	const intl = useIntl();
	return fg('platform_editor_migration_icon_and_typography') ? (
		<Component label={intl.formatMessage(label)} color="currentColor" spacing="spacious" />
	) : (
		<Component label={intl.formatMessage(label)} />
	);
};
