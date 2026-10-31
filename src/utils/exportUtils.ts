/**
 * Export and Reporting Utilities for Betora HMS
 * Generates standards-compliant CSV files and formatted executive PDF print views.
 */

export interface CSVColumn<T> {
  header: string;
  accessor: (item: T) => string | number;
}

/**
 * Escapes CSV cell values to handle commas, quotes, and newlines safely.
 */
function escapeCSVCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates and triggers download of a CSV file in the browser.
 */
export function downloadCSV<T>(
  filename: string,
  data: T[],
  columns: CSVColumn<T>[]
): void {
  const headers = columns.map(col => escapeCSVCell(col.header)).join(',');
  const rows = data.map(item =>
    columns.map(col => escapeCSVCell(col.accessor(item))).join(',')
  );

  const csvContent = [headers, ...rows].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Directly downloads raw multi-table CSV content
 */
export function downloadRawCSV(filename: string, csvContent: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats a timestamp for report filenames (e.g. 2026-10-31)
 */
export function getReportDateStamp(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}
