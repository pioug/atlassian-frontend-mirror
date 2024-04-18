import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import { css } from '@emotion/react';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkStatus } from '../../../../../../constants';
import PreviewBlock from '../index';
import { PreviewBlockProps } from '../types';
import { FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';

describe('PreviewBlock', () => {
  const testId = 'test-smart-block-preview';

  const renderPreviewBlock = (
    props?: PreviewBlockProps,
    customContext?: FlexibleUiDataContext,
  ) => {
    const ctx = customContext || context;
    return render(
      <IntlProvider locale="en">
        <FlexibleUiContext.Provider value={ctx}>
          <PreviewBlock status={SmartLinkStatus.Resolved} {...props} />
        </FlexibleUiContext.Provider>
      </IntlProvider>,
    );
  };

  it('renders PreviewBlock', async () => {
    const { findByTestId } = renderPreviewBlock({
      testId,
    });

    const block = await findByTestId(`${testId}-resolved-view`);

    expect(block).toBeDefined();
  });

  it('does not render Media if preview context is undefined', async () => {
    const { queryByTestId } = renderPreviewBlock(undefined, {
      preview: undefined,
    });

    const media = queryByTestId(`smart-element-media-image-image`);
    expect(media).not.toBeInTheDocument();
  });

  describe('renders Previewblock with overrideUrl', () => {
    const props = {
      testId,
      overrideUrl: 'override-url',
    };

    it('with media data', async () => {
      const { findByTestId } = renderPreviewBlock(props);

      const block = await findByTestId(`${testId}-resolved-view`);
      const image = await findByTestId(`smart-element-media-image-image`);

      expect(block).toBeDefined();
      expect(image).toHaveAttribute('src', 'override-url');
    });

    it('without media data', async () => {
      const customContext = { ...context, preview: undefined };
      const { findByTestId } = renderPreviewBlock(props, customContext);

      const block = await findByTestId(`${testId}-resolved-view`);
      const image = await findByTestId(`smart-element-media-image-image`);

      expect(block).toBeDefined();
      expect(image).toHaveAttribute('src', 'override-url');
    });
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
      'renders PreviewBlock when status is %s',
      async (status: SmartLinkStatus) => {
        const { findByTestId } = renderPreviewBlock({
          status,
        });
        const block = await findByTestId('smart-block-preview-resolved-view');

        expect(block).toBeDefined();
      },
    );
  });

  it('renders with override css', async () => {
    const overrideCss = css({
      backgroundColor: 'blue',
    });
    const { findByTestId } = renderPreviewBlock({
      overrideCss,
      testId,
    });

    const block = await findByTestId(`${testId}-resolved-view`);

    expect(block).toHaveStyleDeclaration('background-color', 'blue');
  });
});
