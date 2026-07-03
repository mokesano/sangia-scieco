import React, { useEffect, useRef } from 'react';

/**
 * FrappeChart Component
 * Transformasi dari frappe_chart.twig
 * @param {string} chartId - ID unik elemen
 * @param {string} chartType - 'bar'|'line'|'pie'|'percentage' (default: 'bar')
 * @param {string} chartTitle - Judul chart
 * @param {Array} labels - Array of string
 * @param {Array} datasets - Array of {name: string, values: array}
 * @param {number} height - Tinggi chart (default: 220)
 * @param {Array} colors - Array of hex string (optional)
 * @param {boolean} isNavigable - (default: false)
 */
const FrappeChart = ({
  chartId,
  chartType = 'bar',
  chartTitle = '',
  labels = [],
  datasets = [],
  height = 220,
  colors = [],
  isNavigable = false,
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Load frappe-charts script dynamically if not already loaded
    const loadFrappeChart = () => {
      if (typeof frappe !== 'undefined' && frappe.Chart) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/frappe-charts/dist/frappe-charts.min.umd.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadFrappeChart()
      .then(() => {
        if (chartRef.current && !chartInstance.current) {
          chartInstance.current = new frappe.Chart(chartRef.current, {
            title: chartTitle,
            data: { labels, datasets },
            type: chartType,
            height,
            ...(colors.length > 0 && { colors }),
            isNavigable,
            lineOptions: { regionFill: 1, hideDots: 0 },
            axisOptions: { xIsSeries: true },
          });
        }
      })
      .catch((error) => {
        console.error('Failed to load frappe-charts:', error);
      });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [chartId, chartType, chartTitle, labels, datasets, height, colors, isNavigable]);

  return <div id={chartId} ref={chartRef} className="frappe-chart-wrapper"></div>;
};

export default FrappeChart;
