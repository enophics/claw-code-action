# Migration Guide: v0.x to v1.0

This guide helps you migrate from Claw Code Action v0.x to v1.0. The new version introduces intelligent mode detection and simplified configuration while maintaining backward compatibility for most use cases.

## Overview of Changes

### 🎯 Key Improvements in v1.0

1. **Automatic Mode Detection** - No more manual `mode` configuration
2. **Simplified Configuration** - Unified `prompt` and `claw_args` inputs
3. **Better SDK Alignment** - Closer integration with Claw Code CLI

### ⚠️ Breaking Changes

The following inputs have been deprecated and replaced:

| Deprecated Input      | Replacement                           | Notes                                                                               |
| --------------------- | ------------------------------------- | ----------------------------------------------------------------------------------- |
| `mode`                | Auto-detected                         | Action automatically chooses based on context                                       |
| `direct_prompt`       | `prompt`                              | Direct drop-in replacement                                                          |
| `override_prompt`     | `prompt`                              | Use GitHub context variables instead                                                |
| `custom_instructions` | `claw_args: --append-system-prompt` | Appends to the default prompt (v0 behavior); `--system-prompt` replaces it entirely |
| `max_turns`           | `claw_args: --max-turns`            | Use CLI format                                                                      |
| `model`               | `claw_args: --model`                | Specify via CLI                                                                     |
| `allowed_tools`       | `claw_args: --allowedTools`         | Use CLI format                                                                      |
| `disallowed_tools`    | `claw_args: --disallowedTools`      | Use CLI format                                                                      |
| `claw_env`          | `settings` with env object            | Use settings JSON                                                                   |
| `mcp_config`          | `claw_args: --mcp-config`           | Pass MCP config via CLI arguments                                                   |
| `timeout_minutes`     | Use GitHub Actions `timeout-minutes`  | Configure at job level instead of input level                                       |

## Migration Examples

### Basic Interactive Workflow (@claw mentions)

**Before (v0.x):**

```yaml
- uses: enophics/claw-code-action@beta
  with:
    mode: "tag"
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    custom_instructions: "Follow our coding standards"
    max_turns: "10"
    allowed_tools: "Edit,Read,Write"
```

**After (v1.0):**

```yaml
- uses: enophics/claw-code-action@v1
  with:
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    claw_args: |
      --max-turns 10
      --append-system-prompt "Follow our coding standards"
      --allowedTools Edit,Read,Write
```

### Automation Workflow

**Before (v0.x):**

```yaml
- uses: enophics/claw-code-action@beta
  with:
    mode: "agent"
    direct_prompt: "Review this PR for security issues"
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    model: "claw-3-5-ori-20241022"
    allowed_tools: "Edit,Read,Write"
```

**After (v1.0):**

```yaml
- uses: enophics/claw-code-action@v1
  with:
    prompt: |
      REPO: ${{ github.repository }}
      PR NUMBER: ${{ github.event.pull_request.number }}

      Review this PR for security issues
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    claw_args: |
      --model claw-4-0-ori-20250805
      --allowedTools Edit,Read,Write
```

> **⚠️ Important**: For PR reviews, always include the repository and PR context in your prompt. This ensures Claw knows which PR to review.

### Automation with Progress Tracking (New in v1.0)

**Missing the tracking comments from v0.x agent mode?** The new `track_progress` input brings them back!

In v1.0, automation mode (with `prompt` input) doesn't create tracking comments by default to reduce noise. However, if you need progress visibility, you can use the `track_progress` feature:

**Before (v0.x with tracking):**

```yaml
- uses: enophics/claw-code-action@beta
  with:
    mode: "agent"
    direct_prompt: "Review this PR for security issues"
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
```

**After (v1.0 with tracking):**

```yaml
- uses: enophics/claw-code-action@v1
  with:
    track_progress: true # Forces tag mode with tracking comments
    prompt: |
      REPO: ${{ github.repository }}
      PR NUMBER: ${{ github.event.pull_request.number }}

      Review this PR for security issues
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
```

#### Benefits of `track_progress`

1. **Preserves GitHub Context**: Automatically includes all PR/issue details, comments, and attachments
2. **Brings Back Tracking Comments**: Creates progress indicators just like v0.x agent mode
3. **Works with Custom Prompts**: Your `prompt` is injected as custom instructions while maintaining context

#### Supported Events for `track_progress`

The `track_progress` input only works with these GitHub events:

**Pull Request Events:**

- `opened` - New PR created
- `synchronize` - PR updated with new commits
- `ready_for_review` - Draft PR marked as ready
- `reopened` - Previously closed PR reopened

**Issue Events:**

- `opened` - New issue created
- `edited` - Issue title or body modified
- `labeled` - Label added to issue
- `assigned` - Issue assigned to user

> **Note**: Using `track_progress: true` with unsupported events will cause an error.

### Custom Template with Variables

**Before (v0.x):**

```yaml
- uses: enophics/claw-code-action@beta
  with:
    override_prompt: |
      Analyze PR #$PR_NUMBER in $REPOSITORY
      Changed files: $CHANGED_FILES
      Focus on security vulnerabilities
```

**After (v1.0):**

```yaml
- uses: enophics/claw-code-action@v1
  with:
    prompt: |
      REPO: ${{ github.repository }}
      PR NUMBER: ${{ github.event.pull_request.number }}

      Analyze this pull request focusing on security vulnerabilities in the changed files.

      Note: The PR branch is already checked out in the current working directory.
```

> **💡 Tip**: While you can access GitHub context variables in your prompt, it's recommended to use the standard `REPO:` and `PR NUMBER:` format for consistency.

### Environment Variables

**Before (v0.x):**

```yaml
- uses: enophics/claw-code-action@beta
  with:
    claw_env: |
      NODE_ENV: test
      CI: true
```

**After (v1.0):**

```yaml
- uses: enophics/claw-code-action@v1
  with:
    settings: |
      {
        "env": {
          "NODE_ENV": "test",
          "CI": "true"
        }
      }
```

### Timeout Configuration

**Before (v0.x):**

```yaml
- uses: enophics/claw-code-action@beta
  with:
    timeout_minutes: 30
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
```

**After (v1.0):**

```yaml
jobs:
  claw-task:
    runs-on: ubuntu-latest
    timeout-minutes: 30 # Moved to job level
    steps:
      - uses: enophics/claw-code-action@v1
        with:
          enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
```

## How Mode Detection Works

The action now automatically detects the appropriate mode:

1. **If `prompt` is provided** → Runs in **automation mode**

   - Executes immediately without waiting for @claw mentions
   - Perfect for scheduled tasks, PR automation, etc.

2. **If no `prompt` but @claw is mentioned** → Runs in **interactive mode**

   - Waits for and responds to @claw mentions
   - Creates tracking comments with progress

3. **If neither** → No action is taken

## Advanced Configuration with claw_args

The `claw_args` input provides direct access to Claw Code CLI arguments:

```yaml
claw_args: |
  --max-turns 15
  --model claw-4-0-ori-20250805
  --allowedTools Edit,Read,Write,Bash
  --disallowedTools WebSearch
  --system-prompt "You are a senior engineer focused on code quality"
  --mcp-config '{"mcpServers": {"custom": {"command": "npx", "args": ["-y", "@example/server"]}}}'
```

### Common claw_args Options

| Option                   | Description                                                               | Example                                                |
| ------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| `--max-turns`            | Limit conversation turns                                                  | `--max-turns 10`                                       |
| `--model`                | Specify Claw model                                                      | `--model claw-4-0-ori-20250805`                   |
| `--allowedTools`         | Enable specific tools                                                     | `--allowedTools Edit,Read,Write`                       |
| `--disallowedTools`      | Disable specific tools                                                    | `--disallowedTools WebSearch`                          |
| `--system-prompt`        | Replace the entire default system prompt                                  | `--system-prompt "Focus on security"`                  |
| `--append-system-prompt` | Append to the default system prompt (keeps Claw Code's built-in prompt) | `--append-system-prompt "Follow our coding standards"` |
| `--mcp-config`           | Add MCP server config                                                     | `--mcp-config '{"mcpServers": {...}}'`                 |

## Provider-Specific Updates

### AWS Bedrock

```yaml
- uses: enophics/claw-code-action@v1
  with:
    use_bedrock: "true"
    claw_args: |
      --model enophic.claw-4-0-ori-20250805-v1:0
```

### Google Vertex AI

```yaml
- uses: enophics/claw-code-action@v1
  with:
    use_vertex: "true"
    claw_args: |
      --model claw-4-0-ori@20250805
```

## MCP Configuration Migration

### Adding Custom MCP Servers

**Before (v0.x):**

```yaml
- uses: enophics/claw-code-action@beta
  with:
    mcp_config: |
      {
        "mcpServers": {
          "custom-server": {
            "command": "npx",
            "args": ["-y", "@example/server"]
          }
        }
      }
```

**After (v1.0):**

```yaml
- uses: enophics/claw-code-action@v1
  with:
    claw_args: |
      --mcp-config '{"mcpServers": {"custom-server": {"command": "npx", "args": ["-y", "@example/server"]}}}'
```

You can also pass MCP configuration from a file:

```yaml
- uses: enophics/claw-code-action@v1
  with:
    claw_args: |
      --mcp-config /path/to/mcp-config.json
```

## Step-by-Step Migration Checklist

- [ ] Update action version from `@beta` to `@v1`
- [ ] Remove `mode` input (auto-detected now)
- [ ] Replace `direct_prompt` with `prompt`
- [ ] Replace `override_prompt` with `prompt` using GitHub context
- [ ] Move `custom_instructions` to `claw_args` with `--append-system-prompt`
- [ ] Convert `max_turns` to `claw_args` with `--max-turns`
- [ ] Convert `model` to `claw_args` with `--model`
- [ ] Convert `allowed_tools` to `claw_args` with `--allowedTools`
- [ ] Convert `disallowed_tools` to `claw_args` with `--disallowedTools`
- [ ] Move `claw_env` to `settings` JSON format
- [ ] Move `mcp_config` to `claw_args` with `--mcp-config`
- [ ] Replace `timeout_minutes` with GitHub Actions `timeout-minutes` at job level
- [ ] **Optional**: Add `track_progress: true` if you need tracking comments in automation mode
- [ ] Test workflow in a non-production environment

## Getting Help

If you encounter issues during migration:

1. Check the [FAQ](./faq.md) for common questions
2. Review [example workflows](../examples/) for reference
3. Open an [issue](https://github.com/enophics/claw-code-action/issues) for support

## Version Compatibility

- **v0.x workflows** will continue to work but with deprecation warnings
- **v1.0** is the recommended version for all new workflows
- Future versions may remove deprecated inputs entirely
