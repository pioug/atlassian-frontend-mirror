/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { avatarGroupMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { AvatarGroupPlugin } from '../index';

import AvatarsWithPluginState from './avatars-with-plugin-state';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const toolbarButtonWrapper = css({
	display: 'flex',
	justifyContent: 'flex-end',
	flexGrow: 0,
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		marginRight: 0,
	},
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const toolbarButtonWrapperFullWidth = css(toolbarButtonWrapper, {
	flexGrow: 1,
});

const AvatarGroupPluginWrapper = (props: {
	collabEdit?: CollabEditOptions;
	editorView: EditorView;
	eventDispatcher: EventDispatcher<any>;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	takeFullWidth: boolean;
	featureFlags: FeatureFlags;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	editorAPI: ExtractInjectionAPI<AvatarGroupPlugin> | undefined;
}) => {
	const { dispatchAnalyticsEvent, featureFlags } = props;
	const intl = useIntl();

	useEffect(() => {
		if (!dispatchAnalyticsEvent) {
			return;
		}

		dispatchAnalyticsEvent({
			action: ACTION.VIEWED,
			actionSubject: ACTION_SUBJECT.BUTTON,
			actionSubjectId: ACTION_SUBJECT_ID.AVATAR_GROUP_PLUGIN,
			eventType: EVENT_TYPE.UI,
		});
	}, [dispatchAnalyticsEvent]);

	return (
		<div
			aria-label={intl.formatMessage(avatarGroupMessages.editors)}
			data-testid={'avatar-group-in-plugin'}
			css={props.takeFullWidth ? toolbarButtonWrapperFullWidth : toolbarButtonWrapper}
		>
			<AvatarsWithPluginState
				editorView={props.editorView}
				eventDispatcher={props.eventDispatcher}
				inviteToEditComponent={props.collabEdit && props.collabEdit.inviteToEditComponent}
				inviteToEditHandler={props.collabEdit && props.collabEdit.inviteToEditHandler}
				isInviteToEditButtonSelected={
					props.collabEdit && props.collabEdit.isInviteToEditButtonSelected
				}
				featureFlags={featureFlags}
				editorAnalyticsAPI={props.editorAnalyticsAPI}
				editorAPI={props.editorAPI}
			/>
		</div>
	);
};

export default AvatarGroupPluginWrapper;
