const fetchData = async () => {
  const res = await fetch(import.meta.env.BASE_URL + "headlines.json");
  const json = await res.json();
  return json;
};

const prepareData = (json) => {
  return json
    .slice(0, 5)
    .map((h) => h.title)
    .map((h) => h.replaceAll("»", "").replaceAll("«", ""));
};

export const getData = async () => {
  const json = await fetchData();
  return prepareData(json);
};
