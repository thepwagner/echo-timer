// Earliest timestamp we can:
const startTime = new Date();

const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  const token = core.getInput('token');
  const octokit = new github.GitHub(token);

  // Unpack event:
  const { comment, issue, repository } = github.context.payload;
  const eventTime = Date.parse(comment.created_at);

  const timeToStart = startTime - eventTime;
  const timeToNow = new Date() - eventTime;
  await octokit.issues.createComment({
    owner: repository.owner.login,
    repo: repository.name,
    issue_number: issue.number,
    body: "```\n" + comment.body + "\n```\n" +
      `${timeToStart} to start, ${timeToNow} to now`
  });
}

run();
