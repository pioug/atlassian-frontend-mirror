/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import CodeBlock from '../../react/nodes/codeBlock/codeBlock';
import Date from '../../react/nodes/date';
import DecisionList from '../../react/nodes/decisionList';
import DecisionItem from '../../react/nodes/decisionItem';
import Emoji from '../../react/nodes/emoji';
import Mention from '../../react/nodes/mention';
import Panel from '../../react/nodes/panel';
import Status from '../../react/nodes/status';
import TaskItem from '../../react/nodes/taskItem';
import TaskList from '../../react/nodes/taskList';
import Expand from '../../ui/Expand';

/**
 * Synchronous renderer node mapping for "small" / simple nodes
 *
 * WARNING: This is an EXPERIMENTAL entry point and may change without notice in the future. Use it only at your own risk!
 *
 * Context: https://hello.atlassian.net/wiki/spaces/JIE/pages/5342146338 (Atlassian-internal)
 */
const nodeToReact: typeof import('../../react/nodes').nodeToReact = {
	codeBlock: CodeBlock,
	date: Date,
	decisionList: DecisionList,
	decisionItem: DecisionItem,
	emoji: Emoji,
	mention: Mention,
	panel: Panel,
	status: Status,
	taskItem: TaskItem,
	taskList: TaskList,
	expand: Expand,
};

export default nodeToReact;
