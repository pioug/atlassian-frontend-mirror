import { type JsonLd } from 'json-ld-types';

import {
	extractImage,
	extractLink,
	extractMembers,
	extractPersonAssignedTo,
	extractPersonCreatedBy,
	extractPersonUpdatedBy,
	extractProvider,
	extractTitle,
	type LinkPerson,
	type LinkTypeUpdatedBy,
} from '@atlaskit/link-extractors';
import { type CardProviderRenderers } from '@atlaskit/link-provider';

import { type BlockCardResolvedViewProps } from '../../view/BlockCard';
import { type ActionProps } from '../../view/BlockCard/components/Action';
import { type CardPlatform } from '../../view/Card';
import { extractClientActions } from '../common/actions/extractActions';
import { extractPreviewAction } from '../common/actions/extractPreviewAction';
import { extractByline } from '../common/byline/extractByline';
import {
	extractAttachmentCount,
	extractCommentCount,
	extractProgrammingLanguage,
	extractSubscriberCount,
	type LinkAttachmentType,
	type LinkCommentType,
	type LinkProgrammingLanguageType,
	type LinkSubscriberType,
} from '../common/detail';
import { type LinkDetail } from '../common/detail/types';
import { extractIcon } from '../common/icon';
import { extractLozenge } from '../common/lozenge';
import { extractIsTrusted } from '../common/meta/extractIsTrusted';
import { extractSummary, extractTitleTextColor } from '../common/primitives';
import { extractTitlePrefix } from '../common/title-prefix/extractTitlePrefix';

import { type ExtractBlockOpts } from './types';

const extractBlockIcon = (jsonLd: JsonLd.Data.BaseData): BlockCardResolvedViewProps['icon'] => {
	const icon = extractIcon(jsonLd);
	if (typeof icon === 'string') {
		return { url: icon };
	} else {
		return { icon };
	}
};

const extractBlockDetails = (jsonLd: JsonLd.Data.BaseData): LinkDetail[] =>
	[
		extractCommentCount(jsonLd as LinkCommentType),
		extractProgrammingLanguage(jsonLd as LinkProgrammingLanguageType),
		extractSubscriberCount(jsonLd as LinkSubscriberType),
		extractAttachmentCount(jsonLd as LinkAttachmentType),
	].filter((detail) => !!detail) as LinkDetail[];

export const extractBlockActions = (
	props: BlockCardResolvedViewProps,
	jsonLd: JsonLd.Data.BaseData,
	opts?: ExtractBlockOpts,
	platform?: CardPlatform,
	meta?: JsonLd.Meta.BaseMeta,
): ActionProps[] => {
	if (opts) {
		const { handleInvoke, actionOptions } = opts;
		const actions = extractClientActions(jsonLd, handleInvoke, actionOptions);
		const previewAction = extractPreviewAction({
			...opts,
			viewProps: props,
			jsonLd,
			platform,
			meta,
		});

		// The previewAction should always be the last action
		if (previewAction) {
			actions.push(previewAction);
		}

		return actions;
	}

	return [];
};

export const extractBlockUsers = (jsonLd: JsonLd.Data.BaseData): LinkPerson[] | undefined => {
	if (jsonLd['@type'] === 'atlassian:Project') {
		return extractMembers(jsonLd as JsonLd.Data.Project);
	} else if (jsonLd['@type'] === 'atlassian:Task') {
		const assignedMembers = extractPersonAssignedTo(jsonLd as JsonLd.Data.Task);
		if (assignedMembers) {
			return [assignedMembers];
		}
	} else if (jsonLd['@type'] === 'atlassian:SourceCodePullRequest') {
		return extractPersonCreatedBy(jsonLd as JsonLd.Data.SourceCodePullRequest);
	} else {
		const updatedBy = extractPersonUpdatedBy(jsonLd as LinkTypeUpdatedBy);
		let updatedByMembers;
		if (updatedBy) {
			updatedByMembers = [updatedBy];
		}
		const createdByMembers = extractPersonCreatedBy(jsonLd);
		return updatedByMembers || createdByMembers;
	}
};

export const extractBlockProps = (
	jsonLd: JsonLd.Data.BaseData,
	meta?: JsonLd.Meta.BaseMeta,
	opts?: ExtractBlockOpts,
	renderers?: CardProviderRenderers,
	platform?: CardPlatform,
): BlockCardResolvedViewProps => {
	const props = {
		link: extractLink(jsonLd),
		title: extractTitle(jsonLd),
		titleTextColor: extractTitleTextColor(jsonLd),
		lozenge: extractLozenge(jsonLd),
		icon: extractBlockIcon(jsonLd),
		context: extractProvider(jsonLd),
		details: extractBlockDetails(jsonLd),
		byline: extractSummary(jsonLd) || extractByline(jsonLd),
		thumbnail: extractImage(jsonLd),
		users: extractBlockUsers(jsonLd),
		titlePrefix: extractTitlePrefix(jsonLd, renderers, 'block'),
		isTrusted: extractIsTrusted(meta),
	};
	return {
		...props,
		actions: extractBlockActions(props, jsonLd, opts, platform, meta),
	};
};
