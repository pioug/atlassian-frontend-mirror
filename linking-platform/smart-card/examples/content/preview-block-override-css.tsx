/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { PreviewBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[data-smart-element-media]': {
		aspectRatio: '4 / 3',
		'@supports not (aspect-ratio: auto)': {
			paddingTop: '75%',
		},
	},
});

export default () => (
	<ExampleContainer>
		<PreviewBlock overrideCss={styles} />
	</ExampleContainer>
);
