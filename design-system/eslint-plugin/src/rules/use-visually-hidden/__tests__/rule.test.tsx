import { tester } from '../../__tests__/utils/_tester';
import { IMPORT_NAME } from '../constants';
import rule from '../index';

tester.run('use-visually-hidden', rule, {
	valid: [
		{
			code: `import VisuallyHidden from '@atlaskit/visually-hidden';`,
		},
		{
			code: `
const SomeComponentObject = styled.span({
  width: '1px',
  height: '1px',
  padding: '0',
});`,
		},
	],
	invalid: [
		{
			code: `
const SomeComponentObject = styled.span({
  width: '1px',
  height: '1px',
  padding: '0',
  position: 'absolute',
  border: '0',
  clip: 'rect(1px, 1px, 1px, 1px)',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});
`,
			errors: [{ messageId: 'suggestion' }],
		},
		{
			code: `
const SomeComponentLiteral = styled.span\`
  width: 1px;
  height: 1px;
  padding: 0;
  position: absolute;
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  white-space: nowrap;
\`;
`,
			errors: [{ messageId: 'suggestion' }],
		},
		{
			code: `
import styled from '@emotion/styled';

const SomeComponentLiteral = styled.span\`
  width: 1px;
  height: 1px;
  padding: 0;
  position: absolute;
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  white-space: nowrap;
\`;
`,
			errors: [{ messageId: 'suggestion' }],
			output: `
import ${IMPORT_NAME} from '@atlaskit/visually-hidden';
import styled from '@emotion/styled';

const SomeComponentLiteral = ${IMPORT_NAME};
`,
		},
		{
			code: `
import styled from '@emotion/styled';

const SomeComponentObject = styled.span({
  width: '1px',
  height: '1px',
  padding: '0',
  position: 'absolute',
  border: '0',
  clip: 'rect(1px, 1px, 1px, 1px)',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});
`,
			errors: [{ messageId: 'suggestion' }],
			output: `
import ${IMPORT_NAME} from '@atlaskit/visually-hidden';
import styled from '@emotion/styled';

const SomeComponentObject = ${IMPORT_NAME};
`,
		},
		{
			code: `
import randomImportName from '@atlaskit/visually-hidden';
import styled from '@emotion/styled';

const SomeComponentLiteral = styled.span\`
  width: 1px;
  height: 1px;
  padding: 0;
  position: absolute;
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  white-space: nowrap;
\`;
`,
			errors: [{ messageId: 'suggestion' }],
			output: `
import randomImportName from '@atlaskit/visually-hidden';
import styled from '@emotion/styled';

const SomeComponentLiteral = randomImportName;
`,
		},
		{
			code: `
const visuallyHidden = css\`
  width: 1px;
  height: 1px;
  padding: 0;
  position: absolute;
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  white-space: nowrap;
\`;
`,
			errors: [{ messageId: 'suggestion' }],
		},
		{
			code: `
import { css, jsx } from '@emotion/core';

const visuallyHiddenStyles = css({
  width: '1px',
  height: '1px',
  padding: '0',
  position: 'absolute',
  border: '0',
  clip: 'rect(1px, 1px, 1px, 1px)',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

const MyComponent = () => (
  <div css={visuallyHiddenStyles} />
);
`,
			errors: [{ messageId: 'suggestion' }],
		},
		{
			code: `
import { assistive } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';

const MyComponent = () => (
  <span css={assistive} />
);
`,
			errors: [{ messageId: 'noDeprecated' }, { messageId: 'noDeprecatedUsage' }],
			output: `
import ${IMPORT_NAME} from '@atlaskit/visually-hidden';
import { assistive } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';

const MyComponent = () => (
  <${IMPORT_NAME} />
);
`,
		},
		{
			code: `
import { something } from '@atlaskit/theme/constants';
import { css, jsx } from '@emotion/core';

const visuallyHidden = css\`
  width: 1px;
  height: 1px;
  padding: 0;
  position: absolute;
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  white-space: nowrap;
\`;

const MyComponent = () => (
  <div css={assistive} />
);
`,
			errors: [{ messageId: 'suggestion' }],
		},

		{
			code: `
import { visuallyHidden } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';

const MyComponent = () => (
  <div css={visuallyHidden} />
);`,
			output: `
import ${IMPORT_NAME} from '@atlaskit/visually-hidden';
import { visuallyHidden } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';

const MyComponent = () => (
  <${IMPORT_NAME} />
);`,
			errors: [{ messageId: 'noDeprecated' }, { messageId: 'noDeprecatedUsage' }],
		},
		{
			code: `
import styled from '@emotion/styled';
import { visuallyHidden } from '@atlaskit/theme';

export const ScreenReadersOnly = styled.span\`
  \${visuallyHidden()}
\`;`,
			errors: [{ messageId: 'noDeprecated' }, { messageId: 'noDeprecatedUsage' }],
			output: `
import ${IMPORT_NAME} from '@atlaskit/visually-hidden';
import styled from '@emotion/styled';
import { visuallyHidden } from '@atlaskit/theme';

export const ScreenReadersOnly = ${IMPORT_NAME};`,
		},
		{
			code: `
import styled from '@emotion/styled';
import { visuallyHidden } from '@atlaskit/theme';

export const ScreenReadersOnly = styled.span(visuallyHidden);`,
			errors: [{ messageId: 'noDeprecated' }, { messageId: 'noDeprecatedUsage' }],
			output: `
import ${IMPORT_NAME} from '@atlaskit/visually-hidden';
import styled from '@emotion/styled';
import { visuallyHidden } from '@atlaskit/theme';

export const ScreenReadersOnly = ${IMPORT_NAME};`,
		},
		{
			code: `
import { jsx } from '@emotion/core';

export const ScreenReadersOnly = () => (
  <div
    css={{
      width: '1px',
      height: '1px',
      padding: '0',
      position: 'absolute',
      border: '0',
      clip: 'rect(1px, 1px, 1px, 1px)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }}
  />
);`,
			errors: [{ messageId: 'suggestion' }],
		},
		{
			code: `
import styled from '@emotion/styled';
import { visuallyHidden } from '@atlaskit/theme';

export const ScreenReadersOnly = () => (
  <div css={visuallyHidden} />
);`,
			output: `
import ${IMPORT_NAME} from '@atlaskit/visually-hidden';
import styled from '@emotion/styled';
import { visuallyHidden } from '@atlaskit/theme';\n
export const ScreenReadersOnly = () => (
  <${IMPORT_NAME} />
);`,
			errors: [{ messageId: 'noDeprecated' }, { messageId: 'noDeprecatedUsage' }],
		},
	],
});
