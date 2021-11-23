/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import InlineMessage from '../../../index';

const testId = 'test';

describe('Inline Message', () => {
  afterEach(cleanup);

  it('basic sanity check', () => {
    const { getByTestId } = render(<InlineMessage testId={testId} />);
    expect(getByTestId(testId)).not.toBe(undefined);
  });

  describe('dialog state', () => {
    it('should start closed, no content on showing', () => {
      const { queryByTestId } = render(
        <InlineMessage>
          <div data-testid={testId} />
        </InlineMessage>,
      );
      expect(queryByTestId(testId)).toBeNull();
    });
    it('should toggle when the button is clicked', () => {
      const { getByTestId, getByText } = render(
        <InlineMessage testId={testId}>
          <div>Hello</div>
        </InlineMessage>,
      );
      const button = getByTestId(`${testId}--button`);
      fireEvent.click(button);
      expect(getByText('Hello')).toBeInTheDocument();
    });

    it('should hide when the button is clicked twice', () => {
      const { getByTestId, getByText, queryByText } = render(
        <InlineMessage testId={testId}>
          <div>Hello</div>
        </InlineMessage>,
      );
      const button = getByTestId(`${testId}--button`);
      fireEvent.click(button);
      expect(getByText('Hello')).toBeInTheDocument();
      fireEvent.click(button);
      expect(queryByText('Hello')).toBeNull();
    });
  });
});
