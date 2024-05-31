import React from 'react';

import { render, screen } from '@testing-library/react';

import type { EditorAppearance } from '@atlaskit/editor-common/types';

import Editor from '../../editor';

const appearances: EditorAppearance[] = ['full-page', 'comment', 'chromeless'];

describe.each(appearances)('%s content components prop', (appearance) => {
	it('should render expected content before and after the editor when custom content components prop includes before and after', async () => {
		// Case where contentComponents prop type is BeforeAndAfterContentComponents
		render(
			<Editor
				appearance={appearance}
				contentComponents={{
					before: <span>UI Before</span>,
					after: <span>UI After</span>,
				}}
			/>,
		);
		expect(screen.getByText('UI Before')).toBeInTheDocument();
		expect(screen.getByText('UI After')).toBeInTheDocument();
	});

	it('should render expected content before the editor when custom content components prop does not include before and after', async () => {
		// Case where contentComponents prop type is ReactComponent
		render(<Editor appearance={appearance} contentComponents={<span>UI Before</span>} />);
		expect(screen.getByText('UI Before')).toBeInTheDocument();
	});
});
