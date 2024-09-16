# Avoid using navigation/visual refresh feature flag functions at module level (feature-flags/no-module-level-eval-nav4)

Disallow usage of navigation/visual refresh feature flag functions in global/module scope. Due to
JFE using SSR, feature flags should not be called/initialised before components have mounted as it
could cause errors.

This is a temporary lint rule cloned from no-module-level-nav4 while we explore pulling these
evaluations inline https://atlassian.slack.com/archives/CFGLH1ZS8/p1726449739284819
