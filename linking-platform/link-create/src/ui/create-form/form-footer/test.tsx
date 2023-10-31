/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render, screen, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import { IntlProvider } from 'react-intl-next';

import { asMock } from '@atlaskit/link-test-helpers/jest';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { useFormContext } from '../../../controllers/form-context';

import { CreateFormFooter } from './main';

jest.mock('../../../controllers/form-context', () => {
  const originalModule = jest.requireActual(
    '../../../controllers/form-context',
  );
  return {
    ...originalModule,
    useFormContext: jest.fn(originalModule.useFormContext),
  };
});

describe('FormFooter', () => {
  it('should find the FormFooter error by its id if formErrorMessage is defined', async () => {
    const testId = 'link-create-form';

    const { getByTestId } = render(
      <IntlProvider locale="en">
        <Form<FormData> onSubmit={() => {}}>
          {({}) => {
            return (
              <form onSubmit={() => {}}>
                <CreateFormFooter
                  formErrorMessage={'errorMessage'}
                  handleCancel={() => {}}
                  submitting={false}
                  testId={testId}
                />
              </form>
            );
          }}
        </Form>
      </IntlProvider>,
    );

    expect(getByTestId(`${testId}-error`)).toBeInTheDocument();
  });

  it('should find the FormFooter buttons by type', async () => {
    const testId = 'link-create-form';

    render(
      <IntlProvider locale="en">
        <Form<FormData> onSubmit={() => {}}>
          {props => {
            return (
              <form onSubmit={props.handleSubmit}>
                <CreateFormFooter
                  formErrorMessage={undefined}
                  handleCancel={() => {}}
                  submitting={false}
                  testId={testId}
                />
              </form>
            );
          }}
        </Form>
      </IntlProvider>,
    );

    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute(
      'type',
      'button',
    );
    expect(screen.getByRole('button', { name: 'Create' })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(
      screen.queryByRole('button', { name: 'Edit' }),
    ).not.toBeInTheDocument();
  });

  ffTest(
    'platform.linking-platform.link-create.enable-edit',
    async () => {
      const testId = 'link-create-form';

      asMock(useFormContext).mockReturnValue({
        enableEditView: jest.fn(),
      });

      render(
        <IntlProvider locale="en">
          <Form<FormData> onSubmit={() => {}}>
            {props => {
              return (
                <form onSubmit={props.handleSubmit}>
                  <CreateFormFooter
                    formErrorMessage={undefined}
                    handleCancel={() => {}}
                    submitting={false}
                    testId={testId}
                  />
                </form>
              );
            }}
          </Form>
        </IntlProvider>,
      );

      expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute(
        'type',
        'button',
      );
      const submitButton = screen.getByRole('button', { name: 'Create' });
      expect(submitButton).toHaveAttribute('type', 'submit');

      const editButton = screen.getByRole('button', { name: 'Edit' });
      expect(editButton).toHaveAttribute('type', 'button');

      editButton.click();
      waitFor(() => {
        expect(editButton).toHaveAttribute('aria-busy', 'true');
        expect(submitButton).toHaveAttribute('aria-busy', 'false');
      });
    },
    async () => {
      const testId = 'link-create-form';

      asMock(useFormContext).mockReturnValue({
        enableEditView: undefined,
      });

      render(
        <IntlProvider locale="en">
          <Form<FormData> onSubmit={() => {}}>
            {props => {
              return (
                <form onSubmit={props.handleSubmit}>
                  <CreateFormFooter
                    formErrorMessage={undefined}
                    handleCancel={() => {}}
                    submitting={false}
                    testId={testId}
                  />
                </form>
              );
            }}
          </Form>
        </IntlProvider>,
      );

      expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute(
        'type',
        'button',
      );
      expect(screen.getByRole('button', { name: 'Create' })).toHaveAttribute(
        'type',
        'submit',
      );
      expect(
        screen.queryByRole('button', { name: 'Edit' }),
      ).not.toBeInTheDocument();
    },
  );

  ffTest(
    'platform.linking-platform.link-create.enable-edit',
    async () => {
      const testId = 'link-create-form';

      asMock(useFormContext).mockReturnValue({
        enableEditView: jest.fn(),
      });

      render(
        <IntlProvider locale="en">
          <Form<FormData> onSubmit={() => {}}>
            {props => {
              return (
                <form onSubmit={props.handleSubmit}>
                  <CreateFormFooter
                    formErrorMessage={undefined}
                    handleCancel={() => {}}
                    submitting={false}
                    testId={testId}
                  />
                </form>
              );
            }}
          </Form>
        </IntlProvider>,
      );

      expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute(
        'type',
        'button',
      );
      const submitButton = screen.getByRole('button', { name: 'Create' });
      expect(submitButton).toHaveAttribute('type', 'submit');

      const editButton = screen.getByRole('button', { name: 'Edit' });
      expect(editButton).toHaveAttribute('type', 'button');

      submitButton.click();
      waitFor(() => {
        expect(submitButton).toHaveAttribute('aria-busy', 'true');
        expect(editButton).toHaveAttribute('aria-busy', 'false');
      });
    },
    async () => {
      const testId = 'link-create-form';

      asMock(useFormContext).mockReturnValue({
        enableEditView: jest.fn(),
      });

      render(
        <IntlProvider locale="en">
          <Form<FormData> onSubmit={() => {}}>
            {props => {
              return (
                <form onSubmit={props.handleSubmit}>
                  <CreateFormFooter
                    formErrorMessage={undefined}
                    handleCancel={() => {}}
                    submitting={false}
                    testId={testId}
                  />
                </form>
              );
            }}
          </Form>
        </IntlProvider>,
      );

      expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute(
        'type',
        'button',
      );
      const submitButton = screen.getByRole('button', { name: 'Create' });
      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(
        screen.queryByRole('button', { name: 'Edit' }),
      ).not.toBeInTheDocument();

      submitButton.click();
      waitFor(() => {
        expect(submitButton).toHaveAttribute('aria-busy', 'true');
      });
    },
  );
});
