import outdent from 'outdent';
import { typescriptEslintTester } from '../../__tests__/utils/_tester';
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
