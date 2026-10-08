import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { FilmstripView } from '@atlaskit/media-filmstrip/filmstrip-view';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { CardView } from '../../../media-card/src/card/cardView';
const styles = cssMap({
	subject: {
		width: '400px',
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
				<FilmstripView animate={false} offset={0} onSize={() => {}} onScroll={() => {}}>
					{['Release notes.pdf', 'Roadmap.pdf'].map((name) => (
						<CardView
							key={name}
							identifier={{ id: name, mediaItemType: 'file' }}
							status="complete"
							mediaItemType="file"
							dimensions={{ width: 180, height: 120 }}
							metadata={{
								id: name,
								name,
								size: 240000,
								mediaType: 'doc',
								mimeType: 'application/pdf',
							}}
						/>
					))}
				</FilmstripView>
			</Box>
		</IntlProvider>
	);
}
