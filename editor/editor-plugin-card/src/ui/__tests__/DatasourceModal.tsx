import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type { DatasourceModalType } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { DatasourceModal } from '../DatasourceModal';

import {
  cardContext,
  MockCardContextAdapter,
} from './_utils/mock-card-context';

const mockEditorView = {
  state: {},
  dispatch: jest.fn(),
} as unknown as EditorView;

describe('DatasourceModal', () => {
  const modalTypes: DatasourceModalType[] = ['jira', 'assets'];

  const setup = (modalType?: DatasourceModalType) =>
    render(
      <IntlProvider locale="en">
        <MockCardContextAdapter card={cardContext}>
          <DatasourceModal
            modalType={modalType}
            view={mockEditorView}
            cardContext={cardContext as any}
          />
        </MockCardContextAdapter>
      </IntlProvider>,
    );

  it.each(modalTypes)(
    'should render the correct modal when modalType is %s',
    modalType => {
      const { getByTestId } = setup(modalType);

      const jiraModal = getByTestId(`${modalType}-config-modal`);
      expect(jiraModal).toBeInTheDocument();
    },
  );

  it.each(modalTypes)(
    'should not render %s modal when modalType is undefined',
    modalType => {
      const { queryByTestId } = setup();

      const jiraModal = queryByTestId(`${modalType}-config-modal`);
      expect(jiraModal).not.toBeInTheDocument();
    },
  );
});
