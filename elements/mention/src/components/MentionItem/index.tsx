/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import React from 'react';

import EditorPanelIcon from '@atlaskit/icon/core/status-information';
import Lozenge from '@atlaskit/lozenge/new/lozenge';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import Tag from '@atlaskit/tag/removable-tag';
import type { TagColor } from '@atlaskit/tag/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';
import { PICKER_ITEM_HEIGHT } from '@atlaskit/user-picker/picker-item-content';

import { isAgentMention } from '../../is-agent-mention';
import { isRestricted } from '../../is-restricted';
import type {
	MentionDescription,
	OnMentionEvent,
	Presence,
	LozengeProps,
	LozengeColor,
} from '../../types';
import { NoAccessLabel } from '../../util/i18n';
import { leftClick } from '../../util/left-click';
import AsyncLockCircleIcon from '../LockCircleIcon';
import MessagesIntlProvider from '../MessagesIntlProvider';
import AsyncNoAccessTooltip from '../NoAccessTooltip';
import { MentionItemLayoutNext } from './MentionItemLayout';
import { MentionItemLayoutLegacy } from './MentionItemLayoutLegacy';
import {
	AccessSectionStyle,
	InfoSectionStyle,
	MentionItemStyle,
	RowStyle as RowStyleLegacy,
	RowStyleNext,
	TimeStyle,
} from './styles';

// Lazy-loaded so `@atlaskit/skeleton` (only needed for the loading
// placeholder) doesn't enter the bundle for every `@atlaskit/mention`
// consumer — only when an `isPlaceholder` mention is actually rendered.
const MentionItemPlaceholder = React.lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_mention-item-placeholder" */ './MentionItemPlaceholder'
		),
);

/**
 * @deprecated Use `import { MENTION_ITEM_HEIGHT, MENTION_ITEM_HEIGHT_REFRESHED } from '@atlaskit/mention/mention-item/styles'` instead.
 */
export { MENTION_ITEM_HEIGHT, MENTION_ITEM_HEIGHT_REFRESHED } from './styles';

const lozengeAppearanceToTagColor: Record<LozengeColor, TagColor> = {
	default: 'standard',
	success: 'lime',
	removed: 'red',
	inprogress: 'blue',
	new: 'purple',
	moved: 'orange',
};

function renderTag(lozenge?: string | LozengeProps) {
	if (typeof lozenge === 'string') {
		return <Tag text={lozenge} color="standard" isRemovable={false} migration_fallback="lozenge" />;
	}
	if (typeof lozenge === 'object') {
		const { appearance, text } = lozenge;
		const color = appearance ? lozengeAppearanceToTagColor[appearance] : 'standard';
		return (
			<Tag text={text as string} color={color} isRemovable={false} migration_fallback="lozenge" />
		);
	}
	return null;
}

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
	height?: number;
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
		const height = isExperimentEnabled('platform_editor_mentions_email_search')
			? PICKER_ITEM_HEIGHT
			: this.props.height;
		const { id, presence, name, mentionName, lozenge, accessLevel, isXProductUser } = mention;

		if (mention.isPlaceholder) {
			return (
				<MessagesIntlProvider>
					{/* Height-preserving fallback so the row doesn't collapse and jump
					 * while the lazy placeholder chunk loads. */}
					<React.Suspense fallback={<MentionItemStyle height={height} aria-hidden />}>
						<MentionItemPlaceholder height={height} forwardedRef={forwardedRef} id={id} />
					</React.Suspense>
				</MessagesIntlProvider>
			);
		}
		const { time } = presence || ({} as Presence);
		const restricted = isRestricted(accessLevel);

		const xProductUserInfoIconColor = selected ? token('color.icon.selected') : token('color.icon');

		let RowStyle = RowStyleLegacy;
		let isAgent = false;
		if (
			expValEquals('platform_editor_agent_mentions', 'isEnabled', true) &&
			fg('platform_editor_agent_mentions_drop_one_fixes')
		) {
			RowStyle = RowStyleNext;
			isAgent = isAgentMention(mention);
		}

		const ItemLayout = isExperimentEnabled('platform_editor_mentions_email_search')
			? MentionItemLayoutNext
			: MentionItemLayoutLegacy;
		return (
			<MessagesIntlProvider>
				<MentionItemStyle
					selected={selected}
					height={height}
					onMouseDown={this.onMentionSelected}
					onMouseMove={this.onMentionMenuItemMouseMove}
					onMouseEnter={this.onMentionMenuItemMouseEnter}
					data-mention-item
					data-testid={`mention-item-${id}`}
					data-mention-id={id}
					data-mention-name={mentionName}
					data-mention-is-agent={isAgent ? 'true' : undefined}
					data-selected={selected}
					ref={forwardedRef}
				>
					<ItemLayout mention={mention} selected={selected} legacyRow={RowStyle}>
						<InfoSectionStyle restricted={restricted}>
							{fg('platform-dst-lozenge-tag-badge-visual-uplifts')
								? renderTag(lozenge)
								: renderLozenge(lozenge)}
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
					</ItemLayout>
				</MentionItemStyle>
			</MessagesIntlProvider>
		);
	}
}

export const MentionItemWithRef: React.ForwardRefExoticComponent<
	Omit<Props, 'forwardedRef'> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, Omit<Props, 'forwardedRef'>>((props, ref) => {
	return <MentionItem {...props} forwardedRef={ref} />;
});
