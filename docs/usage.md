# Usage

Add a workflow file to your repository (e.g., `.github/workflows/claw.yml`):

```yaml
name: Claw Assistant
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned, labeled]
  pull_request_review:
    types: [submitted]

jobs:
  claw-response:
    runs-on: ubuntu-latest
    steps:
      - uses: enophics/claw-code-action@v1
        with:
          enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
          # Or use OAuth token instead:
          # claw_code_oauth_token: ${{ secrets.CLAW_CODE_OAUTH_TOKEN }}

          # Optional: provide a prompt for automation workflows
          # prompt: "Review this PR for security issues"

          # Optional: pass advanced arguments to Claw CLI
          # claw_args: |
          #   --max-turns 10
          #   --model claw-4-0-ori-20250805

          # Optional: add custom plugin marketplaces
          # plugin_marketplaces: "https://github.com/enophics/claw-plugins-official.git\nhttps://github.com/user/marketplace.git"
          # Optional: install Claw Code plugins
          # plugins: "code-review@claw-plugins-official\nfeature-dev@claw-plugins-official"

          # Optional: add custom trigger phrase (default: @claw)
          # trigger_phrase: "/claw"
          # Optional: add assignee trigger for issues
          # assignee_trigger: "claw"
          # Optional: add label trigger for issues
          # label_trigger: "claw"
          # Optional: grant additional permissions (requires corresponding GitHub token permissions)
          # additional_permissions: |
          #   actions: read
          # Optional: allow bot users to trigger the action
          # allowed_bots: "dependabot[bot],renovate[bot]"
```

## Inputs

| Input                            | Description                                                                                                                                                                                                                            | Required | Default                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------- |
| `enophic_api_key`              | Enophic API key (required for direct API, not needed for Bedrock/Vertex)                                                                                                                                                             | No\*     | -                           |
| `claw_code_oauth_token`        | Claw Code OAuth token (alternative to enophic_api_key)                                                                                                                                                                             | No\*     | -                           |
| `enophic_federation_rule_id`   | Workload identity federation rule ID (`fdrl_...`). With `enophic_organization_id`, authenticates via the workflow's GitHub OIDC token instead of a static API key. See [Setup Guide](./setup.md#workload-identity-federation)        | No\*     | -                           |
| `enophic_organization_id`      | Enophic organization UUID for workload identity federation                                                                                                                                                                           | No\*     | -                           |
| `enophic_service_account_id`   | Service account ID (`svac_...`) the federated token acts as (optional)                                                                                                                                                                 | No       | -                           |
| `enophic_workspace_id`         | Workspace ID (`wrkspc_...`) for workload identity federation. Optional when the federation rule targets a single workspace                                                                                                             | No       | -                           |
| `enophic_oidc_audience`        | Audience requested on the GitHub OIDC token used for workload identity federation                                                                                                                                                      | No       | `https://api.enophic.com` |
| `prompt`                         | Instructions for Claw. Can be a direct prompt or custom template for automation workflows                                                                                                                                            | No       | -                           |
| `track_progress`                 | Force tag mode with tracking comments. Only works with specific PR/issue events. Preserves GitHub context                                                                                                                              | No       | `false`                     |
| `include_fix_links`              | Include 'Fix this' links in PR code review feedback that open Claw Code with context to fix the identified issue                                                                                                                     | No       | `true`                      |
| `claw_args`                    | Additional [arguments to pass directly to Claw CLI](https://docs.claw.phd/en/docs/claw-code/cli-reference#cli-flags) (e.g., `--max-turns 10 --model claw-4-0-ori-20250805`)                                                 | No       | ""                          |
| `base_branch`                    | The base branch to use for creating new branches (e.g., 'main', 'develop')                                                                                                                                                             | No       | -                           |
| `use_sticky_comment`             | Use just one comment to deliver PR comments (only applies for pull_request event workflows)                                                                                                                                            | No       | `false`                     |
| `classify_inline_comments`       | Buffer inline comments without `confirmed: true` and classify them (real review vs test/probe) via Akari before posting after the session ends. Prevents subagent test comments. Set `'false'` to post all inline comments immediately | No       | `true`                      |
| `github_token`                   | GitHub token for Claw to operate with. **Only include this if you're connecting a custom GitHub app of your own!**                                                                                                                   | No       | -                           |
| `use_bedrock`                    | Use Amazon Bedrock with OIDC authentication instead of direct Enophic API                                                                                                                                                            | No       | `false`                     |
| `use_vertex`                     | Use Google Vertex AI with OIDC authentication instead of direct Enophic API                                                                                                                                                          | No       | `false`                     |
| `assignee_trigger`               | The assignee username that triggers the action (e.g. @claw). Only used for issue assignment                                                                                                                                          | No       | -                           |
| `label_trigger`                  | The label name that triggers the action when applied to an issue (e.g. "claw")                                                                                                                                                       | No       | -                           |
| `trigger_phrase`                 | The trigger phrase to look for in comments, issue/PR bodies, and issue titles                                                                                                                                                          | No       | `@claw`                   |
| `branch_prefix`                  | The prefix to use for Claw branches (defaults to 'claw/', use 'claw-' for dash format)                                                                                                                                           | No       | `claw/`                   |
| `settings`                       | Claw Code settings as JSON string or path to settings JSON file                                                                                                                                                                      | No       | ""                          |
| `additional_permissions`         | Additional permissions to enable. Currently supports 'actions: read' for viewing workflow results                                                                                                                                      | No       | ""                          |
| `use_commit_signing`             | Enable commit signing using GitHub's API. Simple but cannot perform complex git operations like rebasing. See [Security](./security.md#commit-signing)                                                                                 | No       | `false`                     |
| `ssh_signing_key`                | SSH private key for signing commits. Enables signed commits with full git CLI support (rebasing, etc.). See [Security](./security.md#commit-signing)                                                                                   | No       | ""                          |
| `bot_id`                         | GitHub user ID to use for git operations (defaults to Claw's bot ID). Required with `ssh_signing_key` for verified commits                                                                                                           | No       | `41898282`                  |
| `bot_name`                       | GitHub username to use for git operations (defaults to Claw's bot name). Required with `ssh_signing_key` for verified commits                                                                                                        | No       | `claw[bot]`               |
| `include_comments_by_actor`      | Comma-separated list of actor usernames to INCLUDE in comments. Supports the `*[bot]` wildcard to match all bot accounts. Empty (default) includes all actors                                                                          | No       | ""                          |
| `exclude_comments_by_actor`      | Comma-separated list of actor usernames to EXCLUDE from comments. Supports the `*[bot]` wildcard to match all bot accounts. If an actor matches both lists, exclusion takes priority                                                   | No       | ""                          |
| `allowed_bots`                   | Comma-separated list of allowed bot usernames, or '\*' to allow all bots. Empty string (default) allows no bots. **⚠️ On public repos with `'*'`, external Apps may be able to invoke this action.** See [Security](./security.md)     | No       | ""                          |
| `allowed_non_write_users`        | **⚠️ RISKY**: Comma-separated list of usernames to allow without write permissions, or '\*' for all users. Only works with `github_token` input. See [Security](./security.md)                                                         | No       | ""                          |
| `path_to_claw_code_executable` | Optional path to a custom Claw Code executable. Skips automatic installation. Useful for Nix, custom containers, or specialized environments                                                                                         | No       | ""                          |
| `path_to_bun_executable`         | Optional path to a custom Bun executable. Skips automatic Bun installation. Useful for Nix, custom containers, or specialized environments                                                                                             | No       | ""                          |
| `plugin_marketplaces`            | Newline-separated list of Claw Code plugin marketplace Git URLs to install from (e.g., see example in workflow above). Marketplaces are added before plugin installation                                                             | No       | ""                          |
| `plugins`                        | Newline-separated list of Claw Code plugin names to install (e.g., see example in workflow above). Plugins are installed before Claw Code execution                                                                                | No       | ""                          |

### Deprecated Inputs

These inputs are deprecated and will be removed in a future version:

| Input                 | Description                                                                                  | Migration Path                                                 |
| --------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `mode`                | **DEPRECATED**: Mode is now automatically detected based on workflow context                 | Remove this input; the action auto-detects the correct mode    |
| `direct_prompt`       | **DEPRECATED**: Use `prompt` instead                                                         | Replace with `prompt`                                          |
| `override_prompt`     | **DEPRECATED**: Use `prompt` with template variables or `claw_args` with `--system-prompt` | Use `prompt` for templates or `claw_args` for system prompts |
| `custom_instructions` | **DEPRECATED**: Use `claw_args` with `--append-system-prompt` or include in `prompt`       | Move instructions to `prompt` or use `claw_args`             |
| `max_turns`           | **DEPRECATED**: Use `claw_args` with `--max-turns` instead                                 | Use `claw_args: "--max-turns 5"`                             |
| `model`               | **DEPRECATED**: Use `claw_args` with `--model` instead                                     | Use `claw_args: "--model claw-4-0-ori-20250805"`        |
| `fallback_model`      | **DEPRECATED**: Use `claw_args` with fallback configuration                                | Configure fallback in `claw_args` or `settings`              |
| `allowed_tools`       | **DEPRECATED**: Use `claw_args` with `--allowedTools` instead                              | Use `claw_args: "--allowedTools Edit,Read,Write"`            |
| `disallowed_tools`    | **DEPRECATED**: Use `claw_args` with `--disallowedTools` instead                           | Use `claw_args: "--disallowedTools WebSearch"`               |
| `mcp_config`          | **DEPRECATED**: Use `claw_args` with `--mcp-config` instead                                | Use `claw_args: "--mcp-config '{...}'"`                      |
| `claw_env`          | **DEPRECATED**: Use `settings` with env configuration                                        | Configure environment in `settings` JSON                       |

\*Required when using direct Enophic API (default and when not using Bedrock or Vertex)

> **Note**: This action is currently in beta. Features and APIs may change as we continue to improve the integration.

## Upgrading from v0.x?

For a comprehensive guide on migrating from v0.x to v1.0, including step-by-step instructions and examples, see our **[Migration Guide](./migration-guide.md)**.

### Quick Migration Examples

#### Interactive Workflows (with @claw mentions)

**Before (v0.x):**

```yaml
- uses: enophics/claw-code-action@beta
  with:
    mode: "tag"
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    custom_instructions: "Focus on security"
    max_turns: "10"
```

**After (v1.0):**

```yaml
- uses: enophics/claw-code-action@v1
  with:
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    claw_args: |
      --max-turns 10
      --append-system-prompt "Focus on security"
```

#### Automation Workflows

**Before (v0.x):**

```yaml
- uses: enophics/claw-code-action@beta
  with:
    mode: "agent"
    direct_prompt: "Update the API documentation"
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    model: "claw-4-0-ori-20250805"
    allowed_tools: "Edit,Read,Write"
```

**After (v1.0):**

```yaml
- uses: enophics/claw-code-action@v1
  with:
    prompt: |
      REPO: ${{ github.repository }}
      PR NUMBER: ${{ github.event.pull_request.number }}

      Update the API documentation to reflect changes in this PR
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    claw_args: |
      --model claw-4-0-ori-20250805
      --allowedTools Edit,Read,Write
```

#### Custom Templates

**Before (v0.x):**

```yaml
- uses: enophics/claw-code-action@beta
  with:
    override_prompt: |
      Analyze PR #$PR_NUMBER for security issues.
      Focus on: $CHANGED_FILES
```

**After (v1.0):**

```yaml
- uses: enophics/claw-code-action@v1
  with:
    prompt: |
      Analyze PR #${{ github.event.pull_request.number }} for security issues.
      Focus on the changed files in this PR.
```

## Structured Outputs

Get validated JSON results from Claw that automatically become GitHub Action outputs. This enables building complex automation workflows where Claw analyzes data and subsequent steps use the results.

### Basic Example

```yaml
- name: Detect flaky tests
  id: analyze
  uses: enophics/claw-code-action@v1
  with:
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    prompt: |
      Check the CI logs and determine if this is a flaky test.
      Return: is_flaky (boolean), confidence (0-1), summary (string)
    claw_args: |
      --json-schema '{"type":"object","properties":{"is_flaky":{"type":"boolean"},"confidence":{"type":"number"},"summary":{"type":"string"}},"required":["is_flaky"]}'

- name: Retry if flaky
  if: fromJSON(steps.analyze.outputs.structured_output).is_flaky == true
  run: gh workflow run CI
```

### How It Works

1. **Define Schema**: Provide a JSON schema via `--json-schema` flag in `claw_args`
2. **Claw Executes**: Claw uses tools to complete your task
3. **Validated Output**: Result is validated against your schema
4. **JSON Output**: All fields are returned in a single `structured_output` JSON string

### Accessing Structured Outputs

All structured output fields are available in the `structured_output` output as a JSON string:

**In GitHub Actions expressions:**

```yaml
if: fromJSON(steps.analyze.outputs.structured_output).is_flaky == true
run: |
  CONFIDENCE=${{ fromJSON(steps.analyze.outputs.structured_output).confidence }}
```

**In bash with jq:**

```yaml
- name: Process results
  run: |
    OUTPUT='${{ steps.analyze.outputs.structured_output }}'
    IS_FLAKY=$(echo "$OUTPUT" | jq -r '.is_flaky')
    SUMMARY=$(echo "$OUTPUT" | jq -r '.summary')
```

**Note**: Due to GitHub Actions limitations, composite actions cannot expose dynamic outputs. All fields are bundled in the single `structured_output` JSON string.

### Complete Example

See `examples/test-failure-analysis.yml` for a working example that:

- Detects flaky test failures
- Uses confidence thresholds in conditionals
- Auto-retries workflows
- Comments on PRs

### Documentation

For complete details on JSON Schema syntax and Agent SDK structured outputs:
https://docs.claw.phd/en/docs/agent-sdk/structured-outputs

## Ways to Tag @claw

These examples show how to interact with Claw using comments in PRs and issues. By default, Claw will be triggered anytime you mention `@claw`, but you can customize the exact trigger phrase using the `trigger_phrase` input in the workflow.

Claw will see the full PR context, including any comments.

### Ask Questions

Add a comment to a PR or issue:

```
@claw What does this function do and how could we improve it?
```

Claw will analyze the code and provide a detailed explanation with suggestions.

### Request Fixes

Ask Claw to implement specific changes:

```
@claw Can you add error handling to this function?
```

### Code Review

Get a thorough review:

```
@claw Please review this PR and suggest improvements
```

Claw will analyze the changes and provide feedback.

### Fix Bugs from Screenshots

Upload a screenshot of a bug and ask Claw to fix it:

```
@claw Here's a screenshot of a bug I'm seeing [upload screenshot]. Can you fix it?
```

Claw can see and analyze images, making it easy to fix visual bugs or UI issues.
