/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ChangeEvent, useCallback, useState } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const resultStyles = css({
	borderColor: token('color.border'),
	borderStyle: 'dashed',
	borderWidth: token('border.width', '1px'),
	color: token('color.text.subtle'),
	marginBlockEnd: token('space.100', '8px'),
	marginBlockStart: token('space.100', '8px'),
	marginInlineEnd: token('space.100', '8px'),
	marginInlineStart: token('space.100', '8px'),
	paddingBlockEnd: token('space.100', '8px'),
	paddingBlockStart: token('space.100', '8px'),
	paddingInlineEnd: token('space.100', '8px'),
	paddingInlineStart: token('space.100', '8px'),
});

export default function CheckboxGroups() {
	const [flexDirection, setFlexDirection] = useState<'column' | 'row' | undefined>('column');

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		switch (event.currentTarget.value) {
			case 'column':
				setFlexDirection(event.currentTarget.checked ? 'column' : undefined);
				break;
			case 'row':
				setFlexDirection(event.currentTarget.checked ? 'row' : undefined);
				break;
			default:
				break;
		}
	}, []);

	return (
		<div>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'flex',
					flexDirection: flexDirection,
				}}
			>
				<Checkbox
					isDisabled={flexDirection === 'row'}
					label="Flex-direction: column"
					value="column"
					defaultChecked
					onChange={onChange}
				/>
				<Checkbox
					isDisabled={flexDirection === 'column'}
					label="Flex-direction: row"
					value="row"
					onChange={onChange}
				/>
				<Checkbox
					isDisabled
					label="Disabled"
					value="Disabled"
					onChange={onChange}
					name="checkbox-disabled"
				/>
				<Checkbox
					isInvalid
					label="Invalid"
					value="Invalid"
					onChange={onChange}
					name="checkbox-invalid"
				/>
			</div>
			<div css={resultStyles}>
				{flexDirection
					? `flex-direction: ${flexDirection}`
					: `First two checkboxes change the flex-direction of the container div`}
			</div>
		</div>
	);
}
