import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import {ModelSocketService} from "../../services/model-socket.service";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnChanges {

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];

  labels: Label[];
  data: {data: Array<number>, label: string} = { data: [], label: 'Epoch Data' };

  @Input() reset: boolean;

  constructor(private modelSocket: ModelSocketService) {
    this.modelSocket.epoch.subscribe(d => {
      this.data.data.push(d.error);
      this.labels = Array<string>(this.data.data.length).fill('').map((d: string, i: number) => `${i+1}`);
    });
    this.barChartData = [this.data];
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.labels = [];
    this.data.data = [];
  }

}
