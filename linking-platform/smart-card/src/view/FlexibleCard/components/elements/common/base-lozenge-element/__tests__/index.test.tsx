/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import '@testing-library/jest-dom';
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { SmartLinkActionType } from '@atlaskit/linking-types';

import * as useInvoke from '../../../../../../../state/hooks/use-invoke';
import * as useResolve from '../../../../../../../state/hooks/use-resolve';
import BaseLozengeElement, { type BaseLozengeElementProps } from '../index';

describe('Element: Lozenge', () => {
	const testId = 'smart-element-lozenge';
	const defaultText = 'Some status';
	const defaultAppearance = 'inprogress';

	const renderComponent = (props?: Partial<BaseLozengeElementProps>) => {
		const { text = defaultText, appearance = defaultAppearance, ...rest } = props || {};

		const overrideCss = css({
			fontStyle: 'italic',
		});

		const component = (
			<IntlProvider locale="en">
				<BaseLozengeElement
					text={text}
					appearance={appearance}
					testId={testId}
					css={overrideCss}
					{...rest}
				/>
			</IntlProvider>
		);
		return render(component);
	};

	it('should capture and report a11y violations', async () => {
		const { container } = renderComponent();

		await expect(container).toBeAccessible();
	});

	it('renders element', async () => {
		renderComponent();

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element).toHaveTextContent(defaultText);
	});

	it('does not render when no text in element', async () => {
		renderComponent({ text: '' });
		expect(screen.queryByTestId(testId)).toBeNull();
	});

	describe('renders element with different appearances', () => {
		const appearances: Array<BaseLozengeElementProps['appearance']> = [
			'default',
			'inprogress',
			'moved',
			'new',
			'removed',
			'success',
		];
		for (const appearance of appearances) {
			it(`renders with ${appearance} appearance`, async () => {
				renderComponent({ appearance });

				const element = await screen.findByTestId(testId);

				expect(element).toBeTruthy();
				expect(element).toHaveTextContent(defaultText);
			});
		}
	});

	it('renders with default appearance when given an unexpected appearance', async () => {
		renderComponent({ appearance: 'spaghetti' as any });
		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(element).toHaveTextContent(defaultText);
	});

	it('renders with override css', async () => {
		renderComponent();

		const element = await screen.findByTestId(testId);

		expect(element).toHaveCompiledCss('font-style', 'italic');
	});

	describe('action', () => {
		const triggerTestId = `${testId}--trigger`;
		const action = {
			read: {
				action: {
					actionType: SmartLinkActionType.GetStatusTransitionsAction,
					resourceIdentifiers: {
						issueKey: 'issue-id',
						hostname: 'some-hostname',
					},
				},
				providerKey: 'object-provider',
			},
			update: {
				action: {
					actionType: SmartLinkActionType.StatusUpdateAction,
					resourceIdentifiers: {
						issueKey: 'issue-id',
						hostname: 'some-hostname',
					},
				},
				providerKey: 'object-provider',
			},
		};

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('renders with action', async () => {
			jest.spyOn(useInvoke, 'default').mockReturnValue(jest.fn());
			jest.spyOn(useResolve, 'default').mockReturnValue(jest.fn());

			renderComponent({ action });

			const element = await screen.findByTestId(triggerTestId);

			expect(element).toBeTruthy();
		});
	});
});
