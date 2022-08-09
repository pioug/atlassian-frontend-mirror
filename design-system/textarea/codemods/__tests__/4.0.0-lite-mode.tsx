jest.autoMockOff();

import transformer from '../4.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Rename ref props', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React, { useRef } from "react";
      import TextArea from "@atlaskit/textarea";
      const ref = useRef(null);
      export default () => <TextArea defaultValue="test" forwardedRef={ref}/>;
    `,
    `
      import React, { useRef } from "react";
      import TextArea from "@atlaskit/textarea";
      const ref = useRef(null);
      export default () => <TextArea defaultValue="test" ref={ref}/>;
    `,
    'should apply 1 migrates',
  );
});
