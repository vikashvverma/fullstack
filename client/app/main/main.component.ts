const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';

export class MainController {
  $http;

  stocks = [];
  tops = [];
  newStock = '';

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/stocks').then(response => {
      this.stocks = response.data;
    });
    this.$http.get('/api/stocks/symbol/top').then(response => {
      this.tops = response.data;
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
}

export default angular.module('brainwavesFullstackApp.main', [
  uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
