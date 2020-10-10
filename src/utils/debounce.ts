export const debounce = (func: Function, ms: number): ((...args: any[]) => void) => {
  let timer: number;

  return (...args: any[]): void => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => func(...args), ms);
  };
};
