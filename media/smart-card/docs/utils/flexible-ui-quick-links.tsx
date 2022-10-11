/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import customMd from './custom-md';

const styles = css`
  margin-top: 1rem;
  text-align: center;
`;

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

const FlexibleUiQuickLinks: React.FC = () => (
  <section css={styles}>{links}</section>
);

export default FlexibleUiQuickLinks;
