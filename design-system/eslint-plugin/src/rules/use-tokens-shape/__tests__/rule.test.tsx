// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import { tests as css } from './_css';
import { tests as cssMap } from './_css-map';
import { tests as keyframes } from './_keyframes';
import { tests as styled } from './_styled';

ruleTester.run('use-tokens-shape', rule, {
	valid: [...css.valid, ...cssMap.valid, ...keyframes.valid, ...styled.valid],
	invalid: [...css.invalid, ...cssMap.invalid, ...keyframes.invalid, ...styled.invalid],
});
