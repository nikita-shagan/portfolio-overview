export async function request<T>(params: {
  url: string;
  path: string;
}): Promise<T> {
  const { url, path } = params;
  const response = await fetch(`${url}/${path}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return (await response.json()) as T;
}
