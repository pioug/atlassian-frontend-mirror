import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('use-compiled', rule, {
	valid: [
		`import { styled } from '@compiled/react';`,
		`import { css } from '@compiled/react';`,
		`import { ClassNames } from '@compiled/react';`,
		`import { css, ClassNames, styled } from '@compiled/react';`,
		`import '@compiled/react'`,
		`/**
 * @jsxRuntime classic
 * @jsx jsx
 */`,
		`/** @jsxImportSource @compiled/react */`,
	],
	invalid: [],
});
