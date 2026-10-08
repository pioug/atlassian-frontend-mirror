import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { DocumentViewer } from '../../src/documentViewer';
const imageUrl =
	'data:image/svg+xml,' +
	encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="440" viewBox="0 0 360 440"><rect width="360" height="440" fill="white"/><text x="32" y="58" fill="#172B4D" font-family="Arial" font-size="26" font-weight="bold">Release notes</text><text x="32" y="86" fill="#44546F" font-family="Arial" font-size="14">June 2026</text><path d="M32 114H328" stroke="#DCDFE4"/><text x="32" y="150" fill="#172B4D" font-family="Arial" font-size="18" font-weight="bold">Project updates</text><g fill="#DCDFE4"><rect x="32" y="170" width="290" height="8" rx="4"/><rect x="32" y="188" width="264" height="8" rx="4"/><rect x="32" y="206" width="280" height="8" rx="4"/></g><rect x="32" y="248" width="296" height="128" rx="8" fill="#E9F2FF"/><path d="M64 344V314H106V344ZM128 344V284H170V344ZM192 344V300H234V344ZM256 344V266H298V344Z" fill="#0C66E4"/></svg>`,
	);
const contents = {
	start_index: 0,
	end_index: 1,
	total_pages: 1,
	fonts: [],
	pages: [{ rotation: 0, width: 360, height: 440, lines: [] }],
};
const styles = cssMap({
	subject: {
		width: '260px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<DocumentViewer
					getContent={async () => contents}
					getPageImageUrl={async () => imageUrl}
					zoom={0.6}
				/>
			</Box>
		</IntlProvider>
	);
}
