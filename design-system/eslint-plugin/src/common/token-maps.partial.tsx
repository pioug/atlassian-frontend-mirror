/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::30c84f908843af1f250860b6f3deeea0>>
 * @codegenId spacing
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen-token-maps
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::55622b91aca9b3afac4bce440f222b71>>
 */
export const positiveSpaceMap = {
    '0px': 'space.0',
    '2px': 'space.025',
    '4px': 'space.050',
    '6px': 'space.075',
    '8px': 'space.100',
    '12px': 'space.150',
    '16px': 'space.200',
    '20px': 'space.250',
    '24px': 'space.300',
    '32px': 'space.400',
    '40px': 'space.500',
    '48px': 'space.600',
    '64px': 'space.800',
    '80px': 'space.1000',
};
export type Space = keyof typeof positiveSpaceMap;

export const negativeSpaceMap = {
    '-2px': 'space.negative.025',
    '-4px': 'space.negative.050',
    '-6px': 'space.negative.075',
    '-8px': 'space.negative.100',
    '-12px': 'space.negative.150',
    '-16px': 'space.negative.200',
    '-20px': 'space.negative.250',
    '-24px': 'space.negative.300',
    '-32px': 'space.negative.400',
};
export type NegativeSpace = keyof typeof negativeSpaceMap;

export const allSpaceMap = { ...positiveSpaceMap, ...negativeSpaceMap };

export type AllSpace = keyof typeof allSpaceMap;

/**
 * @codegenEnd
 */
