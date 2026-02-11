/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import { css } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import TagIcon from '@atlaskit/icon/core/tag';
import { AvatarTag, RemovableTag, SimpleTag as Tag, type TagColor } from '@atlaskit/tag';
import TeamAvatar from '@atlaskit/teams-avatar';
import { token } from '@atlaskit/tokens';

const colors: TagColor[] = [
	'blue',
	'red',
	'yellow',
	'green',
	'teal',
	'purple',
	'orange',
	'magenta',
	'lime',
	'grey',
];

const tableStyles = css({
	maxWidth: '700px',
	marginBlockEnd: token('space.100', '8px'),
	marginBlockStart: token('space.100', '8px'),
	marginInlineEnd: token('space.100', '8px'),
	marginInlineStart: token('space.100', '8px'),
});

const avatarTagContainerStyles = css({
	display: 'flex',
	gap: token('space.100'),
	flexWrap: 'wrap',
	marginBlockEnd: token('space.200'),
});

interface TagRowProps {
	title: string;
	renderTag: (color: TagColor, isLight?: boolean) => React.ReactNode;
}

function TagRow({ title, renderTag }: TagRowProps) {
	return (
		<tr>
			<th>{title}</th>
			<td>{renderTag('standard')}</td>
			{colors.map((color) => (
				<td key={`${color}-default`}>{renderTag(color)}</td>
			))}
			<td></td>
		</tr>
	);
}

function LightTagRow({ title, renderTag }: TagRowProps) {
	return (
		<tr>
			<th>{title}</th>
			<td></td>
			{colors.map((color) => (
				<td key={`${color}-light`}>{renderTag(color, true)}</td>
			))}
		</tr>
	);
}

function TagTable({
	caption,
	renderTag,
}: {
	caption: string;
	renderTag: (color: TagColor, isLight?: boolean) => React.ReactNode;
}) {
	return (
		<table css={tableStyles}>
			<caption>{caption}</caption>
			<thead>
				<tr>
					<td></td>
					<th>Standard</th>
					{colors.map((color) => (
						<th key={color}>{color!.charAt(0).toUpperCase() + color!.slice(1)}</th>
					))}
				</tr>
			</thead>
			<tbody>
				<TagRow title="Default" renderTag={renderTag} />
				<LightTagRow title="Light" renderTag={renderTag} />
			</tbody>
		</table>
	);
}

const elemBefore = <TagIcon size="small" label="Tag" />;

const _default: () => JSX.Element = () => (
	<div data-testid="wrapper">
		<TagTable
			caption="Non-interactive tags"
			renderTag={(color, isLight) => (
				<Tag
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
					testId={color === 'standard' ? 'nonInteractiveStandard' : undefined}
				/>
			)}
		/>

		<TagTable
			caption="Link tags"
			renderTag={(color, isLight) => (
				<Tag
					href="https://www.atlassian.com/search?query=Carrot%20cake"
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
					testId={color === 'standard' ? 'linkStandard' : undefined}
				/>
			)}
		/>

		<TagTable
			caption="Removable tags"
			renderTag={(color, isLight) => (
				<RemovableTag
					removeButtonLabel="Remove"
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
				/>
			)}
		/>

		<TagTable
			caption="Removable + link tags"
			renderTag={(color, isLight) => (
				<RemovableTag
					removeButtonLabel="Remove"
					href="https://www.atlassian.com/search?query=Carrot%20cake"
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
				/>
			)}
		/>

		<TagTable
			caption="Link + Element before tags"
			renderTag={(color, isLight) => (
				<Tag
					elemBefore={elemBefore}
					href="https://www.atlassian.com/search?query=Carrot%20cake"
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
					testId={color === 'standard' ? 'elemBeforeBlue' : undefined}
				/>
			)}
		/>

		<TagTable
			caption="Removable + Link + Element before tags"
			renderTag={(color, isLight) => (
				<RemovableTag
					elemBefore={elemBefore}
					href="https://www.atlassian.com/search?query=Carrot%20cake"
					text="Tag"
					color={isLight ? (`${color}Light` as TagColor) : color}
					testId={color === 'standard' ? 'elemBeforeBlue' : undefined}
				/>
			)}
		/>

		{/* AvatarTag Examples - Gray only */}
		<Heading size="medium">AvatarTag - People (Gray Only)</Heading>
		<div css={avatarTagContainerStyles}>
			<AvatarTag type="user" text="User Name" avatar={Avatar} isRemovable={false} />
			<AvatarTag type="user" text="Removable" avatar={Avatar} removeButtonLabel="Remove" />
			<AvatarTag
				type="user"
				text="Linked"
				avatar={Avatar}
				href="https://www.atlassian.com/search?query=User"
				isRemovable={false}
			/>
			<AvatarTag
				type="user"
				text="Linked + Removable"
				avatar={Avatar}
				href="https://www.atlassian.com/search?query=User"
				removeButtonLabel="Remove"
			/>
		</div>

		{/* Team AvatarTag Examples - Gray only */}
		<Heading size="medium">AvatarTag - Other/Team (Gray Only)</Heading>
		<div css={avatarTagContainerStyles}>
			<AvatarTag type="other" text="Design System Team" avatar={TeamAvatar} isRemovable={false} />
			<AvatarTag type="other" text="Removable Team" avatar={TeamAvatar} removeButtonLabel="Remove" />
			<AvatarTag
				type="other"
				text="Linked Team"
				avatar={TeamAvatar}
				href="https://www.atlassian.com/search?query=Team"
				isRemovable={false}
			/>
			<AvatarTag
				type="other"
				text="Linked + Removable Team"
				avatar={TeamAvatar}
				href="https://www.atlassian.com/search?query=Team"
				removeButtonLabel="Remove"
			/>
		</div>

		{/* Agent AvatarTag Examples - Gray only */}
		<Heading size="medium">AvatarTag - Agent (Gray Only)</Heading>
		<div css={avatarTagContainerStyles}>
			<AvatarTag type="agent" text="Rovo" avatar={Avatar} isRemovable={false} />
			<AvatarTag type="agent" text="Removable Agent" avatar={Avatar} removeButtonLabel="Remove" />
			<AvatarTag
				type="agent"
				text="Linked Agent"
				avatar={Avatar}
				href="https://www.atlassian.com/search?query=Agent"
				isRemovable={false}
			/>
			<AvatarTag
				type="agent"
				text="Linked + Removable"
				avatar={Avatar}
				href="https://www.atlassian.com/search?query=Agent"
				removeButtonLabel="Remove"
			/>
		</div>
	</div>
);
export default _default;
