/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, waitForElement } from '@testing-library/react';

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
      const { getByTestId } = renderComponent(Component, context, testId);

      const element = await waitForElement(() => getByTestId(testId));

      expect(Component).toBeDefined();
      expect(element.getAttribute('data-smart-element-link')).toBeTruthy();
      expect(element.textContent).toEqual(context.title);
      expect(element.getAttribute('href')).toBe(context.url);
    });

    it('creates LinkIcon component from Icon element', async () => {
      const Component = createElement(ElementName.LinkIcon);
      const { getByTestId } = renderComponent(Component, context, testId);

      const element = await waitForElement(() => getByTestId(testId));

      expect(Component).toBeDefined();
      expect(element.getAttribute('data-smart-element-icon')).toBeTruthy();
    });

    it('creates State component from Lozenge element', async () => {
      const Component = createElement(ElementName.State);
      const { getByTestId } = renderComponent(Component, context, testId);

      const element = await waitForElement(() => getByTestId(testId));

      expect(Component).toBeDefined();
      expect(element.textContent).toEqual(context.state?.text);
    });

    it.each([
      [
        ElementName.CommentCount,
        'commentCount' as EnumKeysAsString<FlexibleUiDataContext>,
      ],
      [
        ElementName.ViewCount,
        'viewCount' as EnumKeysAsString<FlexibleUiDataContext>,
      ],
      [
        ElementName.ReactCount,
        'reactCount' as EnumKeysAsString<FlexibleUiDataContext>,
      ],
      [
        ElementName.VoteCount,
        'voteCount' as EnumKeysAsString<FlexibleUiDataContext>,
      ],
      [
        ElementName.ProgrammingLanguage,
        'programmingLanguage' as EnumKeysAsString<FlexibleUiDataContext>,
      ],
      [
        ElementName.SubscriberCount,
        'subscriberCount' as EnumKeysAsString<FlexibleUiDataContext>,
      ],
    ])(
      'creates %s component from Badge element',
      async (
        elementName: ElementName,
        contextKey: EnumKeysAsString<FlexibleUiDataContext>,
      ) => {
        const Component = createElement(elementName);
        expect(Component).toBeDefined();

        const { getByTestId } = renderComponent(Component, context, testId);

        const element = await waitForElement(() => getByTestId(testId));
        const icon = await waitForElement(() => getByTestId(`${testId}-icon`));

        expect(element.getAttribute('data-smart-element-badge')).toBeTruthy();
        expect(element.textContent).toEqual(context[contextKey]?.toString());
        expect(icon).toBeDefined();
      },
    );

    it('should render Provider component from Badge element', async () => {
      const Component = createElement(ElementName.Provider);
      expect(Component).toBeDefined();

      const { getByTestId } = renderComponent(Component, context, testId, {
        icon: 'Provider:Confluence' as IconType,
      });
      const element = await waitForElement(() => getByTestId(testId));
      expect(element.getAttribute('data-smart-element-badge')).toBeTruthy();
      expect(element.textContent).toEqual(context.provider?.label);

      const icon = await waitForElement(() => getByTestId(`${testId}-icon`));
      expect(icon).toBeDefined();
    });

    it('creates Priority component from Badge element', async () => {
      const Component = createElement(ElementName.Priority);
      const { getByTestId } = renderComponent(Component, context);

      const element = await waitForElement(() =>
        getByTestId('smart-element-badge'),
      );
      const icon = await waitForElement(() =>
        getByTestId('smart-element-badge-icon'),
      );
      const label = await waitForElement(() =>
        getByTestId('smart-element-badge-label'),
      );

      expect(Component).toBeDefined();
      expect(element).toBeDefined();
      expect(icon).toBeDefined();
      expect(label).toBeDefined();
    });

    it('creates CreatedBy component from Text element', async () => {
      const Component = createElement(ElementName.CreatedBy);
      const { getByTestId } = renderComponent(Component, context);

      const element = await waitForElement(() =>
        getByTestId('smart-element-text'),
      );

      expect(Component).toBeDefined();
      expect(element).toBeDefined();
    });

    it('creates ModifiedBy component from Text element', async () => {
      const Component = createElement(ElementName.ModifiedBy);
      const { getByTestId } = renderComponent(Component, context);

      const element = await waitForElement(() =>
        getByTestId('smart-element-text'),
      );

      expect(Component).toBeDefined();
      expect(element).toBeDefined();
    });
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
      [ElementName.CollaboratorGroup, 'collaboratorGroup'],
      [ElementName.CommentCount, 'commentCount'],
      [ElementName.ViewCount, 'viewCount'],
      [ElementName.ReactCount, 'reactCount'],
      [ElementName.VoteCount, 'voteCount'],
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
    const { getByTestId } = renderComponent(Component, context, testId, {
      text: expectedTextContent,
      theme: SmartLinkTheme.Black,
    });

    const element = await waitForElement(() => getByTestId(testId));

    expect(element.textContent).toEqual(expectedTextContent);
    expect(element).toHaveStyleDeclaration(
      'color',
      expect.stringContaining('#44546F'),
    );
  });
});
