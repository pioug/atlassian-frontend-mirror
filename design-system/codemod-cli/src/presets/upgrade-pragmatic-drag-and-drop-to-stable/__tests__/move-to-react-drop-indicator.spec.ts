jest.autoMockOff();

import transformer from '../upgrade-pragmatic-drag-and-drop-to-stable';
import { check } from './_framework';

describe('move from @atlaskit/pragmatic-drag-and-drop-react-indicator to @atlaskit/pragmatic-drag-and-drop-react-drop-indicator', () => {
	check({
		transformer,
		it: 'should transform import paths',
		original: `
      import * as Root from "@atlaskit/pragmatic-drag-and-drop-react-indicator";
      import { DropIndicator as Box } from "@atlaskit/pragmatic-drag-and-drop-react-indicator/box";
      import { DropIndicator as BoxWithoutTerminal } from "@atlaskit/pragmatic-drag-and-drop-react-indicator/box-without-terminal";
      import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-react-indicator/types";
      import { DropIndicator as TreeItem } from "@atlaskit/pragmatic-drag-and-drop-react-indicator/tree-item";
    `,
		expected: `
      import * as Root from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator";
      import { DropIndicator as Box } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
      import { DropIndicator as BoxWithoutTerminal } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box-without-terminal";
      import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/types";
      import { DropIndicator as TreeItem } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/tree-item";
    `,
	});
});
