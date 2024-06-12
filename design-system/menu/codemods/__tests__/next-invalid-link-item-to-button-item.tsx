jest.autoMockOff();

import * as transformer from '../2.1.0-invalid-link-item-to-button-item';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Converts link items with invalid or missing `href` to button items', () => {
	/**
	 *
	 * Success cases
	 *
	 */
	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem } from '@atlaskit/something';

      const App = () => {
        return <LinkItem />;
      }
    `,
		`
      import { LinkItem } from '@atlaskit/something';

      const App = () => {
        return <LinkItem />;
      }
  `,
		'leaves unrelated code untouched',
	);

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem } from '@atlaskit/menu';
      import { variable } from 'somewhere';

      const App = () => {
        return <LinkItem href={variable}>test</LinkItem>;
      }
    `,
		`
      import { LinkItem } from '@atlaskit/menu';
      import { variable } from 'somewhere';

      const App = () => {
        return <LinkItem href={variable}>test</LinkItem>;
      }
  `,
		'should not do anything with `href`s that are variables',
	);

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem } from '@atlaskit/menu';

      const App = () => {
        return <LinkItem href="http://valid.com">test</LinkItem>;
      }
    `,
		`
      import { LinkItem } from '@atlaskit/menu';

      const App = () => {
        return <LinkItem href="http://valid.com">test</LinkItem>;
      }
  `,
		'should not do anything with a valid `href`',
	);

	/**
	 *
	 * Missing `href`
	 *
	 */

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem } from '@atlaskit/menu';

      const App = () => {
        return <LinkItem>test</LinkItem>;
      }
    `,
		`
      import { LinkItem, ButtonItem } from '@atlaskit/menu';

      const App = () => {
        return <ButtonItem>test</ButtonItem>;
      }
  `,
		'Should convert to ButtonItem if no href exists on LinkItem',
	);

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem } from '@atlaskit/menu';

      const App = () => {
        return <LinkItem id="test">test</LinkItem>;
      }
    `,
		`
      import { LinkItem, ButtonItem } from '@atlaskit/menu';

      const App = () => {
        return <ButtonItem id="test">test</ButtonItem>;
      }
  `,
		'Should convert to ButtonItem but keep existing props if no href exists on LinkItem',
	);

	/**
	 *
	 * Invalid `href`
	 *
	 */

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem } from '@atlaskit/menu';

      const App = () => {
        return <LinkItem href="#">test</LinkItem>;
      }
    `,
		`
      import { LinkItem, ButtonItem } from '@atlaskit/menu';

      const App = () => {
        return <ButtonItem>test</ButtonItem>;
      }
  `,
		'Should convert to ButtonItem if invalid `href`',
	);

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem } from '@atlaskit/menu';

      const App = () => {
        return <LinkItem href="#" id="test">test</LinkItem>;
      }
    `,
		`
      import { LinkItem, ButtonItem } from '@atlaskit/menu';

      const App = () => {
        return <ButtonItem id="test">test</ButtonItem>;
      }
  `,
		'Should convert to ButtonItem but keep existing props if invalid `href`',
	);

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem } from '@atlaskit/menu';

      const App = () => {
        return <LinkItem href="">test</LinkItem>;
      }
    `,
		`
      import { LinkItem, ButtonItem } from '@atlaskit/menu';

      const App = () => {
        return <ButtonItem>test</ButtonItem>;
      }
  `,
		'Should convert to ButtonItem if invalid `href`',
	);

	/**
	 *
	 * Expressions
	 *
	 */

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem } from '@atlaskit/menu';

      const App = () => {
        return <LinkItem href={''}>test</LinkItem>;
      }
    `,
		`
      import { LinkItem, ButtonItem } from '@atlaskit/menu';

      const App = () => {
        return <ButtonItem>test</ButtonItem>;
      }
  `,
		'should handle strings in expression containers',
	);

	/**
	 *
	 * Edge cases
	 *
	 */

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem, ButtonItem } from '@atlaskit/menu';

      const App = () => {
        return (
          <div>
            <LinkItem href="">test 1</LinkItem>
            <ButtonItem>test 2</ButtonItem>
          </div>
        );
      }
    `,
		`
      import { LinkItem, ButtonItem } from '@atlaskit/menu';

      const App = () => {
        return (
          <div>
            <ButtonItem>test 1</ButtonItem>
            <ButtonItem>test 2</ButtonItem>
          </div>
        );
      }
  `,
		'Should handle multiple item types',
	);

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem, CustomItem } from '@atlaskit/menu';

      const App = () => {
        return (
          <div>
            <LinkItem href="">test 1</LinkItem>
            <CustomItem>test 2</CustomItem>
          </div>
        );
      }
    `,
		`
      import { LinkItem, CustomItem, ButtonItem } from '@atlaskit/menu';

      const App = () => {
        return (
          <div>
            <ButtonItem>test 1</ButtonItem>
            <CustomItem>test 2</CustomItem>
          </div>
        );
      }
  `,
		'Should not delete any imports',
	);

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
      import { LinkItem } from '@atlaskit/menu';

      const App = () => {
        return (
          <div>
            <LinkItem href="">test 1</LinkItem>
            <LinkItem href="http://example.com">test 2</LinkItem>
          </div>
        );
      }
    `,
		`
      import { LinkItem, ButtonItem } from '@atlaskit/menu';

      const App = () => {
        return (
          <div>
            <ButtonItem>test 1</ButtonItem>
            <LinkItem href="http://example.com">test 2</LinkItem>
          </div>
        );
      }
  `,
		'Should allow valid `href` and convert invalid ones',
	);
});
