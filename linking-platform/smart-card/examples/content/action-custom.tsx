/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import PremiumIcon from '@atlaskit/icon/glyph/premium';
import { ActionName, FooterBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[data-smart-element-badge]': {
		opacity: 0.2,
	},
});

export default () => (
	<ExampleContainer>
		<FooterBlock
			actions={[
				{
					name: ActionName.CustomAction,
					icon: <DownloadIcon label="download" />,
					content: 'Download',
					onClick: () => {},
				},
				{
					name: ActionName.CustomAction,
					icon: <PremiumIcon label="magic" />,
					content: 'Magic!',
					onClick: () => {},
				},
				{
					name: ActionName.CustomAction,
					icon: <PremiumIcon label="magic" />,
					content:
						'This is an example of a custom action with hidden content. Note how the content still appears in the tooltip.',
					hideContent: true,
					onClick: () => {},
				},
			]}
			overrideCss={styles}
		/>
	</ExampleContainer>
);
