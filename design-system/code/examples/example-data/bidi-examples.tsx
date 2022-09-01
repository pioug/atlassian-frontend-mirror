// Examples sourced from
// https://hello.atlassian.net/wiki/spaces/PRODSEC/pages/1347434677/PSHELP-2943+Investigate+Trojan+Source+Attack+Vulnerability#Executive-Summary
// https://asecurityteam.atlassian.net/browse/VULN-601295

export const codeSnippets = {
  stretchedStringC: `
#include <stdio.h>
#include <string.h>

int main() {
    char* access_level = "user";
    if (strcmp(access_level, "user‮ ⁦// Check if admin ⁩ ⁦")) {
        printf("You are an admin.\n");
    }
    return 0;
}`,
  renderedConditionalJs: `
#!/usr/bin/env node

var isAdmin = false;
/*‮ } ⁦if (isAdmin)⁩ ⁦ begin admins only */
    console.log("You are an admin.");
/* end admins only ‮ { ⁦*/`,

  renderedConditional2JsSingleLine: `if (level != "user‮ ⁦// Check if admin⁩ ⁦") {`,
  renderedConditional2Js: `
#!/usr/bin/env node

var level = "user";
if (level != "user‮ ⁦// Check if admin ⁩ ⁦") {
    console.log("You are an admin.");
}`,
  commentingOutC: `
#include <stdio.h>
#include <stdbool.h>

int main() {
    bool isAdmin = false;
    /*‮ } ⁦ if (isAdmin)⁩ ⁦ begin admins only */
        printf("You are an admin.\n");
    /* end admins only ‮ { ⁦*/
    return 0;
}`,
};

export const characters = {
  u202e: '‮',
  u2066: '⁦',
  u2069: '⁩',
};
