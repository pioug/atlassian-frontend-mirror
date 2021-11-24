import FieldTextArea from '@atlaskit/field-text-area';
import { Field } from '@atlaskit/form';
import React from 'react';
import { useIntl } from 'react-intl-next';
import { messages } from '../i18n';
import { Comment } from '../types';

export type Props = {
  defaultValue?: Comment;
};

export const CommentField: React.StatelessComponent<Props> = ({
  defaultValue,
}) => {
  const intl = useIntl();
  return (
    <Field<Comment> name="comment" defaultValue={defaultValue}>
      {({ fieldProps }) => (
        <FieldTextArea
          {...fieldProps}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            fieldProps.onChange({
              format: 'plain_text',
              value: event.target.value,
            })
          }
          value={fieldProps.value && fieldProps.value.value}
          maxLength={500}
          minimumRows={3}
          shouldFitContainer
          isLabelHidden
          placeholder={intl.formatMessage(messages.commentPlaceholder)}
        />
      )}
    </Field>
  );
};
