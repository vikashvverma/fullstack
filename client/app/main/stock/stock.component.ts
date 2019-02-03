const angular = require('angular');
const uiRouter = require('angular-ui-router');
var Highcharts = require('highcharts');

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);


export class StockController {
  $http;
  $state;

  stocks = [];
  tops = [];
  newStock = '';

  selectedView = 'table';

  /*@ngInject*/
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;
  }

  $onInit() {
    console.log(this.$state);
    this.$http.get(`/api/stocks/symbol/${this.$state.params.id}`).then(response => {
      this.stocks = response.data;
      if(this.selectedView === 'graph') {
        this.graph();
      } else {
        this.table();
      }
    });
  }

  addThing() {
    if (this.newStock) {
      this.$http.post('/api/stocks', {name: this.newStock});
      this.newStock = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/stocks/' + thing._id);
  }

  update(val) {
    this.selectedView = val;
    if (this.selectedView === 'graph') {
      this.graph();
    } else {
      this.table();
    }
  }

  log(val) {
    this.$http.get('/api/stocks/symbol/' + val).then(response => {
      this.stocks = response.data;
      console.log('sss', this.selectedView);
      if (this.selectedView === 'graph') {
        this.graph();
      } else {
        this.table();
      }
    });
  }

  graph() {
    this.selectedView = 'graph';
    let series = this.parse(this.stocks);
    Highcharts.chart('container', {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Stock browser'
      },
      subtitle: {
        text: ''
      },
      tooltip: {
        crosshairs: true,
        shared: true
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1
          }
        }
      },
      series: series,
    });
  }

  table() {
    this.selectedView = 'table';
  }

  parse(data) {
    let series = [{
      name: 'Open',
      data: []
    }, {
      name: 'Close',
      data: []
    }, {
      name: 'Low',
      data: []
    }, {
      name: 'High',
      data: []
    }, {
      name: 'Volume',
      data: []
    }];
    for (let d of data) {
      let dte = new Date(d.date);
      // let dt = Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDay());
      let dt = dte;
      series[0].data.push([dt, d.open]);
      series[1].data.push([dt, d.close]);
      series[2].data.push([dt, d.low]);
      series[3].data.push([dt, d.high]);
      series[4].data.push([dt, d.volume]);
    }
    console.log(series);
    return series;
  }
}

export default angular.module('brainwavesFullstackApp.stock', [uiRouter])
  .component('stock', {
    template: require('./stock.html'),
    controller: StockController
  })
  .name;
