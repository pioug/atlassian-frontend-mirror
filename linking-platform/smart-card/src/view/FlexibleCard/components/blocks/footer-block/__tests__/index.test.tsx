/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { ActionName, InternalActionName, SmartLinkStatus } from '../../../../../../constants';
import { RovoChatPromptKey } from '../../../../../common/rovo-chat-utils';
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

	it('keeps Download accessible when the wide footer has Remix and Rovo prompts', async () => {
		passGate('platform_sl_3p_auth_visualize_killswitch');
		const user = userEvent.setup();
		const Wrapper = getFlexibleCardTestWrapper({
			...context,
			actions: {
				...context.actions,
				[InternalActionName.RemixAction]: {
					url: 'https://docs.google.com/spreadsheets/d/sheet',
					invokeAction: { actionSubjectId: 'remix', actionType: InternalActionName.RemixAction },
				},
			},
		});
		const actions: ActionItem[] = [
			{ name: InternalActionName.RemixAction },
			{ name: ActionName.RovoChatAction, prompts: [RovoChatPromptKey.IDENTIFY_KEY_TRENDS] },
			{ name: ActionName.DownloadAction },
		];

		render(
			<SmartCardProvider
				plugins={{ resolve: () => ({ remix: { isAvailable: () => true, open: jest.fn() } }) }}
				rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
			>
				<Wrapper>
					<FooterBlock actions={actions} />
				</Wrapper>
			</SmartCardProvider>,
		);

		expect(screen.getByRole('button', { name: 'Remix' })).toBeInTheDocument();
		expect(wasExperimentExposed('platform_sl_3p_auth_visualize_exp')).toBe(true);
		expect(screen.getByRole('button', { name: /identify key trends/i })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /download/i })).not.toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'more' }));
		expect(screen.getByRole('menuitem', { name: /download/i })).toBeInTheDocument();
	});

	it('records Remix exposure only after its overflow menu opens', async () => {
		passGate('platform_sl_3p_auth_visualize_killswitch');
		const user = userEvent.setup();
		const Wrapper = getFlexibleCardTestWrapper({
			...context,
			actions: {
				...context.actions,
				[InternalActionName.RemixAction]: {
					url: 'https://docs.google.com/spreadsheets/d/sheet',
					invokeAction: { actionSubjectId: 'remix', actionType: InternalActionName.RemixAction },
				},
			},
		});
		render(
			<SmartCardProvider
				plugins={{ resolve: () => ({ remix: { isAvailable: () => true, open: jest.fn() } }) }}
			>
				<Wrapper>
					<FooterBlock
						actions={[
							{ name: ActionName.CopyLinkAction },
							{ name: ActionName.DownloadAction },
							{ name: InternalActionName.RemixAction },
						]}
					/>
				</Wrapper>
			</SmartCardProvider>,
		);

		expect(screen.queryByRole('menuitem', { name: 'Remix' })).not.toBeInTheDocument();
		expect(wasExperimentExposed('platform_sl_3p_auth_visualize_exp')).toBe(false);
		await user.click(screen.getByRole('button', { name: 'more' }));
		expect(screen.getByRole('menuitem', { name: 'Remix' })).toBeInTheDocument();
		expect(wasExperimentExposed('platform_sl_3p_auth_visualize_exp')).toBe(true);
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

	it('should capture and report a11y violations', async () => {
		const { container } = render(<FooterBlock testId={testIdBase} />, {
			wrapper: getFlexibleCardTestWrapper(context, undefined, SmartLinkStatus.Resolved),
		});
		await expect(container).toBeAccessible();
	});
});
