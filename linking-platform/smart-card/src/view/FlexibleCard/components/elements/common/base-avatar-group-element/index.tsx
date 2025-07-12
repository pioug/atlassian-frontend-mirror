/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { type IntlShape, useIntl } from 'react-intl-next';

import AtlaskitAvatarGroup from '@atlaskit/avatar-group';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { ElementName, SmartLinkSize } from '../../../../../../constants';
import { messages } from '../../../../../../messages';
import { getFormattedMessageAsString } from '../../../utils';
import { type ElementProps } from '../../index';

const styles = css({
	minWidth: 'fit-content',
});

const stylesMap = cssMap({
	xlarge: {
		display: 'inline-flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		ul: {
			marginRight: token('space.100'),
			marginTop: 0,
		},
	},
	large: {
		display: 'inline-flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		ul: {
			marginRight: token('space.100'),
			marginTop: 0,
		},
	},
	medium: {
		display: 'inline-flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		ul: {
			marginRight: token('space.100'),
			marginTop: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		li: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'span, svg': {
				maxHeight: '1.25rem',
				maxWidth: '1.25rem',
			},
		},
	},
	small: {
		display: 'inline-flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		ul: {
			marginRight: token('space.100'),
			marginTop: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		li: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'span, svg': {
				maxHeight: '1.25rem',
				maxWidth: '1.25rem',
			},
		},
	},
});

const getPersonNameWithPrefix = (
	elementName: ElementName,
	personName: string,
	intl: IntlShape,
): string => {
	switch (elementName) {
		case ElementName.AssignedToGroup:
			return getFormattedMessageAsString(intl, messages.assigned_to, personName);
		case ElementName.OwnedByGroup:
			return getFormattedMessageAsString(intl, messages.owned_by, personName);
		case ElementName.AuthorGroup:
			return getFormattedMessageAsString(intl, messages.created_by, personName);
		default:
			return personName;
	}
};

export type BaseAvatarItemProps = {
	/**
	 * The image to be used in an `@atlaskit/avatar - this should be a url to the image src
	 */
	src?: string;
	/**
	 * The name of the person in the avatar.
	 */
	name: string;
};

export type BaseAvatarGroupElementProps = ElementProps & {
	/**
	 * An array of Avatars to show
	 */
	items?: BaseAvatarItemProps[];
	/**
	 * The maximum number of Avatars to show in the AvatarGroup
	 */
	maxCount?: number;
	/**
	 * Shows a name prefix in the Avatar tooltip (Created by, Assigned To, Owned by)
	 */
	showNamePrefix?: boolean;
	/**
	 * Shows a default fallback avatar if no persons in the AvatarGroup.
	 */
	showFallbackAvatar?: boolean;
};

/**
 * A base element that displays a group of avatars.
 * @internal
 * @param {BaseAvatarGroupElementProps} BaseAvatarGroupElementProps - The props necessary for the AvatarGroup.
 * @see AuthorGroup
 * @see CollaboratorGroup
 */
const BaseAvatarGroup = ({
	items = [],
	maxCount = 4,
	name,
	className,
	size = SmartLinkSize.Medium,
	testId = 'smart-element-avatar-group',
	showNamePrefix = false,
	showFallbackAvatar = true,
}: BaseAvatarGroupElementProps): JSX.Element | null => {
	const intl = useIntl();

	const data = useMemo(() => {
		if (!items.length && showFallbackAvatar) {
			switch (name) {
				case ElementName.AssignedToGroup:
					return [
						{
							name: getFormattedMessageAsString(intl, messages.unassigned),
						},
					];
				default:
					return [];
			}
		}

		//show a name prefix if there is one Avatar in a group only
		if (name && items.length === 1 && showNamePrefix) {
			return items.map((person) => {
				return {
					...person,
					name: getPersonNameWithPrefix(name, person.name, intl) || person.name,
				};
			});
		}

		return items;
	}, [name, items, showNamePrefix, showFallbackAvatar, intl]);

	if (!data.length) {
		return null;
	}

	return (
		<span
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[stylesMap[size], styles]}
			{...(fg('platform-linking-enable-avatar-data-separator') ? { ['data-separator']: true } : {})}
			data-smart-element={name}
			data-smart-element-avatar-group
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			<AtlaskitAvatarGroup
				maxCount={maxCount}
				appearance="stack"
				size="small"
				data={data}
				testId={testId}
			/>
		</span>
	);
};

export default BaseAvatarGroup;

export const toAvatarGroupProps = (
	items?: BaseAvatarItemProps[],
	showFallbackAvatar?: boolean,
): Partial<BaseAvatarGroupElementProps> | undefined => {
	return items ? { items } : showFallbackAvatar ? { items: [] } : undefined;
};
