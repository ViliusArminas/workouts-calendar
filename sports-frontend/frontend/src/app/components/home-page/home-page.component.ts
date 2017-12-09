import { Component, OnInit } from '@angular/core';
import { Color } from 'ng2-charts';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {

  public lineChartData: Array<any> = [
    { data: [95, 92, 89, 85, 80, 76, 80, 83, 86, 84, 82, 79], label: 'Weight' },
  ];
  public lineChartLabels: Array<any> =
  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartLegend = true;
  public lineChartType = 'line';

  constructor(private authService: AuthService) { }

  ngOnInit() { }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
