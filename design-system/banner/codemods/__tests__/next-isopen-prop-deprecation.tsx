jest.autoMockOff();

import transformer from '../12.0.0-isopen-prop-deprecation';

import { check } from './_framework';

check({
	transformer,
	it: 'should remove boolean isOpen prop only from Banner',
	original: `
    import Banner from '@atlaskit/banner';

    function App() {
      return <>
        <Banner isOpen>gone</Banner>
        <SomethingElse isOpen>still here</SomethingElse>
      </>;
    }
  `,
	expected: `
    import Banner from '@atlaskit/banner';

    function App() {
      return <>
        <Banner>gone</Banner>
        <SomethingElse isOpen>still here</SomethingElse>
      </>;
    }
  `,
});

check({
	transformer,
	it: 'should extract variable from isOpen prop and create inline expression',
	original: `
    import Banner from '@atlaskit/banner';

    function App() {
      const toggle = true;
      return <>
        <Banner icon={'a'} isOpen={toggle}>something</Banner>
      </>;
    }
  `,
	expected: `
    import Banner from '@atlaskit/banner';

    function App() {
      const toggle = true;
      return <>
        {toggle && <Banner icon={'a'}>something</Banner>}
      </>;
    }
  `,
});

check({
	transformer,
	it: 'should do nothing if isOpen prop is not present',
	original: `
    import Banner from '@atlaskit/banner';

    function App() {
      return <>
        <Banner icon={'a'}>something</Banner>
      </>;
    }
  `,
	expected: `
    import Banner from '@atlaskit/banner';

    function App() {
      return <>
        <Banner icon={'a'}>something</Banner>
      </>;
    }
  `,
});
