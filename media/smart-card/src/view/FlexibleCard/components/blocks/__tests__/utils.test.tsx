import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, waitForElement } from '@testing-library/react';

import {
  ActionName,
  ElementName,
  SmartLinkDirection,
  SmartLinkSize,
} from '../../../../../constants';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import context from '../../../../../__fixtures__/flexible-ui-data-context.json';
import { getBaseStyles, renderActionItems, renderElementItems } from '../utils';

describe('getBaseStyles', () => {
  describe('getDirectionStyles', () => {
    it.each([
      [SmartLinkDirection.Horizontal, 'row'],
      [SmartLinkDirection.Vertical, 'column'],
    ])(
      'renders children in %s',
      (direction: SmartLinkDirection, expected: string) => {
        const { styles } = getBaseStyles(direction, SmartLinkSize.Medium);

        expect(styles).toEqual(
          expect.stringContaining(`flex-direction: ${expected}`),
        );
      },
    );
  });

  describe('getGapSize', () => {
    it.each([
      [SmartLinkSize.XLarge, '1.25rem'],
      [SmartLinkSize.Large, '1rem'],
      [SmartLinkSize.Medium, '0.5rem'],
      [SmartLinkSize.Small, '0.25rem'],
    ])(
      'renders element in %s size',
      (size: SmartLinkSize, expected: string) => {
        const { styles } = getBaseStyles(SmartLinkDirection.Horizontal, size);

        expect(styles).toEqual(expect.stringContaining(`gap: ${expected}`));
      },
    );
  });
});

describe('renderElementItems', () => {
  it.each(Object.values(ElementName).map((name) => [name]))(
    'renders %s',
    async (name: ElementName) => {
      const testId = 'smart-element-test';
      const { getByTestId } = render(
        <IntlProvider locale="en">
          <FlexibleUiContext.Provider value={context}>
            {renderElementItems([{ name, testId }])}
          </FlexibleUiContext.Provider>
        </IntlProvider>,
      );

      if (
        name === ElementName.AuthorGroup ||
        name === ElementName.CollaboratorGroup
      ) {
        const element = await waitForElement(() =>
          getByTestId(`${testId}--avatar-group`),
        );
        expect(element).toBeDefined();
      } else {
        const element = await waitForElement(() => getByTestId(testId));
        expect(element).toBeDefined();
      }
    },
  );

  it('does not render non-flexible-ui element', async () => {
    const elements = renderElementItems([
      { name: 'random-node' as ElementName },
    ]);

    expect(elements).toBeUndefined();
  });
});

describe('renderActionItems', () => {
  it.each(Object.values(ActionName).map((name) => [name]))(
    'renders %s',
    async (name: ActionName) => {
      const onClick = () => {};
      const testId = 'smart-element-test';
      const { getByTestId } = render(
        <FlexibleUiContext.Provider value={context}>
          {renderActionItems([{ onClick, name, testId }])}
        </FlexibleUiContext.Provider>,
      );
      const element = await waitForElement(() => getByTestId(testId));
      expect(element).toBeDefined();
    },
  );
});
