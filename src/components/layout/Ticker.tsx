
import React from 'react';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const mockStocks: StockData[] = [
  { symbol: 'IBOV', name: 'Ibovespa', price: 128750.32, change: 1250.45, changePercent: 0.98 },
  { symbol: 'USD', name: 'Dólar', price: 5.13, change: -0.04, changePercent: -0.78 },
  { symbol: 'EUR', name: 'Euro', price: 5.62, change: 0.02, changePercent: 0.36 },
  { symbol: 'BTC', name: 'Bitcoin', price: 295475.82, change: 12540.32, changePercent: 4.43 },
  { symbol: 'PETR4', name: 'Petrobras', price: 37.81, change: 0.94, changePercent: 2.55 },
  { symbol: 'VALE3', name: 'Vale', price: 68.25, change: -1.37, changePercent: -1.97 },
  { symbol: 'ITUB4', name: 'Itaú', price: 35.17, change: 0.22, changePercent: 0.63 },
  { symbol: 'BBDC4', name: 'Bradesco', price: 14.92, change: -0.18, changePercent: -1.19 },
];

const StockTicker: React.FC = () => {
  const formatChange = (change: number) => {
    return change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
  };

  const formatPercent = (percent: number) => {
    return percent > 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`;
  };

  return (
    <div className="bg-finance-light-gray border-y border-finance-neutral/20 overflow-hidden py-2">
      <div className="ticker-container relative">
        <div className="animate-ticker whitespace-nowrap inline-block">
          {mockStocks.map((stock, index) => (
            <span key={index} className="mx-6 inline-flex items-center">
              <span className="font-semibold">{stock.symbol}</span>
              <span className="mx-2 text-finance-neutral">{stock.price.toFixed(2)}</span>
              <span className={stock.change >= 0 ? 'stock-up' : 'stock-down'}>
                {formatChange(stock.change)} ({formatPercent(stock.changePercent)})
              </span>
            </span>
          ))}
          
          {/* Duplicate for seamless looping */}
          {mockStocks.map((stock, index) => (
            <span key={`dup-${index}`} className="mx-6 inline-flex items-center">
              <span className="font-semibold">{stock.symbol}</span>
              <span className="mx-2 text-finance-neutral">{stock.price.toFixed(2)}</span>
              <span className={stock.change >= 0 ? 'stock-up' : 'stock-down'}>
                {formatChange(stock.change)} ({formatPercent(stock.changePercent)})
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockTicker;
