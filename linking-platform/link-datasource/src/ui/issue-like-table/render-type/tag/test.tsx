import React from 'react';

import { render } from '@testing-library/react';

import Tag, { TAG_TYPE_TEST_ID } from './index';

describe('Tag Type', () => {
  const setup = ({ text = '', ...props }) => {
    return render(<Tag text={{ value: text }} {...props} />);
  };

  it('renders when text is passed', async () => {
    const { queryByTestId } = setup({
      text: 'SIMPLE TAG',
    });

    const el = queryByTestId(TAG_TYPE_TEST_ID);

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('SIMPLE TAG');
  });

  it('does not render when text is empty', async () => {
    const { queryByTestId } = setup({
      text: '',
    });
    expect(queryByTestId(TAG_TYPE_TEST_ID)).not.toBeInTheDocument();
  });
});
