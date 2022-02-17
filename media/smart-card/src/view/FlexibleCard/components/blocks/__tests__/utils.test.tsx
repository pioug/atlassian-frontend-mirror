import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, waitForElement } from '@testing-library/react';

import {
  ActionName,
  ElementName,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkStatus,
} from '../../../../../constants';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import context from '../../../../../__fixtures__/flexible-ui-data-context.json';
import { getBaseStyles, renderActionItems, renderElementItems } from '../utils';
import { MetadataBlock } from '../index';

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
  const getElementTestId = (name: ElementName, testId: string) => {
    switch (name) {
      case ElementName.AuthorGroup:
      case ElementName.CollaboratorGroup:
        return `${testId}--avatar-group`;
      default:
        return testId;
    }
  };

  it.each(Object.values(ElementName).map((name) => [name]))(
    'renders %s',
    async (name: ElementName) => {
      const testId = 'smart-element-test';
      const { getByTestId } = render(
        <IntlProvider locale="en">
          <FlexibleUiContext.Provider value={context}>
            <MetadataBlock
              primary={[{ name, testId }]}
              status={SmartLinkStatus.Resolved}
            />
          </FlexibleUiContext.Provider>
        </IntlProvider>,
      );
      const element = await waitForElement(() =>
        getByTestId(getElementTestId(name, testId)),
      );
      expect(element).toBeDefined();
    },
  );

  it('does not render null element', async () => {
    const { queryByTestId } = render(
      <FlexibleUiContext.Provider value={{ title: 'Link title' }}>
        <MetadataBlock
          primary={[
            { name: ElementName.CommentCount, testId: 'comment-count' },
          ]}
          status={SmartLinkStatus.Resolved}
        />
      </FlexibleUiContext.Provider>,
    );
    expect(queryByTestId('comment-count')).toBeNull();
  });

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
