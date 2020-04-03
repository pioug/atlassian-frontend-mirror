import React from 'react';
import { render, cleanup } from '@testing-library/react';

import ModalDialog, { ModalTransition } from '../../..';

// dialogs require an onClose function
const noop = () => {};

const MyContent = () => <div>Hello</div>;
const wrapperWithTestId = (
  <ModalTransition>
    <ModalDialog onClose={noop} testId="iamTheDataTestId">
      <MyContent />
    </ModalDialog>
  </ModalTransition>
);

describe('Modal should be found by data-testid', () => {
  beforeEach(() => cleanup());
  test('Using getByTestId()', async () => {
    const { getByTestId } = render(wrapperWithTestId);
    expect(getByTestId('iamTheDataTestId')).toBeTruthy();
  });

  test('Using container snapshot', () => {
    const { container } = render(wrapperWithTestId);
    expect(container).toMatchSnapshot();
  });
});
