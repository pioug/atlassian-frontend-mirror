/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { components, type OptionType } from '@atlaskit/select';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Avatar, { type AvatarPropTypes } from '@atlaskit/avatar';
import { fg } from '@atlaskit/platform-feature-flags';
import { AvatarTag } from '@atlaskit/tag';
import TeamAvatar from '@atlaskit/teams-avatar';
import { AddOptionAvatar } from './AddOptionAvatar';
import { AvatarOrIcon } from './AvatarOrIcon';
import { SizeableAvatar } from './SizeableAvatar';
import { getAvatarUrl, isEmail, isGroup, isTeam } from './utils';
import type { ComponentType } from 'react';
import type { Email } from '../types';
import { type Option, type UserPickerProps } from '../types';
import Lozenge from '@atlaskit/lozenge';
import PeopleIcon from '@atlaskit/icon/core/people-group';
import { type MultiValueProps } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';
import { VerifiedTeamIcon } from '@atlaskit/people-teams-ui-public/verified-team-icon';
import { FormattedMessage } from 'react-intl-next';
import { messages } from './i18n';

export const scrollToValue = (valueContainer: HTMLDivElement, control: HTMLElement): void => {
	const { top, height } = valueContainer.getBoundingClientRect();
	const { height: controlHeight } = control.getBoundingClientRect();

	if (top - height < 0) {
		valueContainer.scrollIntoView();
	}

	if (top + height > controlHeight) {
		valueContainer.scrollIntoView(false);
	}
};

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
	paddingLeft: token('space.050', '4px'),
});

const avatarTagWrapperStyle = css({
	display: 'inline-flex',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- offsets AvatarTag's built-in space.050 margin down to space.025
	margin: '-2px',
});

type Props = MultiValueProps<OptionType> & {
	data: Option;
	innerProps: any;
	isFocused?: boolean;
	ref?: React.RefObject<HTMLDivElement>;
	removeProps: { onClick: Function };
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
		const canShowArchivedLozenge = isTeam(data) && data?.state === 'DISBANDED' && fg('enable-sup-archive-experience');
		if ((isGroup(data) && data.includeTeamsUpdates) || (isTeam(data) && data.verified)) {
			return <VerifiedTeamIcon size={data.includeTeamsUpdates ? 'small' : 'medium'} />;
		}
		if (canShowArchivedLozenge) {
			return (
				<Box xcss={archivedLozengeWrapper}>
					<Lozenge appearance="default">
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
			const canShowArchivedLozenge = isTeam(data) && data?.state === 'DISBANDED' && fg('enable-sup-archive-experience');
			const avatarProps = avatarUrl ? { name: data.name, src: avatarUrl } : { name: data.name };

			const removeAction = () => {
				removeProps.onClick({} as React.MouseEvent<HTMLDivElement>);
				return true;
			};

			if (isEmailOption) {
				const emailAvatar: ComponentType<AvatarPropTypes> = (props) => (
					<Avatar
						{...props}
						children={
							<AddOptionAvatar isLozenge isPendingAction={(data as Email).isPendingAction} />
						}
					/>
				);
				return (
					<span ref={this.containerRef} css={avatarTagWrapperStyle} data-user-picker-multi-value>
						<AvatarTag
							text={label}
							type="other"
							avatar={emailAvatar}
							isRemovable={!isDisabled}
							onBeforeRemoveAction={removeAction}
						/>
					</span>
				);
			}

			if (isGroupOption) {
				const groupAvatar: ComponentType<AvatarPropTypes> = (props) => (
					<Avatar
						{...props}
						children={
							<Box xcss={groupTagContainer}>
								<PeopleIcon
									color="currentColor"
									label="" // This element is a decorative icon and does not require a label
									size="small"
								/>
							</Box>
						}
					/>
				);
				return (
					<span ref={this.containerRef} css={avatarTagWrapperStyle} data-user-picker-multi-value>
						<AvatarTag
							type="other"
							text={label}
							isVerified={data.includeTeamsUpdates}
							isRemovable={!isDisabled}
							onBeforeRemoveAction={removeAction}
							avatar={groupAvatar}
						/>
					</span>
				);
			}

			if (data.icon) {
				const iconAvatar: ComponentType<AvatarPropTypes> = (props) => (
					<Avatar
						{...props}
						children={
							<div css={iconStyle} style={{ color: data.iconColor }}>
								{data.icon}
							</div>
						}
					/>
				);
				return (
					<span css={avatarTagWrapperStyle} data-user-picker-multi-value>
						<AvatarTag
							text={label}
							type={isTeamOption ? 'other' : 'user'}
							avatar={iconAvatar}
							isRemovable={!isDisabled}
							onBeforeRemoveAction={removeAction}
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
								onBeforeRemoveAction={removeAction}
								avatar={(props: AvatarPropTypes) => <TeamAvatar {...props} {...avatarProps} />}
							/>
							{canShowArchivedLozenge ? (
								<Box xcss={archivedLozengeWrapper}>
									<Lozenge appearance="default">
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
							onBeforeRemoveAction={removeAction}
							avatar={(props: AvatarPropTypes) => <Avatar {...props} {...avatarProps} />}
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
