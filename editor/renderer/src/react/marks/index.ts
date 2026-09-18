/* eslint-disable @atlaskit/editor/no-re-export */
// Mapping file
import type { ComponentType } from 'react';

import type { Mark } from '@atlaskit/editor-prosemirror/model';

import Alignment from './alignment';
import Annotation, { isAnnotationMark } from './annotation';
import BackgroundColor from './backgroundColor';
import Border from './border';
import Breakout from './breakout';
import Code from './code';
// Stage0
import ConfluenceInlineComment from './confluence-inline-comment';
import DataConsumer from './data-consumer';
import Em from './em';
import FontSize from './fontSize';
import FragmentMark from './fragment';
import Indentation from './indentation';
import Link from './link';
import Strike from './strike';
import Strong from './strong';
import Subsup from './subsup';
import TextColor from './textColor';
import Underline from './underline';
import UnsupportedMark from './unsupportedMark';
import UnsupportedNodeAttribute from './unsupportedNodeAttribute';

export const markToReact: {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: ComponentType<React.PropsWithChildren<any>>;
} = {
	code: Code,
	em: Em,
	link: Link,
	strike: Strike,
	strong: Strong,
	subsup: Subsup,
	textColor: TextColor,
	backgroundColor: BackgroundColor,
	underline: Underline,
	annotation: Annotation,
	border: Border,
	fontSize: FontSize,

	// Stage0
	confluenceInlineComment: ConfluenceInlineComment,
	breakout: Breakout,
	alignment: Alignment,
	indentation: Indentation,
	unsupportedMark: UnsupportedMark,
	unsupportedNodeAttribute: UnsupportedNodeAttribute,
	dataConsumer: DataConsumer,
	fragment: FragmentMark,
};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toReact = (mark: Mark): ComponentType<React.PropsWithChildren<any>> => {
	return markToReact[mark.type.name];
};

export {
	Code,
	Em,
	Link,
	Strike,
	Strong,
	Subsup,
	TextColor,
	BackgroundColor,
	Underline,
	Breakout,
	Annotation,
	Border,
	FontSize,
	UnsupportedMark,
	isAnnotationMark,
	UnsupportedNodeAttribute,
	DataConsumer,
	FragmentMark,
};
