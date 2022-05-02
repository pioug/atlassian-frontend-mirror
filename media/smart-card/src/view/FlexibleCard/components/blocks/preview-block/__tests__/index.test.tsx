/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import { css } from '@emotion/core';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkStatus } from '../../../../../../constants';
import PreviewBlock from '../index';
import { PreviewBlockProps } from '../types';

describe('PreviewBlock', () => {
  const testId = 'test-smart-block-preview';

  const renderPreviewBlock = (props?: PreviewBlockProps) =>
    render(
      <IntlProvider locale="en">
        <FlexibleUiContext.Provider value={context}>
          <PreviewBlock status={SmartLinkStatus.Resolved} {...props} />
        </FlexibleUiContext.Provider>
      </IntlProvider>,
    );

  it('renders PreviewBlock', async () => {
    const { findByTestId } = renderPreviewBlock({
      testId,
    });

    const block = await findByTestId(`${testId}-resolved-view`);

    expect(block).toBeDefined();
  });

  describe('with specific status', () => {
    it('renders PreviewBlock when status is resolved', async () => {
      const { findByTestId } = renderPreviewBlock();

      const block = await findByTestId('smart-block-preview-resolved-view');

      expect(block).toBeDefined();
    });

    it.each([
      [SmartLinkStatus.Resolving],
      [SmartLinkStatus.Forbidden],
      [SmartLinkStatus.Errored],
      [SmartLinkStatus.NotFound],
      [SmartLinkStatus.Unauthorized],
      [SmartLinkStatus.Fallback],
    ])(
      'does not renders PreviewBlock when status is %s',
      async (status: SmartLinkStatus) => {
        const { container } = renderPreviewBlock({
          status,
        });
        expect(container.children.length).toEqual(0);
      },
    );
  });

  it('renders with override css', async () => {
    const overrideCss = css`
      background-color: blue;
    `;
    const { findByTestId } = renderPreviewBlock({
      overrideCss,
      testId,
    });

    const block = await findByTestId(`${testId}-resolved-view`);

    expect(block).toHaveStyleDeclaration('background-color', 'blue');
  });
});
