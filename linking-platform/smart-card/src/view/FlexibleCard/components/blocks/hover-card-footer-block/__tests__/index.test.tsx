/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, screen, userEvent } from '@atlassian/testing-library';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { ActionName } from '../../../../../../constants';
import type { FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import ResolvedHoverCardFooterBlock from '../index';
import { type ResolvedHoverCardFooterBlockProps } from '../types';

describe('ResolvedHoverCardFooterBlock', () => {
	ffTest.both('navx-1895-new-logo-design', '', () => {
		ffTest.on('platform_sl_3p_auth_rovo_action_kill_switch', '', () => {
			const testIdBase = 'some-test-id';
			const renderResolvedHoverCardFooterBlock = (
				props?: ResolvedHoverCardFooterBlockProps,
				data?: FlexibleUiDataContext,
			) => {
				return render(<ResolvedHoverCardFooterBlock {...props} />, {
					wrapper: getFlexibleCardTestWrapper(data ?? context),
				});
			};

			it('should render resolved view block with custom testId', async () => {
				renderResolvedHoverCardFooterBlock({ testId: testIdBase });
				const block = await screen.findByTestId(`${testIdBase}-resolved-view`);
				expect(block).toBeDefined();
			});

			it('should render resolved view block with default testId', async () => {
				renderResolvedHoverCardFooterBlock();
				const block = await screen.findByTestId(`smart-hover-card-footer-block-resolved-view`);
				expect(block).toBeDefined();
			});

			it('should render provider', async () => {
				renderResolvedHoverCardFooterBlock({ testId: testIdBase });
				const provider = await screen.findByTestId(`${testIdBase}-provider`);
				expect(provider).toBeDefined();
				const providerLabel = await screen.findByTestId(`${testIdBase}-provider-label`);
				expect(providerLabel).toHaveTextContent('Confluence');
			});

			it('should not render provider when hideProvider is true', async () => {
				renderResolvedHoverCardFooterBlock({
					testId: testIdBase,
					hideProvider: true,
				});
				const block = await screen.findByTestId(`${testIdBase}-resolved-view`);
				expect(block).toBeDefined();
				const provider = screen.queryByTestId(`${testIdBase}-provider`);
				expect(provider).toBeNull();
			});

			it('should not render actions when context has only the hidden footer actions', () => {
				const contextWithoutFooterActions: FlexibleUiDataContext = {
					...context,
					actions: {
						RovoChatAction: context.actions!.RovoChatAction,
					},
				};
				renderResolvedHoverCardFooterBlock({ testId: testIdBase }, contextWithoutFooterActions);

				const actionsElementGroup = screen.queryByTestId(`${testIdBase}-actions`);
				expect(actionsElementGroup).toBeNull();
			});

			it('should render actions from context and call onActionClick when clicked', async () => {
				const user = userEvent.setup();
				const onActionClick = jest.fn();
				renderResolvedHoverCardFooterBlock({
					testId: testIdBase,
					onActionClick,
				});

				const actionsElementGroup = await screen.findByTestId(`${testIdBase}-actions`);
				expect(actionsElementGroup).toBeDefined();

				const copyLinkButton = await screen.findByTestId('smart-action-copy-link-action');
				await user.click(copyLinkButton);
				expect(onActionClick).toHaveBeenCalledWith(ActionName.CopyLinkAction);
			});

			it('renders with override css prop', async () => {
				const overrideCss = css({
					backgroundColor: 'blue',
				});

				render(<ResolvedHoverCardFooterBlock css={overrideCss} testId={testIdBase} />, {
					wrapper: getFlexibleCardTestWrapper(context),
				});

				const block = await screen.findByTestId(`${testIdBase}-resolved-view`);
				expect(block).toBeDefined();
			});

			it('should capture and report a11y violations', async () => {
				const { container } = render(<ResolvedHoverCardFooterBlock testId={testIdBase} />, {
					wrapper: getFlexibleCardTestWrapper(context),
				});
				await expect(container).toBeAccessible();
			});
		});
	});
});
