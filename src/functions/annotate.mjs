import * as core from '@actions/core'
import * as github from '@actions/github'

export async function annotate(config, annotations) {
  var annotation_level
  const alertLevel = config?.global_options?.alert_level || 'fail'
  if (alertLevel === 'fail') {
    annotation_level = 'failure'
  } else {
    annotation_level = 'neutral'
  }

  // Please note that this will only work for workflows triggered by the pull_request event
  const head_sha = github.context.payload.pull_request.head.sha

  const checkRunId = github.context.payload.check_run.id

  core.debug(`======== annotate ========`)
  core.debug(`annotation_level: ${annotation_level}`)
  core.debug(`owner: ${github.context.repo.owner}`)
  core.debug(`repo: ${github.context.repo.repo}`)
  core.debug(`head_sha: ${head_sha}`)
  core.debug(`annotations: ${JSON.stringify(annotations)}`)
  core.debug(`checkRunId: ${checkRunId}`)
  core.debug(`====== end annotate ======`)

  const token = core.getInput('github_token', {required: true})
  const octokit = github.getOctokit(token)
  const response = await octokit.rest.checks.create({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    name: core.getInput('annotate_name', {required: true}),
    head_sha: head_sha,
    status: core.getInput('annotate_status', {required: true}),
    conclusion: annotation_level,
    output: {
      title: core.getInput('annotate_title', {required: true}),
      summary: core.getInput('annotate_summary', {required: true}),
      annotations: annotations
    }
  })

  core.debug(`annotations response: ${JSON.stringify(response, null, 2)}`)
  core.debug(`annotations created`)
}
