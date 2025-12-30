import React from 'react';

import Avatar from '@atlaskit/avatar';
import { cssMap, cx } from '@atlaskit/css';
import PeopleGroupIcon from '@atlaskit/icon/core/people-group';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import {
	type AvatarLabelOption,
	type FormatOptionLabel,
	type IconLabelOption,
	type LozengeLabelOption,
} from './types';

const styles = cssMap({
	commonLabelStyles: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	avatarOptionLabelStyles: {
		marginLeft: token('space.050'),
	},
	groupWrapperStyles: {
		width: '20px',
		minWidth: '20px',
		height: '20px',
	},
});

const IconOptionLabel = ({ data }: { data: IconLabelOption }) => {
	const { label, icon: avatar, value } = data;

	const avatarOptionLabelData: AvatarLabelOption = {
		label,
		avatar,
		value,
		optionType: 'avatarLabel',
		isSquare: true,
	};

	return (
		<AvatarOptionLabel
			data={avatarOptionLabelData}
			testId="basic-filter-popup-select-option--icon-label"
		/>
	);
};

const LozengeOptionLabel = ({ data }: { data: LozengeLabelOption }) => {
	return (
		<Lozenge
			appearance={data.appearance}
			isBold={fg('platform-component-visual-refresh') ? true : false}
			testId="basic-filter-popup-select-option--lozenge"
		>
			<Box xcss={styles.commonLabelStyles}>{data.label}</Box>
		</Lozenge>
	);
};

const AvatarOptionLabel = ({ data, testId }: { data: AvatarLabelOption; testId?: string }) => {
	return (
		<Flex alignItems="center" testId={testId || 'basic-filter-popup-select-option--avatar'}>
			{data.isGroup ? (
				<Flex alignItems="center" justifyContent="center" xcss={styles.groupWrapperStyles}>
					<PeopleGroupIcon color="currentColor" LEGACY_size="small" label="" />
				</Flex>
			) : (
				<Avatar appearance={data.isSquare ? 'square' : 'circle'} src={data.avatar} size="xsmall" />
			)}
			<Box xcss={cx(styles.commonLabelStyles, styles.avatarOptionLabelStyles)}>{data.label}</Box>
		</Flex>
	);
};

const formatOptionLabel: FormatOptionLabel = (data) => {
	if (data.optionType === 'lozengeLabel') {
		return <LozengeOptionLabel data={data} />;
	}

	if (data.optionType === 'avatarLabel') {
		return <AvatarOptionLabel data={data} />;
	}

	if (data.optionType === 'iconLabel') {
		return <IconOptionLabel data={data} />;
	}

	return <></>;
};

export default formatOptionLabel;
