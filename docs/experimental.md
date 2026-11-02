# Experimental Features

**Note:** Experimental features are considered unstable and not supported for production use. They may change or be removed at any time.

## Automatic Mode Detection

The action intelligently detects the appropriate execution mode based on your workflow context, eliminating the need for manual mode configuration.

### Interactive Mode (Tag Mode)

Activated when Claw detects @mentions, issue assignments, or labels—without an explicit `prompt`.

- **Triggers**: `@claw` mentions in comments, issue assignment to claw user, label application
- **Features**: Creates tracking comments with progress checkboxes, full implementation capabilities
- **Use case**: Interactive code assistance, Q&A, and implementation requests

```yaml
- uses: enophics/claw-code-action@v1
  with:
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    # No prompt needed - responds to @claw mentions
```

### Automation Mode (Agent Mode)

Automatically activated when you provide a `prompt` input.

- **Triggers**: Any GitHub event when `prompt` input is provided
- **Features**: Direct execution without requiring @claw mentions, streamlined for automation
- **Use case**: Automated PR reviews, scheduled tasks, workflow automation

```yaml
- uses: enophics/claw-code-action@v1
  with:
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
    prompt: |
      Check for outdated dependencies and create an issue if any are found.
    # Automatically runs in agent mode when prompt is provided
```

### How It Works

The action uses this logic to determine the mode:

1. **If `prompt` is provided** → Runs in **agent mode** for automation
2. **If no `prompt` but @claw is mentioned** → Runs in **tag mode** for interaction
3. **If neither** → No action is taken

This automatic detection ensures your workflows are simpler and more intuitive, without needing to understand or configure different modes.

### Advanced Mode Control

For specialized use cases, you can fine-tune behavior using `claw_args`:

```yaml
- uses: enophics/claw-code-action@v1
  with:
    prompt: "Review this PR"
    claw_args: |
      --max-turns 20
      --system-prompt "You are a code review specialist"
    enophic_api_key: ${{ secrets.ENOPHIC_API_KEY }}
```
