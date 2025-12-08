/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

const toggleStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginBlockEnd: token('space.100'),
});

const labelStyles = css({
	font: token('font.heading.xxsmall'),
});

const ToggleVisuallyHidden = ({
	children,
	id,
}: {
	id: string;
	children(isVisible: boolean): ReactNode;
}) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<Fragment>
			<div css={toggleStyles}>
				<Toggle
					id={id}
					isChecked={isVisible}
					onChange={(e) => setIsVisible(e.currentTarget.checked)}
					testId="toggle-visually-hidden"
				/>
				<label htmlFor={id} css={labelStyles}>
					Show hidden content
				</label>
			</div>
			{children(isVisible)}
		</Fragment>
	);
};

export default ToggleVisuallyHidden;
