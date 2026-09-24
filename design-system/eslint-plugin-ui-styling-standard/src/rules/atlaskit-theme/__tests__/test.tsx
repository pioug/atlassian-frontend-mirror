import outdent from 'outdent';

import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
import rule from '../index';

const valid = [
	{
		name: 'Valid typography use in styled-components',
		code: outdent`
            import styled from 'styled-components';
            import { typography } from '@atlaskit/theme';
            export const HeadingComponent = styled.h2\`
                \${typography.h200()};
            \`;
        `,
	},
	{
		name: 'Valid typography use in compiled (fontFallback)',
		code: outdent`
        import { styled } from '@compiled/react';
        import { fontFallback } from '@atlaskit/theme/typography';
        import { token } from '@atlaskit/tokens';
        export const HeadingComponent = styled.h2\`
            font: \${token('font.body', fontFallback.body.medium)}
        \`;
    `,
	},
	{
		name: 'Valid elevation use in styled-components',
		code: outdent`
            import styled from 'styled-components';
            import { elevation } from '@atlaskit/theme';
            export const HeadingComponent = styled.h2\`
                \${elevation.e100};
            \`;
        `,
	},
	{
		name: 'Valid skeleton shimmer use in styled-components',
		code: outdent`
            import styled from 'styled-components';
            import { skeletonShimmer } from '@atlaskit/theme/constants';

            export const SkeletonShimmerComponent = styled.div\`
                \${skeletonShimmer};
            \`
        `,
	},
	{
		name: 'Valid layers use in compiled',
		code: outdent`
            import { css } from '@compiled/react';
            import { layers } from '@atlaskit/theme/constants';

            css({ zIndex: layers.card() });
        `,
	},
	{
		name: 'Valid namespace theme use in compiled',
		code: outdent`
            import { css } from '@compiled/react';
            import * as theme from '@atlaskit/theme';

            css(theme.typography.h700());
        `,
	},
	{
		name: 'Valid typography use outside a compiled call',
		code: outdent`
            import { css } from '@compiled/react';
            import { typography } from '@atlaskit/theme';

            const styles = typography.h700();
            css({});
        `,
	},
];

const typography = [
	{
		name: 'Invalid typography use in compiled with template expression',
		code: outdent`
        import { styled } from '@compiled/react';
        import { typography } from '@atlaskit/theme';

        export const HeadingComponent = styled.h2\`
            \${typography.h200()};
        \`;
    `,
		errors: [{ messageId: 'usingTypography' }],
	},
	{
		name: 'Invalid typography use in compiled with function call',
		code: outdent`
        import { styled } from '@compiled/react';
        import { typography } from '@atlaskit/theme';

        export const HeadingComponent = styled.h2(typography.h200());
    `,
		errors: [{ messageId: 'usingTypography' }],
	},
	{
		name: 'Invalid aliased typography use in compiled',
		code: outdent`
            import { css } from '@compiled/react';
            import { typography as type } from '@atlaskit/theme';

            css(type.h700());
        `,
		errors: [{ messageId: 'usingTypography' }],
	},
	{
		name: 'Invalid typography subpath import in compiled',
		code: outdent`
            import { css } from '@compiled/react';
            import { h200 } from '@atlaskit/theme/typography';

            css(h200());
        `,
		errors: [{ messageId: 'usingTypography' }],
	},
	{
		name: 'Invalid typography use alongside a layers import',
		code: outdent`
            import { css } from '@compiled/react';
            import { layers } from '@atlaskit/theme/constants';
            import { typography } from '@atlaskit/theme';

            css({ zIndex: layers.card() });
            css(typography.h700());
        `,
		errors: [{ messageId: 'usingTypography' }],
	},
	{
		name: 'Invalid typography use nested in a compiled style object',
		code: outdent`
            import { css } from '@compiled/react';
            import { typography } from '@atlaskit/theme';

            css({ font: typography.h700() });
        `,
		errors: [{ messageId: 'usingTypography' }],
	},
	{
		name: 'Invalid typography use nested in a call argument',
		code: outdent`
            import { css } from '@compiled/react';
            import { typography } from '@atlaskit/theme';

            css(helper(typography.h700()));
        `,
		errors: [{ messageId: 'usingTypography' }],
	},
	{
		name: 'Invalid typography use alongside fontFallback in one compiled template',
		code: outdent`
            import { styled } from '@compiled/react';
            import { fontFallback, typography } from '@atlaskit/theme/typography';
            import { token } from '@atlaskit/tokens';

            export const HeadingComponent = styled.h2\`
                font: \${token('font.body', fontFallback.body.medium)};
                \${typography.h700()};
            \`;
        `,
		errors: [{ messageId: 'usingTypography' }],
	},
	{
		name: 'Invalid typography use in two compiled calls',
		code: outdent`
            import { css } from '@compiled/react';
            import { typography } from '@atlaskit/theme';

            css(typography.h700());
            css(typography.h800());
        `,
		errors: [{ messageId: 'usingTypography' }, { messageId: 'usingTypography' }],
	},
	{
		name: 'Invalid typography use in a compiled call inside a compiled template',
		code: outdent`
            import { css, styled } from '@compiled/react';
            import { typography } from '@atlaskit/theme';

            export const HeadingComponent = styled.div\`
                \${css(typography.h700())};
            \`;
        `,
		errors: [{ messageId: 'usingTypography' }],
	},
];

const elevation = [
	{
		name: 'Invalid elevation use in compiled with template expression',
		code: outdent`
            import { styled } from '@compiled/react';
            import { elevation } from '@atlaskit/theme';

            export const ElevationComponent = styled.div\`
                \${elevation.e100()};
            \`;
        `,
		errors: [{ messageId: 'usingElevation' }],
	},
	{
		name: 'Invalid elevation use in compiled with function call',
		code: outdent`
            import { styled } from '@compiled/react';
            import { elevation } from '@atlaskit/theme';

            export const ElevationComponent = styled.div(elevation.e100());
        `,
		errors: [{ messageId: 'usingElevation' }],
	},
	{
		name: 'Invalid elevation subpath import in compiled',
		code: outdent`
            import { css } from '@compiled/react';
            import { e100 } from '@atlaskit/theme/elevation';

            css(e100());
        `,
		errors: [{ messageId: 'usingElevation' }],
	},
];

const skeletonShimmer = [
	{
		name: 'Invalid skeleton shimmer use in compiled with template expression',
		code: outdent`
        import { styled } from '@compiled/react';
        import { skeletonShimmer } from '@atlaskit/theme/constants';

        export const SkeletonShimmerComponent = styled.div\`
            \${skeletonShimmer};
        \`;
    `,
		errors: [{ messageId: 'usingSkeletonShimmer' }],
	},
	{
		name: 'Invalid skeleton shimmer use in compiled with function call',
		code: outdent`
        import { styled } from '@compiled/react';
        import { skeletonShimmer } from '@atlaskit/theme/constants';

        export const SkeletonShimmerComponent = styled.div(skeletonShimmer);
    `,
		errors: [{ messageId: 'usingSkeletonShimmer' }],
	},
	{
		name: 'Invalid skeleton shimmer barrel import in compiled',
		code: outdent`
            import { css } from '@compiled/react';
            import { skeletonShimmer } from '@atlaskit/theme';

            css(skeletonShimmer());
        `,
		errors: [{ messageId: 'usingSkeletonShimmer' }],
	},
];

typescriptEslintTester.run(
	'atlaskit-theme',
	// @ts-expect-error
	rule,
	{
		valid,
		invalid: [...typography, ...elevation, ...skeletonShimmer],
	},
);
