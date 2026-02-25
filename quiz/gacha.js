let allitem = [];

fetch("item.json")
  .then((response) => response.json())
  .then((data) => {
    if (!Array.isArray(data)) {
        allitem = Object.values(data);
    } else {
        allitem = data;
    }
  })