/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import customMd from './custom-md';

const styles = css({
	marginTop: '1rem',
	textAlign: 'center',
});

const links = customMd`
[Introduction](./flexible)
• [FlexibleUiOptions](./ui-options)
• [TitleBlock](./title-block)
• [MetadataBlock](./metadata-block)
• [PreviewBlock](./preview-block)
• [SnippetBlock](./snippet-block)
• [FooterBlock](./footer-block)
• [ElementItem](./element-item)
• [ActionItem](./action-item)
`;

const FlexibleUiQuickLinks = () => <section css={styles}>{links}</section>;

export default FlexibleUiQuickLinks;
