import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('ensure-design-token-usage', rule, {
	valid: [
		`
      import '@atlaskit/icon/glyph/activity';

      <>
        <Icon />
        <Icon label="" />
        <Icon label="Hello" />
      </>
    `,
		`
      import ActivityIcon from '@atlaskit/icon/glyph/activity';

      <Button iconBefore={<ActivityIcon label="" />}>
        Children
      </Button>
    `,
		`
      import ActivityIcon from '@atlaskit/icon/glyph/activity';

      <Button iconBefore={<ActivityIcon label="" />} aria-label="Aria label">
      </Button>
    `,
		`
      import ActivityIcon from '@atlaskit/icon/glyph/activity';

      <Button iconBefore={<ActivityIcon label="" />} aria-label="Aria label" />
    `,
		`
      import ActivityIcon from '@atlaskit/icon/glyph/activity';

      <MenuItem iconBefore={<ActivityIcon label="" />}>
        Children
      </MenuItem>
    `,
		`
    import ActivityIcon from '@atlaskit/icon/glyph/activity';

    <IconButton icon={(iconProps) => <ActivityIcon {...iconProps} size="small" />} />
  `,
		`
    import ActivityIcon from '@atlaskit/icon/glyph/activity';

    const MyCustomIcon = (iconProps) => <ActivityIcon {...iconProps} size="small" />
  `,
	],
	invalid: [
		{
			code: `
        import ActivityIcon from '@atlaskit/icon/glyph/activity';

        <ActivityIcon />
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import ActivityIcon from '@atlaskit/icon/glyph/activity';

        const MyCustomIcon = () => <ActivityIcon size="small" />
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import ActivityIcon from '@atlaskit/icon/glyph/activity';

        <IconButton icon={() => <ActivityIcon size="small" />} />
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import ActivityIcon from '@atlaskit/icon/glyph/activity';

        <MenuItem iconBefore={<ActivityIcon label="More label" />}>
          Children
        </MenuItem>
      `,
			output: `
        import ActivityIcon from '@atlaskit/icon/glyph/activity';

        <MenuItem iconBefore={<ActivityIcon label="" />}>
          Children
        </MenuItem>
      `,
			errors: [
				{
					messageId: 'unneededLabelPropContents',
				},
			],
		},
		{
			code: `
        import ActivityIcon from '@atlaskit/icon/glyph/activity';

        <Button iconBefore={<ActivityIcon label="More label" />}>
          Children
        </Button>
      `,
			output: `
        import ActivityIcon from '@atlaskit/icon/glyph/activity';

        <Button iconBefore={<ActivityIcon label="" />}>
          Children
        </Button>
      `,
			errors: [
				{
					messageId: 'unneededLabelPropContents',
				},
			],
		},
		{
			code: `
        import ActivityIcon from '@atlaskit/icon/glyph/activity';

        <Button iconBefore={<ActivityIcon />} />
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import ActivityIcon from '@atlaskit/icon/glyph/activity';

        <Button iconBefore={<ActivityIcon label="" />} />
      `,
			errors: [
				{
					messageId: 'labelPropShouldHaveContents',
				},
			],
		},
	],
});
