import {Component, Input, OnInit} from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];

  @Input() labels: Label[] = ['1', '2', '3', '4', '5', '6'];
  @Input() data: {data: Array<number>, label: string} = { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' };

  constructor() {
    this.barChartData = [this.data];
  }

  ngOnInit(): void {
  }

}
