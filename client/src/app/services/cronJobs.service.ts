import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job, MyJob, Account} from "../models";
import {BehaviorSubject} from "rxjs";
import {filter, tap} from "rxjs/operators";
import {AuthService} from "./auth.service";

@Injectable()
export class CronJobsService {
  private static base = 'api/cron';

  // MARK: Properties
  private _jobs = new BehaviorSubject<Job[]>([]);

  get jobs() { return this._jobs.value; }
  set jobs(jobs: Job[]) { this._jobs.next(jobs); }

  public $jobs = this._jobs.asObservable();

  constructor(private http: HttpClient,
              private authService: AuthService) {
    authService.$loggedAccount.pipe(filter( (acc) => acc !== null))
      .subscribe( (acc) => this.getJobs(acc));
  }

  private getJobs(acc: Account) {
    this.http.post<Job[]>(CronJobsService.base, {acc: acc})
        .subscribe((jobs) => {
          this.jobs = jobs
        });
  }

  public createJob(job: MyJob) {
    const acc = this.authService.loggedAccount;
    return this.http.post<Job>(`${CronJobsService.base}/create`, {acc: acc, job: job})
      .pipe(tap( (_) => this.getJobs(acc)));
  }

  public cancelJob(id: string) {
    const acc = this.authService.loggedAccount;
    return this.http.post(`${CronJobsService.base}/cancel`, {acc: acc, id: id})
      .pipe(tap( () => this.getJobs(this.authService.loggedAccount)));
  }
}
