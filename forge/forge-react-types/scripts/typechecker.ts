/* eslint-disable */
import {
	type BadgeProps,
	type CodeProps,
	type CodeBlockProps,
} from '@atlassian/forge-ui/src/components/UIKit';
import { type BadgeProps as GeneratedBadgeProps } from '../src/components/__generated__/BadgeProps.codegen';
import { type CodeProps as GeneratedCodeProps } from '../src/components/__generated__/CodeProps.codegen';
import { type CodeBlockProps as GeneratedCodeBlockProps } from '../src/components/__generated__/CodeBlockProps.codegen';

const assertAssignable = <A, B extends A>() => {};

assertAssignable<GeneratedBadgeProps, BadgeProps>();
assertAssignable<BadgeProps, GeneratedBadgeProps>();

assertAssignable<GeneratedCodeProps, CodeProps>();
assertAssignable<CodeProps, GeneratedCodeProps>();

assertAssignable<GeneratedCodeBlockProps, CodeBlockProps>();
assertAssignable<CodeBlockProps, GeneratedCodeBlockProps>();
