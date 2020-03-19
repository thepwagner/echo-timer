// Earliest timestamp we can:
const startTime = new Date();

const os = require('os');
const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  const token = core.getInput('token');
  const octokit = new github.GitHub(token);

  // Unpack event:
  const { comment, issue, repository } = github.context.payload;
  const eventTime = Date.parse(comment.created_at);

  // Reply
  const timeToStart = startTime - eventTime;
  const timing = `
**Start Execution:** ${timeToStart} ms
**Process Uptime:** ${process.uptime() * 1000} ms
**Instance Uptime:** ${os.uptime() * 1000} ms
`;

  await octokit.issues.createComment({
    owner: repository.owner.login,
    repo: repository.name,
    issue_number: issue.number,
    body: "```\n" + comment.body + "\n```\n" + timing,
  });
}

run();
