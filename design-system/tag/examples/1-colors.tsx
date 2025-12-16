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

export default () => (
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
		<Heading size="medium">AvatarTag (Gray Only)</Heading>
		<div css={avatarTagContainerStyles}>
			<AvatarTag text="User Name" avatar={Avatar} isRemovable={false} />
			<AvatarTag text="Removable" avatar={Avatar} removeButtonLabel="Remove" />
			<AvatarTag
				text="Linked"
				avatar={Avatar}
				href="https://www.atlassian.com/search?query=User"
				isRemovable={false}
			/>
			<AvatarTag
				text="Linked + Removable"
				avatar={Avatar}
				href="https://www.atlassian.com/search?query=User"
				removeButtonLabel="Remove"
			/>
		</div>
	</div>
);
