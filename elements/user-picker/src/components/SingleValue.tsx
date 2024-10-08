/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { AvatarItem } from '@atlaskit/avatar';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type Option } from '../types';
import { components, type SingleValueProps } from '@atlaskit/select';
import { SizeableAvatar } from './SizeableAvatar';
import { getAvatarUrl } from './utils';
import { token } from '@atlaskit/tokens';

const avatarItemComponent = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	border: 'none !important',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	padding: `${token('space.0', '0px')} !important`,
	width: 'auto',
	overflow: 'hidden',
	minWidth: '100px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		boxSizing: 'border-box',
	},
	'&:hover': {
		width: 'auto',
		padding: 0,
		border: 'none',
	},
});

export type Props = SingleValueProps<Option>;

export const SingleValue = (props: Props) => {
	const {
		data: { label, data },
		//@ts-ignore react-select unsupported props
		selectProps: { appearance, isFocused },
	} = props;

	return !isFocused ? (
		<components.SingleValue {...props}>
			<AvatarItem
				backgroundColor="transparent"
				avatar={<SizeableAvatar src={getAvatarUrl(data)} appearance={appearance} />}
				primaryText={label}
			>
				{({ ref, ...props }) => <div css={avatarItemComponent} {...props} />}
			</AvatarItem>
		</components.SingleValue>
	) : null;
};
