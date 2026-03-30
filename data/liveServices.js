const CATEGORY_TAGS = {
  plumber: [{ key: 'craft', value: 'plumber' }],
  electrician: [{ key: 'craft', value: 'electrician' }],
  tutor: [
    { key: 'amenity', value: 'school' },
    { key: 'amenity', value: 'language_school' },
    { key: 'office', value: 'educational_institution' }
  ],
  cleaner: [
    { key: 'shop', value: 'laundry' },
    { key: 'shop', value: 'dry_cleaning' },
    { key: 'office', value: 'cleaning' }
  ],
  painter: [{ key: 'craft', value: 'painter' }],
  mechanic: [{ key: 'shop', value: 'car_repair' }],
  all: [
    { key: 'shop', value: 'hardware' },
    { key: 'shop', value: 'doityourself' },
    { key: 'shop', value: 'trade' },
    { key: 'office', value: 'company' }
  ]
};

const CATEGORY_IMAGES = {
  plumber:
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
  electrician:
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80',
  tutor:
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80',
  cleaner:
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
  painter:
    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80',
  mechanic:
    'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80',
  all:
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80'
};

const FALLBACK_PHONE = '+1 (800) 000-0000';

export async function fetchNearbyLiveServices(latitude, longitude, radiusMeters = 7000) {
  const primary = await fetchOverpassBatch(latitude, longitude, radiusMeters);
  let mapped = mapElementsToServices(primary, latitude, longitude);

  // If area is sparse, expand search radius to gather more results.
  if (mapped.length < 40) {
    const secondary = await fetchOverpassBatch(latitude, longitude, Math.max(radiusMeters, 14000));
    mapped = mapElementsToServices([...primary, ...secondary], latitude, longitude);
  }

  if (!mapped.length) {
    throw new Error('No nearby live services were found for this area.');
  }

  return mapped;
}

function buildOverpassQuery(latitude, longitude, radiusMeters) {
  const lines = ['[out:json][timeout:25];', '('];

  Object.values(CATEGORY_TAGS)
    .flat()
    .forEach((tag) => {
      lines.push(`node["${tag.key}"="${tag.value}"](around:${radiusMeters},${latitude},${longitude});`);
      lines.push(`way["${tag.key}"="${tag.value}"](around:${radiusMeters},${latitude},${longitude});`);
      lines.push(`relation["${tag.key}"="${tag.value}"](around:${radiusMeters},${latitude},${longitude});`);
    });

  lines.push(');');
  lines.push('out center 400;');
  return lines.join('\n');
}

function mapElementsToServices(elements, originLat, originLon) {
  const unique = new Map();

  elements.forEach((element) => {
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return;
    }

    const tags = element.tags || {};
    const category = detectCategory(tags);
    const name = tags.name || tags.operator || tags.brand || fallbackName(category, element.id);
    const id = `${element.type}_${element.id}`;
    if (unique.has(id)) {
      return;
    }

    const distanceKm = haversineKm(originLat, originLon, lat, lon);
    const ratingSeed = pseudoNumberFromText(id);
    const rating = Math.min(5, Math.max(4.1, 4.1 + (ratingSeed % 90) / 100));

    unique.set(id, {
      id,
      name,
      category,
      rating: Number(rating.toFixed(1)),
      reviews: 20 + (ratingSeed % 240),
      distanceKm: Number(distanceKm.toFixed(1)),
      priceLabel: priceLabelFromCategory(category),
      city: tags['addr:city'] || tags['addr:town'] || tags['addr:state'] || 'Nearby',
      description: descriptionFromCategory(category),
      image: CATEGORY_IMAGES[category] || CATEGORY_IMAGES.all,
      phone: tags.phone || tags['contact:phone'] || FALLBACK_PHONE,
      address: formatAddress(tags),
      location: {
        latitude: lat,
        longitude: lon
      },
      featured: distanceKm <= 2.5
    });
  });

  const sorted = [...unique.values()].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 220);
  return limitCategoryResults(sorted, 'tutor', 5);
}

function detectCategory(tags) {
  const craft = tags.craft;
  const amenity = tags.amenity;
  const shop = tags.shop;
  const office = tags.office;

  if (craft === 'plumber') return 'plumber';
  if (craft === 'electrician') return 'electrician';
  if (craft === 'painter') return 'painter';
  if (shop === 'car_repair') return 'mechanic';
  if (shop === 'laundry' || shop === 'dry_cleaning' || office === 'cleaning') return 'cleaner';
  if (amenity === 'school' || amenity === 'language_school' || office === 'educational_institution') {
    return 'tutor';
  }

  return 'all';
}

function formatAddress(tags) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:city'],
    tags['addr:state']
  ].filter(Boolean);

  return parts.join(' ') || 'Address unavailable';
}

function priceLabelFromCategory(category) {
  const map = {
    plumber: '₹600-1500 / visit',
    electrician: '₹500-1200 / hour',
    tutor: '₹400-900 / hour',
    cleaner: '₹1200-2600 / session',
    painter: '₹1500+ / quote',
    mechanic: '₹700-2000 / inspection',
    all: '₹500+'
  };

  return map[category] || map.all;
}

function descriptionFromCategory(category) {
  const map = {
    plumber: 'Nearby plumbing professionals available based on your current location.',
    electrician: 'Nearby electricians discovered in real-time around your location.',
    tutor: 'Nearby education and tutoring providers found in your area.',
    cleaner: 'Nearby cleaning services currently available around you.',
    painter: 'Nearby painting professionals listed for your area.',
    mechanic: 'Nearby auto repair and mechanic services around your location.',
    all: 'Nearby service provider fetched live from your current location.'
  };

  return map[category] || map.all;
}

function fallbackName(category, id) {
  const label = category === 'all' ? 'Local Service' : category.charAt(0).toUpperCase() + category.slice(1);
  return `${label} Provider ${String(id).slice(-4)}`;
}

function pseudoNumberFromText(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

async function fetchOverpassBatch(latitude, longitude, radiusMeters) {
  const query = buildOverpassQuery(latitude, longitude, radiusMeters);
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: query
  });

  if (!response.ok) {
    throw new Error('Live service API failed to respond.');
  }

  const json = await response.json();
  return json.elements || [];
}

function limitCategoryResults(services, category, maxCount) {
  let count = 0;
  return services.filter((service) => {
    if (service.category !== category) return true;
    count += 1;
    return count <= maxCount;
  });
}
