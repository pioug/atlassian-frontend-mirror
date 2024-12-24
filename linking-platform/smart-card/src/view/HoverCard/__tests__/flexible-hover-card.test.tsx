jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);
jest.doMock('../../../utils/analytics/analytics');
jest.mock('react-render-image', () => ({ src, errored, onError }: any) => {
	switch (src) {
		case 'src-error':
			onError && onError();
			return errored;
		default:
			return null;
	}
});

import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import { act, fireEvent, screen } from '@testing-library/react';

import {
	ActionName,
	Card,
	type CardAppearance,
	ElementName,
	TitleBlock,
} from '@atlaskit/smart-card';

import { analyticsTests } from './common/analytics.test-utils';
import { runCommonHoverCardTests, unauthorizedViewTests } from './common/common.test-utils';
import {
	mockIntersectionObserver,
	setup,
	setupEventPropagationTest,
	type SetUpParams,
	userEventOptionsWithAdvanceTimers,
} from './common/setup.test-utils';

describe('hover card over flexible smart links', () => {
	const hoverCardTestId = 'hover-card';
	const triggerTestId = 'smart-block-title-resolved-view';
	const secondaryChildTestId = 'smart-element-icon';

	const appearance = 'block' as const;
	const noop = () => {};
	const children = (
		<TitleBlock
			actions={[
				{ name: ActionName.EditAction, onClick: noop },
				{ name: ActionName.DeleteAction, onClick: noop },
				{ name: ActionName.CustomAction, onClick: noop, content: 'custom' },
			]}
			metadata={[{ name: ElementName.AuthorGroup }]}
		/>
	);

	const hoverAndVerify = async (
		{ element: trigger, event }: Awaited<ReturnType<typeof setup>>,
		hoverCardTestId: string,
		testId: string,
		expectToBeInTheDocument: boolean,
	) => {
		await event.unhover(trigger);
		act(() => {
			jest.runAllTimers();
		});

		const element = await screen.findByTestId(testId);
		expect(element).toBeInTheDocument();

		await event.hover(element);

		if (expectToBeInTheDocument) {
			expect(await screen.findByTestId(hoverCardTestId)).toBeInTheDocument();
		} else {
			expect(screen.queryByTestId(hoverCardTestId)).not.toBeInTheDocument();
		}
	};

	const clickMoreActionAndVerifyNotToBeInDocument = async (
		{ element: trigger, event }: Awaited<ReturnType<typeof setup>>,
		hoverCardTestId: string,
		testId: string,
	) => {
		await event.hover(trigger);
		await event.unhover(trigger);

		const moreButton = await screen.findByTestId('action-group-more-button');
		await event.click(moreButton);

		const element = await screen.findByTestId(testId);
		expect(element).toBeInTheDocument();

		await event.hover(element);
		await event.hover(element);

		expect(screen.queryByTestId(hoverCardTestId)).not.toBeInTheDocument();
	};

	const setupComponent = (setupProps?: SetUpParams) =>
		setup({
			testId: triggerTestId,
			...setupProps,
			extraCardProps: {
				appearance: 'block' as CardAppearance,
				children: children,
				...setupProps?.extraCardProps,
			},
		});

	const testConfig = {
		testIds: {
			unauthorizedTestId: 'smart-block-title-errored-view',
			secondaryChildTestId: secondaryChildTestId,
			erroredTestId: 'smart-block-title-errored-view',
		},
	};

	beforeEach(() => {
		jest.useFakeTimers({ legacyFakeTimers: true });
		mockIntersectionObserver();
	});

	afterEach(() => {
		act(() => jest.runAllTimers()); // Suppress act errors after test ends
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	describe('hover card view', () => {
		it.each<[string, boolean]>([
			['smart-element-link', true],
			['smart-element-icon', false], // icon (outside element group)
			['smart-element-avatar-group', false], // avatar group (metadata inside element group)
			['smart-action-edit-action', false],
			['action-group-more-button', false],
		])('renders correct view of hover card for %s', async (testId, expectToBeInTheDocument) => {
			const renderResult = await setupComponent({
				extraCardProps: { appearance, children },
				testId: triggerTestId,
			});

			await hoverAndVerify(renderResult, hoverCardTestId, testId, expectToBeInTheDocument);
			await clickMoreActionAndVerifyNotToBeInDocument(renderResult, hoverCardTestId, testId);
		});

		it.each<string>([
			'smart-element-link',
			'smart-element-icon',
			'smart-element-avatar-group', // icon (outside element group)
			'smart-action-edit-action', // avatar group (metadata inside element group)
			'action-group-more-button',
		])('does not render hover card with testId = %s', async (testId) => {
			const renderResult = await setupComponent({
				extraCardProps: {
					appearance,
					children,
					showHoverPreview: false,
				},
				testId: 'smart-links-container',
			});

			await hoverAndVerify(renderResult, hoverCardTestId, testId, false);
			await clickMoreActionAndVerifyNotToBeInDocument(renderResult, hoverCardTestId, testId);
		});

		it('does not render hover card when hover over action and then leave the flexible card', async () => {
			const renderResult = await setupComponent({
				extraCardProps: { appearance, children },
				testId: triggerTestId,
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});
			const { event } = renderResult;

			await hoverAndVerify(renderResult, hoverCardTestId, 'smart-element-link', true);
			await hoverAndVerify(renderResult, hoverCardTestId, 'smart-action-edit-action', false);

			renderResult;
			const link = await screen.findByTestId('smart-element-link');
			fireEvent.mouseMove(link);
			const wrapper = await screen.findByTestId('smart-links-container-hover-card-wrapper');
			await event.unhover(wrapper);

			// move time forward to when canOpen is change but hideCard isn't triggered yet
			jest.advanceTimersByTime(101);

			expect(screen.queryByTestId(hoverCardTestId)).not.toBeInTheDocument();
		});
	});

	describe('event propagation', () => {
		const renderComponent = async (params: Parameters<typeof setupEventPropagationTest>[0]) => {
			const testId = 'hover-card-trigger-wrapper';
			const component = (
				<Card appearance="block" showHoverPreview={true} url="https://some.url">
					<TitleBlock />
				</Card>
			);

			return await setupEventPropagationTest({
				component,
				testId,
				...params,
			});
		};

		it('does not propagate event to parent when clicking inside hover card content on a flexui link', async () => {
			const mockOnClick = jest.fn();
			const { event } = await renderComponent({
				mockOnClick,
			});

			const metadataBlock = await screen.findAllByTestId('smart-block-metadata-resolved-view');
			await event.click(metadataBlock[0]);

			const previewButton = await screen.findByTestId('smart-action-preview-action');
			await event.click(previewButton);

			expect(mockOnClick).not.toHaveBeenCalled();
		});

		it('propagates event to parent when clicking on trigger element', async () => {
			const mockOnClick = jest.fn();
			const { element, event } = await renderComponent({ mockOnClick });

			await event.click(element);

			expect(mockOnClick).toHaveBeenCalled();
		});
	});

	describe('Common tests', () => {
		runCommonHoverCardTests((setupProps?: SetUpParams) => setupComponent(setupProps), testConfig);
		unauthorizedViewTests((setupProps?: SetUpParams) => setupComponent(setupProps), testConfig);
		analyticsTests((setupProps?: SetUpParams) => setupComponent(setupProps), {
			display: 'flexible',
			isAnalyticsContextResolvedOnHover: true,
		});
	});
});
