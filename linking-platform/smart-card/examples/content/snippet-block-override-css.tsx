/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { SnippetBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css({
	fontStyle: 'italic',
});

export default () => (
	<ExampleContainer>
		<SnippetBlock overrideCss={styles} />
	</ExampleContainer>
);
