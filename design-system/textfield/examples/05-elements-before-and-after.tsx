/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import { css, cssMap, jsx } from '@atlaskit/css';
import EditIcon from '@atlaskit/icon/core/edit';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import { Flex } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const afterStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	lineHeight: '100%' as any,
	paddingInlineEnd: token('space.075'),
});

const beforeStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	lineHeight: '100%' as any,
	paddingInlineStart: token('space.075'),
});

export default function ElementsBeforeAfterExample(): JSX.Element {
	return (
		<Fragment>
			<label htmlFor="after-input">After input</label>
			<Textfield
				testId="after-input"
				id="after-input"
				elemAfterInput={
					<div css={afterStyle}>
						<Flex xcss={iconSpacingStyles.space050}>
							<ErrorIcon label="error" />
						</Flex>
					</div>
				}
			/>
			<label htmlFor="before-input">Before input</label>
			<Textfield
				testId="before-input"
				id="before-input"
				elemBeforeInput={
					<div css={beforeStyle}>
						<Avatar size="small" borderColor="transparent" />
					</div>
				}
			/>
			<label htmlFor="after-input-focusable">With focusable</label>
			<Textfield
				testId="after-input-focusable"
				id="after-input-focusable"
				elemAfterInput={
					<div css={afterStyle}>
						<IconButton appearance="subtle" icon={EditIcon} label="Edit" spacing="compact" />
					</div>
				}
			/>
		</Fragment>
	);
}
