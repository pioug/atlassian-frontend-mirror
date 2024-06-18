/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { Fragment, type ReactNode, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

const toggleStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginBlockEnd: token('space.100', '8px'),
});

const labelStyles = css({
	fontSize: token('font.size.075', '12px'),
	fontWeight: token('font.weight.semibold', '600'),
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
