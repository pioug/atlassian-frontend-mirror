import React from 'react';

import { type TableViewPropsRenderType } from '../types';

import BooleanRenderType from './boolean';
import DateRangeRenderType from './date-range';
import DateTimeRenderType from './date-time';
import IconRenderType from './icon';
import LinkRenderType from './link';
import NumberRenderType from './number';
import RichTextRenderType from './richtext';
import StatusRenderType from './status';
import TagRenderType from './tag';
import StringRenderType from './text';
import UserRenderType from './user';

export const renderType: TableViewPropsRenderType = (item) => {
	switch (item.type) {
		case 'boolean':
			return item.values.map((booleanValue) => <BooleanRenderType value={booleanValue} />);
		case 'date':
			return item.values.map((dateValue) => (
				<DateTimeRenderType value={dateValue} display="date" />
			));
		case 'datetime':
			return item.values.map((datTimeValue) => (
				<DateTimeRenderType value={datTimeValue} display="datetime" />
			));
		case 'daterange': {
			return item.values.map((dateRangeValue) => <DateRangeRenderType value={dateRangeValue} />);
		}
		case 'icon':
			return item.values.map((iconValue) => <IconRenderType {...iconValue} />);
		case 'link':
			return item.values.map((linkValue) => <LinkRenderType key={linkValue?.url} {...linkValue} />);
		case 'number':
			return item.values.map((numberValue) => <NumberRenderType number={numberValue} />);
		case 'status':
			return item.values.map((statusValue) => <StatusRenderType {...statusValue} />);
		case 'string':
			return item.values.map((stringValue) => (
				<StringRenderType key={stringValue} text={stringValue} />
			));
		case 'tag':
			return item.values.map((tagValue) => (
				<TagRenderType key={tagValue?.id || tagValue?.text} tag={tagValue} />
			));
		case 'time':
			return item.values.map((timeValue) => (
				<DateTimeRenderType value={timeValue} display="time" />
			));
		case 'user':
			return <UserRenderType users={item.values} />;
		case 'richtext':
			return item.values.map((richValue) => <RichTextRenderType value={richValue} />);
		default:
			return <></>;
	}
};
