import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { MockedMediaClientProvider } from '@atlaskit/media-client-react/mocked-media-client-provider';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers/mocked-media-api';
import { generateSampleFileItem } from '@atlaskit/media-test-data/sample-file-items';
import { hideControlsClassName } from '@atlaskit/media-ui/classNames';

import Header from '../../../headerWithIntl';
import { InsetViewerProvider } from '../../../insetViewerContext';
import { List, type Props as ListProps } from '../../../list';
import { nextNavButtonId } from '../../../navigation';
import { HeaderWrapper, ItemStage } from '../../../styleWrappers';

jest.mock('../../../headerWithIntl', () => {
	const original = jest.requireActual('../../../headerWithIntl');
	return { __esModule: true, ...original, default: jest.fn(original.default) };
});
jest.mock('../../../styleWrappers', () => {
	const original = jest.requireActual('../../../styleWrappers');
	return {
		...original,
		HeaderWrapper: jest.fn(original.HeaderWrapper),
		ItemStage: jest.fn(({ children }) => children),
	};
});

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

	describe('inset viewer', () => {
		const renderList = (isInsetViewer: boolean, props: Partial<ListProps> = {}) => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<InsetViewerProvider isInsetViewer={isInsetViewer}>
							<List items={[identifier]} defaultSelectedItem={identifier} {...props} />
						</InsetViewerProvider>
					</MockedMediaClientProvider>
				</IntlProvider>,
			);
		};

		beforeEach(() => {
			jest.mocked(Header).mockClear();
			jest.mocked(HeaderWrapper).mockClear();
			jest.mocked(ItemStage).mockClear();
		});

		it.each([
			{
				presentation: 'overlay',
				isInsetViewer: false,
				className: hideControlsClassName,
				staged: false,
			},
			{ presentation: 'inset', isInsetViewer: true, className: undefined, staged: true },
		])(
			'should render the header in the $presentation viewer',
			({ isInsetViewer, className, staged }) => {
				renderList(isInsetViewer);

				expect(Header).toHaveBeenCalled();
				// The overlay header auto-hides with the other controls; the inset header stays visible.
				expect(HeaderWrapper).toHaveBeenLastCalledWith(
					expect.objectContaining({ className }),
					expect.anything(),
				);
				expect(jest.mocked(ItemStage).mock.calls.length > 0).toBe(staged);
			},
		);

		it('should give the header the inset close handler and sidebar toggle ref', () => {
			const onClose = jest.fn();
			const onHeaderClose = jest.fn();
			const sidebarToggleRef = React.createRef<HTMLButtonElement>();
			renderList(true, { onClose, onHeaderClose, sidebarToggleRef });

			expect(Header).toHaveBeenLastCalledWith(
				expect.objectContaining({ onClose: onHeaderClose, sidebarToggleRef }),
				expect.anything(),
			);
		});

		it('should give the header the list close handler without an inset one', () => {
			const onClose = jest.fn();
			renderList(false, { onClose });

			expect(Header).toHaveBeenLastCalledWith(
				expect.objectContaining({ onClose }),
				expect.anything(),
			);
		});
	});
});
