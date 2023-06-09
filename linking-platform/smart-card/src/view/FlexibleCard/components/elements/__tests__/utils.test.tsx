import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';

import { createElement } from '../utils';
import {
  ElementName,
  IconType,
  SmartLinkTheme,
} from '../../../../../constants';
import { FlexibleUiDataContext } from '../../../../../state/flexible-ui-context/types';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import context from '../../../../../__fixtures__/flexible-ui-data-context';

const renderComponent = (
  Component: React.FC<any>,
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
      const { findByTestId } = renderComponent(Component, context, testId);

      const element = await findByTestId(testId);

      expect(Component).toBeDefined();
      expect(element.getAttribute('data-smart-element-link')).toBeTruthy();
      expect(element.textContent).toEqual(context.title);
      expect(element.getAttribute('href')).toBe(context.url);
    });

    it('creates LinkIcon component from Icon element', async () => {
      const Component = createElement(ElementName.LinkIcon);
      const { findByTestId } = renderComponent(Component, context, testId);

      const element = await findByTestId(testId);

      expect(Component).toBeDefined();
      expect(element.getAttribute('data-smart-element-icon')).toBeTruthy();
    });

    it('creates DueOn component from Lozenge element', async () => {
      const Component = createElement(ElementName.DueOn);
      const { findByTestId } = renderComponent(Component, context, testId);

      const element = await findByTestId(testId);

      expect(Component).toBeDefined();
      expect(element.textContent).toEqual('Feb 22, 2022');
    });

    it('creates State component from Lozenge element', async () => {
      const Component = createElement(ElementName.State);
      const { findByTestId } = renderComponent(Component, context, testId);

      const element = await findByTestId(testId);

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
          context[
            contextKey as EnumKeysAsString<FlexibleUiDataContext>
          ]?.toString();
        const Component = createElement(elementName);
        expect(Component).toBeDefined();

        const { findByTestId } = renderComponent(Component, context, testId);

        const element = await findByTestId(testId);
        const icon = await findByTestId(`${testId}-icon`);

        expect(element.getAttribute('data-smart-element-badge')).toBeTruthy();
        expect(element.textContent).toEqual(expectedTextContent);
        expect(icon).toBeDefined();
      },
    );

    it('should render Provider component from Badge element', async () => {
      const Component = createElement(ElementName.Provider);
      expect(Component).toBeDefined();

      const { findByTestId } = renderComponent(Component, context, testId, {
        icon: 'Provider:Confluence' as IconType,
      });
      const element = await findByTestId(testId);
      expect(element.getAttribute('data-smart-element-badge')).toBeTruthy();
      const elementLabel = await findByTestId(testId + '-label');
      expect(elementLabel.textContent).toEqual(context.provider?.label);
      const icon = await findByTestId(`${testId}-icon--wrapper`);
      expect(icon).toBeDefined();
    });

    it('creates Priority component from Badge element', async () => {
      const Component = createElement(ElementName.Priority);
      const { findByTestId } = renderComponent(Component, context);

      const element = await findByTestId('smart-element-badge');
      const icon = await findByTestId('smart-element-badge-icon');
      const label = await findByTestId('smart-element-badge-label');

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
        const { findByTestId } = renderComponent(Component, context);

        const element = await findByTestId('smart-element-text');

        expect(Component).toBeDefined();
        expect(element.textContent).toEqual(
          expect.stringContaining(context[key] as string),
        );
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
      const { queryByTestId } = renderComponent(
        Component,
        { ...context, [key]: undefined },
        testId,
      );
      expect(queryByTestId(testId)).toBeNull();
    });
  });

  it('allows overrides of preset props and data', async () => {
    const expectedTextContent = 'Override title';
    const Component = createElement(ElementName.Title);
    const { findByTestId } = renderComponent(Component, context, testId, {
      text: expectedTextContent,
      theme: SmartLinkTheme.Black,
    });

    const element = await findByTestId(testId);

    expect(element.textContent).toEqual(expectedTextContent);
    expect(element).toHaveStyleDeclaration(
      'color',
      expect.stringContaining('#44546F'),
    );
  });
});
