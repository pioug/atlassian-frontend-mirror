import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, waitFor } from '@testing-library/react';

import {
  ElementName,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkStatus,
} from '../../../../../constants';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import context from '../../../../../__fixtures__/flexible-ui-data-context';
import {
  ElementDisplaySchema,
  ElementDisplaySchemaType,
  getBaseStyles,
  renderElementItems,
} from '../utils';
import { MetadataBlock } from '../index';
import Block from '../block';
import { ElementItem } from '../../blocks/types';

const TestRenderElementItemBlock: React.FC<{
  display: ElementDisplaySchemaType;
  metadata: ElementItem[];
}> = ({ display, metadata = [] }) => {
  return <Block>{renderElementItems(metadata, display)}</Block>;
};

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
          expect.stringContaining(`flex-direction:${expected}`),
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

        expect(styles).toEqual(expect.stringContaining(`gap:${expected}`));
      },
    );
  });
});

describe('renderElementItems', () => {
  const getElementTestId = (name: ElementName, testId: string) => {
    switch (name) {
      case ElementName.AuthorGroup:
      case ElementName.CollaboratorGroup:
      case ElementName.OwnedByGroup:
      case ElementName.AssignedToGroup:
        return `${testId}--avatar-group`;
      default:
        return testId;
    }
  };

  const renderTestBlock = (
    display: ElementDisplaySchemaType,
    name: ElementName,
    testId: string,
  ) => {
    const metadata = [{ name, testId }] as ElementItem[];
    return render(
      <IntlProvider locale="en">
        <FlexibleUiContext.Provider value={context}>
          <TestRenderElementItemBlock display={display} metadata={metadata} />
        </FlexibleUiContext.Provider>
      </IntlProvider>,
    );
  };

  // If you are here because you've added a new element and these
  // tests fail, it could be that you haven't added the element
  // into ElementDisplaySchema. Another likely reason is that you
  // need to add or modify the mock data being passed as the value
  // to FlexibleUiContext.Provider
  describe.each([
    ['inline' as ElementDisplaySchemaType],
    ['block' as ElementDisplaySchemaType],
  ])('with %s display schema', (display: ElementDisplaySchemaType) => {
    const testId = 'smart-element-test';
    const expectToRendered = Object.values(ElementName).filter((name) =>
      ElementDisplaySchema[name].includes(display),
    );
    const expectedNotToRendered = Object.values(ElementName).filter(
      (name) => !ElementDisplaySchema[name].includes(display),
    );

    it.each(expectToRendered)(
      'renders element %s',
      async (name: ElementName) => {
        const { getByTestId } = renderTestBlock(display, name, testId);
        const element = await waitFor(() =>
          getByTestId(getElementTestId(name, testId)),
        );
        expect(element).toBeDefined();
      },
    );

    it.each(expectedNotToRendered)(
      'does not render element %s ',
      (name: ElementName) => {
        const { queryByTestId } = renderTestBlock(display, name, testId);
        const element = queryByTestId(getElementTestId(name, testId));
        expect(element).toBeNull();
      },
    );
  });

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
      // @ts-ignore: This violation is intentional for testing purpose.
      { name: 'random-node' as ElementName },
    ]);

    expect(elements).toBeUndefined();
  });
});
