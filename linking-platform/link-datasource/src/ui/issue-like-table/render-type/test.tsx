import { type DatasourceType } from '@atlaskit/linking-types';

import { stringifyType } from '../render-type';

let mockFormatMessage = jest.fn();
const mockFormatDate = jest.fn();

describe('stringifyType', () => {
  mockFormatMessage = jest.fn(() => 'mock message');

  // Test for BooleanType
  it('should return string representation of boolean value', () => {
    const input: DatasourceType = { type: 'boolean', value: true };
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('true');
  });

  // Test for DateType
  it('should return formatted date string', () => {
    const input: DatasourceType = {
      type: 'date',
      value: '2020-01-01',
    };
    mockFormatDate.mockReturnValue('January 1, 2020');
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('January 1, 2020');
  });

  // Test for DateTimeType
  it('should return formatted datetime string', () => {
    const input: DatasourceType = {
      type: 'datetime',
      value: '2020-01-01T00:00:00.000Z',
    };
    mockFormatDate.mockReturnValue('January 1, 2020, 12:00:00 AM');
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('January 1, 2020, 12:00:00 AM');
  });

  // Test for TimeType
  it('should return formatted time string', () => {
    const input: DatasourceType = {
      type: 'time',
      value: '2020-01-01T00:00:00.000Z',
    };
    mockFormatDate.mockReturnValue('12:00:00 AM');
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('12:00:00 AM');
  });

  // Test for NumberType
  it('should return string representation of number value', () => {
    const input: DatasourceType = { type: 'number', value: 123 };
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('123');
  });

  // Test for StringType
  it('should return the string value as is', () => {
    const input: DatasourceType = { type: 'string', value: 'test string' };
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('test string');
  });

  // Test for TagType
  it('should return the text of the tag', () => {
    const input: DatasourceType = {
      type: 'tag',
      value: { id: '1', text: 'tag text' },
    };
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('tag text');
  });

  // Test for UserType
  it('should return the displayName of the User', () => {
    mockFormatMessage.mockReturnValue('John Doe');
    const input: DatasourceType = { type: 'user', value: { displayName: '' } };
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('John Doe');
  });

  // Test for Unassigned UserType
  it('should return the displayName of the Unassigned User', () => {
    mockFormatMessage.mockReturnValue('undefined');
    const input: DatasourceType = { type: 'user', value: { displayName: '' } };
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('undefined');
  });

  // Test for IconType
  it('should return the label of the Icon', () => {
    const input: DatasourceType = {
      type: 'icon',
      value: { source: 'source', label: 'icon label' },
    };
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('icon label');
  });

  // Test for LinkType
  it('should return an empty string for LinkType', () => {
    const input: DatasourceType = {
      type: 'link',
      value: { url: 'url', text: 'link text' },
    };
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('');
  });

  // Test for StatusType
  it('should return the text of the status', () => {
    const input: DatasourceType = {
      type: 'status',
      value: { id: '1', text: 'status text' },
    };
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('status text');
  });

  // Test for RichTextType
  it('should return parsed text from RichTextType', () => {
    // Assuming parseRichText returns the text as is
    const input: DatasourceType = {
      type: 'richtext',
      value: {
        type: 'adf',
        text: `{
                  "type": "paragraph",
                  "content": [{ "type": "text", "text": "Header content 1" }]
                }`,
      },
    };
    const result = stringifyType(input, mockFormatMessage, mockFormatDate);
    expect(result).toEqual('Header content 1');
  });
});
