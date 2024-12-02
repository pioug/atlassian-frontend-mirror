import '@testing-library/jest-dom';
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { render, screen } from '@testing-library/react';

import { SmartLinkActionType } from '@atlaskit/linking-types';

import * as useInvoke from '../../../../../../state/hooks/use-invoke';
import * as useResolve from '../../../../../../state/hooks/use-resolve';
import Lozenge from '../index';
import { type LozengeProps } from '../types';

describe('Element: Lozenge', () => {
	const testId = 'smart-element-lozenge';
	const text = 'Some status';
	const appearance = 'inprogress';

	it('renders element', async () => {
		render(<Lozenge text={text} appearance={appearance} />);

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element).toHaveTextContent(text);
	});

	it('does not render when no text in element', async () => {
		render(<Lozenge text={''} appearance={appearance} />);
		expect(screen.queryByTestId(testId)).toBeNull();
	});

	describe('renders element with different appearances', () => {
		const appearances: Array<LozengeProps['appearance']> = [
			'default',
			'inprogress',
			'moved',
			'new',
			'removed',
			'success',
		];
		for (const appearance of appearances) {
			it(`renders with ${appearance} appearance`, async () => {
				render(<Lozenge text={text} appearance={appearance} />);

				const element = await screen.findByTestId(testId);

				expect(element).toBeTruthy();
				expect(element).toHaveTextContent(text);
			});
		}
	});

	it('renders with default appearance when given an unexpected appearance', async () => {
		render(<Lozenge text={text} appearance={'spaghetti' as any} />);
		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(element).toHaveTextContent(text);
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			fontStyle: 'italic',
		});
		render(<Lozenge appearance={appearance} overrideCss={overrideCss} text={text} />);

		const element = await screen.findByTestId(testId);

		expect(element).toHaveStyleDeclaration('font-style', 'italic');
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

			render(<Lozenge action={action} appearance={appearance} testId={testId} text={text} />);

			const element = await screen.findByTestId(triggerTestId);

			expect(element).toBeTruthy();
		});
	});
});
