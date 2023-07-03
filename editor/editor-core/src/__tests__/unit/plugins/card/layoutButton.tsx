import React from 'react';

import { render, fireEvent } from '@testing-library/react';
import { LayoutButton } from '../../../../plugins/card/ui/LayoutButton';
import { DatasourceTableLayout } from '../../../../plugins/card/ui/LayoutButton/types';
import { createIntl } from 'react-intl-next';

describe('Layout Button', () => {
  const intl = createIntl({
    locale: 'en',
  });

  const formattedMessages: Record<DatasourceTableLayout, string> = {
    center: 'Go wide',
    wide: 'Go full width',
    'full-width': 'Back to center',
  };

  const mockOnLayoutChange = jest.fn();

  const setup = ({ layout }: { layout: DatasourceTableLayout }) => {
    const targetElement = document.createElement('div');
    const component = render(
      <>
        <button data-testid="target-button">Target</button>
        <LayoutButton
          intl={intl}
          layout={layout}
          onLayoutChange={mockOnLayoutChange}
          targetElement={targetElement}
        />
      </>,
    );

    return component;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when rendering the layout button', () => {
    const layouts: DatasourceTableLayout[] = ['center', 'wide', 'full-width'];

    it.each(layouts)(
      'it should render correctly when the layout is %s',
      (layout) => {
        const { queryAllByLabelText } = setup({
          layout,
        });

        const [div, span] = queryAllByLabelText(formattedMessages[layout]);

        expect(div).toHaveAttribute('aria-label', formattedMessages[layout]);
        expect(span).toHaveAttribute('aria-label', formattedMessages[layout]);
      },
    );
  });

  describe('when clicking on the layout button', () => {
    it.each<[DatasourceTableLayout, DatasourceTableLayout]>([
      ['wide', 'center'],
      ['full-width', 'wide'],
      ['center', 'full-width'],
    ])(
      'it should invoke transaction with layout as %s when the current layout is %s',
      (nextLayout, currentLayout) => {
        const { queryByTestId } = setup({
          layout: currentLayout,
        });

        const layoutButton = queryByTestId('datasource-table-layout-button');

        fireEvent.click(layoutButton!);

        expect(mockOnLayoutChange).toHaveBeenCalledTimes(1);
        expect(mockOnLayoutChange).toHaveBeenCalledWith(nextLayout);
      },
    );
  });
});
