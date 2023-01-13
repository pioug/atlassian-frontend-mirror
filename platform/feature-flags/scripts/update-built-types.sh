#!/bin/sh

# overwrite built d.ts with new types.ts if it exists
if [[ -f "dist/types/types.d.ts" ]]; then
    cp src/types.ts dist/types/types.d.ts
fi
