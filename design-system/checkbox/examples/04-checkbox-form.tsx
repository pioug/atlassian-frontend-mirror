/**  @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { Checkbox } from '../src';

const iframeStyles = css({
	boxSizing: 'border-box',
	width: '95%',
	height: '300px',
	margin: token('space.100', '8px'),
	padding: token('space.100', '8px'),
	borderColor: '#ccc',
	borderStyle: 'dashed',
	borderWidth: token('border.width', '1px'),
	color: '#ccc',
});

const formTestUrl = '//httpbin.org/get';

export default function CheckboxGroupExample() {
	return (
		<div>
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
		</div>
	);
}
