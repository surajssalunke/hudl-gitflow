export function transformObjectToChartData(
  obj: Record<string, number>
): { name: string; value: number }[] {
  return Object.entries(obj).map(([key, value]) => ({
    name: key,
    value,
  }));
}

export function transformDateRangeToISO(dateRange: {
  start: Date;
  end: Date;
}): { start: string; end: string } {
  return {
    start: dateRange.start.toISOString().slice(0, 10),
    end: dateRange.end.toISOString().slice(0, 10),
  };
}
