---
name: siyuan-skill
description: 'Operate SiYuan Note CLI (siyuan) to manage workspaces, notebooks, documents, blocks, SQL queries, search, export/import, assets, attributes, bookmarks, tags, history, refs, repo snapshots, sync, serve, database attribute views, templates, outlines, and system info. Use this skill when the user mentions SiYuan, 思源笔记, or asks to query/manipulate SiYuan data via CLI. The skill enforces the correct workflow: discover workspaces first, then target a specific workspace for all subsequent commands.'
---

# SiYuan Note CLI Skill

## Overview

SiYuan Note provides a CLI (`siyuan`) to manage workspaces, notebooks, documents, blocks, and more.
The binary must be available on `PATH` (verify with `siyuan --version`).

> **CLI Version:** v3.8.10. Commands shown below reflect this version.

> **Note:** If `siyuan` is not found on `PATH`, try `SiYuan-Kernel` as the alternative command name.

## Workflow

Follow this sequence for workspace operations. For a request only to list system fonts, run `siyuan system fonts [--lang <lang>]` without opening or selecting a workspace; it outputs JSON.

### 1. Discover Available Workspaces

Run `siyuan workspace list` (no `-w` flag needed) to obtain the list of registered workspaces.
If the user has not specified a workspace, present the list and ask them to choose.

```
siyuan workspace list
siyuan workspace info          # show current default workspace
```

### 2. Lock in the Workspace Path

After the user selects a workspace (or provides a path directly), store the workspace path and use it
as the `-w` argument for **all subsequent commands** (except `workspace` subcommands).

### 3. Execute the Requested Command

Construct and run the target command with `-w <workspace-path>` appended (except `workspace` subcommand).
Use `-f json` for programmatic output when parsing results.

If a command fails, check: (1) workspace path is valid, (2) required flags like `--id` are provided, (3) the subcommand exists in the installed CLI version.

## Common Patterns

### Obtaining Block/Document IDs

Many commands require a block or document ID (`--id`). Obtain IDs via:
- `siyuan sql "SELECT id, content FROM blocks WHERE type='d'" -w <path> -f json` — list document IDs
- `siyuan document list --notebook <id> -w <path> -f json` — list documents in a notebook
- `siyuan search <keyword> -w <path> -f json` — search and get IDs from results

### Destructive Operations — Verify, Preview, Confirm

Treat deletion/cleanup (`remove`, `delete`, `clean`, `clear`, `purge`), rollback (`history rollback`, `repo checkout`, `repo file rollback`), and replacement/overwrite operations (e.g. `import data`, overwriting an existing file with `file write`, or template commands with `--overwrite`) as destructive operations.

1. Verify the workspace, target IDs/paths, and affected scope using read-only commands. Check whether child documents, related data, or existing content will also be affected; do not infer scope from the command name alone.
2. Run the intended command with `--dry-run` first and inspect its output:
   ```bash
   siyuan notebook remove --id <id> --dry-run -w <path>
   ```
   A successful dry run is not user approval or proof that all affected data was listed. If it only validates arguments or gives a generic preview, use read-only inspection to establish the scope. If the dry run fails or the effects cannot be established, stop and explain the limitation; do not retry without `--dry-run` to bypass it.
3. If the user's authorization or the affected scope is unclear, or the preview reveals effects beyond the request, summarize the workspace, targets, and consequences and ask for explicit confirmation before proceeding. Do not guess targets or silently expand the scope.
4. Once the scope is verified and authorized, create a recovery snapshot in the target workspace before executing the destructive operation:
   ```bash
   siyuan repo create --memo "Before <brief description of destructive operation>" -w <path>
   ```
   Verify that snapshot creation succeeded. If it fails, stop and report the error; do not proceed with the destructive operation. A session-end snapshot of the modified state does not replace this pre-operation recovery point.
5. Execute without `--dry-run` only when the verified effects match the user's request or explicit confirmation, keeping the same workspace, targets, and options. If any of these change, repeat verification, preview, and the pre-operation snapshot.

### JSON Output Parsing

Use `-f json` for programmatic parsing. The JSON structure depends on the subcommand: `workspace list` returns an array, while `workspace info` returns an object. Inspect the command's output structure before filtering with `jq` or similar tools; do not assume every result is an array.

### Workspace Lock Errors

If a command exits with code 24 and reports `lock workspace [...] failed`, the workspace is already in use by another SiYuan process (e.g., the desktop app). Either close the other process or target a different workspace.

### Snapshot After Write Operations

Track actual data changes separately for each workspace during the conversation, including partial changes left by failed commands. Snapshot creation itself does not count as a new data change requiring another snapshot.

Before finishing the task or ending the session, summarize the changes and create a data snapshot in **each modified workspace**, using that workspace's path and its own change summary:
```bash
siyuan repo create --memo "<brief summary of changes in this workspace>" -w <modified-workspace-path>
```
The `--memo` should concisely describe what was created/modified/deleted (e.g. `"Created 3 docs in /Projects, updated README, removed obsolete notes"`). Verify success for each workspace; if a snapshot fails, report the affected workspace and error rather than claiming it was saved. Skip workspaces with no data changes; a read-only session requires no snapshots.

These snapshots preserve the post-change state. They do not replace the pre-operation recovery snapshots required for destructive operations.

## Domain Concepts

Understanding these SiYuan-specific concepts is essential for correct CLI usage:

### Block — The Fundamental Unit
Everything is a block with a unique ID. A document is a document block (type `d`, i.e. NodeDocument) that serves as the root; content blocks (headings, paragraphs, lists, code, tables) form a tree beneath it.

**Container blocks** (can hold child blocks, valid as `--parent`): document, blockquote, list, list-item, super-block, callout, tabs, tab-item.
**Leaf blocks** (cannot hold children, invalid as `--parent`): heading, paragraph, code-block, math-block, table, HTML-block, thematic-break, video, audio, widget, iframe, attribute-view, block-query-embed.

> `tabs`/`tab-item` are the block types introduced for tabbed containers; they appear in the `search -t` type filter list as `tabs` and `tabItem`.

### Heading Hierarchy — Use `--previous`, Not `--parent`
Headings (h1-h6) are **leaf blocks**. Blocks that appear "under" a heading in the UI are its *following siblings* in the AST, not its children. To insert a block below a heading, pass the heading's ID (or the ID of the last block currently below it) as `--previous`, **not** as `--parent`:
```
siyuan block insert --parent <docID> --previous <headingID> --data "text" -w <path>
```

### Nested Lists — list-item Cannot Directly Hold list-item
A list-item cannot directly contain another list-item. To nest lists, create a list (NodeList) as a child of the outer list-item, then add list-items to that inner list. The parent of a list-item must always be a list.

### hPath — Human-Readable Path
An hPath is the **title-based path** shown in the document tree (e.g. `/Diary/2024/June`). Renaming a document changes its hPath but not its ID.

- `document list` and `document move`: `--hpath` accepts a title-based path; `--path` accepts an internal ID-based path (default: `/`). These flags are not interchangeable.
- `document create`: `--path` specifies the parent document path (default: `/`); this command does not provide `--hpath`. Check `siyuan document create --help` for the installed version rather than assuming it shares the path flags of `list`/`move`.

### block update — Replace, Not Append
`block update` replaces **ONE** block's entire content with new markdown. It does NOT create or append new blocks. To both modify existing content and add new content, call `block update` first, then `block append`/`prepend`/`insert` as separate calls. Pass `--lock-type` to reject the update when the parsed block type of the new content differs from the existing block's type.

### document move vs block move
`document move` relocates an entire document (and all its children) to the target notebook and parent path, using `--hpath` for a title-based path or `--path` for an internal path. `block move` repositions a single content block under a new parent block.

### Daily Note — When to Use dailynote vs document
A daily note is a special document on the notebook's daily-note save path. For diary/journal/daily-note requests, use `dailynote create` (not `document create`) to open today's note, then `dailynote append`/`prepend` to add content.

### Notebook Icon vs Document Icon
`attr set` changes a document **block's** icon — it cannot set a **notebook's** icon. For notebooks use `notebook set-icon` (specific emoji) or `notebook random-icon` (random emoji).

## Global Flags

These flags are available on every subcommand:

| Flag | Description |
|------|-------------|
| `-w, --workspace <path>` | Workspace path (not needed for `workspace` or `system fonts`; optional for `serve`, which defaults to the default workspace). |
| `-f, --format <table\|json>` | Output format (default: `table`) |
| `-v, --log-level <string>` | Log level: off, trace, debug, info, warn, error, fatal (defaults to conf.json system.logLevel) |
| `--dry-run` | Validate and print what would happen without making changes |
| `--home-dir <path>` | Base directory for user configuration (defaults to the system user home) |

> **Note:** All flags except `-w` (or `--workspace`) are optional. The CLI will use default values if optional flags are not specified.

## Subcommand Reference

> **For detailed flags and examples of each command, load `references/commands.md`.**

| Command | Subcommands |
|---------|-------------|
| `siyuan workspace` | `list`, `info` |
| `siyuan notebook` | `list`, `create`, `open`, `close`, `rename`, `remove`, `set-icon`, `random-icon` |
| `siyuan document` | `list`, `get`/`info`, `create`, `rename`, `move`, `duplicate`, `remove`, `search` |
| `siyuan block` | `get`, `children`, `insert`, `append`, `prepend`, `update`, `delete`, `move`, `stat`, `dom`, `kramdown`, `breadcrumb`, `batch-get`, `batch-kramdown` |
| `siyuan sql "<stmt>"` | (direct) |
| `siyuan search <query>` | (direct, with flags) |
| `siyuan export` | `md`, `html`, `docx`, `sy`, `md-zip`, `preview`, `data` |
| `siyuan import` | `md`, `sy`, `data` |
| `siyuan dailynote` | `create`, `append`, `prepend` |
| `siyuan asset` | `unused`, `clean`, `stat`, `upload` |
| `siyuan attr` | `get`, `set`, `batch-get` |
| `siyuan bookmark` | `list`, `labels`, `rename`, `remove` |
| `siyuan tag` | `list`, `rename`, `remove` |
| `siyuan history` | `list`, `get`, `search`, `rollback`, `clear` |
| `siyuan ref` | `backlinks`, `mentions`, `refresh` |
| `siyuan repo` | `list`, `create`, `diff`, `checkout`, `tag`, `untag`, `purge`, `search`, `file` |
| `siyuan sync` | `pull`, `push`, `status` |
| `siyuan database` | `search`, `get`, `keys`, `render`, `unused`, `clean`, `key`, `item` |
| `siyuan file` | `list`, `read`, `write`, `copy`, `rename`, `delete`, `find`, `grep`, `stat` |
| `siyuan inbox` | `list`, `get`, `convert` |
| `siyuan outline` | `get` |
| `siyuan template` | `search`, `get`, `create`, `save-as`, `render`, `remove` |
| `siyuan system` | `current-time`, `fonts` |
| `siyuan serve` | (direct, with flags) |
| `siyuan completion` | `bash`, `fish`, `powershell`, `zsh` |

> **Note:** `serve` accepts all global flags plus its own flags (`--accessAuthCode`, `--attach-ui`, `--enable-pprof`, `--fixed-port`, `--lang`, `--mode`, `--port`, `--readonly`, `--ssl`, `--safe-mode`, `--wd`). It does not require `-w`; see `references/commands.md` for the full flag list.
