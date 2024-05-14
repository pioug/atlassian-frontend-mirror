import { traverse } from '../traverse/traverse';
import { type ADFEntity, type ADFEntityMark } from '../types';

// This is the set of marks that we wont allow in duplicate to
// exist on a given node, regardless of their attributes. We do
// not include annotations here, because we do allow duplicate
// annotations as long as they have unique id attributes (valid scenario)
const markDuplicatesDisallowed = new Set([
  'strong',
  'underline',
  'textColor',
  'link',
  'em',
  'subsup',
  'strike',
  'backgroundColor',
]);

const maybeHasDisallowedDuplicateMarks = (node: ADFEntity): boolean => {
  const markTypes = node.marks
    ?.map((mark) => mark.type)
    ?.filter(
      (markType) =>
        // For annotations, we are performing the same cheap check
        // for duplicates by type, without considering IDs, to quickly determine
        // whether there may be potential deduping targets.
        // In the actual deduping logic in maybeRemoveDisallowedDuplicateMarks,
        // we correctly/safely dedupe annotations by their unique IDs.
        markDuplicatesDisallowed.has(markType) || markType === 'annotation',
    );

  if (!markTypes?.length) {
    return false;
  }

  return new Set(markTypes).size !== markTypes.length;
};

interface MaybeRemoveDisallowedDuplicateMarksResult {
  node?: ADFEntity;
  discardedMarks: ADFEntityMark[];
}

const maybeRemoveDisallowedDuplicateMarks = (
  node: ADFEntity,
): MaybeRemoveDisallowedDuplicateMarksResult => {
  const quota = new Map<string, boolean>();
  const annotationsQuota = new Map<string | undefined, boolean>();
  const discardedMarks: ADFEntityMark[] = [];

  markDuplicatesDisallowed.forEach((mark) => {
    quota.set(mark, false);
  });

  if (!node.marks) {
    return { discardedMarks };
  }

  let dedupedMarks = node.marks.filter((mark) => {
    const markType = mark.type;

    if (markType === 'annotation') {
      const id = mark.attrs?.id;
      if (annotationsQuota.has(id)) {
        discardedMarks.push(mark);
        return false;
      } else {
        annotationsQuota.set(id, true);
        return true;
      }
    }

    if (quota.has(markType)) {
      if (!quota.get(markType)) {
        quota.set(markType, true);
        return true;
      } else {
        discardedMarks.push(mark);
        return false;
      }
    }
    return true;
  });

  return {
    node: {
      ...node,
      marks: dedupedMarks,
    },
    discardedMarks,
  };
};

interface TransformDedupeMarksResult {
  transformedAdf: ADFEntity;
  isTransformed: boolean;
  discardedMarks: ADFEntityMark[];
}

export const transformDedupeMarks = (
  adf: ADFEntity,
): TransformDedupeMarksResult => {
  let isTransformed: boolean = false;
  let discardedMarks: ADFEntityMark[] = [];

  const transformedAdf = traverse(adf, {
    text: (node) => {
      if (maybeHasDisallowedDuplicateMarks(node)) {
        const result = maybeRemoveDisallowedDuplicateMarks(node);
        const resultDiscardedMarks = result.discardedMarks;
        if (resultDiscardedMarks.length) {
          discardedMarks.push(...resultDiscardedMarks);
          isTransformed = true;
          return result.node;
        }
      }
    },
  }) as ADFEntity;

  return {
    transformedAdf,
    isTransformed,
    discardedMarks,
  };
};
