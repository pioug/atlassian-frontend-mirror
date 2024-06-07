/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useCallback, useMemo, useState } from 'react';
import Lozenge from '@atlaskit/lozenge';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { triggerButtonStyles, triggerLozengeStyles } from '../styled';

import type { FC } from 'react';
import { type LozengeActionTriggerProps } from './type';

const LozengeActionTrigger: FC<LozengeActionTriggerProps> = ({
	appearance,
	isOpen,
	testId,
	text,
	triggerRef,
	...props
}) => {
	const [isBold, setIsBold] = useState(false);
	const onMouseEnter = useCallback(() => setIsBold(true), []);
	const onMouseLeave = useCallback(() => setIsBold(false), []);

	const lozenge = useMemo(
		() => (
			<Lozenge appearance={appearance} isBold={isBold}>
				<span css={triggerLozengeStyles}>
					<span>{text}</span>
					<ChevronDownIcon label="options" size="medium" />
				</span>
			</Lozenge>
		),
		[appearance, isBold, text],
	);
	return (
		<button
			type="button"
			{...props}
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

export default LozengeActionTrigger;
