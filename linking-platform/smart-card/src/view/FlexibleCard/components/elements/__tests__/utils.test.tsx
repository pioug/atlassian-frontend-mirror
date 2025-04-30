import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import context from '../../../../../__fixtures__/flexible-ui-data-context';
import { ElementName, type IconType, SmartLinkTheme } from '../../../../../constants';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { type FlexibleUiDataContext } from '../../../../../state/flexible-ui-context/types';
import { createElement } from '../utils';

const iconAppearanceTestId = 'mock-appearance-icon';
jest.mock('../icon', () => ({
	...jest.requireActual('../icon'),
	__esModule: true,
	default: jest.fn((props) => {
		const Icon = jest.requireActual('../icon').default;

		return (
			<div>
				<div data-testId={iconAppearanceTestId}>
					{props.appearance ? props.appearance : 'no-appearance'}
				</div>
				<Icon {...props} />
			</div>
		);
	}),
}));

const renderComponent = (
	Component: React.ComponentType<any>,
	context: FlexibleUiDataContext,
	testId?: string,
	props?: any,
) =>
	render(
		<IntlProvider locale="en">
			<FlexibleUiContext.Provider value={context}>
				<Component testId={testId} {...props} />
			</FlexibleUiContext.Provider>
		</IntlProvider>,
	);

type EnumKeysAsString<T> = keyof T;

describe('createElement', () => {
	const testId = 'smart-element';

	describe('elements', () => {
		it('creates Title component from Link element', async () => {
			const Component = createElement(ElementName.Title);
			renderComponent(Component, context, testId);

			const element = await screen.findByTestId(testId);

			expect(Component).toBeDefined();
			expect(element.getAttribute('data-smart-element-link')).toBeTruthy();
			expect(element.textContent).toEqual(context.title);
			expect(element.getAttribute('href')).toBe(context.url);
		});

		ffTest.both('platform-linking-visual-refresh-v2', '', () => {
			it('creates LinkIcon component from Icon element', async () => {
				const Component = createElement(ElementName.LinkIcon);
				renderComponent(Component, context, testId);

				const element = await screen.findByTestId(testId);

				expect(Component).toBeDefined();
				expect(element.getAttribute('data-smart-element-icon')).toBeTruthy();
				expect(screen.getByTestId(iconAppearanceTestId).textContent).toEqual(
					fg('platform-linking-visual-refresh-v2') ? 'square' : 'no-appearance',
				);
			});

			it('should create round LinkIcon component from Icon element', async () => {
				const Component = createElement(ElementName.LinkIcon);

				const modifiedContext = {
					...context,
					type: ['Document', 'Profile'],
				};

				renderComponent(Component, modifiedContext, testId);

				expect(Component).toBeDefined();
				expect(screen.getByTestId(iconAppearanceTestId).textContent).toEqual(
					fg('platform-linking-visual-refresh-v2') ? 'round' : 'no-appearance',
				);
			});
		});

		it('creates DueOn component from Lozenge element', async () => {
			const Component = createElement(ElementName.DueOn);
			renderComponent(Component, context, testId);

			const element = await screen.findByTestId(testId);

			expect(Component).toBeDefined();
			expect(element).toHaveTextContent('Feb 22, 2022');
		});

		it('creates State component from Lozenge element', async () => {
			const Component = createElement(ElementName.State);
			renderComponent(Component, context, testId);

			const element = await screen.findByTestId(testId);

			expect(Component).toBeDefined();
			expect(element.textContent).toEqual(context.state?.text);
		});

		it.each([
			[ElementName.ChecklistProgress, 'checklistProgress'],
			[ElementName.CommentCount, 'commentCount'],
			[ElementName.ViewCount, 'viewCount'],
			[ElementName.ReactCount, 'reactCount'],
			[ElementName.VoteCount, 'voteCount'],
			[ElementName.ProgrammingLanguage, 'programmingLanguage'],
			[ElementName.SubscriberCount, 'subscriberCount'],
		])(
			'creates %s component from Badge element',
			async (elementName: ElementName, contextKey: string) => {
				const expectedTextContent =
					context[contextKey as EnumKeysAsString<FlexibleUiDataContext>]?.toString();
				const Component = createElement(elementName);
				expect(Component).toBeDefined();

				renderComponent(Component, context, testId);

				const element = await screen.findByTestId(testId);
				const icon = await screen.findByTestId(`${testId}-icon`);

				expect(element.getAttribute('data-smart-element-badge')).toBeTruthy();
				expect(element.textContent).toEqual(expectedTextContent);
				expect(icon).toBeDefined();
			},
		);

		it('should render Provider component from Badge element', async () => {
			const Component = createElement(ElementName.Provider);
			expect(Component).toBeDefined();

			renderComponent(Component, context, testId, {
				icon: 'Provider:Confluence' as IconType,
			});
			const element = await screen.findByTestId(testId);
			expect(element.getAttribute('data-smart-element-badge')).toBeTruthy();
			const elementLabel = await screen.findByTestId(testId + '-label');
			expect(elementLabel.textContent).toEqual(context.provider?.label);
			const icon = await screen.findByTestId(`${testId}-icon--wrapper`);
			expect(icon).toBeDefined();
		});

		it('creates Priority component from Badge element', async () => {
			const Component = createElement(ElementName.Priority);
			renderComponent(Component, context);

			const element = await screen.findByTestId('smart-element-badge');
			const icon = await screen.findByTestId('smart-element-badge-icon');
			const label = await screen.findByTestId('smart-element-badge-label');

			expect(Component).toBeDefined();
			expect(element).toBeDefined();
			expect(icon).toBeDefined();
			expect(label).toBeDefined();
		});

		it.each([
			[ElementName.CreatedBy, 'createdBy'],
			[ElementName.ModifiedBy, 'modifiedBy'],
			[ElementName.OwnedBy, 'ownedBy'],
			[ElementName.SourceBranch, 'sourceBranch'],
			[ElementName.TargetBranch, 'targetBranch'],
		])(
			'creates %s component from Text element',
			async (elementName: ElementName, contextKey: string) => {
				const key = contextKey as EnumKeysAsString<FlexibleUiDataContext>;
				const Component = createElement(elementName);
				renderComponent(Component, context);

				const element = await screen.findByTestId('smart-element-text');

				expect(Component).toBeDefined();
				expect(element).toHaveTextContent(context[key] as string);
				expect(element).toBeDefined();
			},
		);
	});

	it('throws error if base element does not exists', () => {
		expect(() => createElement('Random' as ElementName)).toThrow(
			new Error('Element Random does not exist.'),
		);
	});

	it('does not render element if context is not available', async () => {
		const Component = createElement(ElementName.Title);
		const { container } = render(<Component />);

		expect(container.children.length).toEqual(0);
	});

	describe('when data is not available', () => {
		it.each([
			[ElementName.AuthorGroup, 'authorGroup'],
			[ElementName.ChecklistProgress, 'checklistProgress'],
			[ElementName.CollaboratorGroup, 'collaboratorGroup'],
			[ElementName.CommentCount, 'commentCount'],
			[ElementName.ViewCount, 'viewCount'],
			[ElementName.ReactCount, 'reactCount'],
			[ElementName.VoteCount, 'voteCount'],
			[ElementName.OwnedBy, 'ownedBy'],
			[ElementName.CreatedBy, 'createdBy'],
			[ElementName.CreatedOn, 'createdOn'],
			[ElementName.LinkIcon, 'linkIcon'],
			[ElementName.ModifiedBy, 'modifiedBy'],
			[ElementName.ModifiedOn, 'modifiedOn'],
			[ElementName.Priority, 'priority'],
			[ElementName.ProgrammingLanguage, 'programmingLanguage'],
			[ElementName.State, 'state'],
			[ElementName.SubscriberCount, 'subscriberCount'],
			[ElementName.Title, 'title'],
			[ElementName.LatestCommit, 'latestCommit'],
		])('returns null on render %s', async (name: ElementName, key: string) => {
			const Component = createElement(name);
			renderComponent(Component, { ...context, [key]: undefined }, testId);
			expect(screen.queryByTestId(testId)).toBeNull();
		});
	});

	it('allows overrides of preset props and data', async () => {
		const expectedTextContent = 'Override title';
		const Component = createElement(ElementName.Title);
		renderComponent(Component, context, testId, {
			text: expectedTextContent,
			theme: SmartLinkTheme.Black,
		});

		const element = await screen.findByTestId(testId);

		expect(element).toHaveTextContent(expectedTextContent);
		expect(element).toHaveCompiledCss('color', 'var(--ds-text-subtle,#44546f)');
	});
});
