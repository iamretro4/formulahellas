export const urlFor = (source: any) => {
  const chain = {
    url: () => '',
    width: () => chain,
    height: () => chain,
    blur: () => chain,
    format: () => chain,
  };
  return chain as any;
};
