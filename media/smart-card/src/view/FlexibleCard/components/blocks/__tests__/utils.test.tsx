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
import context from '../../../../../__fixtures__/flexible-ui-data-context';
import {
  ElementDisplaySchema,
  ElementDisplaySchemaType,
  getBaseStyles,
  renderActionItems,
  renderElementItems,
} from '../utils';
import { MetadataBlock } from '../index';
import Block from '../block';
import { CustomActionItem, ElementItem } from '../../blocks/types';
import PremiumIcon from '@atlaskit/icon/glyph/premium';

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

  const renderTestBlock = (
    display: ElementDisplaySchemaType,
    name: ElementName,
    testId: string,
  ) =>
    render(
      <IntlProvider locale="en">
        <FlexibleUiContext.Provider value={context}>
          <TestRenderElementItemBlock
            display={display}
            metadata={[{ name, testId }]}
          />
        </FlexibleUiContext.Provider>
      </IntlProvider>,
    );

  // If you are here because you've added a new element and these
  // tests fail, it could be that you haven't added the element
  // into ElementDisplaySchema
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
        const element = await waitForElement(() =>
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
      { name: 'random-node' as ElementName },
    ]);

    expect(elements).toBeUndefined();
  });
});

describe('renderActionItems', () => {
  const testId = 'smart-element-test';
  const setup = (
    name: ActionName,
    hideContent: boolean,
    hideIcon: boolean,
    asDropDownItems: boolean = false,
  ) => {
    const onClick = () => {};
    const commonProps = { onClick, testId, hideContent, hideIcon };
    const action =
      name === ActionName.CustomAction
        ? ({
            name: ActionName.CustomAction,
            ...commonProps,
            icon: <PremiumIcon label="magic" />,
            content: 'Magic!',
          } as CustomActionItem)
        : {
            name,
            ...commonProps,
          };
    // const customActionItem: CustomActionItem = {...namedActionItem, name}

    return render(
      <IntlProvider locale="en">
        <FlexibleUiContext.Provider value={context}>
          {renderActionItems([action], undefined, undefined, asDropDownItems)}
        </FlexibleUiContext.Provider>
      </IntlProvider>,
    );
  };

  it('should be able to render DropdownItem element', async () => {
    const { getAllByRole } = setup(ActionName.DeleteAction, false, false, true);
    const elements = getAllByRole('menuitem');
    expect(elements).toHaveLength(1);
  });

  describe.each([
    [ActionName.DeleteAction, 'Delete', 'smart-element-test-icon'],
  ])(
    'with %s action',
    (actionName: ActionName, expectedContent: string, iconTestId: string) => {
      describe.each([
        ['as dropdown item', true],
        ['as button', false],
      ])('%s', (_: string, asDropdownItem: boolean) => {
        it('should render both content and icon', async () => {
          const { getByTestId } = setup(
            actionName,
            false,
            false,
            asDropdownItem,
          );

          const element = await waitForElement(() => getByTestId(testId));
          expect(element).toBeDefined();

          const icon = await waitForElement(() => getByTestId(iconTestId));
          expect(icon).toBeDefined();

          expect(element.textContent).toEqual(expectedContent);
        });

        it('should render only content', async () => {
          const { getByTestId, queryByTestId } = setup(
            actionName,
            false,
            true,
            asDropdownItem,
          );

          const element = await waitForElement(() => getByTestId(testId));
          expect(element).toBeDefined();

          expect(queryByTestId(iconTestId)).toBeNull();

          expect(element.textContent).toEqual(expectedContent);
        });

        if (asDropdownItem) {
          it('should render content even if hideContent is true', async () => {
            const { getByTestId } = setup(
              actionName,
              true,
              false,
              asDropdownItem,
            );

            const element = await waitForElement(() => getByTestId(testId));
            expect(element).toBeDefined();

            const icon = await waitForElement(() => getByTestId(iconTestId));
            expect(icon).toBeDefined();

            expect(element.textContent).toEqual(expectedContent);
          });
        } else {
          it('should render only icon', async () => {
            const { getByTestId } = setup(
              actionName,
              true,
              false,
              asDropdownItem,
            );

            const element = await waitForElement(() => getByTestId(testId));
            expect(element).toBeDefined();

            const icon = await waitForElement(() => getByTestId(iconTestId));
            expect(icon).toBeDefined();

            expect(element.textContent).toEqual('');
          });
        }
      });
    },
  );
});
