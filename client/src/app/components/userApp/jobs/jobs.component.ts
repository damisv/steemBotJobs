import {Component, OnInit, ViewChild} from "@angular/core";
import {MatPaginator} from "@angular/material";
import {MySimpleDataSource} from "../../../utils/tableGeneric";
import {Job} from "../../../models";
import {CronJobsService, SocketService} from "../../../services/";
import {Router} from "@angular/router";

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  // MARK: ViewChild
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // MARK: Properties
  displayedColumns = ['index', 'jobName', 'job', 'interval', 'lastRun', 'nextRun'];
  dataSource: MySimpleDataSource<Job> | null;

  constructor(private cronService: CronJobsService,
              private socketService: SocketService,
              private router: Router) {}

  ngOnInit() {
    // this.dataSource = new MyDataSource<Job>(this.cronService.$jobs, this.paginator);
    this.dataSource = new MySimpleDataSource<Job>(this.cronService.$jobs);
  }

  public viewLogs(id: string) {
    this.router.navigateByUrl(`app/job/${id}`);
  }
}
