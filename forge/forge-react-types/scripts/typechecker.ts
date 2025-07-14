/* eslint-disable */
import {
	type BadgeProps,
	type CalendarProps,
	type CodeBlockProps,
	type CodeProps,
	type HeadingProps,
	type RangeProps,
} from '@atlassian/forge-ui/src/components/UIKit';
import { type BadgeProps as GeneratedBadgeProps } from '../src/components/__generated__/BadgeProps.codegen';
import { type CalendarProps as GeneratedCalendarProps } from '../src/components/__generated__/CalendarProps.codegen';
import { type CodeBlockProps as GeneratedCodeBlockProps } from '../src/components/__generated__/CodeBlockProps.codegen';
import { type CodeProps as GeneratedCodeProps } from '../src/components/__generated__/CodeProps.codegen';
import { type HeadingProps as GeneratedHeadingProps } from '../src/components/__generated__/HeadingProps.codegen';
import { type RangeProps as GeneratedRangeProps } from '../src/components/__generated__/RangeProps.codegen';

const assertAssignable = <A, B extends A>() => {};

assertAssignable<GeneratedBadgeProps, BadgeProps>();
assertAssignable<BadgeProps, GeneratedBadgeProps>();

assertAssignable<GeneratedCodeProps, CodeProps>();
assertAssignable<CodeProps, GeneratedCodeProps>();

assertAssignable<GeneratedCodeBlockProps, CodeBlockProps>();
assertAssignable<CodeBlockProps, GeneratedCodeBlockProps>();

assertAssignable<GeneratedHeadingProps, HeadingProps>();
assertAssignable<HeadingProps, GeneratedHeadingProps>();

assertAssignable<GeneratedRangeProps, RangeProps>();
assertAssignable<RangeProps, GeneratedRangeProps>();

assertAssignable<GeneratedCalendarProps, CalendarProps>();
assertAssignable<CalendarProps, GeneratedCalendarProps>();
