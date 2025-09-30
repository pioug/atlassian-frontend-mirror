/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::80d970238bae380ca0f003b9b81f6955>>
 * @codegenCommand yarn build-glyphs
 */
import type { ObjectTileProps } from '@atlaskit/object';

import BlogObjectTile from '../src/components/object-tile/components/blog';
import BranchObjectTile from '../src/components/object-tile/components/branch';
import BugObjectTile from '../src/components/object-tile/components/bug';
import CalendarObjectTile from '../src/components/object-tile/components/calendar';
import ChangesObjectTile from '../src/components/object-tile/components/changes';
import CodeObjectTile from '../src/components/object-tile/components/code';
import CommitObjectTile from '../src/components/object-tile/components/commit';
import DatabaseObjectTile from '../src/components/object-tile/components/database';
import EpicObjectTile from '../src/components/object-tile/components/epic';
import IdeaObjectTile from '../src/components/object-tile/components/idea';
import ImprovementObjectTile from '../src/components/object-tile/components/improvement';
import IncidentObjectTile from '../src/components/object-tile/components/incident';
import IssueObjectTile from '../src/components/object-tile/components/issue';
import NewFeatureObjectTile from '../src/components/object-tile/components/new-feature';
import PageObjectTile from '../src/components/object-tile/components/page';
import PageLiveDocObjectTile from '../src/components/object-tile/components/page-live-doc';
import ProblemObjectTile from '../src/components/object-tile/components/problem';
import PullRequestObjectTile from '../src/components/object-tile/components/pull-request';
import QuestionObjectTile from '../src/components/object-tile/components/question';
import StoryObjectTile from '../src/components/object-tile/components/story';
import SubtaskObjectTile from '../src/components/object-tile/components/subtask';
import TaskObjectTile from '../src/components/object-tile/components/task';
import WhiteboardObjectTile from '../src/components/object-tile/components/whiteboard';

export const allObjectTiles: (({
	label,
	size,
	testId,
	isBold,
}: ObjectTileProps) => React.JSX.Element)[] = [
	BlogObjectTile,
	BranchObjectTile,
	BugObjectTile,
	CalendarObjectTile,
	ChangesObjectTile,
	CodeObjectTile,
	CommitObjectTile,
	DatabaseObjectTile,
	EpicObjectTile,
	IdeaObjectTile,
	ImprovementObjectTile,
	IncidentObjectTile,
	IssueObjectTile,
	NewFeatureObjectTile,
	PageObjectTile,
	PageLiveDocObjectTile,
	ProblemObjectTile,
	PullRequestObjectTile,
	QuestionObjectTile,
	StoryObjectTile,
	SubtaskObjectTile,
	TaskObjectTile,
	WhiteboardObjectTile,
];
