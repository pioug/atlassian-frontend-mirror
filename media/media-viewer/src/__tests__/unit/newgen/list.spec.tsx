import React from 'react';
import { List } from '../../../list';
import { IntlProvider } from 'react-intl-next';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { render, screen, waitFor } from '@testing-library/react';

describe('<List />', () => {
	it('should show item', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<List items={[identifier]} defaultSelectedItem={identifier} />
				</MockedMediaClientProvider>
			</IntlProvider>,
		);
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(screen.getByText('img.png')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should show controls', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<List items={[identifier]} defaultSelectedItem={identifier} />
				</MockedMediaClientProvider>
			</IntlProvider>,
		);
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(screen.getByLabelText('zoom out')).toBeInTheDocument();
		expect(screen.getByLabelText('zoom in')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});
});
