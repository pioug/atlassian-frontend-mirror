import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { MockedMediaClientProvider } from '@atlaskit/media-client-react/mocked-media-client-provider';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';

import { List } from '../../../list';
import { nextNavButtonId } from '../../../navigation';

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

	describe('onNavigationRequest', () => {
		const renderTwoItemList = (props?: Partial<React.ComponentProps<typeof List>>) => {
			const [fileItem1, identifier1] = generateSampleFileItem.workingImgWithRemotePreview();
			const [fileItem2, identifier2] = generateSampleFileItem.workingGif();
			const { mediaApi } = createMockedMediaApi([fileItem1, fileItem2]);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<List items={[identifier1, identifier2]} defaultSelectedItem={identifier1} {...props} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			return { identifier1, identifier2 };
		};

		it('should commit navigation immediately when no interceptor is supplied', async () => {
			const onNavigationChange = jest.fn();
			const { identifier2 } = renderTwoItemList({ onNavigationChange });

			fireEvent.click(await screen.findByTestId(nextNavButtonId));

			expect(onNavigationChange).toHaveBeenCalledWith(identifier2);
		});

		it('should not commit navigation until the interceptor calls proceed', async () => {
			const onNavigationChange = jest.fn();
			const onNavigationRequest = jest.fn();
			const { identifier2 } = renderTwoItemList({ onNavigationChange, onNavigationRequest });

			fireEvent.click(await screen.findByTestId(nextNavButtonId));

			expect(onNavigationRequest).toHaveBeenCalledWith(identifier2, expect.any(Function));
			expect(onNavigationChange).not.toHaveBeenCalled();

			act(() => onNavigationRequest.mock.calls[0][1]());

			expect(onNavigationChange).toHaveBeenCalledWith(identifier2);
		});
	});
});
