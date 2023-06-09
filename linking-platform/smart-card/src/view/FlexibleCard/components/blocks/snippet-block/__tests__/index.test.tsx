import React from 'react';
import { render } from '@testing-library/react';
import { css } from '@emotion/react';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkStatus } from '../../../../../../constants';
import SnippetBlock from '../index';

describe('SnippetBlock', () => {
  it('renders SnippetBlock', async () => {
    const testId = 'test-smart-block-snippet';
    const { findByTestId } = render(
      <FlexibleUiContext.Provider value={context}>
        <SnippetBlock status={SmartLinkStatus.Resolved} testId={testId} />
      </FlexibleUiContext.Provider>,
    );

    const block = await findByTestId(`${testId}-resolved-view`);

    expect(block).toBeDefined();
    expect(block.textContent).toBe(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );
  });

  describe('with maxLines', () => {
    it('renders with default maxLines', async () => {
      const testId = 'smart-element-text';
      const { findByTestId } = render(
        <FlexibleUiContext.Provider value={context}>
          <SnippetBlock status={SmartLinkStatus.Resolved} />
        </FlexibleUiContext.Provider>,
      );

      const element = await findByTestId(testId);

      expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '3');
    });

    it('renders with specific maxLines', async () => {
      const testId = 'smart-element-text';
      const { findByTestId } = render(
        <FlexibleUiContext.Provider value={context}>
          <SnippetBlock maxLines={2} status={SmartLinkStatus.Resolved} />
        </FlexibleUiContext.Provider>,
      );

      const element = await findByTestId(testId);

      expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '2');
    });

    it('renders with maximum maxLines when maxLines exceed maximum', async () => {
      const testId = 'smart-element-text';
      const { findByTestId } = render(
        <FlexibleUiContext.Provider value={context}>
          <SnippetBlock maxLines={5} status={SmartLinkStatus.Resolved} />
        </FlexibleUiContext.Provider>,
      );

      const element = await findByTestId(testId);

      expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '3');
    });
  });

  it('renders with override css', async () => {
    const overrideCss = css`
      background-color: blue;
    `;
    const { findByTestId } = render(
      <FlexibleUiContext.Provider value={context}>
        <SnippetBlock
          overrideCss={overrideCss}
          status={SmartLinkStatus.Resolved}
          testId="css"
        />
      </FlexibleUiContext.Provider>,
    );

    const block = await findByTestId('css-resolved-view');

    expect(block).toHaveStyleDeclaration('background-color', 'blue');
  });
});
