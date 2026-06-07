#!/usr/bin/env python3
"""
Offline build script: generate `first_token_to_words.json`.

This is a ONE-TIME / build-time tool. It is never imported by the plugin and
never runs in CI. It reproduces the prefix-expansion map that the BE sidecar
builds in-memory at runtime (`cc-smarts/python-sidecar/src/causal_lm_encoder.py`
`CausalLMEncoder._ensure_loaded`), so the local (client-only) slow-lane client
can ship it as a static artifact instead of running a tokenizer in the browser.

The output maps each SmolLM2 first-token id to every L2/L3 vocabulary word whose
space-prefixed encoding starts with that token. The local client loads it and,
per inference, spreads the next-token logit mass over whole words (masked softmax
+ prefix expansion) to match the BE's whole-word `lm_logits` payload.

Three details MUST match the BE exactly, or the map is silently wrong:
  1. Tokenizer = HuggingFaceTB/SmolLM2-135M (base; vocab identical to Instruct).
  2. Leading space: encode(" " + word) — BPE tokenizes " word" != "word".
  3. add_special_tokens=False — no BOS/EOS, we want the word's own first token.

Usage:
    pip install transformers      # torch NOT required (SmolLM2 uses a fast tokenizer)
    python scripts/gen_first_token_to_words.py

Run it from anywhere — paths are resolved relative to this file's location.
"""

import os
import json
import collections

from transformers import AutoTokenizer

# Ground truth: must match the BE tokenizer (causal_lm_encoder.py line 30).
TOKENIZER_NAME = "HuggingFaceTB/SmolLM2-135M"

# Resolve data paths relative to this script, so cwd does not matter.
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
_DATA_DIR = os.path.join(_SCRIPT_DIR, "..", "src", "pm-plugins", "data")
L2_PATH = os.path.join(_DATA_DIR, "vocabulary_10k.json")
L3_PATH = os.path.join(_DATA_DIR, "l3_vocabulary.json")
OUT_PATH = os.path.join(_DATA_DIR, "first_token_to_words.json")

# Probe words for the post-build sanity check.
# Must be words that actually appear in vocabulary_10k.json (L2) or l3_vocabulary.json (L3).
# Common stop words like "the" / "a" are NOT in either vocabulary by design.
# L2 confirmed: "atlassian", "service", "product", "customer" (vocabulary_10k.json lines 3-18)
# L3 confirmed: "about", "search", "information", "business"  (l3_vocabulary.json lines 2-15)
_PROBE_WORDS = ["atlassian", "service", "product", "about", "search"]


def load_l2_words(path):
    """
    Load the L2 (Atlassian-domain) vocabulary as a set of words.

    The file shape is {"words": {"<word>": {freq, ...}}}, matching the BE's
    `vocab_data.get("words", {})`. Only the keys are needed.

    :params:
        path: Absolute path to vocabulary_10k.json
    :returns:
        A set of L2 word strings
    """
    with open(path, "r") as f:
        data = json.load(f)
    return set(data["words"].keys())


def load_l3_words(path):
    """
    Load the L3 (general English) vocabulary as a list of words.

    The file shape is a flat JSON array of strings, matching the BE's L3 list.

    :params:
        path: Absolute path to l3_vocabulary.json
    :returns:
        A list of L3 word strings
    """
    with open(path, "r") as f:
        return json.load(f)


def build_first_token_map(tokenizer, words):
    """
    Build the first-token-id -> [words] prefix-expansion map.

    Mirrors the BE loop exactly: each word is encoded with a leading space and
    no special tokens, and the word is bucketed under its first token id. A set
    of words is expected so each word is processed once (L2/L3 overlap removed).

    :params:
        tokenizer: A HuggingFace tokenizer for SmolLM2
        words: An iterable of unique words (L2 union L3)
    :returns:
        A dict mapping int first-token-id to a list of word strings
    """
    table = collections.defaultdict(list)
    for word in words:
        ids = tokenizer.encode(" " + word, add_special_tokens=False)
        if ids:
            table[ids[0]].append(word)
    return table


def verify_map(tokenizer, table, probe_words):
    """
    Sanity-check the generated map by confirming probe words land in the right
    first-token bucket.

    :params:
        tokenizer: The same SmolLM2 tokenizer used to build the map
        table: The dict mapping int first-token-id to a list of words
        probe_words: A list of words expected to be present in the map
    :returns:
        None. Raises AssertionError if any probe word is missing or misplaced.
    """
    for word in probe_words:
        ids = tokenizer.encode(" " + word, add_special_tokens=False)
        assert ids, f"Probe word '{word}' produced no tokens"
        first_token_id = ids[0]
        bucket = table.get(first_token_id, [])
        assert word in bucket, (
            f"Probe word '{word}' missing under token {first_token_id} "
            f"(bucket head: {bucket[:5]})"
        )
        print(f"  OK: '{word}' -> token {first_token_id} -> {bucket[:5]}...")


def main():
    """
    Generate first_token_to_words.json from the L2 and L3 vocabularies.

    :params:
        None
    :returns:
        None. Writes the JSON artifact to OUT_PATH and prints a summary.
    """
    print(f"[gen] Loading tokenizer: {TOKENIZER_NAME} ...")
    tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_NAME)

    print(f"[gen] Loading vocabularies ...")
    l2_words = load_l2_words(L2_PATH)
    l3_words = load_l3_words(L3_PATH)
    all_words = l2_words.union(l3_words)

    print(f"[gen] Building prefix-expansion map for {len(all_words)} words ...")
    table = build_first_token_map(tokenizer, all_words)

    # JSON object keys must be strings; the FE parses them back with Number(key).
    out = {str(token_id): words for token_id, words in table.items()}
    with open(OUT_PATH, "w") as f:
        json.dump(out, f)

    total_words = sum(len(v) for v in table.values())
    print(
        f"[gen] Mapped {len(all_words)} words ({len(l2_words)} L2) "
        f"-> {len(table)} unique first-tokens ({total_words} word entries)"
    )

    print(f"[gen] Verifying probe words ...")
    verify_map(tokenizer, table, _PROBE_WORDS)

    out_abs = os.path.abspath(OUT_PATH)
    size_kb = os.path.getsize(OUT_PATH) / 1024
    print(f"[gen] Wrote {out_abs} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
