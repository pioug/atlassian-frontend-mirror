import React from 'react';
import ActionItemDoc from './content/action-item';
import ElementItemDoc from './content/element-item';
import FlexibleCardDoc from './content/flexible-card';
import FooterBlockDoc from './content/footer-block';
import MetadataBlockDoc from './content/metadata-block';
import PreviewBlockDoc from './content/preview-block';
import SnippetBlockDoc from './content/snippet-block';
import TitleBlockDoc from './content/title-block';
import CustomBlockDoc from './content/custom-block';
import UIOptionsDoc from './content/ui-options';
import customMd from './utils/custom-md';
import LinkTabs from './utils/link-tabs';
import DocQuickLinks from './utils/doc-quick-links';

export default customMd`

${(<DocQuickLinks />)}

${(
	<LinkTabs
		tabs={[
			{ name: 'Overview', content: FlexibleCardDoc },
			{ name: 'UI', content: UIOptionsDoc },
			{ name: 'TitleBlock', content: TitleBlockDoc },
			{ name: 'MetadataBlock', content: MetadataBlockDoc },
			{ name: 'PreviewBlock', content: PreviewBlockDoc },
			{ name: 'SnippetBlock', content: SnippetBlockDoc },
			{ name: 'FooterBlock', content: FooterBlockDoc },
			{ name: 'CustomBlock', content: CustomBlockDoc },
			{ name: 'ElementItem', content: ElementItemDoc },
			{ name: 'ActionItem', content: ActionItemDoc },
		]}
	/>
)}
`;
