import transform from '../index';

const apply = require('jscodeshift/dist/testUtils').applyTransform;

async function applyTransform(transform: any, input: string) {
	const output = await apply({ default: transform, parser: 'tsx' }, {}, { source: input });
	return output;
}

describe('0.5.2-primitives-emotion-to-compiled', () => {
	describe('basic xcss transformations', () => {
		it('should replace xcss Box with simple cssMap', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
color: "color.text",
zIndex: "layer",
});

const MyComponent = () => <Box xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			  root: {
			  color: token("color.text"),
			  zIndex: 400,
			  }
			});

			const MyComponent = () => <Box xcss={styles.root} />"
		`);
		});

		it('should not add tokens import unless necessary', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
borderWidth: 0,
appearance: "none",
});

const MyComponent = () => <Box xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";

			const styles = cssMap({
			  root: {
			  borderWidth: 0,
			  appearance: "none",
			  }
			});

			const MyComponent = () => <Box xcss={styles.root} />"
		`);
		});

		it('should not add a duplicate jsx pragma', async () => {
			const input = `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
color: "color.text",
zIndex: "layer",
});

const MyComponent = () => <Box xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			 root: {
			 color: token("color.text"),
			 zIndex: 400,
			 }
			});

			const MyComponent = () => <Box xcss={styles.root} />"
		`);
		});

		it('should replace xcss Box with simple cssMap containing every style', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
color: "color.text",
zIndex: "layer",
width: "size.100",
borderRadius: "radius.xsmall",
borderColor: "color.border.accent.orange",
borderWidth: "border.width.selected",
fill: "color.icon.accent.orange",
fontFamily: "font.family.body",
font: "font.body.small",
fontWeight: "font.weight.bold",
padding: "space.050",
marginBlock: "space.negative.200",
boxShadow: "elevation.shadow.overflow",
});

const MyComponent = () => <Box xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			  root: {
			  color: token("color.text"),
			  zIndex: 400,
			  width: "1rem",
			  borderRadius: token("radius.xsmall"),
			  borderColor: token("color.border.accent.orange"),
			  borderWidth: token("border.width.selected"),
			  fill: token("color.icon.accent.orange"),
			  fontFamily: token("font.family.body"),
			  font: token("font.body.small"),
			  fontWeight: token("font.weight.bold"),
			  padding: token("space.050"),
			  marginBlock: token("space.negative.200"),
			  boxShadow: token("elevation.shadow.overflow"),
			  }
			});

			const MyComponent = () => <Box xcss={styles.root} />"
		`);
		});
	});

	describe('import transformations', () => {
		it('should replace @emotion/react with @compiled/react', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";
import { jsx } from "@emotion/react";

const styles = xcss({
color: "color.text",
zIndex: "layer",
});

const MyComponent = () => <Box xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			  root: {
			  color: token("color.text"),
			  zIndex: 400,
			  }
			});

			const MyComponent = () => <Box xcss={styles.root} />"
		`);
		});

		it('should replace every primitive with its compiled variant', async () => {
			const input = `import { Box, xcss, Inline, Stack, Flex, Bleed, Grid, Pressable, Anchor } from "@atlaskit/primitives";
import { jsx } from "@emotion/react";

const styles = xcss({
color: "color.text",
zIndex: "layer",
});

const MyComponent = () => <Box xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Anchor, Bleed, Box, Flex, Grid, Inline, Pressable, Stack } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			  root: {
			  color: token("color.text"),
			  zIndex: 400,
			  }
			});

			const MyComponent = () => <Box xcss={styles.root} />"
		`);
		});
	});

	describe('style transformations', () => {
		it('should replace xcss with cssMap with styles not in style-maps', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
backgroundColor: "color.background.accent.lime.subtlest",
display: "flex",
});

const MyComponent = () => <Box xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";

			const styles = cssMap({
			  root: {
			    display: "flex"
			  }
			});

			const MyComponent = () => <Box
			  xcss={styles.root}
			  backgroundColor="color.background.accent.lime.subtlest" />"
		`);
		});

		it('should replace two xcss objects with one cssMap', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";
const styles = xcss({
borderRadius: "radius.xsmall",
color: "red",
});

const disabledStyles = xcss({
color: "color.text.disabled",
cursor: "not-allowed",
});

export default ({ disabled }) => <Box xcss={[styles, disabled && disabledStyles]} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			  root: {
			  borderRadius: token("radius.xsmall"),
			  color: "red",
			  },

			  disabled: {
			  color: token("color.text.disabled"),
			  cursor: "not-allowed",
			  }
			});

			export default ({ disabled }) => <Box xcss={[styles.root, disabled && styles.disabled]} />"
		`);
		});

		it('should replace xcss with cssMap with multiple components', async () => {
			const input = `import { Stack, Inline, xcss } from "@atlaskit/primitives";

const innerStyles = xcss({
font: "font.body.small",
marginBlock: "space.200",
});

const containerStyles = xcss({
padding: "space.050",
display: "flex",
});

const MyComponent = () => <Stack xcss={containerStyles}><Inline xcss={innerStyles} /></Stack>`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Inline, Stack } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

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

			const MyComponent = () => <Stack xcss={styles.container}><Inline xcss={styles.inner} /></Stack>"
		`);
		});

		it('should replace xcss containing nested selector with a cssMap', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
color: "color.text",
zIndex: "layer",
':hover': {
	transform: 'scale(1)',
	},
});

const MyComponent = () => <Box xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			    root: {
			    color: token("color.text"),
			    zIndex: 400,
			    "&:hover": {
			        transform: 'scale(1)',
			        },
			    }
			});

			const MyComponent = () => <Box xcss={styles.root} />"
		`);
		});

		it('should replace xcss containing media query with a cssMap', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";

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

const MyComponent = () => <Box xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

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

			const MyComponent = () => <Box xcss={styles.root} />"
		`);
		});

		it('should move cssMap declarations up after variable declarations to ensure they are declared before use', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";

const opacityVar = "0.5";

const MyComponent = () => <Box xcss={styles} />;

const styles = xcss({
	color: "color.text",
	backgroundColor: "color.background.accent.lime.subtlest",
	opacity: \`\${opacityVar}\`,
});

export default MyComponent;`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const opacityVar = "0.5";

			const styles = cssMap({
			    root: {
			        color: token("color.text"),
			        opacity: \`\${opacityVar}\`
			    }
			});

			const MyComponent = () => <Box
			    xcss={styles.root}
			    backgroundColor="color.background.accent.lime.subtlest" />;

			export default MyComponent;"
		`);
		});

		it('should place cssMap before component declarations that use the styles', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
	color: "color.text",
	backgroundColor: "color.background.accent.lime.subtlest",
});

const BackToTop = () => <Box xcss={styles} />;

export default BackToTop;`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			    root: {
			        color: token("color.text")
			    }
			});

			const BackToTop = () => <Box
			    xcss={styles.root}
			    backgroundColor="color.background.accent.lime.subtlest" />;

			export default BackToTop;"
		`);
		});

		it('should move backgroundColor from cssMap to Box props when used on Box component', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
	color: "color.text",
	backgroundColor: "color.background.discovery",
	padding: "space.200",
});

const MyComponent = () => <Box xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			    root: {
			        color: token("color.text"),
			        padding: token("space.200")
			    }
			});

			const MyComponent = () => <Box xcss={styles.root} backgroundColor="color.background.discovery" />"
		`);
		});

		it('should not move backgroundColor from cssMap when used on non-Box components', async () => {
			const input = `import { Stack, xcss } from "@atlaskit/primitives";

const styles = xcss({
	color: "color.text",
	backgroundColor: "color.background.discovery",
	padding: "space.200",
});

const MyComponent = () => <Stack xcss={styles} />`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Stack } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			    root: {
			        color: token("color.text"),
			        backgroundColor: token("color.background.discovery"),
			        padding: token("space.200"),
			    }
			});

			const MyComponent = () => <Stack xcss={styles.root} />"
		`);
		});

		it('should handle multiple Box components with different backgroundColors', async () => {
			const input = `import { Box, xcss } from "@atlaskit/primitives";

const styles = xcss({
	color: "color.text",
	backgroundColor: "color.background.discovery",
	padding: "space.200",
});

const otherStyles = xcss({
	color: "color.text",
	backgroundColor: "color.background.success",
	padding: "space.200",
});

const MyComponent = () => (
	<>
		<Box xcss={styles} />
		<Box xcss={otherStyles} />
	</>
);`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			    root: {
			        color: token("color.text"),
			        padding: token("space.200")
			    },

			    other: {
			        color: token("color.text"),
			        padding: token("space.200")
			    }
			});

			const MyComponent = () => (
				<>
					<Box xcss={styles.root} backgroundColor="color.background.discovery" />
					<Box xcss={styles.other} backgroundColor="color.background.success" />
				</>
			);"
		`);
		});
	});

	describe('file transformations', () => {
		it('should codemod the entire file', async () => {
			const input = `import React, { type ReactNode } from 'react';

import { Anchor, xcss } from '@atlaskit/primitives';

const cardStyles = xcss({
	display: 'block',
	textDecoration: 'none',
	height: '100%',
	borderRadius: 'radius.small',
	transition: 'box-shadow 200ms',
	color: 'color.text.subtlest',

	':hover': {
		color: 'color.text.subtlest',
		textDecoration: 'none',
	},
});

const normalCardStyles = xcss({
	backgroundColor: 'elevation.surface.raised',
	boxShadow: 'elevation.shadow.raised',

	':hover': {
		boxShadow: 'elevation.shadow.overlay',
	},
});

const invertedCardStyles = xcss({
	backgroundColor: 'elevation.surface.sunken',
});

interface CardLinkProps {
to: string;
children: ReactNode;
variant?: 'normal' | 'inverted';
}

const CardLink = ({ to, children, variant = 'normal' }: CardLinkProps) => {
	return (
		<Anchor
			xcss={[
				cardStyles,
				variant === 'normal' && normalCardStyles,
				variant === 'inverted' && invertedCardStyles,
			]}
			href={to}
		>
			{children}
		</Anchor>
	);
};

export default CardLink;`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { type ReactNode } from 'react';

			import { Anchor } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			    card: {
			        display: 'block',
			        textDecoration: 'none',
			        height: "100%",
			        borderRadius: token("radius.small"),
			        transition: 'box-shadow 200ms',
			        color: token("color.text.subtlest"),

			        "&:hover": {
			            color: token("color.text.subtlest"),
			            textDecoration: 'none',
			        },
			    },

			    normalCard: {
			        backgroundColor: token("elevation.surface.raised"),
			        boxShadow: token("elevation.shadow.raised"),

			        "&:hover": {
			            boxShadow: token("elevation.shadow.overlay"),
			        },
			    },

			    invertedCard: {
			        backgroundColor: token("elevation.surface.sunken"),
			    }
			});

			interface CardLinkProps {
			to: string;
			children: ReactNode;
			variant?: 'normal' | 'inverted';
			}

			const CardLink = ({ to, children, variant = 'normal' }: CardLinkProps) => {
				return (
			        <Anchor
						xcss={[
							styles.card,
							variant === 'normal' && styles.normalCard,
							variant === 'inverted' && styles.invertedCard,
						]}
						href={to}
					>
			            {children}
			        </Anchor>
			    );
			};

			export default CardLink;"
		`);
		});

		it('should transform whole file without throwing errors', async () => {
			const input = `import React from 'react';

import Anchor from '@atlaskit/primitives/anchor';
import { Box, xcss, Text } from '@atlaskit/primitives';
import { media } from '@atlaskit/primitives/responsive';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import VisuallyHidden from '@atlaskit/visually-hidden';

import ThemedImg from '../themed-img';

const cardStyles = xcss({
	gridColumn: 'span 12',
	[media.above.xs]: {
		gridColumn: 'span 6',
	},
	textDecoration: 'none',
	display: 'block',
	backgroundColor: 'color.background.neutral',

	':hover': {
		backgroundColor: 'color.background.neutral.hovered',
		textDecoration: 'none',
	},
	':active': {
		backgroundColor: 'color.background.neutral.pressed',
	},
});

const headerStyles = xcss({
	paddingBlock: 'space.250',
	paddingInline: 'space.200',
	backgroundColor: 'color.background.neutral',
	overflow: 'hidden',
	color: 'color.text',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	lineHeight: '20px',
	borderStartStartRadius: 'radius.small',
	borderStartEndRadius: 'radius.small',
});

const contentStyles = xcss({
	padding: 'space.200',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	transition: 'background-color 0.2s ease-in',
	borderEndStartRadius: 'radius.small',
	borderEndEndRadius: 'radius.small',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		maxHeight: '70px',
		maxWidth: '75%',
	},

	[media.above.xs]: {
		height: '11rem',

		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		img: {
			maxHeight: '100%',
			maxWidth: '100%',
		},
	},
});

interface AssetCardProps {
title: string;
link: string;
fileSize: number;
thumbnail: { light: string; dark: string };
}

const AssetCard = ({ title, link, fileSize, thumbnail }: AssetCardProps) => {
const KB = fileSize / 1024;
const titleWithFileSize = \`\${title} (\${(KB > 1000 ? KB / 1024 : KB).toFixed(2)}KB)\`;

return (
<Anchor xcss={cardStyles} href={link}>
<VisuallyHidden>Download \${titleWithFileSize}</VisuallyHidden>
<Box xcss={headerStyles}>
<Text maxLines={1}>\${titleWithFileSize}</Text>
<DownloadIcon label="" size="medium" />
</Box>
<Box xcss={contentStyles}>
<ThemedImg
src={{
light: thumbnail.light,
dark: thumbnail.dark,
}}
alt=""
/>
</Box>
</Anchor>
);
};

export default AssetCard;`;

			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import DownloadIcon from '@atlaskit/icon/glyph/download';
			import VisuallyHidden from '@atlaskit/visually-hidden';

			import ThemedImg from '../themed-img';

			import { Anchor, Box, Text, media } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			    card: {
			        gridColumn: 'span 12',
			        [media.above.xs]: {
			            gridColumn: 'span 6',
			        },
			        textDecoration: 'none',
			        display: 'block',
			        backgroundColor: token("color.background.neutral"),

			        "&:hover": {
			            backgroundColor: token("color.background.neutral.hovered"),
			            textDecoration: 'none',
			        },
			        "&:active": {
			            backgroundColor: token("color.background.neutral.pressed"),
			        },
			    },

			    header: {
			        paddingBlock: token("space.250"),
			        paddingInline: token("space.200"),
			        overflow: 'hidden',
			        color: token("color.text"),
			        display: 'flex',
			        alignItems: 'center',
			        justifyContent: 'space-between',
			        lineHeight: '20px',
			        borderStartStartRadius: token("radius.small"),
			        borderStartEndRadius: token("radius.small")
			    },

			    content: {
			        padding: token("space.200"),
			        display: 'flex',
			        justifyContent: 'center',
			        alignItems: 'center',
			        transition: 'background-color 0.2s ease-in',
			        borderEndStartRadius: token("radius.small"),
			        borderEndEndRadius: token("radius.small"),
			        // eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			        img: {
			            maxHeight: '70px',
			            maxWidth: '75%',
			        },

			        [media.above.xs]: {
			            height: '11rem',

			            // @ts-expect-error
			            // eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			            img: {
			                maxHeight: "100%",
			                maxWidth: "100%",
			            },
			        },
			    }
			});

			interface AssetCardProps {
			title: string;
			link: string;
			fileSize: number;
			thumbnail: { light: string; dark: string };
			}

			const AssetCard = ({ title, link, fileSize, thumbnail }: AssetCardProps) => {
			const KB = fileSize / 1024;
			const titleWithFileSize = \`\${title} (\${(KB > 1000 ? KB / 1024 : KB).toFixed(2)}KB)\`;

			return (
			    <Anchor xcss={styles.card} href={link}>
			        <VisuallyHidden>Download \${titleWithFileSize}</VisuallyHidden>
			        <Box xcss={styles.header} backgroundColor="color.background.neutral">
			        <Text maxLines={1}>\${titleWithFileSize}</Text>
			        <DownloadIcon label="" size="medium" />
			        </Box>
			        <Box xcss={styles.content}>
			        <ThemedImg
			        src={{
			        light: thumbnail.light,
			        dark: thumbnail.dark,
			        }}
			        alt=""
			        />
			        </Box>
			    </Anchor>
			);
			};

			export default AssetCard;"
		`);
		});
	});

	describe('inline xcss transformations', () => {
		it('should transform the primitive with inline xcss', async () => {
			const input = `
			import { Stack, xcss } from '@atlaskit/primitives';

			const MyComponent = () => <Stack xcss={xcss({
				borderColor: 'color.border',
		    })} />
			`;
			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Stack } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const stackStyles = cssMap({
			    root: {
			        borderColor: token("color.border"),
			    }
			});

			const MyComponent = () => <Stack xcss={stackStyles.root} />"
		`);
		});

		it('should transform multiple primitives with inline xcss', async () => {
			const input = `
			import { Stack, xcss, Box } from '@atlaskit/primitives';

			const MyComponent = () =>
			<div>
				<Stack xcss={xcss({
					borderColor: 'color.border.input',
		    	})} />
				<Box xcss={xcss({
					borderColor: 'color.border',
		    	})} />
			</div>
			`;
			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box, Stack } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const stackStyles = cssMap({
			    root: {
			        borderColor: token("color.border.input"),
			    }
			});

			const boxStyles = cssMap({
			    root: {
			        borderColor: token("color.border"),
			    }
			});

			const MyComponent = () =>
			<div>
			    <Stack xcss={stackStyles.root} />
			    <Box xcss={boxStyles.root} />
			</div>"
		`);
		});

		it('should transform multiple primitives with inline xcss and primitive with variable', async () => {
			const input = `
			import { Stack, xcss, Box, Inline } from '@atlaskit/primitives';

			const inlineStyles = xcss({
				color: 'color.text',
			});

			const MyComponent = () =>
			<div>
				<Stack xcss={xcss({
					borderColor: 'color.border.input',
		    	})} />
				<Box xcss={xcss({
					borderColor: 'color.border',
		    	})} />
				<Inline xcss={inlineStyles} />
			</div>
			`;
			const result = await applyTransform(transform, input);
			expect(result).toMatchInlineSnapshot(`
			"/**
			 * @jsxRuntime classic
			 * @jsx jsx
			 */
			import { Box, Inline, Stack } from "@atlaskit/primitives/compiled";
			import { cssMap, jsx } from "@atlaskit/css";
			import { token } from "@atlaskit/tokens";

			const styles = cssMap({
			    inline: {
			        color: token("color.text"),
			    }
			});

			const stackStyles = cssMap({
			    root: {
			        borderColor: token("color.border.input"),
			    }
			});

			const boxStyles = cssMap({
			    root: {
			        borderColor: token("color.border"),
			    }
			});

			const MyComponent = () =>
			<div>
			    <Stack xcss={stackStyles.root} />
			    <Box xcss={boxStyles.root} />
			    <Inline xcss={styles.inline} />
			</div>"
		`);
		});
	});
});
