import {Component} from "@angular/core";
import {CronJobsService, DialogService, LogsService} from "../../../services";
import {ActivatedRoute, Router} from "@angular/router";
import {Log} from "../../../models";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-view-job',
  templateUrl: './viewCronJob.component.html',
  styleUrls: ['./viewCronJob.component.scss']
})
export class ViewCronJobComponent {
  logs: Log[] = [];
  id: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dialogService: DialogService,
              private cronService: CronJobsService,
              private logService: LogsService) {
    combineLatest(route.params, logService.$logs, (params, logs) => ({params, logs}))
      .subscribe( values => {
        this.id = values.params['id'];
        this.logs = values.logs[this.id];
      });
  }

  public cancelJob() {
    this.dialogService.showDialogWithYesNo({title: `Cancel`,
      message: 'Do you want to cancel this job ? Have in mind that logs will also be deleted.'})
      .subscribe((result) => {
        if (result) {
          this.cronService.cancelJob(this.id)
            .subscribe(() => this.router.navigate(['app'])
              .then(() => this.dialogService.showSimpleDialogWith({
                title: 'Cancel',
                message: 'Job cancelled'
              })));
        }
      });
  }
}
