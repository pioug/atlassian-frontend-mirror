import Lozenge from '@atlaskit/lozenge';
import React from 'react';
import { token } from '@atlaskit/tokens';
import EditorPanelIcon from '@atlaskit/icon/core/status-information';
import {
	isRestricted,
	type MentionDescription,
	type OnMentionEvent,
	type Presence,
	type LozengeProps,
} from '../../types';
import { NoAccessLabel } from '../../util/i18n';
import { leftClick } from '../../util/mouse';
import AsyncNoAccessTooltip from '../NoAccessTooltip';
import AsyncLockCircleIcon from '../LockCircleIcon';
import {
	AccessSectionStyle,
	AvatarStyle,
	FullNameStyle,
	InfoSectionStyle,
	MentionItemStyle,
	NameSectionStyle,
	RowStyle,
	TimeStyle,
} from './styles';
import { renderHighlight } from './MentionHighlightHelpers';
import MentionDescriptionByline from '../MentionDescriptionByline';
import MessagesIntlProvider from '../MessagesIntlProvider';
import { MentionAvatar } from '../MentionAvatar';

export { MENTION_ITEM_HEIGHT } from './styles';

function renderLozenge(lozenge?: string | LozengeProps) {
	if (typeof lozenge === 'string') {
		return <Lozenge>{lozenge}</Lozenge>;
	}
	if (typeof lozenge === 'object') {
		const { appearance, text } = lozenge;
		return <Lozenge appearance={appearance}>{text}</Lozenge>;
	}
	return null;
}

function renderTime(time?: string) {
	if (time) {
		return <TimeStyle>{time}</TimeStyle>;
	}
	return null;
}

export interface Props {
	forwardedRef?: React.Ref<HTMLDivElement>;
	mention: MentionDescription;
	onMouseEnter?: OnMentionEvent;
	// TODO: Remove onMouseMove -> https://product-fabric.atlassian.net/browse/FS-3897
	onMouseMove?: OnMentionEvent;
	onSelection?: OnMentionEvent;
	selected?: boolean;
}

export default class MentionItem extends React.PureComponent<Props, {}> {
	// internal, used for callbacks
	private onMentionSelected = (event: React.MouseEvent<any>) => {
		if (leftClick(event) && this.props.onSelection) {
			event.preventDefault();
			this.props.onSelection(this.props.mention, event);
		}
	};

	private onMentionMenuItemMouseMove = (event: React.MouseEvent<any>) => {
		if (this.props.onMouseMove) {
			this.props.onMouseMove(this.props.mention, event);
		}
	};

	private onMentionMenuItemMouseEnter = (event: React.MouseEvent<any>) => {
		if (this.props.onMouseEnter) {
			this.props.onMouseEnter(this.props.mention, event);
		}
	};

	render(): React.JSX.Element {
		const { mention, selected, forwardedRef } = this.props;
		const { id, highlight, presence, name, mentionName, lozenge, accessLevel, isXProductUser } =
			mention;
		const { time } = presence || ({} as Presence);
		const restricted = isRestricted(accessLevel);

		const nameHighlights = highlight && highlight.name;

		const xProductUserInfoIconColor = selected
			? token('color.icon.selected', '#0C66E4')
			: token('color.icon', '#44546F');

		return (
			<MessagesIntlProvider>
				<MentionItemStyle
					selected={selected}
					onMouseDown={this.onMentionSelected}
					onMouseMove={this.onMentionMenuItemMouseMove}
					onMouseEnter={this.onMentionMenuItemMouseEnter}
					data-mention-item
					data-testid={`mention-item-${id}`}
					data-mention-id={id}
					data-mention-name={mentionName}
					data-selected={selected}
					ref={forwardedRef}
				>
					<RowStyle>
						<AvatarStyle restricted={restricted}>
							<MentionAvatar selected={selected} mention={mention} />
						</AvatarStyle>
						<NameSectionStyle restricted={restricted}>
							{renderHighlight(FullNameStyle, name, nameHighlights)}
							<MentionDescriptionByline mention={mention} />
						</NameSectionStyle>
						<InfoSectionStyle restricted={restricted}>
							{renderLozenge(lozenge)}
							{renderTime(time)}
						</InfoSectionStyle>
						{restricted ? (
							<React.Suspense fallback={null}>
								<AsyncNoAccessTooltip name={name!}>
									<AccessSectionStyle>
										<NoAccessLabel>
											{
												(text) => (
													<AsyncLockCircleIcon label={text} />
												) /* safe to cast to string given there is no value binding */
											}
										</NoAccessLabel>
									</AccessSectionStyle>
								</AsyncNoAccessTooltip>
							</React.Suspense>
						) : null}
						{isXProductUser && <EditorPanelIcon color={xProductUserInfoIconColor} label={''} />}
					</RowStyle>
				</MentionItemStyle>
			</MessagesIntlProvider>
		);
	}
}

export const MentionItemWithRef = React.forwardRef<HTMLDivElement, Omit<Props, 'forwardedRef'>>(
	(props, ref) => {
		return <MentionItem {...props} forwardedRef={ref} />;
	},
);
