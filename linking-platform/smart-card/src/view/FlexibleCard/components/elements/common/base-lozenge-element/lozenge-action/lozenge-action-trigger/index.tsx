/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { css, cx, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';


import { cssMap } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../../../../../messages';

import { type LozengeActionTriggerProps } from './type';

const styles = cssMap({
	chevronDown: {
		marginLeft: token('space.075'),
		display: 'flex',
	},
	lozengeContainer: {
		all: 'unset',
		backgroundColor: 'transparent',
		borderRadius: token('radius.small'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: 'transparent',
		display: 'flex',
		alignItems: 'center',
		height: '16px',
	},
	lozengeContainerSelected: {
		borderColor: token('color.border.focused'),
		overflow: 'hidden',
	},
});

const triggerLozengeStyles = css({
	alignItems: 'center',
	display: 'flex',
});

const triggerButtonStyles = css({
	all: 'unset',
	backgroundColor: 'transparent',
	color: 'unset',
	cursor: 'pointer',
	fontFamily: 'unset',
	fontSize: 'unset',
	fontStyle: 'unset',
	fontWeight: 'unset',
	fontVariant: 'unset',
	lineHeight: 0,
	padding: 0,
	textTransform: 'unset',
	borderStyle: 'solid',
	borderWidth: token('border.width.selected'),
	borderColor: 'transparent',
	marginTop: token('space.025', '2px'),
	marginRight: token('space.025', '2px'),
	marginBottom: token('space.025', '2px'),
	marginLeft: token('space.025', '2px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"&:focus-visible, &:focus-within, &[aria-expanded='true']": {
		outline: 'none',
		boxShadow: `0 0 0 2px ${token('color.border.focused', '#388BFF')}`,
		borderRadius: token('radius.medium'),
	},
});

const LozengeActionTrigger = ({
	appearance,
	isOpen,
	testId,
	text,
	triggerRef,
	...props
}: LozengeActionTriggerProps) => {
	const intl = useIntl();
	const [isHovering, setIsHovering] = useState(false);
	const [isPressing, setIsPressing] = useState(false);
	const [lozengeBackgroundColor, setLozengeBackgroundColor] = useState<string | undefined>(
		undefined,
	);
	const [lozengeForegroundColor, setLozengeForegroundColor] = useState<string | undefined>(
		undefined,
	);

	const onMouseEnter = useCallback(() => setIsHovering(true), []);
	const onMouseLeave = useCallback(() => setIsHovering(false), []);
	const onMouseOrKeyDown = useCallback(() => setIsPressing(true), []);
	const onMouseOrKeyUp = useCallback(() => setIsPressing(false), []);

	useEffect(() => {
		if (isPressing) {
			setLozengeBackgroundColor(token('color.background.selected.pressed'));
			setLozengeForegroundColor(token('color.text.selected'));
		} else if (isOpen) {
			if (isHovering) {
				setLozengeBackgroundColor(token('color.background.selected.hovered'));
			} else {
				setLozengeBackgroundColor(token('color.background.selected'));
			}
			setLozengeForegroundColor(token('color.text.selected'));
		} else {
			setLozengeBackgroundColor(undefined);
			setLozengeForegroundColor(undefined);
		}
	}, [isPressing, isOpen, isHovering]);

	const lozenge = useMemo(() => {
		return (
			<Box
				xcss={cx(
					styles.lozengeContainer,
					(isOpen || isPressing) && styles.lozengeContainerSelected,
				)}
				as="span"
			>
				<Lozenge
					appearance={appearance}
					isBold={fg('platform-component-visual-refresh') ? true : isHovering}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={{
						backgroundColor: lozengeBackgroundColor,
						color: lozengeForegroundColor,
					}}
				>
					<span css={triggerLozengeStyles}>
						<span>{text}</span>
						<Box as="span" xcss={styles.chevronDown}>
							<ChevronDownIcon
								color="currentColor"
								label="options"
								size="small"
								aria-hidden={true}
							/>
						</Box>
					</span>
				</Lozenge>
			</Box>
		);
	}, [
		appearance,
		isHovering,
		isPressing,
		text,
		isOpen,
		lozengeBackgroundColor,
		lozengeForegroundColor,
	]);

	return (
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		<button
			type="button"
			{...props}
			css={triggerButtonStyles}
			data-action-open={isOpen}
			data-testid={`${testId}--trigger`}
			// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
			onMouseEnter={onMouseEnter}
			// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
			onMouseLeave={onMouseLeave}
			onMouseDown={onMouseOrKeyDown}
			onMouseUp={onMouseOrKeyUp}
			onKeyDown={onMouseOrKeyDown}
			onKeyUp={onMouseOrKeyUp}
			ref={triggerRef}
			aria-label={
				fg('platform_navx_flex_card_status_dropdown_a11y_fix')
					? (intl.formatMessage(messages.change_status, { status: text }) as string)
					: undefined
			}
		>
			{lozenge}
		</button>
	);
};

export default LozengeActionTrigger;
