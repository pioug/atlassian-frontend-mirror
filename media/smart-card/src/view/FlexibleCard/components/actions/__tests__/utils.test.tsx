import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { ActionName } from '../../../../../constants';
import { FlexibleUiDataContext } from '../../../../../state/flexible-ui-context/types';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import context from '../../../../../__fixtures__/flexible-ui-data-context';
import { createUIAction } from '../utils';
import { IntlProvider } from 'react-intl-next';

const renderAction = (
  Action: React.FC<any>,
  context: FlexibleUiDataContext,
  testId: string,
  props?: any,
) =>
  render(
    <IntlProvider locale="en">
      <FlexibleUiContext.Provider value={context}>
        <Action testId={testId} {...props} />
      </FlexibleUiContext.Provider>
    </IntlProvider>,
  );

describe('createUIAction', () => {
  const testId = 'smart-action';

  describe('actions', () => {
    it('creates delete action', async () => {
      const Action = createUIAction(ActionName.DeleteAction);
      const props = { onClick: () => {} };
      const { getByTestId } = renderAction(Action, context, testId, props);

      const element = await waitFor(() => getByTestId(testId));

      expect(Action).toBeDefined();
      expect(element.textContent).toEqual('Delete');
    });
  });

  it('throws error if base element does not exists', () => {
    expect(() => createUIAction('Random' as ActionName)).toThrow(
      new Error('Action Random does not exist.'),
    );
  });

  it('does not render element if context is not available', async () => {
    const Action = createUIAction(ActionName.DeleteAction);
    const { container } = await render(<Action />);
    expect(container.children.length).toEqual(0);
  });

  it('allows overrides of preset props and data', async () => {
    const expectedTextContent = 'Overridden delete action';
    const Action = createUIAction(ActionName.DeleteAction);
    const { getByTestId } = renderAction(Action, context, testId, {
      onClick: () => {},
      content: expectedTextContent,
    });

    const element = await waitFor(() => getByTestId(testId));

    expect(element.textContent).toEqual(expectedTextContent);
  });
});
