import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { fireEvent, render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Container from '../index';
import {
  SmartLinkSize,
  SmartLinkStatus,
  SmartLinkTheme,
} from '../../../../../constants';
import { TitleBlock } from '../../blocks';
import context from '../../../../../__fixtures__/flexible-ui-data-context.json';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { messages } from '../../../../../messages';

describe('Container', () => {
  const testId = 'smart-links-container';

  it('renders container', async () => {
    const { getByTestId } = render(<Container testId={testId} />);

    const container = await waitForElement(() => getByTestId(testId));

    expect(container).toBeTruthy();
    expect(container.getAttribute('data-smart-link-container')).toBeTruthy();
  });

  describe('size', () => {
    it.each([
      [SmartLinkSize.XLarge, '1.25rem 0', '1.5rem'],
      [SmartLinkSize.Large, '1rem 0', '1.25rem'],
      [SmartLinkSize.Medium, '.5rem 0', '1rem'],
      [SmartLinkSize.Small, '.25rem 0', '.5rem'],
      [undefined, '.5rem 0', '1rem'],
    ])(
      'renders element in %s size',
      async (
        size: SmartLinkSize | undefined,
        expectedGap: string,
        expectedPadding: string,
      ) => {
        const { getByTestId } = render(
          <Container size={size} testId={testId} />,
        );

        const block = await waitForElement(() => getByTestId(testId));

        expect(block).toHaveStyleDeclaration('gap', expectedGap);
        expect(block).toHaveStyleDeclaration('padding', expectedPadding);
      },
    );
  });

  describe('hideBackground', () => {
    it('shows background by default', async () => {
      const { getByTestId } = render(<Container testId={testId} />);

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).toHaveStyleDeclaration(
        'background-color',
        expect.stringContaining('#FFFFFF'),
      );
    });

    it('shows background', async () => {
      const { getByTestId } = render(
        <Container hideBackground={false} testId={testId} />,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).toHaveStyleDeclaration(
        'background-color',
        expect.stringContaining('#FFFFFF'),
      );
    });

    it('hides background', async () => {
      const { getByTestId } = render(
        <Container hideBackground={true} testId={testId} />,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).not.toHaveStyleDeclaration(
        'background-color',
        expect.any(String),
      );
    });
  });

  describe('hideElevation', () => {
    const border = '1px solid transparent';
    const borderRadius = '1.5px';

    it('shows elevation by default', async () => {
      const { getByTestId } = render(<Container testId={testId} />);

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).toHaveStyleDeclaration('border', border);
      expect(container).toHaveStyleDeclaration('border-radius', borderRadius);
      expect(container).toHaveStyleDeclaration(
        'box-shadow',
        expect.any(String),
      );
    });

    it('shows elevation', async () => {
      const { getByTestId } = render(
        <Container hideElevation={false} testId={testId} />,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).toHaveStyleDeclaration('border', border);
      expect(container).toHaveStyleDeclaration('border-radius', borderRadius);
      expect(container).toHaveStyleDeclaration(
        'box-shadow',
        expect.any(String),
      );
    });

    it('hides elevation', async () => {
      const { getByTestId } = render(
        <Container hideElevation={true} testId={testId} />,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).not.toHaveStyleDeclaration('border', border);
      expect(container).not.toHaveStyleDeclaration(
        'border-radius',
        borderRadius,
      );
      expect(container).not.toHaveStyleDeclaration(
        'box-shadow',
        expect.any(String),
      );
    });
  });

  describe('hidePadding', () => {
    const padding = '1rem';

    it('shows padding by default', async () => {
      const { getByTestId } = render(<Container testId={testId} />);

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).toHaveStyleDeclaration('padding', padding);
    });

    it('shows padding', async () => {
      const { getByTestId } = render(
        <Container hidePadding={false} testId={testId} />,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).toHaveStyleDeclaration('padding', padding);
    });

    it('hides padding', async () => {
      const { getByTestId } = render(
        <Container hidePadding={true} testId={testId} />,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).not.toHaveStyleDeclaration('padding', padding);
    });
  });

  describe('renderChildren', () => {
    it('renders children', async () => {
      const { getByTestId } = render(
        <Container testId={testId}>
          <TitleBlock />
          <TitleBlock />
        </Container>,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container.children.length).toEqual(2);
    });

    it('does not render non block element', async () => {
      const { getByTestId } = render(
        <Container testId={testId}>
          <TitleBlock />
          <div></div>
          <TitleBlock />
        </Container>,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container.children.length).toEqual(2);
    });

    it('does not renders non valid element', async () => {
      const { getByTestId } = render(
        <Container testId={testId}>This is a text.</Container>,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container.children.length).toEqual(0);
    });

    describe('retry', () => {
      it('renders TitleBlock with retry message', async () => {
        const onClick = jest.fn();
        const { getByTestId } = render(
          <IntlProvider locale="en">
            <Container
              retry={{ descriptor: messages.cannot_find_link, onClick }}
              status={SmartLinkStatus.NotFound}
              testId={testId}
            >
              <TitleBlock />
            </Container>
          </IntlProvider>,
        );

        const message = await waitForElement(() =>
          getByTestId('smart-block-title-errored-view-message'),
        );
        fireEvent(
          message,
          new MouseEvent('click', { bubbles: true, cancelable: true }),
        );

        expect(message.textContent).toEqual("Can't find link");
        expect(onClick).toHaveBeenCalled();
      });
    });

    describe('size', () => {
      it('renders block with the defined size', async () => {
        const size = SmartLinkSize.Small;
        const { getByTestId } = render(
          <Container
            size={size}
            status={SmartLinkStatus.Resolved}
            testId={testId}
          >
            <TitleBlock />
          </Container>,
        );

        const element = await waitForElement(() =>
          getByTestId('smart-block-title-resolved-view'),
        );

        expect(element).toHaveStyleDeclaration('gap', '.25rem');
      });

      it('does not override block size if defined', async () => {
        const { getByTestId } = render(
          <Container
            size={SmartLinkSize.Small}
            status={SmartLinkStatus.Resolved}
            testId={testId}
          >
            <TitleBlock size={SmartLinkSize.Large} />
          </Container>,
        );

        const block = await waitForElement(() =>
          getByTestId('smart-block-title-resolved-view'),
        );

        expect(block).toHaveStyleDeclaration('gap', '1rem');
      });
    });

    describe('status', () => {
      it('renders block with the defined status', async () => {
        const size = SmartLinkSize.Small;
        const { getByTestId } = render(
          <Container
            size={size}
            status={SmartLinkStatus.Errored}
            testId={testId}
          >
            <TitleBlock />
          </Container>,
        );

        const element = await waitForElement(() =>
          getByTestId('smart-block-title-errored-view'),
        );

        expect(element).toBeDefined();
      });
    });

    describe('theme', () => {
      it('renders block with the defined theme', async () => {
        const theme = SmartLinkTheme.Black;
        const { getByTestId } = render(
          <FlexibleUiContext.Provider value={context}>
            <Container testId={testId} theme={theme}>
              <TitleBlock />
            </Container>
          </FlexibleUiContext.Provider>,
        );

        const element = await waitForElement(() =>
          getByTestId('smart-element-link'),
        );

        expect(element).toHaveStyleDeclaration(
          'color',
          expect.stringContaining('#44546F'),
        );
        expect(element).toHaveStyleDeclaration('font-weight', '500');
      });

      it('overrides block theme', async () => {
        const { getByTestId } = render(
          <FlexibleUiContext.Provider value={context}>
            <Container testId={testId} theme={SmartLinkTheme.Link}>
              <TitleBlock theme={SmartLinkTheme.Black} />
            </Container>
          </FlexibleUiContext.Provider>,
        );

        const element = await waitForElement(() =>
          getByTestId('smart-element-link'),
        );

        expect(element).toHaveStyleDeclaration(
          'color',
          expect.stringContaining('#0C66E4'),
        );
      });
    });
  });
});
