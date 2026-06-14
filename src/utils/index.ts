// Utility functions
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function formatNumber(num) {
  return Number(num).toLocaleString();
}
