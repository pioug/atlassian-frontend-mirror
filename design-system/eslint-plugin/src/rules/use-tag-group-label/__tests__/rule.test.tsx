import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('ensure-design-token-usage', rule, {
	valid: [
		`
    import TagGroup from '@atlaskit/tag-group';
    <>
      <TagGroup label="TagGroup accessible name">
        Children
      </TagGroup>
    </>

  `,
		`
    import TagGroup from '@atlaskit/tag-group';
    <>
      <h2 id="tag-group-title">TagGroup title content</h2>
      <TagGroup titleId="tag-group-title">
        Children
      </TagGroup>
    </>
  `,
		`
    import AkTagGroup from '@atlaskit/tag-group';
    <>
      <AkTagGroup label="TagGroup accessible name">
        Children
      </AkTagGroup>
    </>
  `,
		`
    import AwesomeTagGroup from '@atlaskit/tag-group';
    <>
      <h2 id="tag-group-title">TagGroup title content</h2>
      <AwesomeTagGroup titleId="tag-group-title">
        Children
      </AwesomeTagGroup>
    </>
  `,
		`
		// Should not run if not the @atlaskit/tag-group package

    import TagGroup from '@foo/bar';
    <>
      <AkTagGroup>
        Children
      </AkTagGroup>
    </>
  `,
	],
	invalid: [
		{
			code: `
        import TagGroup from '@atlaskit/tag-group';
        <TagGroup>
          children
        </TagGroup>
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import TagGroup from '@atlaskit/tag-group';
        <TagGroup label="">
          Children
        </TagGroup>
      `,
			errors: [
				{
					messageId: 'labelPropShouldHaveContents',
				},
			],
		},
		{
			code: `
        import TagGroup from '@atlaskit/tag-group';
        <TagGroup titleId="">
          Children
        </TagGroup>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
        import TagGroup from '@atlaskit/tag-group';
        <TagGroup titleId="" label="">
          Children
        </TagGroup>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
		{
			code: `
        import AkTagGroup from '@atlaskit/tag-group';
        <AkTagGroup>
          Children
        </AkTagGroup>
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import AkTagGroup from '@atlaskit/tag-group';
        <AkTagGroup label="">
          Children
        </AkTagGroup>
      `,
			errors: [
				{
					messageId: 'labelPropShouldHaveContents',
				},
			],
		},
		{
			code: `
        import AkTagGroup from '@atlaskit/tag-group';
        <AkTagGroup titleId="">
          Children
        </AkTagGroup>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
        import AkTagGroup from '@atlaskit/tag-group';
        <>
          <h2 id="tag-group-title">TagGroup title content</h2>
          <AkTagGroup titleId="tag-group-title" label="TagGroup title content">
            Children
          </AkTagGroup>
        </>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
	],
});
