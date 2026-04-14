/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { css, cx, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import Lozenge, { LozengeDropdownTrigger } from '@atlaskit/lozenge';
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
	lozengeDropdownContainer: {
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
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
	marginTop: token('space.025'),
	marginRight: token('space.025'),
	marginBottom: token('space.025'),
	marginLeft: token('space.025'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"&:focus-visible, &:focus-within, &[aria-expanded='true']": {
		outline: 'none',
		boxShadow: `0 0 0 2px ${token('color.border.focused')}`,
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
	trailingMetric,
	...props
}: LozengeActionTriggerProps): JSX.Element => {
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
					maxWidth={maxWidth}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={{
						backgroundColor: lozengeBackgroundColor,
						color: lozengeForegroundColor,
					}}
				>
					<span css={triggerLozengeStyles}>
						<span css={textStyles}>{text}</span>
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

	return fg('platform-dst-lozenge-tag-badge-visual-uplifts') ? (
		<Box xcss={styles.lozengeDropdownContainer}>
			<LozengeDropdownTrigger
				{...props}
				appearance={appearance}
				trailingMetric={trailingMetric}
				data-action-open={isOpen}
				data-testid={`${testId}--trigger`}
				maxWidth={maxWidth}
				testId={testId}
				ref={triggerRef}
				aria-label={
					fg('platform_navx_flex_card_status_dropdown_a11y_fix')
						? // The `as unknown` type cast is needed for react-intl v7 upgrade
							(intl.formatMessage(messages.change_status, { status: text }) as unknown as string)
						: undefined
				}
			>
				{text}
			</LozengeDropdownTrigger>
		</Box>
	) : (
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		<button
			type="button"
			{...props}
			css={triggerButtonStyles}
			data-action-open={isOpen}
			data-testid={`${testId}--trigger`}
			style={{ maxWidth }}
			onMouseDown={onMouseOrKeyDown}
			onMouseUp={onMouseOrKeyUp}
			onKeyDown={onMouseOrKeyDown}
			onKeyUp={onMouseOrKeyUp}
			ref={triggerRef}
			aria-label={
				fg('platform_navx_flex_card_status_dropdown_a11y_fix')
					? (intl.formatMessage(messages.change_status, { status: text }) as unknown as string)
					: undefined
			}
		>
			{lozenge}
		</button>
	);
};

export default LozengeActionTrigger;
