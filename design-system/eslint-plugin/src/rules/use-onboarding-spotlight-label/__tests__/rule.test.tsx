import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('ensure-design-token-usage', rule, {
	valid: [
		`
		import {Spotlight} from '@atlaskit/onboarding';
		<>
			<Spotlight label="Spotlight accessible name">
				Children
			</Spotlight>
		</>
  	`,
		`
		import Spotlight from '@atlaskit/onboarding/spotlight';
		<>
			<Spotlight label="Spotlight accessible name">
				Children
			</Spotlight>
		</>
  	`,
		`
		import {Spotlight} from '@atlaskit/onboarding';
		<>
			<Spotlight heading="Spotlight dialog title">
				Children
			</Spotlight>
		</>
  	`,
		`
		import {Spotlight} from '@atlaskit/onboarding';
		<>
			<Spotlight titleId="heading-title-id">
				<p id="heading-title-id">Spotlight dialog title</p>
			</Spotlight>
		</>
	`,
		`
		import Spotlight from '@atlaskit/onboarding/spotlight';
		<>
			<Spotlight heading="Spotlight dialog title">
				Children
			</Spotlight>
		</>
	`,
		`
		import Spotlight from '@atlaskit/onboarding/spotlight';
		<>
			<Spotlight titleId="spotlight-dialog-title">
				<p id="spotlight-dialog-title">Spotlight dialog title</p>
			</Spotlight>
		</>
	`,
		`
		import {Spotlight as AkSpotlight} from '@atlaskit/onboarding';
		<>
			<AkSpotlight label="Spotlight accessible name">
				Children
			</AkSpotlight>
		</>
  	`,
		`
		import AkSpotlight from '@atlaskit/onboarding/spotlight';
		<>
			<AkSpotlight label="Spotlight accessible name">
				Children
			</AkSpotlight>
		</>
  	`,
		`
		import {Spotlight as AwesomeSpotlight} from '@atlaskit/onboarding';
		<>
			<AwesomeSpotlight heading="Spotlight dialog title">
				Children
			</AwesomeSpotlight>
		</>
  	`,
		`
		import {Spotlight as AwesomeSpotlight} from '@atlaskit/onboarding';
		<>
			<AwesomeSpotlight titleId="spotlight-dialog-title">
				<p id="spotlight-dialog-title">Spotlight dialog title</p>
			</AwesomeSpotlight>
		</>
	`,
		`
		import AwesomeSpotlight from '@atlaskit/onboarding/spotlight';
		<>
			<AwesomeSpotlight heading="Spotlight dialog title">
				Children
			</AwesomeSpotlight>
		</>
  	`,
		`
		import AwesomeSpotlight from '@atlaskit/onboarding/spotlight';
		<>
			<AwesomeSpotlight titleId="spotlight-dialog-title">
				<p id="spotlight-dialog-title">Spotlight dialog title</p>
			</AwesomeSpotlight>
		</>
	`,
	],
	invalid: [
		{
			code: `
				import {Spotlight} from '@atlaskit/onboarding';
				<>
					<Spotlight>
						Children
					</Spotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'missingAccessibleName',
				},
			],
		},
		{
			code: `
        		import Spotlight from '@atlaskit/onboarding/spotlight';
				<>
					<Spotlight>
						Children
					</Spotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'missingAccessibleName',
				},
			],
		},
		{
			code: `
				import {Spotlight as AkSpotlight} from '@atlaskit/onboarding';
				<AkSpotlight>
					Children
				</AkSpotlight>
      	`,
			errors: [
				{
					messageId: 'missingAccessibleName',
				},
			],
		},
		{
			code: `
				import AkSpotlight from '@atlaskit/onboarding/spotlight';
				<AkSpotlight>
					Children
				</AkSpotlight>
      	`,
			errors: [
				{
					messageId: 'missingAccessibleName',
				},
			],
		},
		{
			code: `
				import {Spotlight} from '@atlaskit/onboarding';
				<>
					<Spotlight label="">
						Children
					</Spotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'labelPropShouldHaveContent',
				},
			],
		},
		{
			code: `
        		import Spotlight from '@atlaskit/onboarding/spotlight';
				<>
					<Spotlight label="">
						Children
					</Spotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'labelPropShouldHaveContent',
				},
			],
		},
		{
			code: `
				import {Spotlight as AkSpotlight} from '@atlaskit/onboarding';
				<AkSpotlight label="">
					Children
				</AkSpotlight>
      	`,
			errors: [
				{
					messageId: 'labelPropShouldHaveContent',
				},
			],
		},
		{
			code: `
				import AkSpotlight from '@atlaskit/onboarding/spotlight';
				<AkSpotlight label="">
					Children
				</AkSpotlight>
      	`,
			errors: [
				{
					messageId: 'labelPropShouldHaveContent',
				},
			],
		},
		{
			code: `
				import {Spotlight} from '@atlaskit/onboarding';
				<Spotlight titleId="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
				import {Spotlight} from '@atlaskit/onboarding';
				<Spotlight heading="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'headingPropShouldHaveContent',
				},
			],
		},
		{
			code: `
				import Spotlight from '@atlaskit/onboarding/spotlight';
				<Spotlight titleId="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
				import {Spotlight as AkSpotlight} from '@atlaskit/onboarding';
				<AkSpotlight titleId="">
					Children
				</AkSpotlight>
      	`,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
				import AkSpotlight from '@atlaskit/onboarding/spotlight';
				<AkSpotlight titleId="">
					Children
				</AkSpotlight>
      	`,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
				import Spotlight from '@atlaskit/onboarding/spotlight';
				<Spotlight heading="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'headingPropShouldHaveContent',
				},
			],
		},
		{
			code: `
				import {Spotlight as AkSpotlight} from '@atlaskit/onboarding';
				<AkSpotlight heading="">
					Children
				</AkSpotlight>
      	`,
			errors: [
				{
					messageId: 'headingPropShouldHaveContent',
				},
			],
		},
		{
			code: `
				import AkSpotlight from '@atlaskit/onboarding/spotlight';
				<AkSpotlight heading="">
					Children
				</AkSpotlight>
      	`,
			errors: [
				{
					messageId: 'headingPropShouldHaveContent',
				},
			],
		},
		{
			code: `
				import {Spotlight} from '@atlaskit/onboarding';
				<Spotlight titleId="" label="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import {Spotlight} from '@atlaskit/onboarding';
				<Spotlight titleId="" heading="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import {Spotlight} from '@atlaskit/onboarding';
				<Spotlight heading="" label="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import {Spotlight} from '@atlaskit/onboarding';
				<Spotlight heading="" titleId="" label="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import Spotlight from '@atlaskit/onboarding/spotlight';
				<Spotlight titleId="" label="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import Spotlight from '@atlaskit/onboarding/spotlight';
				<Spotlight titleId="" heading="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import Spotlight from '@atlaskit/onboarding/spotlight';
				<Spotlight heading="" label="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import Spotlight from '@atlaskit/onboarding/spotlight';
				<Spotlight titleId="" label="" heading="">
					Children
				</Spotlight>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import {Spotlight as AkSpotlight} from '@atlaskit/onboarding';
				<>
					<AkSpotlight
						titleId="spotlight-dialog-title"
						label="Spotlight accessible name"
						heading="Spotlight dialog title"
					>
						Children
					</AkSpotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import {Spotlight as AkSpotlight} from '@atlaskit/onboarding';
				<>
					<AkSpotlight
						titleId="spotlight-dialog-title"
						label="Spotlight accessible name"
					>
						Children
					</AkSpotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import {Spotlight as AkSpotlight} from '@atlaskit/onboarding';
				<>
					<AkSpotlight
						titleId="spotlight-dialog-title"
						heading="Spotlight dialog title"
					>
						Children
					</AkSpotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import {Spotlight as AkSpotlight} from '@atlaskit/onboarding';
				<>
					<AkSpotlight
						label="Spotlight accessible name"
						heading="Spotlight dialog title"
					>
						Children
					</AkSpotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import AkSpotlight from '@atlaskit/onboarding/spotlight';
				<>
					<AkSpotlight
						titleId="spotlight-dialog-title"
						label="Spotlight accessible name"
						heading="Spotlight dialog title"
					>
						Children
					</AkSpotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import AkSpotlight from '@atlaskit/onboarding/spotlight';
				<>
					<AkSpotlight
						titleId="spotlight-dialog-title"
						label="Spotlight accessible name"
					>
						Children
					</AkSpotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import AkSpotlight from '@atlaskit/onboarding/spotlight';
				<>
					<AkSpotlight
						titleId="spotlight-dialog-title"
						heading="Spotlight dialog title"
					>
						Children
					</AkSpotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
		{
			code: `
				import AkSpotlight from '@atlaskit/onboarding/spotlight';
				<>
					<AkSpotlight
						label="Spotlight accessible name"
						heading="Spotlight dialog title"
					>
						Children
					</AkSpotlight>
				</>
      	`,
			errors: [
				{
					messageId: 'noCombinedPropsUsage',
				},
			],
		},
	],
});
