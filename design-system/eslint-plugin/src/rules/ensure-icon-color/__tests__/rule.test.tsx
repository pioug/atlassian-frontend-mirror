import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('ensure-design-token-usage', rule, {
	valid: [
		`
      import Icon from '@atlaskit/icon/core/add';
			import UtilityIcon from '@atlaskit/icon/utility/add';
			import { token } from '@atlaskit/tokens';

      <>
        <Icon color="currentColor" />
        <Icon color={token('color.text')} />
				<UtilityIcon color="currentColor" />
        <UtilityIcon color={token('color.text')} />
      </>
    `,
		`
      import ActivityIcon from '@atlaskit/icon/glyph/activity';

      <ActivityIcon label="" />
    `,
		`
      import Icon from '@atlaskit/icon/core/add';
			import UtilityIcon from '@atlaskit/icon/core/add';
			import Button from '@atlaskit/button/new';

			<>
				<Button iconBefore={Icon} />
				<Button iconBefore={UtilityIcon} />
			</>
    `,
	],
	invalid: [
		{
			code: `
			import Icon from '@atlaskit/icon/core/add';
			import UtilityIcon from '@atlaskit/icon/utility/add';
			import LabIcon from '@atlaskit/icon-lab/core/test';
			import PrivateIcon from '@atlassian/icon-private/core/test';
			import { token } from '@atlaskit/tokens';

      <>
        <Icon  />
        <Icon {...iconProps} />
				<UtilityIcon />
				<LabIcon />
				<PrivateIcon />
      </>
      `,
			errors: [
				{
					messageId: 'missingColorProp',
				},
				{
					messageId: 'missingColorProp',
				},
				{
					messageId: 'missingColorProp',
				},
				{
					messageId: 'missingColorProp',
				},
				{
					messageId: 'missingColorProp',
				},
			],
		},
		{
			code: `
			import Icon from '@atlaskit/icon/core/add';
			import UtilityIcon from '@atlaskit/icon/utility/add';
			import Button from '@atlaskit/button/new';

			<>
				<Button iconBefore={(iconProps) => <Icon {...iconProps} /> } />
				<Button iconBefore={(iconProps) => <Icon {...iconProps} /> } />
			</>
      `,
			errors: [
				{
					messageId: 'missingColorProp',
				},
				{
					messageId: 'missingColorProp',
				},
			],
		},
	],
});
