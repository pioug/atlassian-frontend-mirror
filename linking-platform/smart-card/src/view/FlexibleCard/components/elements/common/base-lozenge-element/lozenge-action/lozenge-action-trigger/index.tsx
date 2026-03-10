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

const textStyles = css({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
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
	maxWidth,
	testId,
	text,
	triggerRef,
	...props
}: LozengeActionTriggerProps) => {
	const intl = useIntl();
	const [isPressing, setIsPressing] = useState(false);
	const [lozengeBackgroundColor, setLozengeBackgroundColor] = useState<string | undefined>(
		undefined,
	);
	const [lozengeForegroundColor, setLozengeForegroundColor] = useState<string | undefined>(
		undefined,
	);

	const onMouseOrKeyDown = useCallback(() => setIsPressing(true), []);
	const onMouseOrKeyUp = useCallback(() => setIsPressing(false), []);

	useEffect(() => {
		if (isPressing) {
			setLozengeBackgroundColor(token('color.background.selected.pressed'));
			setLozengeForegroundColor(token('color.text.selected'));
		} else if (isOpen) {
			setLozengeBackgroundColor(token('color.background.selected'));

			setLozengeForegroundColor(token('color.text.selected'));
		} else {
			setLozengeBackgroundColor(undefined);
			setLozengeForegroundColor(undefined);
		}
	}, [isPressing, isOpen]);

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
					isBold
					{...(fg('platform_navx_sl_lozenge_max_width') ? { maxWidth } : undefined)}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={{
						backgroundColor: lozengeBackgroundColor,
						color: lozengeForegroundColor,
					}}
				>
					<span css={triggerLozengeStyles}>
						<span css={[fg('platform_navx_sl_lozenge_max_width') ? textStyles : undefined]}>
							{text}
						</span>
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
		isPressing,
		text,
		isOpen,
		lozengeBackgroundColor,
		lozengeForegroundColor,
		maxWidth,
	]);

	return (
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		<button
			type="button"
			{...props}
			css={triggerButtonStyles}
			data-action-open={isOpen}
			data-testid={`${testId}--trigger`}
			style={{ maxWidth: fg('platform_navx_sl_lozenge_max_width') ? maxWidth : undefined }}
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
