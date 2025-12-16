/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';
import { type AppearanceType } from '@atlaskit/avatar';
import { SizeableAvatar } from './SizeableAvatar';
import { getAvatarSize } from './utils';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

export type AvatarOrIconProps = {
	appearance?: string;
	avatarAppearanceShape?: AppearanceType;
	icon?: ReactNode;
	iconColor?: string;
	presence?: string;
	src?: string;
	type?: 'person' | 'team';
};

const iconStyle = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
})

const iconSizes = {
	xsmall: css({width: '20px', height: '20px'}),	
	small: css({width: '28px', height: '28px'}),
	medium: css({width: '36px', height: '36px'}),
};

export const AvatarOrIcon = ({
	appearance = 'big',
	avatarAppearanceShape,
	icon,
	iconColor,
	presence,
	src,
	type = 'person',
}: AvatarOrIconProps) => {
	// If icon is provided, render it instead of avatar
	if (icon) {
		const avatarSize = getAvatarSize(appearance);
		return (
			<div css={[iconStyle, iconSizes[avatarSize]]} style={{color: iconColor}}>{icon}</div>
		);
	}

	// Otherwise, render the avatar as before
	return (
		<SizeableAvatar
			appearance={appearance}
			src={src}
			presence={presence}
			type={type}
			avatarAppearanceShape={avatarAppearanceShape}
		/>
	);
};


