import React, { useState } from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import Textfield from '@atlaskit/textfield';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import InlineEdit from '../../InlineEdit';

describe('InlineEdit component', () => {
  describe('Simple render', () => {
    it('should render read view component by default', () => {
      const defaultValue = 'Some text';
      const onConfirm = jest.fn();

      const { queryByTestId } = render(
        <InlineEdit
          defaultValue={defaultValue}
          label="Inline edit"
          editView={fieldProps => (
            <Textfield testId="edit-view" {...fieldProps} />
          )}
          readView={() => (
            <div data-testid="read-view">
              {defaultValue || 'Click to enter value'}
            </div>
          )}
          onConfirm={onConfirm}
        />,
      );

      const read = queryByTestId('read-view');
      expect(read).toBeInTheDocument();
    });

    it('should render edit component when user clicked', () => {
      const defaultValue = 'Some text';
      const onConfirm = jest.fn();

      const { container, queryByTestId } = render(
        <InlineEdit
          defaultValue={defaultValue}
          label="Inline edit"
          editView={fieldProps => (
            <Textfield testId="edit-view" {...fieldProps} />
          )}
          readView={() => (
            <div data-testid="read-view">
              {defaultValue || 'Click to enter value'}
            </div>
          )}
          onConfirm={onConfirm}
        />,
      );

      const read = queryByTestId('read-view');
      const edit = queryByTestId('edit-view');

      expect(read).toBeInTheDocument();
      expect(edit).not.toBeInTheDocument();

      //enter edit mode
      fireEvent.click(read!);

      const textField = container.querySelector('[data-testid="edit-view"]');
      const confirm = container.querySelector('[aria-label="Confirm"]');
      const cancel = container.querySelector('[aria-label="Cancel"]');

      expect(textField).toBeInTheDocument();
      expect(confirm).toBeInTheDocument();
      expect(cancel).toBeInTheDocument();
    });

    it('should edit the content', () => {
      const defaultValue = 'Some text';
      const onConfirm = jest.fn();

      const { container, queryByTestId } = render(
        <InlineEdit
          defaultValue={defaultValue}
          label="Inline edit"
          editView={fieldProps => (
            <Textfield testId="edit-view" {...fieldProps} />
          )}
          readView={() => (
            <div data-testid="read-view">
              {defaultValue || 'Click to enter value'}
            </div>
          )}
          onConfirm={onConfirm}
        />,
      );

      const read = queryByTestId('read-view');
      const edit = queryByTestId('edit-view');

      expect(read).toBeInTheDocument();
      expect(edit).not.toBeInTheDocument();

      //enter edit mode
      fireEvent.click(read!);

      const textField = container.querySelector('[data-testid="edit-view"]');
      const confirm = container.querySelector('[aria-label="Confirm"]');

      fireEvent.change(textField!, { target: { value: 'New content' } });
      fireEvent.click(confirm!);

      expect(onConfirm).toHaveBeenCalledWith(
        'New content',
        expect.objectContaining({}),
      );
    });

    it('should be able to update the content - integration', () => {
      const InlineEditExample = () => {
        const [editValue, setEditValue] = useState('Old content');

        return (
          <InlineEdit
            defaultValue={editValue}
            label="Inline edit"
            editView={fieldProps => (
              <Textfield testId="edit-view" {...fieldProps} />
            )}
            readView={() => (
              <div data-testid="read-view">
                {editValue || 'Click to enter value'}
              </div>
            )}
            onConfirm={value => setEditValue(value)}
          />
        );
      };

      const { container, queryByTestId } = render(<InlineEditExample />);

      const read = queryByTestId('read-view');
      expect(read).toBeInTheDocument();
      expect(read!.innerText).toContain('Old content');

      //enter edit mode
      fireEvent.click(read!);

      const textField = container.querySelector('[data-testid="edit-view"]');
      const confirm = container.querySelector('[aria-label="Confirm"]');

      fireEvent.change(textField!, { target: { value: 'New content' } });
      fireEvent.click(confirm!);

      expect(queryByTestId('read-view')!.innerText).toContain('New content');
    });
  });

  describe('analytics', () => {
    it('should send event to atlaskit/analytics', () => {
      const defaultValue = '';
      const newValue = 'new value';
      const onConfirm = jest.fn();
      const onAnalyticsEvent = jest.fn();

      const { container } = render(
        <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
          <InlineEdit
            defaultValue={defaultValue}
            label="Inline edit"
            editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
            readView={() => (
              <span>{defaultValue || 'Click to enter value'}</span>
            )}
            onConfirm={onConfirm}
          />
        </AnalyticsListener>,
      );

      const button = container.querySelector('button[aria-label="Edit"]');
      fireEvent.click(button!);

      const input = container.querySelector('input[name="inlineEdit"]');
      fireEvent.change(input!, { target: { value: newValue } });

      const confirm = container.querySelector('button[type="submit"]');
      fireEvent.click(confirm!);

      expect(onConfirm).toHaveBeenCalled();
      expect(onAnalyticsEvent.mock.calls[2]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: {
              action: 'confirmed',
              actionSubject: 'inlineEdit',
              attributes: {
                componentName: 'inlineEdit',
                packageName,
                packageVersion,
              },
            },
          }),
        ]),
      );
    });
  });
});
