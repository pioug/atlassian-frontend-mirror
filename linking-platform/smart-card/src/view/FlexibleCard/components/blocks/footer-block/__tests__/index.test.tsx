import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { ActionName, SmartLinkStatus } from '../../../../../../constants';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { render } from '@testing-library/react';
import { type FooterBlockProps } from '../types';
import { IntlProvider } from 'react-intl-next';
import FooterBlock from '../index';
import { type ActionItem } from '../../types';
import userEvent from '@testing-library/user-event';

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
		const { findByTestId } = renderFooterBlock({ testId: testIdBase });
		const block = await findByTestId(`${testIdBase}-resolved-view`);
		expect(block).toBeDefined();
	});

	it('should render resolved view block with default testId', async () => {
		const { findByTestId } = renderFooterBlock();
		const block = await findByTestId(`smart-footer-block-resolved-view`);
		expect(block).toBeDefined();
	});

	it('should render provider', async () => {
		const { findByTestId } = renderFooterBlock({ testId: testIdBase });
		const provider = await findByTestId(`${testIdBase}-provider`);
		expect(provider).toBeDefined();
		const providerLabel = await findByTestId(`${testIdBase}-provider-label`);
		expect(providerLabel.textContent).toBe('Confluence');
	});

	it('should not render provider when hideProvider is true', async () => {
		const { findByTestId, queryByTestId } = renderFooterBlock({
			testId: testIdBase,
			hideProvider: true,
		});
		const block = await findByTestId(`${testIdBase}-resolved-view`);
		expect(block).toBeDefined();
		const provider = queryByTestId(`${testIdBase}-provider`);
		expect(provider).toBeNull();
	});

	it('should not render actions when array is empty', () => {
		const { queryByTestId } = renderFooterBlock({
			testId: testIdBase,
			actions: [],
		});

		const actionsElementGroup = queryByTestId('smart-element-group-actions');
		expect(actionsElementGroup).toBeNull();
	});

	it('should render provided actions', async () => {
		const user = userEvent.setup();
		const actionItem: ActionItem = {
			testId: 'some-delete-actionItem-test-id',
			name: ActionName.DeleteAction,
			onClick: jest.fn(),
		};
		const { findByTestId } = renderFooterBlock({
			testId: testIdBase,
			actions: [actionItem],
		});

		const actionsElementGroup = await findByTestId('smart-element-group-actions');
		expect(actionsElementGroup).toBeDefined();

		const deleteAction = await findByTestId('some-delete-actionItem-test-id');
		expect(deleteAction).toBeDefined();
		expect(deleteAction.textContent).toBe('Delete');

		await user.click(deleteAction);
		expect(actionItem.onClick).toHaveBeenCalled();
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		const { findByTestId } = renderFooterBlock({
			overrideCss,
			testId: testIdBase,
		});

		const block = await findByTestId(`${testIdBase}-resolved-view`);

		expect(block).toHaveStyleDeclaration('background-color', 'blue');
	});
});
