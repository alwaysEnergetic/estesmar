
export const formatNumber = (v) => {
    return parseFloat(v).toLocaleString('en-US', { maximumFractionDigits: 0 });
}
