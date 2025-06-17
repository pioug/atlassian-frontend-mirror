import React from 'react';
import { render, screen } from '@testing-library/react';
import { MediaInlineCardErroredView } from '../..';
import { IntlProvider } from 'react-intl-next';
import ErrorIcon from '@atlaskit/icon/core/migration/error';

describe('Errored view', () => {
	it('should accept custom icon', () => {
		render(
			<IntlProvider locale={'en'}>
				<MediaInlineCardErroredView
					message="Error"
					icon={<ErrorIcon color="currentColor" label="my-icon" />}
				/>
			</IntlProvider>,
		);
		expect(screen.getByLabelText('my-icon')).toBeInTheDocument();
	});

	it('should render warning icon by default', () => {
		render(
			<IntlProvider locale={'en'}>
				<MediaInlineCardErroredView message="Error" />
			</IntlProvider>,
		);
		expect(screen.getByLabelText('error')).toBeInTheDocument();
	});

	it('should be void of a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale={'en'}>
				<MediaInlineCardErroredView message="Error" />
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});
});
