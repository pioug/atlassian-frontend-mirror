import React from 'react';
import { md, Example, code } from '@atlaskit/docs';

export default md`
  Being able to programmatically test the behaviour of your components is important.
  ak/select enables this through two props \`className\` and \`classNamePrefix\`

  Typically when these two props are not defined, the dom-elements in ak/select use emotions generated classnames.
  However with className and classNamePrefix, ak/select generates semantic classnames for you to reliably search for specific dom elements in the tree.

  The value specified in the className prop is reflected down to the selects container.
  While the value of the classNamePrefix prop is reflected down to every single dom element in the tree as a prefix.

  You can see this by inspecting the following example.

  ${(
    <Example
      packageName="@atlaskit/select"
      Component={require('../examples/00-single-select').default}
      source={require('!!raw-loader!../examples/00-single-select')}
      title="Single"
    />
  )}

  Note here that the className of the container element has both the generated css as well as \`single-select\` the value of the className prop.
  Every other element in the tree also includes the generated emotion classname as well as a semantic classname preceded by \`react-select\` the value passed into the classNamePrefix.

  As such in our tests, we can now reliably assert the state of specific dom elements, like so:

  ${code`
  import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
  import Page from '@atlaskit/webdriver-runner/wd-wrapper';
  const selectInputElement = '.react-select__input';

  BrowserTestCase('ak/select input should be identifiable by classname',
    {},
    async (client: any) => {
      const page = new Page(client);
      expect(await page.isVisible(selectInputElement)).toBe(true);
    }
  )

`}

 Once you provide a classNamePrefix, these are the selectors that will be exposed to you:
 * [classNamePrefix]__control
 * [classNamePrefix]__input
 * [classNamePrefix]__placeholder
 * [classNamePrefix]__value-container
 * [classNamePrefix]__indicators
 * [classNamePrefix]__dropdown-indicator
 * [classNamePrefix]__clear-indicator
 * [classNamePrefix]__menu
 * [classNamePrefix]__menu-list
 * [classNamePrefix]__option

 Providing a value for the className prop will reflect that value to the class name of the select container.

`;
