jest.autoMockOff();
import transformer from '../next-primitives-emotion-to-compiled';

import { check } from './_framework';

check({
	transformer,
	it: 'should replace xcss Box with simple cssMap',
	original: `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
color: "color.text",
zIndex: "layer",
backgroundColor: "elevation.surface.hovered"
});

const MyComponent = () => <Box xcss={styles} />`,
	expected: `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";

import { token } from "@atlaskit/tokens";
import { jsx } from "@compiled/react";

const styles = cssMap({
  root: {
  color: token("color.text"),
  zIndex: 400,
  backgroundColor: token("elevation.surface.hovered")
  }
});

const MyComponent = () => <Box xcss={styles.root} />`,
});

check({
	transformer,
	it: 'should replace xcss Box with simple cssMap containing every style',
	original: `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
color: "color.text",
zIndex: "layer",
width: "size.100",
backgroundColor: "color.background.accent.lime.subtlest",
borderRadius: "border.radius.050",
borderColor: "color.border.accent.orange",
borderWidth: "border.width.indicator",
fill: "color.icon.accent.orange",
fontFamily: "font.family.body",
font: "font.body.small",
fontWeight: "font.weight.bold",
padding: "space.050",
marginBlock: "space.negative.200",
boxShadow: "elevation.shadow.overflow",
});

const MyComponent = () => <Box xcss={styles} />`,
	expected: `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";

import { token } from "@atlaskit/tokens";
import { jsx } from "@compiled/react";

const styles = cssMap({
  root: {
  color: token("color.text"),
  zIndex: 400,
  width: "1rem",
  backgroundColor: token("color.background.accent.lime.subtlest"),
  borderRadius: token("border.radius.050"),
  borderColor: token("color.border.accent.orange"),
  borderWidth: token("border.width.indicator"),
  fill: token("color.icon.accent.orange"),
  fontFamily: token("font.family.body"),
  font: token("font.body.small"),
  fontWeight: token("font.weight.bold"),
  padding: token("space.050"),
  marginBlock: token("space.negative.200"),
  boxShadow: token("elevation.shadow.overflow"),
  }
});

const MyComponent = () => <Box xcss={styles.root} />`,
});

check({
	transformer,
	it: 'should replace @emotion/react with @compiled/react',
	original: `import { Box, xcss } from "@atlaskit/primitives";
import { jsx } from "@emotion/react";

const styles = xcss({
color: "color.text",
zIndex: "layer",
});

const MyComponent = () => <Box xcss={styles} />`,
	expected: `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import { jsx } from "@compiled/react";

const styles = cssMap({
  root: {
  color: token("color.text"),
  zIndex: 400,
  }
});

const MyComponent = () => <Box xcss={styles.root} />`,
});

check({
	transformer,
	it: 'should replace every primitive with its compiled variant',
	original: `import { Box, xcss, Inline, Stack, Flex, Bleed, Grid, Pressable, Anchor } from "@atlaskit/primitives";
import { jsx } from "@emotion/react";

const styles = xcss({
color: "color.text",
zIndex: "layer",
});

const MyComponent = () => <Box xcss={styles} />`,
	expected: `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from "@atlaskit/css";
import { Box, Inline, Stack, Flex, Bleed, Grid, Pressable, Anchor } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import { jsx } from "@compiled/react";

const styles = cssMap({
  root: {
  color: token("color.text"),
  zIndex: 400,
  }
});

const MyComponent = () => <Box xcss={styles.root} />`,
});

check({
	transformer,
	it: 'should replace xcss with cssMap with styles not in style-maps',
	original: `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
backgroundColor: "color.background.accent.lime.subtlest",
display: "flex",
});

const MyComponent = () => <Box xcss={styles} />`,
	expected: `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";

import { token } from "@atlaskit/tokens";
import { jsx } from "@compiled/react";

const styles = cssMap({
  root: {
  backgroundColor: token("color.background.accent.lime.subtlest"),
  display: "flex",
  }
});

const MyComponent = () => <Box xcss={styles.root} />`,
});

check({
	transformer,
	it: 'should replace two xcss objects with one cssMap',
	original: `import { Box, xcss } from "@atlaskit/primitives";
const styles = xcss({
borderRadius: "border.radius.050",
color: "red",
});

const disabledStyles = xcss({
color: "color.text.disabled",
cursor: "not-allowed",
});

export default ({ disabled }) => <Box xcss={[styles, disabled && disabledStyles]} />`,
	expected: `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import { jsx } from "@compiled/react";

const styles = cssMap({
  root: {
  borderRadius: token("border.radius.050"),
  color: "red",
  },

  disabled: {
  color: token("color.text.disabled"),
  cursor: "not-allowed",
  }
});

export default ({ disabled }) => <Box xcss={[styles.root, disabled && styles.disabled]} />`,
});

check({
	transformer,
	it: 'should replace xcss with cssMap with multiple components',
	original: `import { Stack, Inline, xcss } from "@atlaskit/primitives";

const innerStyles = xcss({
font: "font.body.small",
marginBlock: "space.200",
});

const containerStyles = xcss({
padding: "space.050",
display: "flex",
});

const MyComponent = () => <Stack xcss={containerStyles}><Inline xcss={innerStyles} /></Stack>`,
	expected: `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from "@atlaskit/css";
import { Stack, Inline } from "@atlaskit/primitives/compiled";

import { token } from "@atlaskit/tokens";
import { jsx } from "@compiled/react";

const styles = cssMap({
  inner: {
  font: token("font.body.small"),
  marginBlock: token("space.200"),
  },

  container: {
  padding: token("space.050"),
  display: "flex",
  }
});

const MyComponent = () => <Stack xcss={styles.container}><Inline xcss={styles.inner} /></Stack>`,
});

check({
	transformer,
	it: 'should replace xcss containing nested selector with a cssMap',
	original: `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
color: "color.text",
zIndex: "layer",
':hover': {
	transform: 'scale(1)',
	},
});

const MyComponent = () => <Box xcss={styles} />`,
	expected: `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";

import { token } from "@atlaskit/tokens";
import { jsx } from "@compiled/react";

const styles = cssMap({
    root: {
    color: token("color.text"),
    zIndex: 400,
    "&:hover": {
        transform: 'scale(1)',
        },
    }
});

const MyComponent = () => <Box xcss={styles.root} />`,
});

check({
	transformer,
	it: 'should replace xcss containing media query with a cssMap',
	original: `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
color: "color.text",
zIndex: "layer",
':hover': {
	transform: 'scale(1)',
	},
'@media (min-width: 64rem)': {
	backgroundColor: 'color.background.accent.blue.subtlest.hovered',
	},
});

const MyComponent = () => <Box xcss={styles} />`,
	expected: `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";

import { token } from "@atlaskit/tokens";
import { jsx } from "@compiled/react";

const styles = cssMap({
    root: {
    color: token("color.text"),
    zIndex: 400,
    "&:hover": {
        transform: 'scale(1)',
        },
    '@media (min-width: 64rem)': {
        backgroundColor: token("color.background.accent.blue.subtlest.hovered"),
        },
    }
});

const MyComponent = () => <Box xcss={styles.root} />`,
});
