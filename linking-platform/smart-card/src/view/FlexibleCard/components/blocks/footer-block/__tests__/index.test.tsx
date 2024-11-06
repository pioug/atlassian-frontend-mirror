import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ActionName, SmartLinkStatus } from '../../../../../../constants';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { type ActionItem } from '../../types';
import FooterBlock from '../index';
import { type FooterBlockProps } from '../types';

describe('FooterBlock', () => {
	const testIdBase = 'some-test-id';
	const renderFooterBlock = (props?: FooterBlockProps) => {
		return render(
			<IntlProvider locale="en">
				<FlexibleUiContext.Provider value={context}>
					<FooterBlock status={SmartLinkStatus.Resolved} {...props} />
				</FlexibleUiContext.Provider>
			</IntlProvider>,
		);
	};

	it('should render non-empty block when status is resolved', () => {
		const { container } = renderFooterBlock();
		expect(container.children.length).toBeGreaterThan(0);
	});

	it('should render non-empty block when status is not resolved but alwaysShow is true', () => {
		const { container } = renderFooterBlock({ status: SmartLinkStatus.Fallback, alwaysShow: true });
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
		expect(providerLabel.textContent).toBe('Confluence');
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
		expect(deleteAction.textContent).toBe('Delete');

		await user.click(deleteAction);
		expect(actionItem.onClick).toHaveBeenCalled();
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		renderFooterBlock({
			overrideCss,
			testId: testIdBase,
		});

		const block = await screen.findByTestId(`${testIdBase}-resolved-view`);

		expect(block).toHaveStyleDeclaration('background-color', 'blue');
	});
});
