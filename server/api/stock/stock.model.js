'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './stock.events';

var StockSchema = new mongoose.Schema({
  date: Date,
  symbol: String,
  open: Number,
  close: Number,
  low: Number,
  high: Number,
  volume: Number,
});

registerEvents(StockSchema);
export default mongoose.model('Stock', StockSchema);
