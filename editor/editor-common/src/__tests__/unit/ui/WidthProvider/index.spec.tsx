import React from 'react';

import { render } from '@testing-library/react';

import {
  createWidthContext,
  WidthConsumer,
  WidthContext,
  WidthProvider,
} from '../../../../ui/WidthProvider';

describe('WidthProvider', () => {
  it('should consume container width correctly without shouldCheckExistingValue', () => {
    // mock child-component container width
    jest
      .spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get')
      .mockReturnValue(123);
    const onWidth = jest.fn();
    render(
      <div>
        <WidthContext.Provider value={createWidthContext(300)}>
          <WidthProvider>
            <div data-testid="child-component">
              <WidthConsumer>{({ width }) => onWidth(width)}</WidthConsumer>
            </div>
          </WidthProvider>
        </WidthContext.Provider>
      </div>,
    );
    expect(onWidth).toHaveBeenCalledWith(123);
  });

  it('should consume container width correctly with shouldCheckExistingValue', () => {
    // mock child-component container width
    jest
      .spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get')
      .mockReturnValue(123);
    const onWidth = jest.fn();
    render(
      <div>
        <WidthContext.Provider value={createWidthContext(300)}>
          <WidthProvider shouldCheckExistingValue>
            <div data-testid="child-component">
              <WidthConsumer>{({ width }) => onWidth(width)}</WidthConsumer>
            </div>
          </WidthProvider>
        </WidthContext.Provider>
      </div>,
    );
    expect(onWidth).toHaveBeenCalledWith(300);
  });
});
