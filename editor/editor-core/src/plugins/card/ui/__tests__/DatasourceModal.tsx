import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { EditorView } from 'prosemirror-view';
import { render } from '@testing-library/react';

import { DatasourceModal } from '../DatasourceModal';
import { DatasourceModalType } from '@atlaskit/editor-common/types';

const mockEditorView = {
  state: {},
  dispatch: jest.fn(),
} as unknown as EditorView;

describe('DatasourceModal', () => {
  const modalTypes: DatasourceModalType[] = ['jira'];

  const setup = (modalType?: DatasourceModalType) =>
    render(
      <IntlProvider locale="en">
        <DatasourceModal modalType={modalType} view={mockEditorView} />
      </IntlProvider>,
    );

  it.each(modalTypes)(
    'should render the correct modal when modalType is %s',
    (modalType) => {
      const { getByTestId } = setup(modalType);

      const jiraModal = getByTestId(`${modalType}-config-modal`);
      expect(jiraModal).toBeInTheDocument();
    },
  );

  it.each(modalTypes)(
    'should not render %s modal when modalType is undefined',
    (modalType) => {
      const { queryByTestId } = setup();

      const jiraModal = queryByTestId(`${modalType}-config-modal`);
      expect(jiraModal).not.toBeInTheDocument();
    },
  );
});
