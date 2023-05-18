import React from 'react';

import { render } from '@testing-library/react';

import { CreateFormLoader } from './main';

describe('FormLoader', () => {
  it("should find the FormLoader by its testid when it's active", async () => {
    const testId = 'link-create-form-loader';

    const { getByTestId } = render(<CreateFormLoader />);

    expect(getByTestId(testId)).toBeTruthy();
  });
});
