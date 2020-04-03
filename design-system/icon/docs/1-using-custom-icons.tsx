import React from 'react';
import { md, code, Props, Example } from '@atlaskit/docs';

export default md`
  ### Custom Icons

  If you need to render an icon that is not in our current set, and adding it
  does not make sense, you can render a custom icon instead. We assume here that
  the SVG's contents will be exported from a \`.js\` file, or
  be written in a React context, so we need to sanitize our SVGs for that use-case.

  First you will need to import the Icon component itself. The default export
  of the package is this component, however you can use the same technique used with
  individual icons to stop application bloat, and import just the component itself
  using the following:

  ${code`import Icon from '@atlaskit/icon/dist/cjs/components/Icon'`}

  This icon has the same props as all icons. See the bottom of this page for those.

  ### Gotchas of generating your custom SVG

  Icon uses svgs as glyphs, and there are certain rules we expect the glyphs to
  adhere to so that they work correctly:

  - the glyph is 24px by 24px
  - the fill property of g will be set to 'currentColor', which will allow it to
  be styled using the \`primaryColor\` prop.
  - If you want part of your svg to be colored using the \`secondaryColor\` it
  shuold have its fill property set to 'inherit'.
  - custom icons should have \`focusable="false"\` and \`role="presentation"\`.

  See the example below of us using a custom icon. If you want to remix it to
  test out your own icon, view the example [here](/packages/core/icon/example/IconCustomExample)
  and click on the \`sandbox\` link.

  ${(
    <Example
      packageName="@atlaskit/icon"
      Component={require('../examples/IconCustomExample').default}
      title="Using a custom Icon"
      source={require('!!raw-loader!../examples/IconCustomExample')}
    />
  )}

  ### SVGs from sketch

  If you are exporting an svg from sketch, it will include a large amount of
  metadata that you won't need. You will likely need to manually adjust the file.
  There are several other optimisations that can be done to svgs. Here is an example
  of one of our raw svg icons:

  ${code`
    <?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
        <title>icons/global-atlassian</title>
        <desc>Created with Sketch.</desc>
        <defs>
            <linearGradient x1="99.3448074%" y1="16.2727563%" x2="45.7955414%" y2="89.3214068%" id="linearGradient-1">
                <stop stop-color="inherit" stop-opacity="0.4" offset="0%"></stop>
                <stop stop-color="inherit" offset="100%"></stop>
            </linearGradient>
        </defs>
        <g id="Global" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="icons/global-atlassian" fill-rule="nonzero">
                <path d="M8.7026087,11.4753467 C8.46608696,11.2223032 8.09391304,11.2362162 7.93565217,11.5623032 L4.04956522,19.3301293 C3.97749017,19.4741375 3.9851743,19.6452073 4.0698702,19.7821737 C4.15456609,19.91914 4.30417962,20.0024449 4.46521739,20.0023032 L9.87652174,20.0023032 C10.0546254,20.0057557 10.2178394,19.9033201 10.2921739,19.7414336 C11.4591304,17.3336075 10.7521739,13.6649119 8.7026087,11.4753467 Z" id="Shape" fill="url(#linearGradient-1)"></path>
                <path d="M11.553913,4.40945905 C9.38,7.85293731 9.52347826,11.6668504 10.9556522,14.529459 L13.5643478,19.7468504 C13.6418811,19.9058962 13.8030635,20.0070566 13.98,20.0077199 L19.3913043,20.0077199 C19.5523421,20.0078617 19.7019556,19.9245568 19.7866515,19.7875904 C19.8713474,19.650624 19.8790316,19.4795542 19.8069565,19.335546 C19.8069565,19.335546 12.5269565,4.76945905 12.3478261,4.40685035 C12.18,4.08076339 11.7643478,4.07380687 11.553913,4.40945905 Z" id="Shape" fill="currentColor"></path>
            </g>
        </g>
    </svg>
  `}

  vs the same icon after we have stripped it down:

  ${code`
    <svg width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient x1="99.345%" y1="16.273%" x2="45.796%" y2="89.321%" id="a"><stop stop-color="inherit" stop-opacity=".4" offset="0%"/><stop stop-color="inherit" offset="100%"/></linearGradient></defs><path d="M8.703 11.475c-.237-.253-.61-.239-.767.087L4.05 19.33a.464.464 0 0 0 .415.672h5.412a.448.448 0 0 0 .415-.26c1.167-2.408.46-6.077-1.59-8.267z" fill="url(#a)"/><path d="M11.554 4.41c-2.174 3.443-2.03 7.257-.598 10.12l2.608 5.217c.078.159.24.26.416.26h5.411a.464.464 0 0 0 .416-.671s-7.28-14.567-7.46-14.93c-.167-.325-.583-.332-.793.003z" fill="currentColor"/></svg>
  `}

  We use the \`SVGO\` package to clean these svgs, with several custom extensions
  for our workflow. Here is what ur SVGO config looks like:

  ${code`
    new SVGO({
      multipass: true,
      plugins: [
        { removeTitle: true },
        { removeDesc: { removeAny: true } },
        { cleanupIDs: true },
        { collapseGroups: true },
        { removeXMLNS: true },
        { removeNamespacedAttributes },
        { replaceSketchHexColors },
      ],
    });
  `}

  The last two plugins are custom plugins we have written. The first removes
  attributes with a namespace (e.g. xmlns:link, ns:foo, ...), while the second
  replaces hex colors with 'currentColor' or 'inherit', depending on the color value.

  If you only need to do this once, you may want to make the final changes by hand.
  If you predict doing this multiple times, it may be worth copying our plugins
  or writing your own.

  Using this SVGO configuration should get you most of the way there, however
  you will need to make sure you remove any attributes not supported in React. In
  particular, attributes such as \`xmlns:link\` will cause React parsing to fail.

  ${(
    <Props
      heading="Icon Props"
      props={require('!!extract-react-types-loader!../src/components/Icon')}
    />
  )}
`;
