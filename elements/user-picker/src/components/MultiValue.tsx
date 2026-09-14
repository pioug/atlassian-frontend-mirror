/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl';

import Avatar, { type AvatarPropTypes } from '@atlaskit/avatar/avatar';
import PeopleIcon from '@atlaskit/icon/core/people-group';
import Lozenge from '@atlaskit/lozenge/lozenge';
import { VerifiedTeamIcon } from '@atlaskit/people-teams-ui-public/verified-team-icon/main';
import { fg } from '@atlaskit/platform-feature-flags/fg';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { components } from '@atlaskit/react-select/components';
import type { OptionType } from '@atlaskit/select/types';
import type { MultiValueProps } from '@atlaskit/select/types';
import AvatarTag from '@atlaskit/tag/avatar-tag';
import { default as Tag } from '@atlaskit/tag/removable-tag';
import TeamAvatar, { type TeamAvatarProps } from '@atlaskit/teams-avatar/teams-avatar';
import { token } from '@atlaskit/tokens';

import type { Email } from '../types';
import { type Option, type UserPickerProps } from '../types';
import { AddOptionAvatar } from './AddOptionAvatar';
import { AvatarOrIcon } from './AvatarOrIcon';
import { SizeableAvatar } from './SizeableAvatar';
import { getAvatarUrl } from './getAvatarUrl';
import { messages } from './i18n';
import { isEmail } from './isEmail';
import { isGroup } from './isGroup';
import { isTeam } from './isTeam';
import { scrollToValue } from './scrollToValue';

const groupTagContainerOld = xcss({
	paddingLeft: 'space.025',
	marginTop: 'space.025',
});

const groupTagContainer = xcss({
	paddingLeft: 'space.050',
});

const archivedLozengeWrapper = xcss({
	display: 'flex',
	paddingLeft: 'space.050',
});

const iconStyle = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	width: '20px',
	height: '20px',
});

const nameWrapper = css({
	font: token('font.body'),
	paddingLeft: token('space.050'),
});

const avatarTagWrapperStyle = css({
	display: 'flex',
	font: token('font.body.small'),
});

type Props = MultiValueProps<OptionType> & {
	data: Option;
	innerProps: any;
	isFocused?: boolean;
	ref?: React.RefObject<HTMLDivElement>;
	removeProps: { onClick: (e?: React.MouseEvent<HTMLDivElement>) => void };
	selectProps: UserPickerProps;
};

export class MultiValue extends React.Component<Props> {
	private containerRef: React.RefObject<HTMLDivElement>;
	constructor(props: Props) {
		super(props);
		this.containerRef = React.createRef<HTMLDivElement>();
	}

	componentDidUpdate(): void {
		const { isFocused } = this.props;
		if (
			isFocused &&
			this.containerRef.current &&
			this.containerRef.current.parentElement &&
			this.containerRef.current.parentElement.parentElement
		) {
			scrollToValue(
				this.containerRef.current,
				this.containerRef.current.parentElement.parentElement,
			);
		}
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		const { data: option, innerProps, isFocused } = this.props;
		const { data: nextOption, innerProps: nextInnerProps, isFocused: nextIsFocused } = nextProps;

		if (option == null || nextOption == null) {
			return option !== nextOption || innerProps !== nextInnerProps || isFocused !== nextIsFocused;
		}

		const { label, data } = option;
		const { label: nextLabel, data: nextData } = nextOption;

		// We can ignore onRemove here because it is an anonymous function
		// that will be recreated every time but with the same implementation.
		return (
			data !== nextData ||
			label !== nextLabel ||
			innerProps !== nextInnerProps ||
			isFocused !== nextIsFocused
		);
	}

	getElemBefore = (): React.JSX.Element => {
		const {
			data: { data },
		} = this.props;
		if (isEmail(data)) {
			// This element is a decorative icon and does not require a label
			return <AddOptionAvatar isLozenge isPendingAction={data.isPendingAction} />;
		}

		if (isGroup(data)) {
			return (
				<Box xcss={groupTagContainerOld}>
					<PeopleIcon
						color="currentColor"
						label="" // This element is a decorative icon and does not require a label
					/>
				</Box>
			);
		}

		if (data.icon) {
			return (
				<AvatarOrIcon
					appearance="multi"
					icon={data.icon}
					iconColor={data.iconColor}
					src={getAvatarUrl(data)}
					type={isTeam(data) ? 'team' : 'person'}
				/>
			);
		}
		// Fallback to original behavior
		return (
			<SizeableAvatar
				appearance="multi"
				src={getAvatarUrl(data)}
				type={isTeam(data) ? 'team' : 'person'}
			/>
		);
	};

	getElemAfter = (): React.JSX.Element | null => {
		const {
			data: { data },
		} = this.props;
		const canShowArchivedLozenge = isTeam(data) && data?.state === 'DISBANDED';
		if ((isGroup(data) && data.includeTeamsUpdates) || (isTeam(data) && data.verified)) {
			return <VerifiedTeamIcon size={data.includeTeamsUpdates ? 'small' : 'medium'} />;
		}
		if (canShowArchivedLozenge) {
			return (
				<Box xcss={archivedLozengeWrapper}>
					<Lozenge appearance="neutral">
						<FormattedMessage {...messages.archivedLozenge} />
					</Lozenge>
				</Box>
			);
		}
		return null;
	};

	render(): React.JSX.Element {
		const { children, innerProps: _innerProps, removeProps, data: option, ...rest } = this.props;

		if (fg('platform-dst-lozenge-tag-badge-visual-uplifts')) {
			const { data, label } = option;
			const isTeamOption = isTeam(data);
			const isGroupOption = isGroup(data);
			const isEmailOption = isEmail(data);
			const avatarUrl = getAvatarUrl(data);
			const isDisabled = Boolean((this.props.selectProps as UserPickerProps)?.isDisabled);
			const canShowArchivedLozenge = isTeam(data) && data?.state === 'DISBANDED';
			const avatarProps = avatarUrl ? { name: data.name, src: avatarUrl } : { name: data.name };

			const onAfterRemoveAction = () => {
				removeProps.onClick({} as React.MouseEvent<HTMLDivElement>);
			};

			if (isEmailOption) {
				return (
					<span ref={this.containerRef} css={avatarTagWrapperStyle} data-user-picker-multi-value>
						<Tag
							text={label}
							elemBefore={
								<AddOptionAvatar isLozenge isPendingAction={(data as Email).isPendingAction} />
							}
							isRemovable={!isDisabled}
							onAfterRemoveAction={onAfterRemoveAction}
							hasMargin={false}
						/>
					</span>
				);
			}

			if (isGroupOption) {
				return (
					<span ref={this.containerRef} css={avatarTagWrapperStyle} data-user-picker-multi-value>
						<Tag
							text={label}
							elemBefore={
								<Box xcss={groupTagContainer}>
									<PeopleIcon
										color="currentColor"
										label="" // This element is a decorative icon and does not require a label
										size="small"
									/>
								</Box>
							}
							isRemovable={!isDisabled}
							onAfterRemoveAction={onAfterRemoveAction}
							hasMargin={false}
						/>
					</span>
				);
			}

			if (data.icon) {
				return (
					<span ref={this.containerRef} css={avatarTagWrapperStyle} data-user-picker-multi-value>
						<Tag
							text={label}
							elemBefore={
								<div css={iconStyle} style={{ color: data.iconColor }}>
									{data.icon}
								</div>
							}
							isRemovable={!isDisabled}
							hasMargin={false}
							onAfterRemoveAction={onAfterRemoveAction}
						/>
					</span>
				);
			}
			return (
				<span ref={this.containerRef} css={avatarTagWrapperStyle} data-user-picker-multi-value>
					{isTeamOption ? (
						<React.Fragment>
							<AvatarTag
								type="other"
								text={label}
								isVerified={isTeamOption ? data.verified : undefined}
								isRemovable={!isDisabled}
								onAfterRemoveAction={onAfterRemoveAction}
								avatar={(props: AvatarPropTypes) => (
									// AvatarTag always supplies size="xxsmall", which is a valid
									// TeamAvatarSize; TeamAvatar does not support UNSAFE_xsmall.
									<TeamAvatar {...(props as TeamAvatarProps)} {...avatarProps} />
								)}
								hasMargin={false}
							/>
							{canShowArchivedLozenge ? (
								<Box xcss={archivedLozengeWrapper}>
									<Lozenge appearance="neutral">
										<FormattedMessage {...messages.archivedLozenge} />
									</Lozenge>
								</Box>
							) : null}
						</React.Fragment>
					) : (
						<AvatarTag
							type="user"
							text={label}
							isRemovable={!isDisabled}
							onAfterRemoveAction={onAfterRemoveAction}
							avatar={(props: AvatarPropTypes) => <Avatar {...props} {...avatarProps} />}
							hasMargin={false}
						/>
					)}
				</span>
			);
		}

		return (
			<components.MultiValue
				{...(rest as any)}
				data={option}
				removeProps={removeProps}
				innerProps={{ ref: this.containerRef }}
				cropWithEllipsis={false}
			>
				<Inline alignBlock="center">
					{this.getElemBefore()} <div css={nameWrapper}>{children}</div>
					{this.getElemAfter()}
				</Inline>
			</components.MultiValue>
		);
	}
}
