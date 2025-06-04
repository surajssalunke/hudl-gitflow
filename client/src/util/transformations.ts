export function transformObjectToChartData(
  obj: Record<string, number>
): { name: string; value: number }[] {
  return Object.entries(obj).map(([key, value]) => ({
    name: key,
    value,
  }));
}
