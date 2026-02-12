package provider

import (
	"context"
	"fmt"

	"github.com/google/go-github/v60/github"
	"golang.org/x/oauth2"
)

// GitHubProvider implements the Provider interface for GitHub
type GitHubProvider struct {
	client *github.Client
	token  string
	user   string
}

// NewGitHubProvider creates a new GitHub provider
func NewGitHubProvider(token string) (*GitHubProvider, error) {
	if token == "" {
		return nil, fmt.Errorf("GitHub token is required")
	}

	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token},
	)
	tc := oauth2.NewClient(context.Background(), ts)
	client := github.NewClient(tc)

	// Get authenticated user info
	user, _, err := client.Users.Get(context.Background(), "")
	if err != nil {
		return nil, fmt.Errorf("failed to authenticate: %w", err)
	}

	return &GitHubProvider{
		client: client,
		token:  token,
		user:   user.GetLogin(),
	}, nil
}

// Name returns the provider name
func (g *GitHubProvider) Name() string {
	return "github"
}

// ListRepos returns all repositories for the authenticated user
func (g *GitHubProvider) ListRepos(ctx context.Context) ([]*Repo, error) {
	opt := &github.RepositoryListOptions{
		ListOptions: github.ListOptions{PerPage: 100},
		Sort:        "updated",
		Direction:   "desc",
	}

	var allRepos []*Repo
	for {
		repos, resp, err := g.client.Repositories.List(ctx, "", opt)
		if err != nil {
			return nil, fmt.Errorf("failed to list repositories: %w", err)
		}

		for _, repo := range repos {
			allRepos = append(allRepos, &Repo{
				ID:            repo.GetID(),
				Owner:         repo.GetOwner().GetLogin(),
				Name:          repo.GetName(),
				FullName:      repo.GetFullName(),
				Description:   repo.GetDescription(),
				Language:      repo.GetLanguage(),
				DefaultBranch: repo.GetDefaultBranch(),
				Private:       repo.GetPrivate(),
				Fork:          repo.GetFork(),
				Stars:         repo.GetStargazersCount(),
				OpenIssues:    repo.GetOpenIssuesCount(),
				UpdatedAt:     repo.GetUpdatedAt().Time,
				HTMLURL:       repo.GetHTMLURL(),
			})
		}

		if resp.NextPage == 0 {
			break
		}
		opt.Page = resp.NextPage
	}

	return allRepos, nil
}

// ListPullRequests returns all pull requests for a repository
func (g *GitHubProvider) ListPullRequests(ctx context.Context, owner, repo string) ([]*PullRequest, error) {
	opt := &github.PullRequestListOptions{
		State:       "all",
		Sort:        "updated",
		Direction:   "desc",
		ListOptions: github.ListOptions{PerPage: 100},
	}

	var allPRs []*PullRequest
	for {
		prs, resp, err := g.client.PullRequests.List(ctx, owner, repo, opt)
		if err != nil {
			return nil, fmt.Errorf("failed to list pull requests: %w", err)
		}

		for _, pr := range prs {
			reviewState := "pending"

			// Get review state
			reviews, _, err := g.client.PullRequests.ListReviews(ctx, owner, repo, pr.GetNumber(), nil)
			if err == nil && len(reviews) > 0 {
				// Get latest review state
				latestReview := reviews[len(reviews)-1]
				switch latestReview.GetState() {
				case "APPROVED":
					reviewState = "approved"
				case "CHANGES_REQUESTED":
					reviewState = "changes_requested"
				case "COMMENTED":
					reviewState = "commented"
				}
			}

			allPRs = append(allPRs, &PullRequest{
				ID:           pr.GetID(),
				Number:       pr.GetNumber(),
				Title:        pr.GetTitle(),
				State:        pr.GetState(),
				Author:       pr.GetUser().GetLogin(),
				CreatedAt:    pr.GetCreatedAt().Time,
				UpdatedAt:    pr.GetUpdatedAt().Time,
				Draft:        pr.GetDraft(),
				Mergeable:    pr.GetMergeable(),
				Repo:         fmt.Sprintf("%s/%s", owner, repo),
				SourceBranch: pr.GetHead().GetRef(),
				TargetBranch: pr.GetBase().GetRef(),
				HTMLURL:      pr.GetHTMLURL(),
				ReviewState:  reviewState,
			})
		}

		if resp.NextPage == 0 {
			break
		}
		opt.Page = resp.NextPage
	}

	return allPRs, nil
}

// GetCIStatus returns CI status for a specific ref (commit/branch)
func (g *GitHubProvider) GetCIStatus(ctx context.Context, owner, repo, ref string) (*CIStatus, error) {
	// Get check runs for the ref
	checkRuns, _, err := g.client.Checks.ListCheckRunsForRef(ctx, owner, repo, ref, &github.ListCheckRunsOptions{
		ListOptions: github.ListOptions{PerPage: 100},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get check runs: %w", err)
	}

	status := &CIStatus{
		State:     "pending",
		TotalRuns: checkRuns.GetTotal(),
		Runs:      make([]CheckRun, 0),
	}

	successCount := 0
	failedCount := 0
	pendingCount := 0

	for _, run := range checkRuns.CheckRuns {
		checkRun := CheckRun{
			ID:         run.GetID(),
			Name:       run.GetName(),
			Status:     run.GetStatus(),
			Conclusion: run.GetConclusion(),
			HTMLURL:    run.GetHTMLURL(),
		}

		if run.StartedAt != nil {
			checkRun.StartedAt = run.StartedAt.Time
		}
		if run.CompletedAt != nil {
			checkRun.CompletedAt = run.CompletedAt.Time
		}

		status.Runs = append(status.Runs, checkRun)

		// Count status
		if run.GetStatus() == "completed" {
			switch run.GetConclusion() {
			case "success":
				successCount++
			case "failure", "cancelled", "timed_out":
				failedCount++
			}
		} else {
			pendingCount++
		}

		// Update latest time
		if run.CompletedAt != nil && run.CompletedAt.After(status.UpdatedAt) {
			status.UpdatedAt = run.CompletedAt.Time
		}
	}

	status.SuccessRuns = successCount
	status.FailedRuns = failedCount
	status.PendingRuns = pendingCount

	// Determine overall state
	if failedCount > 0 {
		status.State = "failure"
	} else if pendingCount > 0 {
		status.State = "pending"
	} else if successCount > 0 {
		status.State = "success"
	}

	return status, nil
}
