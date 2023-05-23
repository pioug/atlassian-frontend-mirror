import React from 'react';

import { render } from '@testing-library/react';

import Text, { TEXT_TYPE_TEST_ID } from './index';

describe('Text Type', () => {
  const setup = ({ text = '', ...props }) => {
    return render(<Text text={text} {...props} />);
  };

  it('renders when text is passed', async () => {
    const { queryByTestId } = setup({
      text: 'HELLO_WORLD',
    });

    const text = queryByTestId(TEXT_TYPE_TEST_ID);

    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent('HELLO_WORLD');
  });

  it('does not render when the text is empty', async () => {
    const { queryByTestId } = setup({
      text: '',
    });
    expect(queryByTestId(TEXT_TYPE_TEST_ID)).not.toBeInTheDocument();
  });
});
