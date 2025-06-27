/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { ActionName, SmartLinkStatus } from '../../../../../../constants';
import { type ActionItem } from '../../types';
import FooterBlock from '../index';
import { type FooterBlockProps } from '../types';

describe('FooterBlock', () => {
	const testIdBase = 'some-test-id';
	const renderFooterBlock = (props?: FooterBlockProps, status?: SmartLinkStatus) => {
		return render(<FooterBlock {...props} />, {
			wrapper: getFlexibleCardTestWrapper(context, undefined, status),
		});
	};

	ffTest.on('platform-linking-flexible-card-context', 'with fg', () => {
		it('should render non-empty block when status is resolved', () => {
			const { container } = renderFooterBlock();
			expect(container.children.length).toBeGreaterThan(0);
		});

		it('should render non-empty block when status is not resolved but alwaysShow is true', () => {
			const { container } = renderFooterBlock(
				{
					alwaysShow: true,
				},
				SmartLinkStatus.Fallback,
			);
			expect(container.children.length).toBeGreaterThan(0);
		});

		it.each([
			[SmartLinkStatus.Resolving],
			[SmartLinkStatus.Forbidden],
			[SmartLinkStatus.Errored],
			[SmartLinkStatus.NotFound],
			[SmartLinkStatus.Unauthorized],
			[SmartLinkStatus.Fallback],
		])('should render null when status is %s', (status: SmartLinkStatus) => {
			const { container } = renderFooterBlock(undefined, status);
			expect(container.children.length).toEqual(0);
		});

		it('should render resolved view block with custom testId', async () => {
			renderFooterBlock({ testId: testIdBase });
			const block = await screen.findByTestId(`${testIdBase}-resolved-view`);
			expect(block).toBeDefined();
		});

		it('should render resolved view block with default testId', async () => {
			renderFooterBlock();
			const block = await screen.findByTestId(`smart-footer-block-resolved-view`);
			expect(block).toBeDefined();
		});

		it('should render provider', async () => {
			renderFooterBlock({ testId: testIdBase });
			const provider = await screen.findByTestId(`${testIdBase}-provider`);
			expect(provider).toBeDefined();
			const providerLabel = await screen.findByTestId(`${testIdBase}-provider-label`);
			expect(providerLabel).toHaveTextContent('Confluence');
		});

		it('should not render provider when hideProvider is true', async () => {
			renderFooterBlock({
				testId: testIdBase,
				hideProvider: true,
			});
			const block = await screen.findByTestId(`${testIdBase}-resolved-view`);
			expect(block).toBeDefined();
			const provider = screen.queryByTestId(`${testIdBase}-provider`);
			expect(provider).toBeNull();
		});

		it('should not render actions when array is empty', () => {
			renderFooterBlock({
				testId: testIdBase,
				actions: [],
			});

			const actionsElementGroup = screen.queryByTestId('smart-element-group-actions');
			expect(actionsElementGroup).toBeNull();
		});

		it('should render provided actions', async () => {
			const user = userEvent.setup();
			const actionItem: ActionItem = {
				testId: 'some-delete-actionItem-test-id',
				name: ActionName.DeleteAction,
				onClick: jest.fn(),
			};
			renderFooterBlock({
				testId: testIdBase,
				actions: [actionItem],
			});

			const actionsElementGroup = await screen.findByTestId('smart-element-group-actions');
			expect(actionsElementGroup).toBeDefined();

			const deleteAction = await screen.findByTestId('some-delete-actionItem-test-id');
			expect(deleteAction).toBeDefined();
			expect(deleteAction).toHaveTextContent('Delete');

			await user.click(deleteAction);
			expect(actionItem.onClick).toHaveBeenCalled();
		});

		it('renders with override css', async () => {
			const overrideCss = css({
				backgroundColor: 'blue',
			});

			render(<FooterBlock css={overrideCss} testId={testIdBase} />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});

			const block = await screen.findByTestId(`${testIdBase}-resolved-view`);

			expect(block).toHaveCompiledCss('background-color', 'blue');
		});
	});

	ffTest.off('platform-linking-flexible-card-context', 'with fg', () => {
		it('should render non-empty block when status is resolved', () => {
			const { container } = renderFooterBlock({ status: SmartLinkStatus.Resolved });
			expect(container.children.length).toBeGreaterThan(0);
		});

		it('should render non-empty block when status is not resolved but alwaysShow is true', () => {
			const { container } = renderFooterBlock({
				status: SmartLinkStatus.Fallback,
				alwaysShow: true,
			});
			expect(container.children.length).toBeGreaterThan(0);
		});

		it.each([
			[SmartLinkStatus.Resolving],
			[SmartLinkStatus.Forbidden],
			[SmartLinkStatus.Errored],
			[SmartLinkStatus.NotFound],
			[SmartLinkStatus.Unauthorized],
			[SmartLinkStatus.Fallback],
		])('should render null when status is %s', (status: SmartLinkStatus) => {
			const { container } = renderFooterBlock({ status });
			expect(container.children.length).toEqual(0);
		});

		it('should render resolved view block with custom testId', async () => {
			renderFooterBlock({ status: SmartLinkStatus.Resolved, testId: testIdBase });
			const block = await screen.findByTestId(`${testIdBase}-resolved-view`);
			expect(block).toBeDefined();
		});

		it('should render resolved view block with default testId', async () => {
			renderFooterBlock({ status: SmartLinkStatus.Resolved });
			const block = await screen.findByTestId(`smart-footer-block-resolved-view`);
			expect(block).toBeDefined();
		});

		it('should render provider', async () => {
			renderFooterBlock({ status: SmartLinkStatus.Resolved, testId: testIdBase });
			const provider = await screen.findByTestId(`${testIdBase}-provider`);
			expect(provider).toBeDefined();
			const providerLabel = await screen.findByTestId(`${testIdBase}-provider-label`);
			expect(providerLabel).toHaveTextContent('Confluence');
		});

		it('should not render provider when hideProvider is true', async () => {
			renderFooterBlock({
				status: SmartLinkStatus.Resolved,
				testId: testIdBase,
				hideProvider: true,
			});
			const block = await screen.findByTestId(`${testIdBase}-resolved-view`);
			expect(block).toBeDefined();
			const provider = screen.queryByTestId(`${testIdBase}-provider`);
			expect(provider).toBeNull();
		});

		it('should not render actions when array is empty', () => {
			renderFooterBlock({
				status: SmartLinkStatus.Resolved,
				testId: testIdBase,
				actions: [],
			});

			const actionsElementGroup = screen.queryByTestId('smart-element-group-actions');
			expect(actionsElementGroup).toBeNull();
		});

		it('should render provided actions', async () => {
			const user = userEvent.setup();
			const actionItem: ActionItem = {
				testId: 'some-delete-actionItem-test-id',
				name: ActionName.DeleteAction,
				onClick: jest.fn(),
			};
			renderFooterBlock({
				status: SmartLinkStatus.Resolved,
				testId: testIdBase,
				actions: [actionItem],
			});

			const actionsElementGroup = await screen.findByTestId('smart-element-group-actions');
			expect(actionsElementGroup).toBeDefined();

			const deleteAction = await screen.findByTestId('some-delete-actionItem-test-id');
			expect(deleteAction).toBeDefined();
			expect(deleteAction).toHaveTextContent('Delete');

			await user.click(deleteAction);
			expect(actionItem.onClick).toHaveBeenCalled();
		});

		it('renders with override css', async () => {
			const overrideCss = css({
				backgroundColor: 'blue',
			});

			render(
				<FooterBlock status={SmartLinkStatus.Resolved} css={overrideCss} testId={testIdBase} />,
				{ wrapper: getFlexibleCardTestWrapper(context) },
			);

			const block = await screen.findByTestId(`${testIdBase}-resolved-view`);

			expect(block).toHaveCompiledCss('background-color', 'blue');
		});
	});
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<FooterBlock status={SmartLinkStatus.Resolved} testId={testIdBase} />,
			{ wrapper: getFlexibleCardTestWrapper(context) },
		);
		await expect(container).toBeAccessible();
	});
});
