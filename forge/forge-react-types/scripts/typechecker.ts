/* eslint-disable */
import {
	type BadgeProps,
	type CalendarProps,
	type CheckboxProps,
	type CodeBlockProps,
	type CodeProps,
	type EmptyStateProps,
	type ErrorMessageProps,
	type HeadingProps,
	type LozengeProps,
	type RangeProps,
} from '@atlassian/forge-ui/src/components/UIKit';
import { type BadgeProps as GeneratedBadgeProps } from '../src/components/__generated__/BadgeProps.codegen';
import { type CalendarProps as GeneratedCalendarProps } from '../src/components/__generated__/CalendarProps.codegen';
import { type CheckboxProps as GeneratedCheckboxProps } from '../src/components/__generated__/CheckboxProps.codegen';
import { type CodeBlockProps as GeneratedCodeBlockProps } from '../src/components/__generated__/CodeBlockProps.codegen';
import { type CodeProps as GeneratedCodeProps } from '../src/components/__generated__/CodeProps.codegen';
import { type EmptyStateProps as GeneratedEmptyStateProps } from '../src/components/__generated__/EmptyStateProps.codegen';
import { type ErrorMessageProps as GeneratedErrorMessageProps } from '../src/components/__generated__/ErrorMessageProps.codegen';
import { type HeadingProps as GeneratedHeadingProps } from '../src/components/__generated__/HeadingProps.codegen';
import { type LozengeProps as GeneratedLozengeProps } from '../src/components/__generated__/LozengeProps.codegen';
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

assertAssignable<GeneratedCheckboxProps, CheckboxProps>();
assertAssignable<CheckboxProps, GeneratedCheckboxProps>();

assertAssignable<GeneratedEmptyStateProps, EmptyStateProps>();
assertAssignable<EmptyStateProps, GeneratedEmptyStateProps>();

assertAssignable<GeneratedErrorMessageProps, ErrorMessageProps>();
assertAssignable<ErrorMessageProps, GeneratedErrorMessageProps>();

assertAssignable<GeneratedLozengeProps, LozengeProps>();
assertAssignable<LozengeProps, GeneratedLozengeProps>();
