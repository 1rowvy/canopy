export namespace main {
	
	export class DashboardData {
	    total_repos: number;
	    open_prs: number;
	    ci_success_rate: number;
	    recent_repos: provider.Repo[];
	    recent_prs: provider.PullRequest[];
	
	    static createFrom(source: any = {}) {
	        return new DashboardData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.total_repos = source["total_repos"];
	        this.open_prs = source["open_prs"];
	        this.ci_success_rate = source["ci_success_rate"];
	        this.recent_repos = this.convertValues(source["recent_repos"], provider.Repo);
	        this.recent_prs = this.convertValues(source["recent_prs"], provider.PullRequest);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace provider {
	
	export class CheckRun {
	    id: number;
	    name: string;
	    status: string;
	    conclusion: string;
	    // Go type: time
	    started_at: any;
	    // Go type: time
	    completed_at: any;
	    html_url: string;
	
	    static createFrom(source: any = {}) {
	        return new CheckRun(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.status = source["status"];
	        this.conclusion = source["conclusion"];
	        this.started_at = this.convertValues(source["started_at"], null);
	        this.completed_at = this.convertValues(source["completed_at"], null);
	        this.html_url = source["html_url"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class CIStatus {
	    state: string;
	    total_runs: number;
	    success_runs: number;
	    failed_runs: number;
	    pending_runs: number;
	    // Go type: time
	    updated_at: any;
	    runs: CheckRun[];
	
	    static createFrom(source: any = {}) {
	        return new CIStatus(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.state = source["state"];
	        this.total_runs = source["total_runs"];
	        this.success_runs = source["success_runs"];
	        this.failed_runs = source["failed_runs"];
	        this.pending_runs = source["pending_runs"];
	        this.updated_at = this.convertValues(source["updated_at"], null);
	        this.runs = this.convertValues(source["runs"], CheckRun);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class PullRequest {
	    id: number;
	    number: number;
	    title: string;
	    state: string;
	    author: string;
	    // Go type: time
	    created_at: any;
	    // Go type: time
	    updated_at: any;
	    draft: boolean;
	    mergeable: boolean;
	    repo: string;
	    source_branch: string;
	    target_branch: string;
	    html_url: string;
	    review_state: string;
	
	    static createFrom(source: any = {}) {
	        return new PullRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.number = source["number"];
	        this.title = source["title"];
	        this.state = source["state"];
	        this.author = source["author"];
	        this.created_at = this.convertValues(source["created_at"], null);
	        this.updated_at = this.convertValues(source["updated_at"], null);
	        this.draft = source["draft"];
	        this.mergeable = source["mergeable"];
	        this.repo = source["repo"];
	        this.source_branch = source["source_branch"];
	        this.target_branch = source["target_branch"];
	        this.html_url = source["html_url"];
	        this.review_state = source["review_state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Repo {
	    id: number;
	    owner: string;
	    name: string;
	    full_name: string;
	    description: string;
	    language: string;
	    default_branch: string;
	    private: boolean;
	    fork: boolean;
	    stars: number;
	    open_issues: number;
	    // Go type: time
	    updated_at: any;
	    html_url: string;
	
	    static createFrom(source: any = {}) {
	        return new Repo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.owner = source["owner"];
	        this.name = source["name"];
	        this.full_name = source["full_name"];
	        this.description = source["description"];
	        this.language = source["language"];
	        this.default_branch = source["default_branch"];
	        this.private = source["private"];
	        this.fork = source["fork"];
	        this.stars = source["stars"];
	        this.open_issues = source["open_issues"];
	        this.updated_at = this.convertValues(source["updated_at"], null);
	        this.html_url = source["html_url"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

