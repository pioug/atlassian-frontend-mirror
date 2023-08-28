import React from 'react';

import { TableViewPropsRenderType } from '../types';

import BooleanRenderType from './boolean';
import DateTimeRenderType from './date-time';
import IconRenderType from './icon';
import LinkRenderType from './link';
import NumberRenderType from './number';
import RichTextRenderType from './richtext';
import StatusRenderType from './status';
import TagRenderType from './tag';
import StringRenderType from './text';
import UserRenderType from './user';

export const fallbackRenderType: TableViewPropsRenderType = item => {
  switch (item.type) {
    case 'boolean':
      return <BooleanRenderType value={item.value} />;
    case 'date':
      return <DateTimeRenderType value={item.value} display="date" />;
    case 'datetime':
      return <DateTimeRenderType value={item.value} display="datetime" />;
    case 'icon':
      return <IconRenderType {...item.value} />;
    case 'link':
      return <LinkRenderType key={item.value?.url} {...item.value} />;
    case 'number':
      return <NumberRenderType number={item.value} />;
    case 'status':
      return <StatusRenderType {...item.value} />;
    case 'string':
      return <StringRenderType key={item.value} text={item.value} />;
    case 'tag':
      return (
        <TagRenderType
          key={item.value?.id || item.value?.text}
          tag={item.value}
        />
      );
    case 'time':
      return <DateTimeRenderType value={item.value} display="time" />;
    case 'user':
      return <UserRenderType {...item.value} />;

    case 'richtext':
      return <RichTextRenderType value={item.value} />;
    default:
      return <></>;
  }
};
