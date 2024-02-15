import React from 'react';

import { IntlShape } from 'react-intl-next';

import { DatasourceType } from '@atlaskit/linking-types';

import { TableViewPropsRenderType } from '../types';

import BooleanRenderType from './boolean';
import DateTimeRenderType, { getFormattedDate } from './date-time';
import IconRenderType from './icon';
import LinkRenderType from './link';
import NumberRenderType from './number';
import RichTextRenderType, { parseRichText } from './richtext';
import StatusRenderType from './status';
import TagRenderType from './tag';
import StringRenderType from './text';
import UserRenderType from './user';
import { userTypeMessages } from './user/messages';

export const stringifyType = (
  { type, value }: DatasourceType,
  formatMessage: IntlShape['formatMessage'],
  formatDate: IntlShape['formatDate'],
): string => {
  switch (type) {
    case 'boolean':
    case 'number':
      return value?.toString() || '';
    case 'date':
      return getFormattedDate(value, 'date', formatDate);
    case 'datetime':
      return getFormattedDate(value, 'datetime', formatDate);
    case 'time':
      return getFormattedDate(value, 'time', formatDate);
    case 'icon':
      return value?.label || '';
    case 'status':
      return value?.text.toString() || '';
    case 'string':
      return value;
    case 'tag':
      return value?.text || '';
    case 'user':
      return (
        value?.displayName ||
        formatMessage(userTypeMessages.userDefaultdisplayNameValue)
      );
    case 'richtext':
      const adfPlainText = parseRichText(value);
      return adfPlainText || '';
    case 'link':
    default:
      return '';
  }
};

export const fallbackRenderType: TableViewPropsRenderType = item => {
  switch (item.type) {
    case 'boolean':
      return item.values.map(booleanValue => (
        <BooleanRenderType value={booleanValue} />
      ));
    case 'date':
      return item.values.map(dateValue => (
        <DateTimeRenderType value={dateValue} display="date" />
      ));
    case 'datetime':
      return item.values.map(datTimeValue => (
        <DateTimeRenderType value={datTimeValue} display="datetime" />
      ));
    case 'icon':
      return item.values.map(iconValue => <IconRenderType {...iconValue} />);
    case 'link':
      return item.values.map(linkValue => (
        <LinkRenderType key={linkValue?.url} {...linkValue} />
      ));
    case 'number':
      return item.values.map(numberValue => (
        <NumberRenderType number={numberValue} />
      ));
    case 'status':
      return item.values.map(statusValue => (
        <StatusRenderType {...statusValue} />
      ));
    case 'string':
      return item.values.map(stringValue => (
        <StringRenderType key={stringValue} text={stringValue} />
      ));
    case 'tag':
      return item.values.map(tagValue => (
        <TagRenderType key={tagValue?.id || tagValue?.text} tag={tagValue} />
      ));
    case 'time':
      return item.values.map(timeValue => (
        <DateTimeRenderType value={timeValue} display="time" />
      ));
    case 'user':
      return <UserRenderType users={item.values} />;
    case 'richtext':
      return item.values.map(richValue => (
        <RichTextRenderType value={richValue} />
      ));
    default:
      return <></>;
  }
};
