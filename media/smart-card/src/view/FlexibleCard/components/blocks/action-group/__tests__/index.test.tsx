import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionGroup from '..';
import { ActionName } from '../../../../../../constants';
import { ActionItem } from '../../types';

describe('ActionGroup', () => {
  it('renders action group', async () => {
    const childrenText = 'I am an action group';
    const { container } = render(
      <ActionGroup
        items={[
          ({
            name: ActionName.DeleteAction,
            onClick: () => {},
            content: childrenText,
          } as unknown) as ActionItem,
        ]}
      >
        {childrenText}
      </ActionGroup>,
    );

    const actionGroup = await waitForElement(() => container.firstChild);

    expect(actionGroup).toBeTruthy();
    expect(actionGroup?.textContent).toMatch(childrenText);
  });
});
