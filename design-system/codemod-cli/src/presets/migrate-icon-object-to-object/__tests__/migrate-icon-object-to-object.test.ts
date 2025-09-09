import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/migrate-icon-object-to-object';

const check = createCheck(transformer);

describe('Migrate icon-object to object', () => {
	describe('16px icons (migrate to object)', () => {
		check({
			it: 'should migrate 16px NewFeature icon to object',
			original: `
				import NewFeature16Icon from '@atlaskit/icon-object/glyph/new-feature/16';

				export default () => <NewFeature16Icon label="" />;
			`,
			expected: `
				import NewFeatureObject from '@atlaskit/object/new-feature';

				export default () => <NewFeatureObject label="" />;
			`,
		});

		check({
			it: 'should migrate 16px Bug icon to object',
			original: `
				import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';

				export default () => <Bug16Icon label="Bug icon" />;
			`,
			expected: `
				import BugObject from '@atlaskit/object/bug';

				export default () => <BugObject label="Bug icon" />;
			`,
		});

		check({
			it: 'should migrate 16px PageLiveDoc icon to object',
			original: `
				import PageLiveDoc16Icon from '@atlaskit/icon-object/glyph/page-live-doc/16';

				export default () => <PageLiveDoc16Icon />;
			`,
			expected: `
				import PageLiveDocObject from '@atlaskit/object/page-live-doc';

				export default () => <PageLiveDocObject />;
			`,
		});

		check({
			it: 'should handle renamed 16px imports',
			original: `
				import CustomName from '@atlaskit/icon-object/glyph/task/16';

				export default () => <CustomName label="Custom task" />;
			`,
			expected: `
				import TaskObject from '@atlaskit/object/task';

				export default () => <TaskObject label="Custom task" />;
			`,
		});
	});

	describe('24px icons (migrate to object tile)', () => {
		check({
			it: 'should migrate 24px NewFeature icon to object tile with small size',
			original: `
				import NewFeature24Icon from '@atlaskit/icon-object/glyph/new-feature/24';

				export default () => <NewFeature24Icon label="" />;
			`,
			expected: `
				import NewFeatureObjectTile from '@atlaskit/object/tile/new-feature';

				export default () => <NewFeatureObjectTile label="" size="small" />;
			`,
		});

		check({
			it: 'should migrate 24px Epic icon to object tile with small size',
			original: `
				import Epic24Icon from '@atlaskit/icon-object/glyph/epic/24';

				export default () => <Epic24Icon label="Epic icon" testId="epic-test" />;
			`,
			expected: `
				import EpicObjectTile from '@atlaskit/object/tile/epic';

				export default () => <EpicObjectTile label="Epic icon" testId="epic-test" size="small" />;
			`,
		});

		check({
			it: 'should handle renamed 24px imports with small size',
			original: `
				import MyCustomIcon from '@atlaskit/icon-object/glyph/pull-request/24';

				export default () => <MyCustomIcon />;
			`,
			expected: `
				import PullRequestObjectTile from '@atlaskit/object/tile/pull-request';

				export default () => <PullRequestObjectTile size="small" />;
			`,
		});
	});

	describe('Mixed imports', () => {
		check({
			it: 'should handle multiple 16px imports',
			original: `
				import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
				import Task16Icon from '@atlaskit/icon-object/glyph/task/16';

				export default () => (
					<div>
						<Bug16Icon label="Bug" />
						<Task16Icon label="Task" />
					</div>
				);
			`,
			expected: `
				import BugObject from '@atlaskit/object/bug';
				import TaskObject from '@atlaskit/object/task';

				export default () => (
					<div>
						<BugObject label="Bug" />
						<TaskObject label="Task" />
					</div>
				);
			`,
		});

		check({
			it: 'should handle multiple 24px imports with small size',
			original: `
				import Story24Icon from '@atlaskit/icon-object/glyph/story/24';
				import Epic24Icon from '@atlaskit/icon-object/glyph/epic/24';

				export default () => (
					<div>
						<Story24Icon />
						<Epic24Icon />
					</div>
				);
			`,
			expected: `
				import StoryObjectTile from '@atlaskit/object/tile/story';
				import EpicObjectTile from '@atlaskit/object/tile/epic';

				export default () => (
					<div>
						<StoryObjectTile size="small" />
						<EpicObjectTile size="small" />
					</div>
				);
			`,
		});

		check({
			it: 'should handle mixed 16px and 24px imports with correct sizes',
			original: `
				import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
				import Bug24Icon from '@atlaskit/icon-object/glyph/bug/24';
				import Task16Icon from '@atlaskit/icon-object/glyph/task/16';

				export default () => (
					<div>
						<Bug16Icon label="Small bug" />
						<Bug24Icon label="Large bug" />
						<Task16Icon />
					</div>
				);
			`,
			expected: `
				import BugObject from '@atlaskit/object/bug';
				import BugObjectTile from '@atlaskit/object/tile/bug';
				import TaskObject from '@atlaskit/object/task';

				export default () => (
					<div>
						<BugObject label="Small bug" />
						<BugObjectTile label="Large bug" size="small" />
						<TaskObject />
					</div>
				);
			`,
		});
	});

	describe('Complex scenarios', () => {
		check({
			it: 'should handle icons used in render functions and other references',
			original: `
				import IssueIcon from '@atlaskit/icon-object/glyph/issue/16';

				const renderIcon = () => IssueIcon;
				const Component = () => <IssueIcon label="Issue" />;
				const iconRef = IssueIcon;
			`,
			expected: `
				import IssueObject from '@atlaskit/object/issue';

				const renderIcon = () => IssueObject;
				const Component = () => <IssueObject label="Issue" />;
				const iconRef = IssueObject;
			`,
		});

		check({
			it: 'should preserve existing imports and add new ones',
			original: `
				import React from 'react';
				import Button from '@atlaskit/button';
				import TaskIcon from '@atlaskit/icon-object/glyph/task/16';

				export default () => (
					<Button>
						<TaskIcon />
					</Button>
				);
			`,
			expected: `
				import TaskObject from '@atlaskit/object/task';
				import React from 'react';
				import Button from '@atlaskit/button';

				export default () => (
					<Button>
						<TaskObject />
					</Button>
				);
			`,
		});

		check({
			it: 'should handle self-closing and regular JSX elements with correct sizes',
			original: `
				import IssueIcon from '@atlaskit/icon-object/glyph/issue/16';
				import StoryIcon from '@atlaskit/icon-object/glyph/story/24';

				export default () => (
					<div>
						<IssueIcon />
						<StoryIcon></StoryIcon>
					</div>
				);
			`,
			expected: `
				import IssueObject from '@atlaskit/object/issue';
				import StoryObjectTile from '@atlaskit/object/tile/story';

				export default () => (
					<div>
						<IssueObject />
						<StoryObjectTile size="small"></StoryObjectTile>
					</div>
				);
			`,
		});

		check({
			it: 'should preserve all props including label, testId, and others',
			original: `
				import CalendarIcon from '@atlaskit/icon-object/glyph/calendar/16';

				export default () => (
					<CalendarIcon
						label="Calendar event"
						testId="calendar-icon"
						className="custom-class"
						onClick={handleClick}
					/>
				);
			`,
			expected: `
				import CalendarObject from '@atlaskit/object/calendar';

				export default () => (
					<CalendarObject
						label="Calendar event"
						testId="calendar-icon"
						className="custom-class"
						onClick={handleClick}
					/>
				);
			`,
		});
	});
});
