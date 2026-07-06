# react-klinecharts
> React component for klinecharts.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![download][download-image]][download-url]

## installation
```shell
npm install -S @jswork/react-klinecharts
```

## usage
  ```js
  import { SimpleChart, ReactKlineChart, Indicator } from '@jswork/react-klinecharts';
  import { useStockData } from './hooks/use-stock-data';
  import '@jswork/react-klinecharts/dist/style.scss';

  function App() {
    const { data, signals, loading, error } = useStockData();

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-xl text-gray-600">加载中...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-xl text-red-600">错误: {error}</div>
        </div>
      );
    }

    if (!data) {
      return null;
    }

    return (
      <div className="container mx-auto p-5 bg-gray-50 min-h-screen">
        <div className="badge badge-warning absolute right-0 top-0 m-4">
          Build Time: {BUILD_TIME}
        </div>

        <h1 className="text-3xl font-bold mb-5 text-gray-800">
          ReactKlineChart 示例
        </h1>

        {/* SimpleChart 预设组件 */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            SimpleChart 预设组件（主图 + 成交量 + MACD）
          </h2>
          <SimpleChart
            data={data}
            signals={signals}
            theme="dark"
            height={600}
          />
        </div>

        {/* 自定义组合示例 */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            自定义组合（主图 + VOL + KDJ + RSI）
          </h2>
          <ReactKlineChart
            data={data}
            signals={signals}
            theme="dark"
            height={600}
            maParams={{ periods: [5, 10, 20, 60], colors: ['#ffffff', '#ff6600', '#00ff00', '#ff00ff'] }}
          >
            <Indicator type="VOL" />
            <Indicator type="KDJ" params={{ n: 9, m1: 3, m2: 3 }} />
            <Indicator type="RSI" params={{ period: 14 }} />
          </ReactKlineChart>
        </div>

        {/* 统计信息 */}
        <div className="mt-4 text-sm text-gray-600 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">数据统计</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">数据来源:</span> 东方财富API（上证指数）</p>
              <p><span className="font-semibold">数据量:</span> {data.length} 条K线</p>
              <p><span className="font-semibold">时间范围:</span> {new Date(data[0].timestamp).toLocaleDateString()} - {new Date(data[data.length - 1].timestamp).toLocaleDateString()}</p>
            </div>
            <div>
              <p><span className="font-semibold">信号数量:</span> {signals.length} 个信号点</p>
              <p><span className="font-semibold">买入信号:</span> {signals.filter(s => s.type === 'buy').length} 个</p>
              <p><span className="font-semibold">卖出信号:</span> {signals.filter(s => s.type === 'sell').length} 个</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default App;
  ```

## preview
- https://afeiship.github.io/react-klinecharts/

## license
Code released under [the MIT license](https://github.com/afeiship/react-klinecharts/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/react-klinecharts
[version-url]: https://npmjs.org/package/@jswork/react-klinecharts

[license-image]: https://img.shields.io/npm/l/@jswork/react-klinecharts
[license-url]: https://github.com/afeiship/react-klinecharts/blob/master/LICENSE.txt

[download-image]: https://img.shields.io/npm/dm/@jswork/react-klinecharts
[download-url]: https://www.npmjs.com/package/@jswork/react-klinecharts
