import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Container from '../index';
import { SmartLinkSize } from '../../../../../constants';
import Block from '../../blocks/block';

const mockBlockComponent = jest.fn();
jest.mock('../../blocks/block', () => ({
  __esModule: true,
  default: (props: any) => {
    mockBlockComponent(props);
    return <div></div>;
  },
}));

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
    const background = 'var(--ds-surface,#FFFFFF)';

    it('shows background by default', async () => {
      const { getByTestId } = render(<Container testId={testId} />);

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).toHaveStyleDeclaration('background-color', background);
    });

    it('shows background', async () => {
      const { getByTestId } = render(
        <Container hideBackground={false} testId={testId} />,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).toHaveStyleDeclaration('background-color', background);
    });

    it('hides background', async () => {
      const { getByTestId } = render(
        <Container hideBackground={true} testId={testId} />,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).not.toHaveStyleDeclaration(
        'background-color',
        background,
      );
    });
  });

  describe('hideElevation', () => {
    const border = '1px solid transparent';
    const borderRadius = '1.5px';
    const boxShadow = `var(--ds-shadow-raised,0 1px 1px rgba(9,30,66,0.25),0 0 1px 1px rgba(9,30,66,0.13))`;

    it('shows elevation by default', async () => {
      const { getByTestId } = render(<Container testId={testId} />);

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).toHaveStyleDeclaration('border', border);
      expect(container).toHaveStyleDeclaration('border-radius', borderRadius);
      expect(container).toHaveStyleDeclaration('box-shadow', boxShadow);
    });

    it('shows elevation', async () => {
      const { getByTestId } = render(
        <Container hideElevation={false} testId={testId} />,
      );

      const container = await waitForElement(() => getByTestId(testId));

      expect(container).toHaveStyleDeclaration('border', border);
      expect(container).toHaveStyleDeclaration('border-radius', borderRadius);
      expect(container).toHaveStyleDeclaration('box-shadow', boxShadow);
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
      expect(container).not.toHaveStyleDeclaration('box-shadow', boxShadow);
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
    afterEach(() => {
      mockBlockComponent.mockClear();
    });

    it('renders children', async () => {
      const { getByTestId } = render(
        <Container testId={testId}>
          <div></div>
          <div></div>
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

    it('passes size prop to child element', async () => {
      const size = SmartLinkSize.Small;
      const { getByTestId } = render(
        <Container size={size} testId={testId}>
          <Block />
        </Container>,
      );

      await waitForElement(() => getByTestId(testId));

      expect(mockBlockComponent).toHaveBeenCalledWith(
        expect.objectContaining({ size }),
      );
    });

    it('does not override child element size prop', async () => {
      const { getByTestId } = render(
        <Container size={SmartLinkSize.Small} testId={testId}>
          <Block size={SmartLinkSize.Large} />
        </Container>,
      );

      await waitForElement(() => getByTestId(testId));

      expect(mockBlockComponent).toHaveBeenCalledWith(
        expect.objectContaining({ size: SmartLinkSize.Large }),
      );
    });
  });
});
