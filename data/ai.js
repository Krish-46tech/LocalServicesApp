const ISSUE_RULES = [
  { category: 'plumber', urgency: 'high', keywords: ['leak', 'pipe', 'tap', 'drain', 'sewer', 'water'] },
  { category: 'electrician', urgency: 'high', keywords: ['power', 'spark', 'switch', 'socket', 'wiring', 'electric'] },
  { category: 'mechanic', urgency: 'medium', keywords: ['car', 'bike', 'engine', 'battery', 'brake', 'vehicle'] },
  { category: 'carpenter', urgency: 'medium', keywords: ['wood', 'door', 'furniture', 'cabinet', 'wardrobe'] },
  { category: 'ac_repair', urgency: 'medium', keywords: ['ac', 'air conditioner', 'cooling', 'compressor'] },
  { category: 'appliance_repair', urgency: 'medium', keywords: ['fridge', 'washing machine', 'oven', 'microwave', 'appliance'] },
  { category: 'pest_control', urgency: 'medium', keywords: ['termite', 'cockroach', 'rat', 'pest', 'insect'] },
  { category: 'cleaner', urgency: 'low', keywords: ['clean', 'deep clean', 'dust', 'mop', 'sanitize'] },
  { category: 'painter', urgency: 'low', keywords: ['paint', 'wall color', 'repaint', 'coating'] },
  { category: 'beauty_salon', urgency: 'low', keywords: ['hair', 'facial', 'salon', 'spa', 'beauty'] },
  { category: 'mover', urgency: 'medium', keywords: ['shift', 'move', 'relocation', 'packing'] },
  { category: 'tutor', urgency: 'low', keywords: ['study', 'math', 'science', 'tuition', 'exam', 'tutor'] }
];

const VALID_CATEGORIES = [
  'all',
  'plumber',
  'electrician',
  'tutor',
  'cleaner',
  'painter',
  'mechanic',
  'carpenter',
  'ac_repair',
  'pest_control',
  'beauty_salon',
  'mover',
  'appliance_repair'
];

const VALID_URGENCY = ['low', 'medium', 'high'];

export async function classifyIssueToServiceAI(inputText) {
  const fallback = classifyIssueToService(inputText);
  const text = String(inputText || '').trim();

  if (!text) {
    return fallback;
  }

  const apiKey = process.env.EXPO_PUBLIC_AI_API_KEY;
  const baseUrl = process.env.EXPO_PUBLIC_AI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.EXPO_PUBLIC_AI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    return {
      ...fallback,
      reason: `${fallback.reason} (External AI key not configured; using local fallback.)`,
      source: 'fallback'
    };
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        messages: [
          {
            role: 'system',
            content:
              'You are a strict issue classifier for a local services app. Reply ONLY with valid JSON object: {"category":"...","urgency":"low|medium|high","confidence":0-1,"reason":"..."}. No markdown.'
          },
          {
            role: 'user',
            content: `Issue text: ${text}\nAllowed categories: ${VALID_CATEGORIES.join(', ')}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error ${response.status}`);
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content || '';
    const parsed = parseAIResponse(content);

    return {
      category: sanitizeCategory(parsed.category, fallback.category),
      urgency: sanitizeUrgency(parsed.urgency, fallback.urgency),
      confidence: sanitizeConfidence(parsed.confidence, fallback.confidence),
      reason: parsed.reason || 'External AI classification applied.',
      source: 'external_ai'
    };
  } catch {
    return {
      ...fallback,
      reason: `${fallback.reason} (External AI unavailable; using local fallback.)`,
      source: 'fallback'
    };
  }
}

export function classifyIssueToService(inputText) {
  const text = String(inputText || '').trim().toLowerCase();
  if (!text) {
    return {
      category: 'all',
      urgency: 'low',
      confidence: 0,
      reason: 'No issue text entered.',
      source: 'fallback'
    };
  }

  let best = { category: 'all', urgency: 'low', confidence: 0, reason: 'No direct keyword match.', source: 'fallback' };

  ISSUE_RULES.forEach((rule) => {
    let matches = 0;
    rule.keywords.forEach((keyword) => {
      if (text.includes(keyword)) matches += 1;
    });

    if (matches > 0) {
      const confidence = Math.min(0.95, 0.35 + matches * 0.15);
      if (confidence > best.confidence) {
        best = {
          category: rule.category,
          urgency: rule.urgency,
          confidence,
          reason: `Matched keywords for ${rule.category}.`,
          source: 'fallback'
        };
      }
    }
  });

  return best;
}

export function addTrustSignals(service, sourceMode = 'live') {
  let score = 50;
  const reasons = [];

  if (service.rating >= 4.7) {
    score += 14;
    reasons.push('Strong rating trend');
  } else if (service.rating >= 4.4) {
    score += 8;
    reasons.push('Good rating trend');
  }

  if ((service.reviews || 0) >= 120) {
    score += 12;
    reasons.push('High review count');
  } else if ((service.reviews || 0) >= 40) {
    score += 7;
    reasons.push('Moderate review count');
  }

  if (service.phone && !String(service.phone).includes('0000')) {
    score += 8;
    reasons.push('Contact number available');
  } else {
    score -= 6;
    reasons.push('Contact number looks generic');
  }

  if (service.address && service.address !== 'Address unavailable') {
    score += 8;
    reasons.push('Address available');
  } else {
    score -= 5;
    reasons.push('Address not available');
  }

  if (sourceMode === 'live') {
    score += 6;
    reasons.push('Live location listing');
  } else {
    score -= 4;
    reasons.push('Fallback listing source');
  }

  if ((service.distanceKm || 99) > 20) {
    score -= 6;
    reasons.push('Far from selected area');
  }

  const bounded = Math.max(0, Math.min(100, score));
  const level = bounded >= 80 ? 'High Trust' : bounded >= 60 ? 'Medium Trust' : 'Low Trust';
  const flagged = bounded < 55;

  return {
    ...service,
    trust: {
      score: bounded,
      level,
      flagged,
      reasons: reasons.slice(0, 3)
    }
  };
}

function parseAIResponse(content) {
  const raw = String(content || '').trim();
  const clean = raw.startsWith('```') ? raw.replace(/```json|```/g, '').trim() : raw;
  return JSON.parse(clean);
}

function sanitizeCategory(value, fallback) {
  return VALID_CATEGORIES.includes(value) ? value : fallback;
}

function sanitizeUrgency(value, fallback) {
  return VALID_URGENCY.includes(value) ? value : fallback;
}

function sanitizeConfidence(value, fallback) {
  const num = Number(value);
  if (Number.isNaN(num)) return fallback;
  return Math.max(0, Math.min(1, num));
}
