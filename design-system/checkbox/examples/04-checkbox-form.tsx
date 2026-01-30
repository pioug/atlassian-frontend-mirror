/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { css, cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iframeStyles = css({
	boxSizing: 'border-box',
	width: '100%',
	height: '300px',
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

const styles = cssMap({
	container: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

const formTestUrl = '//httpbin.org/get';

export default function CheckboxGroupExample(): JSX.Element {
	return (
		<Box xcss={styles.container}>
			<form action={formTestUrl} method="get" target="submitFrame">
				<span>
					<Checkbox label="One" value="One" name="one" />
					<Checkbox label="Two" value="two" name="two" />
					<Checkbox label="Three" value="Three" name="three" />
				</span>

				<p>When checkboxes have the same name their values are grouped when submitted.</p>

				<span>
					<Checkbox label="Same Name - One" value="Same Name - One" name="same-name" />
					<Checkbox label="Same Name - Two" value="Same Name - Two" name="same-name" />
					<Checkbox label="Same Name - Three" value="Same Name - Three" name="same-name" />
				</span>
				<p>
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</p>
			</form>
			<p>The data submitted by the form will appear below:</p>
			<iframe
				src=""
				title="Checkbox Resopnse Frame"
				id="submitFrame"
				name="submitFrame"
				css={iframeStyles}
			/>
		</Box>
	);
}
