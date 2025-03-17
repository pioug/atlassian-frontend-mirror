/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { InlineCardResolvedView as ResolvedView } from '../../src/view/InlineCard/ResolvedView';
import { VRTestCase } from '../utils/common';

const styles = css({
	maxWidth: '50px',
});

export default () => {
	return (
		<VRTestCase title="Inline card text wrap">
			{() => (
				<div css={styles}>
					<ResolvedView
						isSelected={false}
						icon={'broken-url'}
						title="hyphens - CSS: Cascading Style Sheets | MDN"
						lozenge={{
							text: 'in progress',
							appearance: 'inprogress',
						}}
					/>
				</div>
			)}
		</VRTestCase>
	);
};
