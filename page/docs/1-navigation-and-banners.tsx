import { md } from '@atlaskit/docs';

export default md`
# Using banners with page

Due to navigation and banner both being renderable without each other and
without page, there's a bit of complexity we need to explain for you
here. Note that a lot of this complexity comes from using an announcement
banner in your app, so to start, let's go through what to do if you
only ever want a warning or error banner.

You may also find it useful to open the code and follow along with some of
the concepts we are talking about.

## Basic Banners

If you are certain you are only using a warning or an error banner in your
application, then there are two numbers you are going to need to set. On
\`<Page />\` you will need to set \`bannerHeight\` to \`52\`, and on the
\`<Navigation />\` component that you pass in, you need to set the \`topOffset\`
to 52 only when the banner is open.

## Complex use-cases with announcement Banners

Announcement banners add an additional level of complexity, as they
can be of a variable height. Our handy number \`52\` will not do for
these banners, so we are going to need to do something more complex.

What we can use is the \`innerRef\` property of banner, to get the
ref to the banner that will be displayed. The height of the returned
ref will always be the height of the expanded banner, so you can access
\`ref.clientHeight\` to find out the height of the banner to be rendered.

As with before, you need to set both the bannerHeight of \`<Page />\`
and the topOffset of \`<Navigation />\` (while the banner is visible).

In the code for this example, you can see that we are saving the ref so
that we can correctly calculate the offset for both banners being
displayed at the same time.

For a thorough example using banners, you can see them working [here](../example/navigation-example).
`;
