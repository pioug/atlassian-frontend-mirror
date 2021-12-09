import React from 'react';

import { mount } from 'enzyme';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import FieldTextArea from '@atlaskit/field-text-area';
import { Field } from '@atlaskit/form';

import { CommentField, Props } from '../../../components/CommentField';
import { messages } from '../../../i18n';
import { Comment } from '../../../types';

jest.mock('react-intl-next', () => {
  return {
    ...(jest.requireActual('react-intl-next') as any),
    useIntl: jest.fn().mockReturnValue({
      formatMessage: (descriptor: any) => descriptor.defaultMessage,
    }),
  };
});

describe('CommentField', () => {
  const buildCommentField = (props: Partial<Props> = {}) => {
    const component = mount(<CommentField {...props} />);
    const field = component.find(Field);
    const fieldTextArea = field.find(FieldTextArea);
    return {
      fieldTextArea,
      field,
      component,
    };
  };

  it('should render TextField', () => {
    const { fieldTextArea } = buildCommentField();

    expect(fieldTextArea).toHaveLength(1);
    expect(fieldTextArea.prop('placeholder')).toEqual(
      messages.commentPlaceholder.defaultMessage,
    );
    expect(fieldTextArea.prop('onChange')).toBeInstanceOf(Function);
    expect(fieldTextArea.prop('value')).toBe(undefined);
    expect(fieldTextArea.prop('maxLength')).toBe(500);
  });

  it('should set defaultValue and see the change in value for <FieldTextArea />', () => {
    const defaultValue: Comment = {
      format: 'plain_text',
      value: 'some comment',
    };
    const { field, fieldTextArea } = buildCommentField({ defaultValue });
    expect(field.props()).toMatchObject({
      defaultValue,
      name: 'comment',
    });
    expect(fieldTextArea.prop('value')).toBe('some comment');
  });
});
