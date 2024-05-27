import React from 'react';

import { mount } from 'enzyme';

import { Field } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';

import { CommentField, type Props } from '../../../components/CommentField';
import { messages } from '../../../i18n';
import { type Comment } from '../../../types';

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
    const textArea = field.find(TextArea);
    return {
      textArea,
      field,
      component,
    };
  };

  it('should render TextField', () => {
    const { textArea } = buildCommentField();

    expect(textArea).toHaveLength(1);
    expect(textArea.prop('placeholder')).toEqual(
      messages.commentPlaceholder.defaultMessage,
    );
    expect(textArea.prop('onChange')).toBeInstanceOf(Function);
    expect(textArea.prop('value')).toBe(undefined);
    expect(textArea.prop('maxLength')).toBe(500);
  });

  it('should set defaultValue and see the change in value for <FieldTextArea />', () => {
    const defaultValue: Comment = {
      format: 'plain_text',
      value: 'some comment',
    };
    const { field, textArea } = buildCommentField({ defaultValue });
    expect(field.props()).toMatchObject({
      defaultValue,
      name: 'comment',
    });
    expect(textArea.prop('value')).toBe('some comment');
  });
});
