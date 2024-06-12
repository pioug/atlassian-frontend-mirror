import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-css-modules', rule, {
	valid: [
		"import 'styles-css';",
		"import 'less';",
		"import 'sass-module';",
		"import 'something-scss-something';",
	],
	invalid: [
		{
			name: '.css import',
			code: "import 'styles.css';",
			errors: [{ messageId: 'no-css-modules' }],
		},
		{
			name: '.less import',
			code: "import 'styles.less';",
			errors: [{ messageId: 'no-css-modules' }],
		},
		{
			name: '.sass import',
			code: "import 'styles.sass';",
			errors: [{ messageId: 'no-css-modules' }],
		},
		{
			name: '.scss import',
			code: "import 'styles.scss';",
			errors: [{ messageId: 'no-css-modules' }],
		},
	],
});
