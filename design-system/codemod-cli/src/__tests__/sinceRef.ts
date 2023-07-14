import simpleGit from 'simple-git';
import { getPackagesSinceRef } from '../sinceRef';

jest.mock('simple-git');

const mockDiff = `
diff --git a/package.json b/package.json
index 77aae63a48e..27b8feb2ddf 100644
--- a/package.json
+++ b/package.json
@@ -84,7 +84,7 @@
     "@atlaskit/atlassian-navigation": "^0.10.13",
     "@atlaskit/atlassian-notifications": "^0.1.4",
     "@atlaskit/atlassian-switcher": "^7.1.0",
-    "@atlaskit/avatar": "^17.1.9",
+    "@atlaskit/avatar": "^18.0.0",
     "@atlaskit/avatar-group": "^5.1.1",
-    "@atlaskit/badge": "^13.1.7",
+    "@atlaskit/badge": "^14.0.0",
     "@atlaskit/banner": "^10.1.7",
`;

describe('sinceRef', () => {
  let mockGit: {};
  beforeEach(() => {
    jest.resetAllMocks();
    mockGit = {
      revparse: jest.fn(() => 'abcdef123'),
      diff: jest.fn(() => mockDiff),
    };
    (simpleGit as jest.Mock).mockImplementation(() => mockGit);
  });
  describe('getPackagesSinceRef', () => {
    it('should return packages that have been upgraded since the ref', async () => {
      expect(await getPackagesSinceRef('head')).toEqual([
        {
          name: '@atlaskit/avatar',
          version: '^17.1.9',
        },
        {
          name: '@atlaskit/badge',
          version: '^13.1.7',
        },
      ]);
    });
    it('should throw when an invalid ref is passed', async () => {
      mockGit = {
        ...mockGit,
        revparse: jest.fn(() => {
          throw Error();
        }),
      };
      await expect(
        getPackagesSinceRef('foo'),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Invalid git ref \\"foo\\""`,
      );
    });
    it('should not return packages that have been deleted', async () => {
      mockGit = {
        ...mockGit,
        diff: jest.fn(
          () => `
diff --git a/package.json b/package.json
index 77aae63a48e..27b8feb2ddf 100644
--- a/package.json
+++ b/package.json
@@ -84,7 +84,7 @@
     "@atlaskit/atlassian-navigation": "^0.10.13",
     "@atlaskit/atlassian-notifications": "^0.1.4",
     "@atlaskit/atlassian-switcher": "^7.1.0",
-    "@atlaskit/avatar": "^17.1.9",
     "@atlaskit/avatar-group": "^5.1.1",
-    "@atlaskit/badge": "^13.1.7",
+    "@atlaskit/badge": "^14.0.0",
     "@atlaskit/banner": "^10.1.7",
        `,
        ),
      };
      expect(await getPackagesSinceRef('head')).toEqual([
        {
          name: '@atlaskit/badge',
          version: '^13.1.7',
        },
      ]);
    });
    it('should not return packages that have been added', async () => {
      mockGit = {
        ...mockGit,
        diff: jest.fn(
          () => `
diff --git a/package.json b/package.json
index 77aae63a48e..27b8feb2ddf 100644
--- a/package.json
+++ b/package.json
@@ -84,7 +84,7 @@
     "@atlaskit/atlassian-navigation": "^0.10.13",
     "@atlaskit/atlassian-notifications": "^0.1.4",
     "@atlaskit/atlassian-switcher": "^7.1.0",
+    "@atlaskit/avatar": "^17.1.9",
     "@atlaskit/avatar-group": "^5.1.1",
-    "@atlaskit/badge": "^13.1.7",
+    "@atlaskit/badge": "^14.0.0",
     "@atlaskit/banner": "^10.1.7",
        `,
        ),
      };
      expect(await getPackagesSinceRef('head')).toEqual([
        {
          name: '@atlaskit/badge',
          version: '^13.1.7',
        },
      ]);
    });
    it('should not return packages that are modified in the diff but do not differ in version', async () => {
      mockGit = {
        ...mockGit,
        diff: jest.fn(
          () => `
diff --git a/package.json b/package.json
index 77aae63a48e..27b8feb2ddf 100644
--- a/package.json
+++ b/package.json
@@ -84,7 +84,7 @@
     "@atlaskit/atlassian-navigation": "^0.10.13",
     "@atlaskit/atlassian-notifications": "^0.1.4",
     "@atlaskit/atlassian-switcher": "^7.1.0",
-    "@atlaskit/avatar": "^17.1.9",
+    "@atlaskit/avatar": "^17.1.9",
     "@atlaskit/avatar-group": "^5.1.1",
-    "@atlaskit/badge": "^13.1.7",
+    "@atlaskit/badge": "^14.0.0",
     "@atlaskit/banner": "^10.1.7",
        `,
        ),
      };
      expect(await getPackagesSinceRef('head')).toEqual([
        {
          name: '@atlaskit/badge',
          version: '^13.1.7',
        },
      ]);
    });
  });
});
