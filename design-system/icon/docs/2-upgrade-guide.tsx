import React from 'react';
import { md, code } from '@atlaskit/docs';

import { DynamicTableStateless } from '@atlaskit/dynamic-table';

interface TableProps {
  changedValues: Record<string, string>;
}

const Table = ({ changedValues }: TableProps) => (
  <DynamicTableStateless
    isFixedSize
    head={{
      cells: [
        { key: 'old location', content: 'Old location' },
        { key: 'new location', content: 'New location' },
      ],
    }}
    rows={Object.keys(changedValues).map(oldLocation => ({
      key: oldLocation + changedValues[oldLocation],
      cells: [
        { key: oldLocation, content: <code>{oldLocation}</code> },
        {
          key: changedValues[oldLocation],
          content: <code>{changedValues[oldLocation]}</code>,
        },
      ],
    }))}
  />
);

const logoSizeMap = [
  { oldSize: 'small', newSize: 'xsmall', pixelValue: '16px' },
  { oldSize: 'medium (default)', newSize: 'small', pixelValue: '24px' },
  { oldSize: 'large', newSize: 'medium (default)', pixelValue: '32px' },
  { oldSize: '-', newSize: 'large', pixelValue: '40px' },
  { oldSize: 'xlarge', newSize: 'xlarge', pixelValue: '48px' },
];

const SizeTable = () => (
  <DynamicTableStateless
    isFixedSize
    head={{
      cells: [
        { key: 'old size', content: 'Your prop in v13' },
        { key: 'new size', content: 'You should use in v14' },
        { key: 'pixel value', content: 'pixel value' },
      ],
    }}
    rows={logoSizeMap.map(({ oldSize, newSize, pixelValue }) => ({
      key: pixelValue,
      cells: [
        { key: oldSize, content: oldSize },
        { key: newSize, content: newSize },
        { key: pixelValue, content: pixelValue },
      ],
    }))}
  />
);

const logoLocation = {
  '@atlaskit/icon/glyph/atlassian':
    '@atlaskit/logo/dist/esm/AtlassianLogo/Icon',
  '@atlaskit/icon/glyph/bitbucket':
    '@atlaskit/logo/dist/esm/BitbucketLogo/Icon',
  '@atlaskit/icon/glyph/confluence':
    '@atlaskit/logo/dist/esm/ConfluenceLogo/Icon',
  '@atlaskit/icon/glyph/hipchat': '@atlaskit/logo/dist/esm/HipchatLogo/Icon',
  '@atlaskit/icon/glyph/jira-core': '@atlaskit/logo/dist/esm/JiraCoreLogo/Icon',
  '@atlaskit/icon/glyph/jira': '@atlaskit/logo/dist/esm/JiraLogo/Icon',
  '@atlaskit/icon/glyph/jira-service-desk':
    '@atlaskit/logo/dist/esm/JiraServiceDeskLogo/Icon',
  '@atlaskit/icon/glyph/jira-software':
    '@atlaskit/logo/dist/esm/JiraSoftwareLogo/Icon',
  '@atlaskit/icon/glyph/statuspage':
    '@atlaskit/logo/dist/esm/StatuspageLogo/Icon',
  '@atlaskit/icon/glyph/stride': '@atlaskit/logo/dist/esm/StrideLogo/Icon',
};

const priorityIconLocation = {
  '@atlaskit/icon/glyph/jira/blocker':
    '@atlaskit/icon-priority/glyph/priotity-blocker',
  '@atlaskit/icon/glyph/jira/critical':
    '@atlaskit/icon-priority/glyph/priority-critical',
  '@atlaskit/icon/glyph/jira/major':
    '@atlaskit/icon-priority/glyph/priority-major',
  '@atlaskit/icon/glyph/jira/medium':
    '@atlaskit/icon-priority/glyph/priority-medium',
  '@atlaskit/icon/glyph/jira/minor':
    '@atlaskit/icon-priority/glyph/priority-minor',
  '@atlaskit/icon/glyph/jira/trivial':
    '@atlaskit/icon-priority/glyph/priority-trivial',
};

export default md`
## v15.x to v16.x

We have moved the priority icons to its own package.

The following icons have been removed from \`@atlaskit/icons\`. They can be imported from \`@atlaskit/icon-priority\` going
forward. The icons are:

${(<Table changedValues={priorityIconLocation} />)}



## v14.x to v15.x
In Version 15, we removed the onClick props. Icons are not focusable elements, they are only presentational.
We recommend to wrap them into a link or a button if you need to click on them.

${code`
import BookIcon from '@atlaskit/icon/glyph/book';
<Button onClick={() => {}}>
  <BookIcon
    label="Book"
    primaryColor={colors.N0}
    secondaryColor={colors.B400}
    size="small"
  />
</Button>
`}

${code`
import EmojiIcon from '@atlaskit/icon/glyph/emoji';
<Link>
  <EmojiIcon
    label="Yay"
    primaryColor={colors.N0}
    secondaryColor={colors.P300}
    size="medium"
  />
</Link>
`}




## v13.x to v14.x
Version 14 of icons resorts our icons into better locations.
There is a full explanation below, but to start, here are the icons
that are affected.

There is also a codemod to help you upgrade located [here](https://bitbucket.org/atlassian/atlaskit-codemods/src/master/src/icon-13-to-14/).

Quickly, what happened:
- [Swap the icon \`JiraMajorIcon\` and \`JiraMinorIcon\`](#jiraMajorMinor)
- [Product Logo Icons](#logo)
- [Object Icons](#object)
- [File-type Icons](#file-type)
- [Why these changes?](#explanation)

${(
  <h2 id="jiraMajorMinor">
    Swap the icon <code>JiraMajorIcon</code> and <code>JiraMinorIcon</code>
  </h2>
)}

These icons are named incorrectly in atlaskit, so we're taking the opportunity of a breaking change to switch these around.

${(<h2 id="logo">Product Logo Icons</h2>)}

The following icons have been removed from \`@atlaskit/icons\`. They can be imported from \`@atlaskit/logo\` going
forward. The icons are:

${(<Table changedValues={logoLocation} />)}

In addition to being moved, the move to logo comes with a change to how
the sizing prop will affect these icons:

${(<SizeTable />)}

Logos are set up to handle gradients as first class citizens, with \`gradientStart\` and \`gradientStop\` props. For
the most part you can rely on inheritance and will not need to provide these props.

The \`primaryColor\` should be transferred to \`iconColor\` and \`gradientEnd\` props. The \`secondaryColor\` should
be transformed into the \`iconGradientStop\` property.

As an example, an icon that looked like this:

${code`
<AtlassianIcon
  label="Atlassian Design Guidelines"
  primaryColor={colors.N0}
  secondaryColor={colors.B400}
  size="small"
/>
`}

to

${code`
<AtlassianIcon
  label="Atlassian Design Guidelines"
  iconColor={colors.N0}
  iconGradientStart={colors.B400}
  iconGradientStop={colors.N0}
  size="xsmall"
/>
`}

${(<h2 id="object">Object Icons</h2>)}

Similarly, object icons use different svgs for different sizes, and so are incompatible
with the architecture of the \`@altaskit/icon\` package. As such, they are
being given their own package: \`@atlaskit/icon-object\`. These icons can be
identified with the following pattern:

${(
  <Table
    changedValues={{
      '@atlaskit/icon/glyph/object/16/objects-16-ICON_NAME':
        '@atlaskit/icon-object/glyph/ICON_NAME/16',
      '@atlaskit/icon/glyph/object/24/objects-24-ICON_NAME':
        '@atlaskit/icon-object/glyph/ICON_NAME/24',
    }}
  />
)}

You will need to install the \`@atlaskit/icon-object\` package to use these.

Other notable differences for object icons are:
- They do not accept a sizing prop - their size is fixed to the imported svg
- They can be required at only two sizes (16px and 24px)
- Their colors are fixed

${(<h2 id="file-type">File-type Icons</h2>)}

Similarly, file-type icons use different svgs for different sizes, and so are incompatible
with the architecture of the \`@altaskit/icon\` package. As such, they are
being given their own package: \`@atlaskit/icon-file-type\`. These icons are:

${(
  <Table
    changedValues={{
      '@atlaskit/icon/glyph/file-types/16/file-types-16-{ICON_NAME}':
        '@atlaskit/icon-file-type/glyph/{ICON_NAME}/16',
      '@atlaskit/icon/glyph/file-types/24/file-types-24-{ICON_NAME}':
        '@atlaskit/icon-file-type/glyph/{ICON_NAME}/24',
    }}
  />
)}

Other notable differences for file-type icons are:
- They do not accept a sizing prop - their size is fixed to the imported svg
- They can be required at only three sizes (16 by 16px, 24 by 24px, and 48 by 64px)
- The largest size of these icons is not square, unlike all other icons
- Their colors are fixed

${(<h2 id="explanation">Why these changes?</h2>)}

The icons package was architected with several implicit decisions that defined
what icons are:

- icons are svgs with a 24\*24px canvas
- they can be scaled to 16px, 24px (default), 32px, and 48px
- they feature one or two colors that are editable by props

One of the other important features of icons is that they need a unique build step,
different to what other components in the atlaskit repository need.

As we have evolved our visual style, we have had more and more items that from a
design-perspective are definitely icons, however have failed to meet the architectural
guidelines of the \`@atlaskit/icons\` package. We have generally endeavoured to add
these in to the icons package, but we have enough that we needed a better solution. The
biggest driver of this was icons that had separate svgs for different sizes.

Adding a way to handle this into icon's existing architecture was not going to work. We
defined an API for multi-svg icons that is fundamentally incompatible with the existing
icons API. While it was possible to ship both APIs from a single package, learning which
icons used which API was going to be trial and error.

By using different packages, we want to make clear distinctions between how to use an icon.
`;
