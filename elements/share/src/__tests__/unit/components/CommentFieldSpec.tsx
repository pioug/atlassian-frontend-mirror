import { shallowWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import FieldTextArea from '@atlaskit/field-text-area';
import { Field } from '@atlaskit/form';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CommentField, Props } from '../../../components/CommentField';
import { messages } from '../../../i18n';
import { Comment } from '../../../types';
import { renderProp } from '../_testUtils';

describe('CommentField', () => {
  const buildCommentField = (props: Partial<Props> = {}) => {
    const component = shallowWithIntl(<CommentField {...props} />);
    // No types for Field component =(
    const field = component.find<any>(Field);
    const fieldProps = {
      onChange: jest.fn(),
      value: {
        type: 'plain_text',
        value: 'Some text',
      },
    };
    const fieldChildren = renderProp(field, 'children', { fieldProps });
    const formattedMessage = fieldChildren.find(FormattedMessage);
    const fieldTextArea = renderProp(
      formattedMessage,
      'children',
      'placeholder',
    ).find(FieldTextArea);

    return {
      formattedMessage,
      fieldTextArea,
      field,
      fieldProps,
      component,
      fieldChildren,
    };
  };

  it('should render TextField', () => {
    const { formattedMessage, fieldProps, fieldTextArea } = buildCommentField();

    expect(formattedMessage).toHaveLength(1);
    expect(formattedMessage.props()).toMatchObject(messages.commentPlaceholder);

    expect(fieldTextArea).toHaveLength(1);
    expect(fieldTextArea.prop('placeholder')).toEqual('placeholder');
    expect(fieldTextArea.prop('onChange')).toBeInstanceOf(Function);
    expect(fieldTextArea.prop('value')).toBe(fieldProps.value.value);
    expect(fieldTextArea.prop('maxLength')).toBe(500);
  });

  it('should call onChange with Comment object', () => {
    const { fieldProps, fieldTextArea } = buildCommentField();

    expect(fieldTextArea).toHaveLength(1);
    fieldTextArea.simulate('change', { target: { value: 'some comment' } });
    expect(fieldProps.onChange).toHaveBeenCalledTimes(1);
    expect(fieldProps.onChange).toHaveBeenCalledWith({
      format: 'plain_text',
      value: 'some comment',
    });
  });

  it('should set defaultValue', () => {
    const defaultValue: Comment = {
      format: 'plain_text',
      value: 'some comment',
    };
    const { field } = buildCommentField({ defaultValue });
    expect(field.props()).toMatchObject({
      defaultValue,
      name: 'comment',
    });
  });
});
