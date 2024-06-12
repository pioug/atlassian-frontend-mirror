jest.autoMockOff();

import transformer from '../1.6.0-level-to-size';

import { check } from './_framework';

check({
	transformer,
	it: 'should replace level with size only on Heading component',
	original: `
    import Heading from '@atlaskit/heading';

    function App() {
      return <>
        <Heading level="h700" as="h3">hello</Heading>
        <SomethingElse level="h700">still here</SomethingElse>
      </>;
    }
  `,
	expected: `
    import Heading from '@atlaskit/heading';

    function App() {
      return <>
        <Heading size="large" as="h3">hello</Heading>
        <SomethingElse level="h700">still here</SomethingElse>
      </>;
    }
  `,
});

check({
	transformer,
	it: 'should do nothing if level is h200 or h100',
	original: `
    import Heading from '@atlaskit/heading';

    function App() {
      return <>
        <Heading level="h300">hello</Heading>
        <Heading level="h200">hello</Heading>
        <Heading level="h100">hello</Heading>
      </>;
    }
  `,
	expected: `
    import Heading from '@atlaskit/heading';

    function App() {
      return <>
        <Heading size="xxsmall">hello</Heading>
        <Heading level="h200">hello</Heading>
        <Heading level="h100">hello</Heading>
      </>;
    }
  `,
});

check({
	transformer,
	it: 'should do nothing if size already exists',
	original: `
    import Heading from '@atlaskit/heading';

    function App() {
      return <>
        <Heading size="large">hello</Heading>
      </>;
    }
  `,
	expected: `
    import Heading from '@atlaskit/heading';

    function App() {
      return <>
        <Heading size="large">hello</Heading>
      </>;
    }
  `,
});
