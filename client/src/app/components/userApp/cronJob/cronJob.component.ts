import {Component} from '@angular/core';
import {CronJobsService, AuthService} from "../../../services/";
import {Account, MyJob} from "../../../models";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cron-job',
  templateUrl: './cronJob.component.html',
  styleUrls: ['./cronJob.component.scss']
})
export class CronJobComponent {
  job: MyJob = new MyJob();
  user: Account;

  constructor(private cronService: CronJobsService,
              private authService: AuthService,
              private router: Router) {
    authService.$loggedAccount.subscribe((user) => {
      this.user = user;
      this.job.data.username = user.user;
      this.job.data.key = user.key;
    });
  }

  public createJob() {
    console.log(this.job);
    this.cronService.createJob(this.job)
      .subscribe( (_) => this.router.navigate(['app']));
  }

  public isCorrect() {
    if (!this.job) { return true; }
    if (!this.job.name) { return true; }
    if (!this.job.data.username) { return true; }
    if (!this.job.data.jobName) { return true; }
    if (!this.job.data.key) { return true; }
    return false;
  }

  step = 0;
  setStep(index: number) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }
}
