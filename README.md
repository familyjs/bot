# Bot

The bot for Family and Jigra repos, implemented using GitHub Actions.

## Config

There are two steps to setting up the configuration for this bot.

### Workflow File

Add a GitHub Actions workflow file for the bot (usually `.github/workflows/bot.yml`).

```yml
name: Bot

on:
  push:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created]

jobs:
  bot:
    name: ${{ github.event_name }}/${{ github.event.action }}
    runs-on: ubuntu-latest
    steps:
      - uses: familyjs/bot@main
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

### Config File

Though this bot is one GitHub Action, it does many things. Because of this, a separate configuration file is needed specifically for the bot (`.github/bot.yml`):

```yml
tasks:
  - name: remove-label
    on:
      issue_comment:
        types: [created]
    condition: 'payload.issue.number === 1'
    config:
      label: needs-reply
      exclude-labeler: true
```

The `tasks` key is an array of tasks, the event that triggers them, and their configuration. Notice how the `on` block is copied from the workflow file to specify exactly which events triggers which tasks. You can also have a `condition` expression, the result of which determines if the task is run for a particular event payload.

#### Tasks

- `add-comment`: Add a comment to an issue, optionally closing and/or locking the issue
  - `comment` _(string)_: the comment text
  - `close` _(boolean)_: if `true`, close the issue
  - `lock` _(boolean)_: if `true`, lock the issue
- `add-contributors`: Open a PR to modify `README.md` when a new contributor appears in a base branch
  - `base` _(string)_: the base branch
  - `file` _(string)_: the file to edit (usually `README.md`)
  - `commit-message` _(string)_: the [lodash template](https://lodash.com/docs#template) for the commit message; properties: `base`, `file`
  - `exclude-patterns` _(string array)_: the patterns for excluding contributors, defaults to excluding users whose usernames end in `[bot]`
- `add-label`: Add a label to an issue
  - `label` _(string)_: the label to add
- `add-platform-labels`: Parse issue bodies and add labels to issues that have keywords under a `Platform` header
- `remove-label`: Remove a label from an issue
  - `label` _(string)_: the label to remove
  - `exclude-labeler` _(boolean)_: if `true`, the label won't be removed if the event actor is the user that added the label
- `assign-to-project`: Assign an issue or pull request to a project
  - `columns` _(object)_
    -  `issue` _(number)_: the project column ID to put issues in
    -  `pr` _(number)_: the project column ID to put pull requests in
    -  `draft-pr` _(number)_: the project column ID to put draft PRs in

#### Condition Context

There are a variety of variables and functions available in `condition` expressions.

- `payload`: the entire event payload
- `config`: the task configuration
- `getTeamMembers(teamSlug: string) => Promise<string[]>`: get the usernames of an organization team by slug
