export function filterServices(services, { search = '', category = 'all' } = {}) {
  const query = search.trim().toLowerCase();

  return services.filter((service) => {
    const matchesCategory = category === 'all' || service.category === category;
    const matchesSearch =
      !query ||
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.category.toLowerCase().includes(query) ||
      (service.address || '').toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}

export function sortServices(services, sort = 'topRated') {
  const copy = [...services];

  if (sort === 'nearest') {
    return copy.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  if (sort === 'priceLow') {
    return copy.sort((a, b) => normalizePrice(a.priceLabel) - normalizePrice(b.priceLabel));
  }

  return copy.sort((a, b) => b.rating - a.rating);
}

function normalizePrice(label) {
  if (!label) return 999;
  const matches = label.match(/\d+/g);
  if (matches?.length) {
    return Number(matches[0]);
  }
  return 999;
}
