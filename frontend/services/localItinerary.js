const BASE_THEMES = [
  "Arrival & First Impressions",
  "Signature Sights",
  "Local Flavors",
  "Hidden Corners",
  "Views & Sunsets",
  "Day Trip & Nature",
  "Slow Morning, Long Night",
];

const pickTheme = (dayIndex, totalDays) => {
  return BASE_THEMES[dayIndex] || `Day ${dayIndex + 1} Highlights`;
};

const interestToType = (interest) => {
  const lower = interest.toLowerCase();
  if (lower.includes("food")) return "food";
  if (lower.includes("night") || lower.includes("party")) return "relaxation";
  if (lower.includes("nature")) return "relaxation";
  if (lower.includes("adventure")) return "adventure";
  if (lower.includes("history") || lower.includes("art") || lower.includes("culture")) return "sightseeing";
  if (lower.includes("shopping")) return "sightseeing";
  return "sightseeing";
};

const budgetLine = (budget) => {
  if (budget === "Budget") {
    return "Most picks are wallet‑friendly spots loved by locals, with a few special splurges.";
  }
  if (budget === "Luxury") {
    return "Expect elevated stays, tasting menus, and a bit of VIP energy in each day.";
  }
  return "A balanced mix of casual favorites and one‑or‑two memorable splurges.";
};

export const generateLocalItinerary = async (formData) => {
  const interests = formData.interests.length ? formData.interests : ["Sightseeing", "Food"];

  const summary = [
    `A ${formData.duration}-day escape in ${formData.destination}, built around ${interests.join(
      ", "
    )}.`,
    "Days start with simple anchors so you’re never rushing, then build into one or two memorable set‑pieces.",
    budgetLine(formData.budget),
  ].join(" ");

  const days = Array.from({ length: formData.duration }, (_, index) => {
    const dayNumber = index + 1;
    const theme = pickTheme(index, formData.duration);

    const primaryInterest = interests[index % interests.length];
    const secondaryInterest = interests[(index + 1) % interests.length];

    const activities = [
      {
        time: "Morning",
        activity: `Easy start in ${formData.destination}`,
        description: `Walk a calm neighborhood, grab coffee, and get a feel for ${formData.destination} before the day fills up.`,
        location: `Central ${formData.destination}`,
        type: "relaxation",
      },
      {
        time: "Late Morning",
        activity: `${primaryInterest}‑focused stop`,
        description: `Spend a couple of hours leaning into ${primaryInterest.toLowerCase()} — pick a spot that instantly says “you’re really in ${formData.destination} now”.`,
        location: `${formData.destination} — main ${primaryInterest.toLowerCase()} area`,
        type: interestToType(primaryInterest),
      },
      {
        time: "Afternoon",
        activity: `${secondaryInterest} detour`,
        description: `Head somewhere with a different energy: a contrasting district, a market, a quiet viewpoint, or a gallery — whatever matches your ${secondaryInterest.toLowerCase()} side.`,
        location: `${formData.destination} — contrasting neighborhood`,
        type: interestToType(secondaryInterest),
      },
      {
        time: "Evening",
        activity: "Dinner & slow walk",
        description: `Book a simple but memorable dinner spot, then walk it off through a well‑lit area. Think golden hour photos, street lights, and an easy route back to your stay.`,
        location: `${formData.destination} — dinner street or waterfront`,
        type: "food",
      },
      {
        time: "Night",
        activity: "Optional late‑night add‑on",
        description:
          "If you still have energy, find one late‑night view, rooftop, or café. If not, this is simply your buffer to rest, pack, or journal the day.",
        location: `${formData.destination} — safe late‑night area`,
        type: "relaxation",
      },
    ];

    return {
      dayNumber,
      theme,
      activities,
    };
  });

  const tripName = `${formData.destination} • ${formData.duration}-Day Outline`;

  return {
    tripName,
    destination: formData.destination,
    summary,
    days,
  };
};


