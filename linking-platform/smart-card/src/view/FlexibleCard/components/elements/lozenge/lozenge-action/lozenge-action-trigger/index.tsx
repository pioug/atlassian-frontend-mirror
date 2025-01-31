/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import LozengeActionTriggerOld from './LozengeActionTriggerOld';
import { type LozengeActionTriggerProps } from './type';

const styles = cssMap({
	chevronDown: {
		marginLeft: token('space.075'),
		display: 'flex',
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
	borderWidth: '2px',
	borderColor: 'transparent',
	marginTop: token('space.025', '2px'),
	marginRight: token('space.025', '2px'),
	marginBottom: token('space.025', '2px'),
	marginLeft: token('space.025', '2px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"&:focus-visible, &:focus-within, &[aria-expanded='true']": {
		outline: 'none',
		boxShadow: `0 0 0 2px ${token('color.border.focused', '#388BFF')}`,
		borderRadius: '5px',
	},
});

const LozengeActionTriggerNew = ({
	appearance,
	isOpen,
	testId,
	text,
	triggerRef,
	...props
}: LozengeActionTriggerProps) => {
	const [isBold, setIsBold] = useState(false);
	const onMouseEnter = useCallback(() => setIsBold(true), []);
	const onMouseLeave = useCallback(() => setIsBold(false), []);

	const lozenge = useMemo(
		() => (
			<Lozenge appearance={appearance} isBold={isBold}>
				<span css={triggerLozengeStyles}>
					<span>{text}</span>
					<Box as="span" xcss={styles.chevronDown}>
						<ChevronDownIcon
							color="currentColor"
							label="options"
							LEGACY_size="medium"
							LEGACY_margin="-4px -8px -4px -7px"
						/>
					</Box>
				</span>
			</Lozenge>
		),
		[appearance, isBold, text],
	);
	return (
		<button
			type="button"
			{...props}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={triggerButtonStyles}
			data-action-open={isOpen}
			data-testid={`${testId}--trigger`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={triggerRef}
		>
			{lozenge}
		</button>
	);
};

const LozengeActionTrigger = (props: LozengeActionTriggerProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <LozengeActionTriggerNew {...props} />;
	} else {
		return <LozengeActionTriggerOld {...props} />;
	}
};

export default LozengeActionTrigger;
