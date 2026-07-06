// packages/example/src/hooks/use-stock-data.ts

import { useState, useEffect } from 'react';
import type { KLineData, Signal } from '@jswork/react-klinecharts/src/main';
import stockData from '../assets/eastmoney.json';
import signalsData from '../assets/signals.json';

interface EastmoneyResponse {
  data: {
    klines: string[];
  };
}

/**
 * 解析单条K线字符串为KLineData对象
 * 格式: "日期,开盘,收盘,最高,最低,成交量,成交额,振幅,涨跌幅,涨跌额,换手率"
 */
function parseKLine(line: string): KLineData {
  const fields = line.split(',');
  return {
    timestamp: new Date(fields[0]).getTime(),
    open: parseFloat(fields[1]),
    close: parseFloat(fields[2]),
    high: parseFloat(fields[3]),
    low: parseFloat(fields[4]),
    volume: parseFloat(fields[5]),
    turnover: parseFloat(fields[6]),
  };
}

/**
 * 加载本地JSON数据并解析为KLineData数组
 */
export function useStockData(): {
  data: KLineData[] | null;
  signals: Signal[];
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<KLineData[] | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // 解析K线数据
      const klines = (stockData as EastmoneyResponse).data?.klines;
      if (!klines || !Array.isArray(klines)) {
        throw new Error('Invalid data format: klines array not found');
      }
      const parsedData = klines.map(parseKLine);
      setData(parsedData);

      // 解析信号数据
      const parsedSignals = (signalsData as any).signals || [];
      setSignals(parsedSignals);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load stock data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, signals, loading, error };
}