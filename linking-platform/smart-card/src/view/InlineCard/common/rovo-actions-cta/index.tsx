/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

import { useIntl } from "react-intl";

import { cssMap, cx, jsx } from '@atlaskit/css';
import AiGenerativeTextSummaryIcon from '@atlaskit/icon/core/ai-generative-text-summary';
import RovoChatIcon from '@atlaskit/icon/core/rovo-chat';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import useRovoChat from "../../../../state/hooks/use-rovo-chat";
import { getPromptAction, RovoChatPromptKey } from "../../../common/rovo-chat-utils";
import { ActionButton } from "../action-button";

const styles = cssMap({
	innerContainer: {
		display: 'inline',
		backgroundClip: 'padding-box',
		boxDecorationBreak: 'clone',
		paddingLeft: token('space.075'),
		paddingRight: token('space.075'),
	},
	rovoIcon: {
		color: token('color.text.inverse'),
		cursor: 'pointer',
		backgroundColor: token('color.background.selected.bold'),
		borderTopRightRadius: token('radius.xsmall'),
		borderBottomRightRadius: token('radius.xsmall'),
		paddingTop: token('space.025'),
		paddingBottom: token('space.025'),
	},
	text: {
		display: 'inline',
		paddingLeft: token('space.075'),
	}
});

export const RovoActionsCta = ({ testId }: { testId?: string }): JSX.Element => {
	return (
		<Box xcss={cx(styles.innerContainer, styles.rovoIcon)} testId={testId}>
			<RovoChatIcon label="Rovo" color={token('color.icon.inverse')} size="small" />
		</Box>
	);
};

export const InlineRovoActionButton = ({ testId, url }: { testId?: string, url?: string }): JSX.Element | null => {
	const { sendPromptMessage, isRovoChatEnabled } = useRovoChat();
	const intl = useIntl();

	// TODO: NAVX-5109 implement tailored rovo chat actions here
	const { data: promptData, content } = getPromptAction(RovoChatPromptKey.SUMMARIZE_LINK, intl, url) || {}

	const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		event.stopPropagation();

		if (isRovoChatEnabled && promptData) {
			sendPromptMessage(promptData)
		}
	}, [sendPromptMessage, isRovoChatEnabled, promptData])

	return promptData && content ? (
		<ActionButton onClick={handleClick} testId={testId}>
			<AiGenerativeTextSummaryIcon label="Rovo" color={token('color.icon')} size="small" />
			<Box xcss={styles.text}>
				<Text size="small">{content}</Text>
			</Box>
		</ActionButton>
	) : null;
};
