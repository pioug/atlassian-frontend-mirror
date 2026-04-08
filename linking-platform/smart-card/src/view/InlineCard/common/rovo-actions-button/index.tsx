/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap, cx, jsx } from '@atlaskit/css';
import RovoChatIcon from '@atlaskit/icon/core/rovo-chat';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../messages';
import AIPrism from '../../../common/ai-prism';
import { ActionButton } from '../action-button';
import { RovoPostAuthActionsModal } from '../rovo-post-auth-actions-modal';

const styles = cssMap({
	wrapper: {
		position: 'relative',
		display: 'inline-block',
	},
	expanded: {
		position: 'absolute',
		top: '0',
		right: '0',
		display: 'inline',
		whiteSpace: 'nowrap',
		zIndex: 1,
	},
	expandedText: {
		display: 'inline-block',
		maxWidth: '0px',
		overflow: 'hidden',
		verticalAlign: 'top',
		transition: 'max-width 0.3s ease-in-out, padding-right 0.3s ease-in-out',
		whiteSpace: 'nowrap',
	},
	expandedTextVisible: {
		maxWidth: '200px',
		paddingRight: token('space.050'),
	},
});

export interface RovoActionsButtonProps {
	onClick?: (e: React.MouseEvent<HTMLElement>) => void;
	testId?: string;
	title?: string;
	url?: string;
}

export const RovoActionsButton = ({ onClick, testId, title = '', url = ''}: RovoActionsButtonProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const { formatMessage } = useIntl();
	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsPopupOpen((prev) => !prev);
		onClick?.(e);
	};

	return (
		<Popup
			isOpen={isPopupOpen}
			onClose={() => setIsPopupOpen(false)}
			placement="right-start"
			content={() => (
				<AIPrism isVisible isMoving isGlowing>
					<RovoPostAuthActionsModal title={title} url={url} testId={testId && `${testId}-popup`} />
				</AIPrism>
			)}
			trigger={(triggerProps) => (
				<Box
					xcss={styles.wrapper}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					onFocus={() => setIsHovered(true)}
					onBlur={() => setIsHovered(false)}
				>
					<ActionButton onClick={handleClick} viewType="action" testId={testId} {...triggerProps}>
						<RovoChatIcon label="Rovo" color={token('color.icon.inverse')} size="small" />
					</ActionButton>
					<Box xcss={styles.expanded}>
						<ActionButton onClick={handleClick} viewType="action" {...triggerProps}>
							<Box xcss={cx(styles.expandedText, isHovered && styles.expandedTextVisible)}>
								{formatMessage(messages.rovo_actions_explore)}
							</Box>
							<RovoChatIcon
								label="Rovo"
								color={token('color.icon.inverse')}
								size="small"
							/>
						</ActionButton>
					</Box>
				</Box>
			)}
		/>
	);
};
