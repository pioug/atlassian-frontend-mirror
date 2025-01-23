/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import Lozenge from '@atlaskit/lozenge';
import { Box, xcss } from '@atlaskit/primitives';

import { triggerButtonStyles, triggerLozengeStyles } from '../styled';

import { type LozengeActionTriggerProps } from './type';

const chevronDownStyles = xcss({
	marginLeft: 'space.075',
	display: 'flex',
});

const LozengeActionTriggerOld = ({
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
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<span css={triggerLozengeStyles}>
					<span>{text}</span>
					<Box as="span" xcss={chevronDownStyles}>
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

export default LozengeActionTriggerOld;
