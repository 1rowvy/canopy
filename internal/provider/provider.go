package provider

import (
	"context"
	"time"
)

// Provider defines the interface for source code hosting platforms
type Provider interface {
	Name() string
	ListRepos(ctx context.Context) ([]*Repo, error)
	ListPullRequests(ctx context.Context, owner, repo string) ([]*PullRequest, error)
	GetCIStatus(ctx context.Context, owner, repo, ref string) (*CIStatus, error)
}

// Repo represents a repository
type Repo struct {
	ID            int64     `json:"id"`
	Owner         string    `json:"owner"`
	Name          string    `json:"name"`
	FullName      string    `json:"full_name"`
	Description   string    `json:"description"`
	Language      string    `json:"language"`
	DefaultBranch string    `json:"default_branch"`
	Private       bool      `json:"private"`
	Fork          bool      `json:"fork"`
	Stars         int       `json:"stars"`
	OpenIssues    int       `json:"open_issues"`
	UpdatedAt     time.Time `json:"updated_at"`
	HTMLURL       string    `json:"html_url"`
}

// PullRequest represents a pull request
type PullRequest struct {
	ID           int64     `json:"id"`
	Number       int       `json:"number"`
	Title        string    `json:"title"`
	State        string    `json:"state"`
	Author       string    `json:"author"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	Draft        bool      `json:"draft"`
	Mergeable    bool      `json:"mergeable"`
	Repo         string    `json:"repo"`
	SourceBranch string    `json:"source_branch"`
	TargetBranch string    `json:"target_branch"`
	HTMLURL      string    `json:"html_url"`
	ReviewState  string    `json:"review_state"` // approved, changes_requested, pending
}

// CIStatus represents CI/CD status for a commit/branch
type CIStatus struct {
	State       string     `json:"state"` // success, failure, pending, error
	TotalRuns   int        `json:"total_runs"`
	SuccessRuns int        `json:"success_runs"`
	FailedRuns  int        `json:"failed_runs"`
	PendingRuns int        `json:"pending_runs"`
	UpdatedAt   time.Time  `json:"updated_at"`
	Runs        []CheckRun `json:"runs"`
}

// CheckRun represents a single CI check
type CheckRun struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	Status      string    `json:"status"`     // completed, in_progress, queued
	Conclusion  string    `json:"conclusion"` // success, failure, cancelled, skipped
	StartedAt   time.Time `json:"started_at"`
	CompletedAt time.Time `json:"completed_at"`
	HTMLURL     string    `json:"html_url"`
}
