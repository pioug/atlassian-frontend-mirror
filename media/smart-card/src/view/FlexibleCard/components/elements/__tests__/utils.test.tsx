import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, waitForElement } from '@testing-library/react';

import { createElement } from '../utils';
import { ElementName, SmartLinkTheme } from '../../../../../constants';
import { FlexibleUiDataContext } from '../../../../../state/flexible-ui-context/types';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import context from '../../../../../__fixtures__/flexible-ui-data-context.json';

const renderComponent = (
  Component: React.FC<any>,
  context: FlexibleUiDataContext,
  testId?: string,
  props?: any,
) =>
  render(
    <IntlProvider locale="en">
      <FlexibleUiContext.Provider value={context}>
        <Component testId={testId} {...props} />,
      </FlexibleUiContext.Provider>
    </IntlProvider>,
  );

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
      expect(element.textContent).toEqual(context.state.text);
    });

    it.each([
      [ElementName.CommentCount, 'commentCount'],
      [ElementName.ProgrammingLanguage, 'programmingLanguage'],
      [ElementName.SubscriberCount, 'subscriberCount'],
    ])(
      'creates %s component from Badge element',
      async (elementName: ElementName, contextKey: string) => {
        const Component = createElement(elementName);
        const { getByTestId } = renderComponent(Component, context, testId);

        const element = await waitForElement(() => getByTestId(testId));
        const icon = await waitForElement(() => getByTestId(`${testId}-icon`));

        expect(Component).toBeDefined();
        expect(element.getAttribute('data-smart-element-badge')).toBeTruthy();
        expect(element.textContent).toEqual(context[contextKey].toString());
        expect(icon).toBeDefined();
      },
    );

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
