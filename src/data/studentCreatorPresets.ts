import { StudentCreatorData } from "../types";

export interface UniversityPreset {
  id: string;
  name: string;
  shortName: string;
  location: string;
  enrollment: string;
  colors: { primary: string; secondary: string; bgBadge: string };
  mascotOrVibe: string;
  topMajors: string[];
}

export const UNIVERSITY_PRESETS: UniversityPreset[] = [
  {
    id: "ucla",
    name: "University of California, Los Angeles (UCLA)",
    shortName: "UCLA",
    location: "Los Angeles, CA",
    enrollment: "46,000 Students",
    colors: { primary: "#2774AE", secondary: "#FFD100", bgBadge: "#EBF5FB" },
    mascotOrVibe: "Bruin Nation & Westwood Life",
    topMajors: ["Computer Science", "Biology / Pre-Med", "Film & Media", "Economics"],
  },
  {
    id: "ut-austin",
    name: "University of Texas at Austin",
    shortName: "UT Austin",
    location: "Austin, TX",
    enrollment: "52,000 Students",
    colors: { primary: "#BF5700", secondary: "#333F48", bgBadge: "#FDF2E9" },
    mascotOrVibe: "Longhorn Spirit & Austin Tech Hub",
    topMajors: ["Computer Science", "Business / McCombs", "Mechanical Engineering", "Advertising"],
  },
  {
    id: "nyu",
    name: "New York University (NYU)",
    shortName: "NYU",
    location: "New York, NY",
    enrollment: "58,000 Students",
    colors: { primary: "#57068C", secondary: "#8900E1", bgBadge: "#F4ECF7" },
    mascotOrVibe: "Washington Square & NYC Creator Capital",
    topMajors: ["Tisch Film & Arts", "Stern Business", "Journalism", "Liberal Studies"],
  },
  {
    id: "umich",
    name: "University of Michigan",
    shortName: "Michigan",
    location: "Ann Arbor, MI",
    enrollment: "51,000 Students",
    colors: { primary: "#00274C", secondary: "#FFCB05", bgBadge: "#E8F0FE" },
    mascotOrVibe: "Wolverine Pride & Big House Game Days",
    topMajors: ["Ross Business", "Engineering", "Psychology", "Kinesiology / NIL"],
  },
  {
    id: "uc-berkeley",
    name: "University of California, Berkeley",
    shortName: "UC Berkeley",
    location: "Berkeley, CA",
    enrollment: "45,000 Students",
    colors: { primary: "#003262", secondary: "#FDB515", bgBadge: "#E6F0FA" },
    mascotOrVibe: "Cal Silicon Valley & Research Grinders",
    topMajors: ["EECS & Data Science", "Haas Business", "Molecular Biology", "Political Science"],
  },
  {
    id: "uf",
    name: "University of Florida",
    shortName: "Florida",
    location: "Gainesville, FL",
    enrollment: "55,000 Students",
    colors: { primary: "#0021A5", secondary: "#FA4616", bgBadge: "#E8EEF9" },
    mascotOrVibe: "Gator Nation, Greek Life & Game Days",
    topMajors: ["Health Sciences", "Finance", "Agricultural Studies", "Mechanical Engineering"],
  },
  {
    id: "stanford",
    name: "Stanford University",
    shortName: "Stanford",
    location: "Stanford, CA",
    enrollment: "17,000 Students",
    colors: { primary: "#8C1515", secondary: "#2E2D29", bgBadge: "#F9ECEC" },
    mascotOrVibe: "Farm Tech Founders & Silicon Valley Network",
    topMajors: ["Computer Science", "Symbolic Systems", "Bioengineering", "Management Science"],
  },
];

export function generateStudentCreatorDataset(
  uniName: string = "UCLA",
  selectedSeason: string = "midterms",
  majorFocus: string = "All Majors",
  creatorHandle: string = "@creator"
): StudentCreatorData {
  const isFinals = selectedSeason === "finals";
  const isWelcome = selectedSeason === "welcome";
  const isMidterms = selectedSeason === "midterms";

  return {
    university: uniName,
    campusEnrollment: uniName.includes("Stanford") ? "17,500 students" : "48,000+ students",
    campusReachScore: isFinals ? 96 : isWelcome ? 98 : 91,
    peerTrustIndex: "94.6% Peer Recommendation Affinity",
    academicCycle: {
      termName: isFinals
        ? "Finals Week Sprint & Exam Marathon"
        : isWelcome
        ? "Welcome Week & Fall Rush Onboarding"
        : "Midterms Crunch & Project Deadlines",
      viewershipVelocityMultiplier: isFinals ? 1.62 : isWelcome ? 1.45 : 1.28,
      studyContentAppetite: isFinals ? "Peak" : isWelcome ? "Moderate" : "High",
      lifestyleContentAppetite: isWelcome ? "Peak" : isFinals ? "Low" : "High",
      recommendedPostingCadence: isFinals
        ? "2-3 Study-With-Me streams/week + 1 Quick Cram Hack Short/day"
        : isWelcome
        ? "Daily Campus Vlogs, Dorm Organization, & Social Recaps"
        : "3-4 Posts/Week: 2 Routine Vlogs, 1 Career/Study Guide, 1 Weekend Recap",
      keyInsight: isFinals
        ? "Audience watch time surges by +62% during finals; students crave low-friction ambient study streams (Pomodoro 50/10) and condensed survival tips between 11 PM and 2 AM."
        : isWelcome
        ? "Freshmen and transfer students drive a massive +45% spike in dorm tours, class schedule walk-throughs, and dining hall rankings."
        : "Midterms season triggers peak demand for productivity setups, study snack meal prep, and genuine 'realistic college day in the life' balance content.",
    },
    cohortBreakdown: [
      {
        standing: "Freshmen",
        percentage: 34,
        primaryInterests: ["Dorm Room Setup", "Campus Dining Hacks", "Making Friends", "First-Year Survival"],
        retentionIndex: 124,
      },
      {
        standing: "Sophomores",
        percentage: 27,
        primaryInterests: ["Off-Campus Apartment Hunting", "Declaring Major", "Greek Life", "Study Routines"],
        retentionIndex: 108,
      },
      {
        standing: "Juniors",
        percentage: 21,
        primaryInterests: ["Summer Internships", "Career Fairs & Resumes", "Balancing Part-Time Jobs", "Upper-Div Seminars"],
        retentionIndex: 114,
      },
      {
        standing: "Seniors",
        percentage: 13,
        primaryInterests: ["Senior Capstone", "Full-Time Job Hunt", "Graduation Bucket List", "Post-Grad Budgeting"],
        retentionIndex: 98,
      },
      {
        standing: "Graduate / Postgrad",
        percentage: 5,
        primaryInterests: ["Research Lab Work", "Thesis Writing ASMR", "Fellowships", "Work-Life Balance"],
        retentionIndex: 102,
      },
    ],
    majorsDistribution: [
      { field: "STEM & Computer Science", percentage: 38, avgEngagementRate: 6.8 },
      { field: "Business, Finance & Econ", percentage: 26, avgEngagementRate: 5.9 },
      { field: "Pre-Med, Biology & Nursing", percentage: 18, avgEngagementRate: 7.4 },
      { field: "Media, Film, Arts & Design", percentage: 11, avgEngagementRate: 8.2 },
      { field: "Humanities, Law & Social Sciences", percentage: 7, avgEngagementRate: 5.2 },
    ],
    housingBreakdown: [
      { type: "On-Campus Dorms", percentage: 46 },
      { type: "Off-Campus Apartments", percentage: 34 },
      { type: "Greek / Co-op Housing", percentage: 13 },
      { type: "Commuter Students", percentage: 7 },
    ],
    campusPeakHours: [
      { timeSlot: "7:00 AM - 9:00 AM", activityLevel: 32, note: "Morning routines & coffee walks before 8am lectures" },
      { timeSlot: "11:30 AM - 1:30 PM", activityLevel: 78, note: "Between-class dining hall scroll & library check-in" },
      { timeSlot: "4:00 PM - 6:00 PM", activityLevel: 62, note: "Club meetings, campus gym workout & study wrap-up" },
      { timeSlot: "8:00 PM - 10:00 PM", activityLevel: 88, note: "Post-dinner homework grind & evening social recap" },
      { timeSlot: "10:30 PM - 2:00 AM", activityLevel: 96, note: "Peak study cramming, late-night dorm chats & ASMR" },
      { timeSlot: "2:00 AM - 6:00 AM", activityLevel: 14, note: "Dorm quiet hours & minimal active scrolling" },
    ],
    topCampusFormats: [
      {
        formatName: "Day in the Life (Realistic Routine)",
        avgRetentionPercent: 68,
        engagementRate: 8.4,
        bestPostingWindow: "Sundays at 6:30 PM (Pre-week inspiration)",
        collegiateViralityScore: 94,
        brandSponsorSuitability: "Elite",
        sampleTitle: `A brutally honest day in my life at ${uniName} (pre-med + 3 exams)`,
        recommendationNote: "Include actual time stamps on screen and raw dining hall moments; avoid overly polished corporate cuts.",
      },
      {
        formatName: "Silent Pomodoro Study-With-Me (50/10)",
        avgRetentionPercent: 82,
        engagementRate: 6.1,
        bestPostingWindow: "Weekdays at 9:00 PM",
        collegiateViralityScore: 89,
        brandSponsorSuitability: "High",
        sampleTitle: `Study With Me 3 Hours for Finals 📚 (Rain sounds, campus library view)`,
        recommendationNote: "Students use this as virtual co-working accountability; high repeat view count and multi-hour session watch time.",
      },
      {
        formatName: "Dorm Tour & Desk Setup Upgrades",
        avgRetentionPercent: 64,
        engagementRate: 9.1,
        bestPostingWindow: "Fridays at 3:00 PM",
        collegiateViralityScore: 96,
        brandSponsorSuitability: "Elite",
        sampleTitle: `Turning my tiny ${uniName} dorm into a cozy productivity haven ✨`,
        recommendationNote: "Drive high save-rates by listing exact product links, storage hacks, and ambient lighting sources.",
      },
      {
        formatName: "Campus Dining Hall Hacks & $15 Meal Prep",
        avgRetentionPercent: 71,
        engagementRate: 7.9,
        bestPostingWindow: "Mondays at 12:00 PM",
        collegiateViralityScore: 92,
        brandSponsorSuitability: "High",
        sampleTitle: `Top 5 secret dining hall combinations that actually taste amazing 🍜`,
        recommendationNote: "Hyper-localized campus content creates immediate peer comment debates and shares on campus GroupMe/Snapchat.",
      },
      {
        formatName: "Internship Recruiting & Resume Teardowns",
        avgRetentionPercent: 75,
        engagementRate: 8.7,
        bestPostingWindow: "Tuesdays at 5:00 PM",
        collegiateViralityScore: 88,
        brandSponsorSuitability: "Elite",
        sampleTitle: `How I got a Big Tech internship as a sophomore with no connections`,
        recommendationNote: "Generates massive bookmarks and shares; students tag their study groups and fraternity/sorority peers.",
      },
    ],
    brandPartnerships: [
      {
        brandName: "Celsius / Red Bull",
        category: "Energy & Beverage",
        typicalCompensationTier: "$450 - $900 / reel + Free Monthly Campus Supply",
        avgStudentConversionRate: "5.4% Promo Code Redemptions",
        idealContentAngle: "Midterms desk study fuel shot or pre-library study pack routine.",
      },
      {
        brandName: "Notion / Chegg / Quizlet",
        category: "EdTech & Study",
        typicalCompensationTier: "$600 - $1,400 / dedicated integration",
        avgStudentConversionRate: "8.2% Free Tier App Signups",
        idealContentAngle: "Sharing custom semester planner templates and exam flashcard sets.",
      },
      {
        brandName: "Prime Student / Unidays",
        category: "Student Productivity",
        typicalCompensationTier: "$500 - $1,200 / 30s mid-roll",
        avgStudentConversionRate: "6.7% Student Verification Clicks",
        idealContentAngle: "Dorm essentials haul and textbook discount breakdowns.",
      },
      {
        brandName: "Liquid I.V. / Cirkul",
        category: "Snacks & Dorm",
        typicalCompensationTier: "$350 - $750 / reel or story set",
        avgStudentConversionRate: "4.9% Hydration Bundle Sales",
        idealContentAngle: "Morning 8am class hydration routine and walk-to-campus vlog.",
      },
    ],
    risingCampusTrends: [
      {
        id: "trend-1",
        topic: "Dorm Room Minimalist Aesthetic & Cable Management",
        hashtag: "#DormAesthetic #CollegeDeskSetup",
        viralityVelocity: "+210%",
        category: "Campus Life & Dorm",
        suggestedAngle: "Show before-and-after lighting upgrade with warm desk LED bar and Notion desktop dashboard.",
        bestPlatform: "YouTube Shorts / Reels",
      },
      {
        id: "trend-2",
        topic: "Realistic 5 AM Study Vlog vs Actual 10 AM Reality",
        hashtag: "#CollegeRelatable #StudyWithMe",
        viralityVelocity: "+145%",
        category: "Academics & Study",
        suggestedAngle: "Humorous juxtaposition of romanticized aesthetic morning vs reality of sleeping through 8am alarm.",
        bestPlatform: "YouTube Shorts / Reels",
      },
      {
        id: "trend-3",
        topic: "College Budgeting: What I Spend in a Week at School",
        hashtag: "#CollegeBudget #StudentFinance",
        viralityVelocity: "+88%",
        category: "Budget & Food",
        suggestedAngle: "Transparent breakdown of groceries, coffee runs, printing fees, and weekend dining.",
        bestPlatform: "Carousel Infographic",
      },
      {
        id: "trend-4",
        topic: "Coffee Shop & Quiet Campus Library Tier List",
        hashtag: "#CampusHiddenGems #StudySpots",
        viralityVelocity: "+64%",
        category: "Campus Life & Dorm",
        suggestedAngle: "Rating campus libraries by outlet availability, quietness, natural light, and chair ergonomics.",
        bestPlatform: "Long-form Vlog",
      },
    ],
    aiCampusStrategicBriefing: `Campus engagement for ${creatorHandle} at ${uniName} demonstrates an exceptional 94.6% peer trust index. With ${selectedSeason.toUpperCase()} dynamics in play, student retention rates peak on late-night study sessions (11 PM - 2 AM) and mid-day dining hall updates. Freshmen and sophomores represent 61% of your aggregate audience, indicating tremendous leverage for relatable lifestyle vlogs and practical dorm/study survival tips. To maximize collegiate brand sponsorship valuation, bundle your 50/10 study streams with campus ambassador partner links (e.g. Celsius or Notion), which convert at 2.4x the standard retail average on campus.`,
  };
}
