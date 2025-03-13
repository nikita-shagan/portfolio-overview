export const formatNumber = (num: number, decimals = 2) => {
  return (Math.round(num * 100) / 100).toFixed(decimals);
};
