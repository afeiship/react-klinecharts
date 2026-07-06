import { SimpleChart, type KLineData, type Signal } from '@jswork/react-klinecharts/src/main';
import '@jswork/react-klinecharts/src/style.scss';

// 模拟K线数据
const mockData: KLineData[] = [
  { timestamp: 1625097600000, open: 100, high: 105, low: 98, close: 103, volume: 1000000 },
  { timestamp: 1625184000000, open: 103, high: 108, low: 102, close: 107, volume: 1200000 },
  { timestamp: 1625270400000, open: 107, high: 110, low: 105, close: 108, volume: 1100000 },
];

// 模拟买卖信号
const mockSignals: Signal[] = [
  { type: 'buy', timestamp: 1625097600000, price: 100, text: '买入' },
  { type: 'sell', timestamp: 1625184000000, price: 107, text: '卖出' },
];

function App() {
  return (
    <div className="m-10 p-4 shadow bg-gray-100 text-gray-800 hover:shadow-md transition-all">
      <div className="badge badge-warning absolute right-0 top-0 m-4">
        Build Time: {BUILD_TIME}
      </div>
      <h1 className="text-2xl font-bold mb-4">ReactKlineChart 示例</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">SimpleChart 预设组件</h2>
        <SimpleChart
          data={mockData}
          signals={mockSignals}
          theme="dark"
          height={500}
        />
      </div>
    </div>
  );
}

export default App;
