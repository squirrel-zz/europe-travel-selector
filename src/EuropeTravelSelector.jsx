import React, { useState, useEffect, useMemo, useRef } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Eye, EyeOff, Filter, Heart, Info, LayoutGrid, RotateCcw, Scale, Table2, X } from "lucide-react";
import { MANCHESTER_WEEKEND_ROUTES } from "./manchesterWeekendRoutes";

/* ============================================================
   EUROPE TRAVEL SELECTOR
   Data source: the Europe Travel Master Guide built earlier.
   Every record below is a CONCRETE route/experience extracted
   from that guide (not a category). Budgets are per-person
   ESTIMATES (twin-share where stated). Flight/cruise schedules
   change — records carry liveVerificationNeeded flags.
   ============================================================ */

/* ---------- design tokens: "Baedeker" editorial ---------- */
const T = {
  paper: "#F7F6F1",
  panel: "#FFFFFF",
  ink: "#1E2733",
  muted: "#67707B",
  carmine: "#9E2B25",
  carmineSoft: "#F3E4E2",
  moss: "#4F6650",
  mossSoft: "#E7EDE6",
  gold: "#8A6D2F",
  line: "#DAD6CA",
  lineSoft: "#E9E6DD",
  serif: "Georgia, 'Iowan Old Style', 'Times New Roman', serif",
  sans: "ui-sans-serif, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ---------- route factory with defaults ---------- */
const BASE = {
  parentCategory: "Land", tripTypes: [], countries: [], regions: [], mainStops: [],
  description: "", highlights: [], drawbacks: [],
  bestMonths: [], acceptableMonths: [], unsuitableMonths: [], seasonalWindow: null,
  minimumDurationDays: 2, idealDurationDays: 4, maximumDurationDays: 7,
  travelStyles: [],
  budgetMinGBP: null, budgetTypicalGBP: null, budgetMaxGBP: null,
  budgetBasis: "Per person, twin-share, incl. transport + accommodation (estimate)",
  budgetConfidence: "medium",
  departureCities: ["Manchester"], departurePorts: [],
  directFromManchester: "unknown", ManchesterAccessScore: 5,
  approximateManchesterToStartHours: null,
  flightRequired: true, trainPossible: false, ferryPossible: false,
  cruiseBased: false, drivingRequired: false,
  overnightTravelPossible: false, overnightTravelRequired: false,
  typicalTransferLevel: "low", hotelChanges: "low",
  physicalEffort: 2, walkingLevel: 2, stairsRisk: 2, luggageHandling: 2,
  comfortLevel: 4, weatherRisk: 2,
  suitableForSolo: true, suitableForCouple: true, suitableForFriends: true,
  suitableForFamily: true, suitableForOlderTraveller: true, suitableForMum: true,
  natureScore: 5, sceneryScore: 5, cultureScore: 5, historyScore: 5, foodScore: 5,
  relaxationScore: 5, adventureScore: 4, photographyScore: 6,
  uniqueTransportScore: 3, valueForMoneyScore: 6,
  onceInALifetimeScore: 5, revisitScore: 6,
  tags: [], officialSources: [],
  estimated: true, liveVerificationNeeded: false, sourceSection: "",
  isManchesterWeekendRoute: false, routeBase: null, region: null, routeType: null,
  weekendRouteType: null, manchesterJourneyTime: null, likelyTransportMode: null,
  directConnectionStatus: "unknown", majorTransferCountToBase: null,
  localConnectionsRequired: false, carDependency: "unnecessary",
  fridayEveningFeasible: "uncertain", saturdayMorningFeasible: "uncertain",
  sundayEveningReturnFeasible: "uncertain", weekendTimingNote: null,
  weekendSuitability: null, weekendSuitabilityEvidence: null,
  weekendPlanningEstimate: false, evidenceNote: null,
  imageUrl: null, imageAlt: null, imageCredit: null,
};
const TRAVEL_STYLE_WINDOWS = {
  "day-trip": [1, 1],
  weekend: [2, 3],
  "short-break": [4, 5],
  "one-week": [6, 8],
  "longer-trip": [9, 21],
};
const inferredTravelStyles = (minimum, maximum) => Object.entries(TRAVEL_STYLE_WINDOWS)
  .filter(([, [styleMin, styleMax]]) => minimum <= styleMax && maximum >= styleMin)
  .map(([style]) => style);
const R = (o) => {
  const minimumDurationDays = o.minimumDurationDays ?? BASE.minimumDurationDays;
  const idealDurationDays = o.idealDurationDays ?? BASE.idealDurationDays;
  const maximumDurationDays = o.maximumDurationDays ?? BASE.maximumDurationDays;
  return {
    ...BASE,
    ...o,
    minimumDurationDays,
    idealDurationDays,
    maximumDurationDays,
    travelStyles: o.travelStyles ?? inferredTravelStyles(minimumDurationDays, maximumDurationDays),
  };
};

/* ============================ ROUTES ============================ */
const ROUTES = [

/* ---------------- SEA · cruises ---------------- */
R({ id:"fjords-cruise", routeName:"Norwegian Fjords Cruise from the UK", shortName:"Fjords Cruise",
  parentCategory:"Sea", tripTypes:["Ocean Cruise"], countries:["Norway"], regions:["Norwegian Fjords"],
  mainStops:["Geiranger","Flåm","Olden","Bergen"],
  description:"Sail from an English port straight into Europe's most dramatic sea scenery — no flights, no luggage moves.",
  highlights:["No-fly departure (Liverpool/Southampton/Newcastle)","Unpack once, four fjord days","Best older-traveller value in the guide"],
  drawbacks:["Sea days can feel slow","Excursions cost extra"],
  bestMonths:[5,6,7,8], acceptableMonths:[4,9], unsuitableMonths:[11,12,1,2],
  minimumDurationDays:7, idealDurationDays:7, maximumDurationDays:14,
  budgetMinGBP:600, budgetTypicalGBP:850, budgetMaxGBP:1500,
  budgetBasis:"Inside cabin, twin-share, 7 nights, UK departure — no flights needed",
  departurePorts:["Liverpool","Southampton","Newcastle"], directFromManchester:"not-applicable",
  ManchesterAccessScore:9, approximateManchesterToStartHours:1.5,
  flightRequired:false, cruiseBased:true, trainPossible:true,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:1, walkingLevel:1, stairsRisk:1, luggageHandling:1, comfortLevel:5, weatherRisk:2,
  natureScore:10, sceneryScore:10, cultureScore:4, historyScore:3, foodScore:6,
  relaxationScore:9, photographyScore:9, uniqueTransportScore:8, valueForMoneyScore:8,
  onceInALifetimeScore:8, revisitScore:7,
  tags:["summer","no-fly","mum-flagship"],
  officialSources:[{label:"P&O Cruises",url:"https://www.pocruises.com"},{label:"Fred. Olsen",url:"https://www.fredolsencruises.com"}],
  liveVerificationNeeded:true, sourceSection:"S1 Ocean Cruise" }),

R({ id:"baltic-cruise", routeName:"Baltic Capitals Cruise", shortName:"Baltic Capitals",
  parentCategory:"Sea", tripTypes:["Ocean Cruise","City Break"], countries:["Denmark","Sweden","Estonia","Finland"],
  regions:["Baltic Sea"], mainStops:["Copenhagen","Stockholm","Tallinn","Helsinki"],
  description:"Four Nordic-Baltic capitals in one sailing — a culture-dense cruise without repacking.",
  highlights:["Four capitals, one cabin","Tallinn's medieval old town","Long summer evenings on deck"],
  drawbacks:["Port days are short for big cities","Longer itinerary (12+ nights)"],
  bestMonths:[6,7,8], acceptableMonths:[5,9], unsuitableMonths:[11,12,1,2,3],
  minimumDurationDays:10, idealDurationDays:12, maximumDurationDays:14,
  budgetMinGBP:900, budgetTypicalGBP:1300, budgetMaxGBP:2200,
  departurePorts:["Southampton"], directFromManchester:"not-applicable",
  ManchesterAccessScore:6, approximateManchesterToStartHours:4,
  flightRequired:false, cruiseBased:true, trainPossible:true,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:2, walkingLevel:3, stairsRisk:2, luggageHandling:1, comfortLevel:5,
  natureScore:4, sceneryScore:6, cultureScore:9, historyScore:8, foodScore:6,
  relaxationScore:7, photographyScore:7, uniqueTransportScore:6, valueForMoneyScore:6,
  onceInALifetimeScore:6, revisitScore:5,
  tags:["summer"], officialSources:[{label:"P&O Cruises",url:"https://www.pocruises.com"},{label:"Cunard",url:"https://www.cunard.com"}],
  liveVerificationNeeded:true, sourceSection:"S1 Ocean Cruise" }),

R({ id:"westmed-cruise", routeName:"Western Mediterranean Cruise", shortName:"West Med Cruise",
  parentCategory:"Sea", tripTypes:["Ocean Cruise"], countries:["Spain","France","Italy"],
  regions:["Mediterranean"], mainStops:["Barcelona","Marseille","Rome (Civitavecchia)","Naples"],
  description:"Classic Med circuit — either sail from Southampton or fly to Barcelona and join there.",
  highlights:["History + food + sun in one loop","Fly-cruise option shortens it","Good shoulder-season value"],
  drawbacks:["Peak summer = hot, crowded ports","Rome/Naples port days need stamina"],
  bestMonths:[5,6,9,10], acceptableMonths:[4,7,8], unsuitableMonths:[1,2,12],
  minimumDurationDays:7, idealDurationDays:10, maximumDurationDays:14,
  budgetMinGBP:700, budgetTypicalGBP:1100, budgetMaxGBP:2000,
  departurePorts:["Southampton","Barcelona (fly-cruise)"], directFromManchester:"yes",
  ManchesterAccessScore:6, approximateManchesterToStartHours:5,
  flightRequired:false, cruiseBased:true,
  typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:2, walkingLevel:3, stairsRisk:2, luggageHandling:1, comfortLevel:5, weatherRisk:1,
  natureScore:4, sceneryScore:6, cultureScore:8, historyScore:9, foodScore:8,
  relaxationScore:7, photographyScore:7, uniqueTransportScore:5, valueForMoneyScore:7,
  onceInALifetimeScore:5, revisitScore:6,
  tags:["summer","warm-escape"], officialSources:[{label:"MSC Cruises",url:"https://www.msccruises.co.uk"},{label:"P&O Cruises",url:"https://www.pocruises.com"}],
  liveVerificationNeeded:true, sourceSection:"S1 Ocean Cruise" }),

R({ id:"canary-cruise", routeName:"Canary Islands Winter-Sun Cruise", shortName:"Canaries Cruise",
  parentCategory:"Sea", tripTypes:["Ocean Cruise","Beach"], countries:["Spain","Portugal"],
  regions:["Canary Islands","Madeira"], mainStops:["Tenerife","Gran Canaria","Lanzarote","Funchal"],
  description:"The classic UK winter escape afloat — 20°C in January without an airport.",
  highlights:["Winter sun, no flying","Madeira flower stop","Calm all-inclusive pace"],
  drawbacks:["2 sea days each way across Biscay","Biscay can be rough in winter"],
  bestMonths:[11,12,1,2,3], acceptableMonths:[4,10], unsuitableMonths:[7,8],
  minimumDurationDays:10, idealDurationDays:12, maximumDurationDays:14,
  budgetMinGBP:800, budgetTypicalGBP:1100, budgetMaxGBP:1800,
  departurePorts:["Southampton"], directFromManchester:"not-applicable",
  ManchesterAccessScore:6, approximateManchesterToStartHours:4,
  flightRequired:false, cruiseBased:true,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:5, weatherRisk:3,
  natureScore:6, sceneryScore:6, cultureScore:4, historyScore:3, foodScore:5,
  relaxationScore:10, photographyScore:6, uniqueTransportScore:5, valueForMoneyScore:7,
  onceInALifetimeScore:4, revisitScore:7,
  tags:["winter","warm-escape","beach"], officialSources:[{label:"P&O Cruises",url:"https://www.pocruises.com"}],
  liveVerificationNeeded:true, sourceSection:"S1 Ocean Cruise" }),

R({ id:"british-isles-cruise", routeName:"British Isles Cruise", shortName:"British Isles",
  parentCategory:"Sea", tripTypes:["Ocean Cruise"], countries:["United Kingdom","Ireland"],
  regions:["Scotland","Ireland","Channel Islands"], mainStops:["Orkney","Dublin","Belfast","Guernsey"],
  description:"Circumnavigate home waters — islands and cities you'd struggle to link any other way.",
  highlights:["Orkney's neolithic sites","Departs Liverpool some seasons","No passport stress"],
  drawbacks:["Weather-dependent tendering","Scenery gentler than the fjords"],
  bestMonths:[5,6,7,8], acceptableMonths:[4,9], unsuitableMonths:[11,12,1,2],
  minimumDurationDays:7, idealDurationDays:9, maximumDurationDays:12,
  budgetMinGBP:700, budgetTypicalGBP:1000, budgetMaxGBP:1700,
  departurePorts:["Liverpool","Southampton"], directFromManchester:"not-applicable",
  ManchesterAccessScore:9, approximateManchesterToStartHours:1.5,
  flightRequired:false, cruiseBased:true, trainPossible:true,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:1, comfortLevel:5, weatherRisk:3,
  natureScore:7, sceneryScore:7, cultureScore:7, historyScore:8, foodScore:5,
  relaxationScore:8, photographyScore:7, uniqueTransportScore:5, valueForMoneyScore:6,
  onceInALifetimeScore:4, revisitScore:5,
  tags:["summer","no-fly"], officialSources:[{label:"Fred. Olsen",url:"https://www.fredolsencruises.com"},{label:"Ambassador",url:"https://www.ambassadorcruiseline.com"}],
  liveVerificationNeeded:true, sourceSection:"S1 Ocean Cruise" }),

R({ id:"hurtigruten-coastal", routeName:"Hurtigruten Norwegian Coastal Voyage", shortName:"Hurtigruten",
  parentCategory:"Sea", tripTypes:["Expedition Cruise","Ferry"], countries:["Norway"],
  regions:["Norwegian Coast","Arctic Norway"], mainStops:["Bergen","Ålesund","Tromsø","Kirkenes"],
  description:"The working coastal ship threading 34 ports between Bergen and the Russian border — winter sailings double as aurora hunts.",
  highlights:["Crosses the Arctic Circle","Winter = Northern Lights promise","Real Norway, not a resort ship"],
  drawbacks:["Simpler ships than mainstream cruises","Fly via Oslo/Bergen to join"],
  bestMonths:[2,3,6,7,9,10,11], acceptableMonths:[1,4,5,8,12], unsuitableMonths:[],
  minimumDurationDays:6, idealDurationDays:8, maximumDurationDays:12,
  budgetMinGBP:1100, budgetTypicalGBP:1600, budgetMaxGBP:2600,
  departureCities:["Bergen"], directFromManchester:"no",
  ManchesterAccessScore:4, approximateManchesterToStartHours:7,
  cruiseBased:true, typicalTransferLevel:"medium", hotelChanges:"none",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:2, comfortLevel:4, weatherRisk:3,
  natureScore:10, sceneryScore:10, cultureScore:5, historyScore:4, foodScore:6,
  relaxationScore:8, photographyScore:9, uniqueTransportScore:8, valueForMoneyScore:6,
  onceInALifetimeScore:8, revisitScore:6,
  tags:["winter","summer","northern-lights"], officialSources:[{label:"Hurtigruten",url:"https://www.hurtigruten.com"}],
  liveVerificationNeeded:true, sourceSection:"S2 Expedition Cruise" }),

R({ id:"svalbard-expedition", routeName:"Svalbard Polar Expedition Cruise", shortName:"Svalbard",
  parentCategory:"Sea", tripTypes:["Expedition Cruise","Wildlife"], countries:["Norway"],
  regions:["Svalbard","High Arctic"], mainStops:["Longyearbyen","Ny-Ålesund","pack ice edge"],
  description:"Small-ship Zodiac expedition among glaciers and polar bears at 80°N — the guide's once-in-a-lifetime ceiling.",
  highlights:["Polar bears in the wild","Zodiac landings on tundra","Midnight sun the whole voyage"],
  drawbacks:["Very expensive","Physically needs sure footing (ship ladders, Zodiacs)"],
  bestMonths:[6,7,8], acceptableMonths:[5], unsuitableMonths:[10,11,12,1,2,3],
  minimumDurationDays:9, idealDurationDays:10, maximumDurationDays:14,
  budgetMinGBP:4000, budgetTypicalGBP:5500, budgetMaxGBP:9000, budgetConfidence:"low",
  departureCities:["Longyearbyen (via Oslo)"], directFromManchester:"no",
  ManchesterAccessScore:2, approximateManchesterToStartHours:10,
  cruiseBased:true, typicalTransferLevel:"high", hotelChanges:"low",
  physicalEffort:3, walkingLevel:3, stairsRisk:3, luggageHandling:3, comfortLevel:4, weatherRisk:3,
  suitableForMum:false, suitableForOlderTraveller:false, suitableForFamily:false,
  natureScore:10, sceneryScore:10, cultureScore:2, historyScore:3, foodScore:5,
  relaxationScore:5, adventureScore:10, photographyScore:10, uniqueTransportScore:9,
  valueForMoneyScore:4, onceInALifetimeScore:10, revisitScore:3,
  tags:["summer","midnight-sun","wildlife"], officialSources:[{label:"HX Expeditions",url:"https://www.travelhx.com"},{label:"Hurtigruten",url:"https://www.hurtigruten.com"}],
  liveVerificationNeeded:true, sourceSection:"S2 Expedition Cruise" }),

R({ id:"mini-cruise-amsterdam", routeName:"Newcastle–Amsterdam Mini Cruise", shortName:"Amsterdam Mini Cruise",
  parentCategory:"Sea", tripTypes:["Mini Cruise","Ferry","City Break"], countries:["Netherlands"],
  regions:["North Sea"], mainStops:["Newcastle","IJmuiden","Amsterdam"],
  description:"Two nights aboard, a full day in Amsterdam — the cheapest way to test whether you're a cruise person.",
  highlights:["Weekend-sized, hotel included","Train from Manchester to port in ~2.5h","December run pairs with Amsterdam lights"],
  drawbacks:["Only ~7 hours ashore","North Sea can roll in winter"],
  bestMonths:[4,5,6,7,8,9,12], acceptableMonths:[3,10,11], unsuitableMonths:[],
  minimumDurationDays:2, idealDurationDays:3, maximumDurationDays:3,
  budgetMinGBP:150, budgetTypicalGBP:220, budgetMaxGBP:350, budgetConfidence:"high",
  departurePorts:["Newcastle"], directFromManchester:"not-applicable",
  ManchesterAccessScore:8, approximateManchesterToStartHours:3,
  flightRequired:false, ferryPossible:true, cruiseBased:true, trainPossible:true,
  overnightTravelPossible:true, overnightTravelRequired:true,
  typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:4, weatherRisk:2,
  natureScore:2, sceneryScore:4, cultureScore:6, historyScore:5, foodScore:5,
  relaxationScore:7, photographyScore:5, uniqueTransportScore:7, valueForMoneyScore:9,
  onceInALifetimeScore:2, revisitScore:8,
  tags:["no-fly","weekend"], officialSources:[{label:"DFDS",url:"https://www.dfds.com"}],
  liveVerificationNeeded:true, sourceSection:"S3 Mini Cruise" }),

R({ id:"rhine-cruise", routeName:"Rhine River Cruise (Amsterdam–Basel)", shortName:"Rhine Cruise",
  parentCategory:"Sea", tripTypes:["River Cruise"], countries:["Netherlands","Germany","France","Switzerland"],
  regions:["Rhine Valley"], mainStops:["Cologne","Rüdesheim","Lorelei","Strasbourg","Basel"],
  description:"The guide's ceiling for travelling with Mum: dock in each old town's centre, castles glide past the window.",
  highlights:["Ship moors in town centres — near-zero walking","Lorelei gorge castle parade","Unpack once for four countries"],
  drawbacks:["Premium price point","Low water can alter itineraries (summer)"],
  bestMonths:[4,5,9,10], acceptableMonths:[6,7,8], unsuitableMonths:[1,2],
  minimumDurationDays:7, idealDurationDays:8, maximumDurationDays:8,
  budgetMinGBP:1400, budgetTypicalGBP:1900, budgetMaxGBP:3000,
  budgetBasis:"Twin-share, 7 nights, most meals included, incl. flights to Amsterdam/Basel",
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:4,
  cruiseBased:true, typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:5, weatherRisk:2,
  natureScore:6, sceneryScore:8, cultureScore:8, historyScore:8, foodScore:7,
  relaxationScore:10, photographyScore:7, uniqueTransportScore:7, valueForMoneyScore:5,
  onceInALifetimeScore:6, revisitScore:8,
  tags:["mum-flagship","spring","autumn"], officialSources:[{label:"Viking",url:"https://www.vikingrivercruises.co.uk"},{label:"Riviera Travel",url:"https://www.rivieratravel.co.uk"}],
  liveVerificationNeeded:true, sourceSection:"S4 River Cruise" }),

R({ id:"danube-cruise", routeName:"Danube River Cruise (Passau–Budapest)", shortName:"Danube Cruise",
  parentCategory:"Sea", tripTypes:["River Cruise"], countries:["Germany","Austria","Slovakia","Hungary"],
  regions:["Danube Valley","Wachau"], mainStops:["Passau","Wachau Valley","Vienna","Bratislava","Budapest"],
  description:"Vienna, Bratislava and the Budapest night sail in one slow, comfortable week.",
  highlights:["Budapest parliament lit up from the water","Wachau vineyards","Three capitals, zero packing"],
  drawbacks:["Premium price point","Popular ships book out early"],
  bestMonths:[4,5,9,10], acceptableMonths:[6,7,8,12], unsuitableMonths:[1,2],
  minimumDurationDays:7, idealDurationDays:8, maximumDurationDays:8,
  budgetMinGBP:1400, budgetTypicalGBP:1900, budgetMaxGBP:3000,
  budgetBasis:"Twin-share, 7 nights, most meals included, incl. flights",
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:4.5,
  cruiseBased:true, typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:5, weatherRisk:2,
  natureScore:6, sceneryScore:8, cultureScore:9, historyScore:8, foodScore:7,
  relaxationScore:10, photographyScore:8, uniqueTransportScore:7, valueForMoneyScore:5,
  onceInALifetimeScore:6, revisitScore:8,
  tags:["mum-flagship","spring","autumn"], officialSources:[{label:"Viking",url:"https://www.vikingrivercruises.co.uk"},{label:"AmaWaterways",url:"https://www.amawaterways.co.uk"}],
  liveVerificationNeeded:true, sourceSection:"S4 River Cruise" }),

R({ id:"douro-cruise", routeName:"Douro Valley River Cruise", shortName:"Douro Cruise",
  parentCategory:"Sea", tripTypes:["River Cruise","Food & Wine"], countries:["Portugal","Spain"],
  regions:["Douro Valley"], mainStops:["Porto","Régua","Pinhão","Vega de Terrón"],
  description:"Terraced vineyards climbing from the water on both banks — the prettiest small river in the guide, at harvest even more so.",
  highlights:["UNESCO vineyard terraces","September harvest atmosphere","Solves Porto's hills: see it from the deck"],
  drawbacks:["Premium price","Hot in high summer"],
  bestMonths:[4,5,9,10], acceptableMonths:[6], unsuitableMonths:[12,1,2],
  minimumDurationDays:7, idealDurationDays:8, maximumDurationDays:8,
  budgetMinGBP:1300, budgetTypicalGBP:1800, budgetMaxGBP:2800,
  budgetBasis:"Twin-share, 7 nights, incl. flights to Porto",
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:4,
  cruiseBased:true, typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:2, luggageHandling:1, comfortLevel:5, weatherRisk:1,
  natureScore:8, sceneryScore:9, cultureScore:6, historyScore:5, foodScore:9,
  relaxationScore:10, photographyScore:8, uniqueTransportScore:7, valueForMoneyScore:5,
  onceInALifetimeScore:6, revisitScore:6,
  tags:["mum-flagship","autumn","wine"], officialSources:[{label:"Riviera Travel",url:"https://www.rivieratravel.co.uk"},{label:"Visit Porto & North",url:"https://www.visitportoandnorth.travel"}],
  liveVerificationNeeded:true, sourceSection:"S4 River Cruise / SE12 Wine Harvest" }),

R({ id:"xmas-river-cruise", routeName:"Christmas Markets River Cruise (Rhine/Danube)", shortName:"Xmas Market Cruise",
  parentCategory:"Seasonal", tripTypes:["River Cruise","Christmas Markets"], countries:["Germany","Austria","France","Hungary"],
  regions:["Rhine Valley","Danube Valley"], mainStops:["Cologne","Rüdesheim","Strasbourg","Vienna","Budapest"],
  description:"Four or five Christmas markets in one gentle sailing — mulled wine ashore, warm ship waiting at the quay.",
  highlights:["Multiple markets, one unpacking","Ship moored minutes from each market","Shorter 4–5 night versions exist"],
  drawbacks:["Cold on deck","December cabins sell out by autumn"],
  bestMonths:[12], acceptableMonths:[11], unsuitableMonths:[5,6,7,8],
  seasonalWindow:"Late Nov – 23 Dec",
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:8,
  budgetMinGBP:900, budgetTypicalGBP:1300, budgetMaxGBP:2200,
  budgetBasis:"Twin-share, 4–5 nights, incl. flights",
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:4,
  cruiseBased:true, typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:5, weatherRisk:2,
  natureScore:3, sceneryScore:6, cultureScore:8, historyScore:7, foodScore:8,
  relaxationScore:9, photographyScore:8, uniqueTransportScore:7, valueForMoneyScore:5,
  onceInALifetimeScore:7, revisitScore:7,
  tags:["winter","christmas","mum-flagship"], officialSources:[{label:"Viking",url:"https://www.vikingrivercruises.co.uk"},{label:"Riviera Travel",url:"https://www.rivieratravel.co.uk"}],
  liveVerificationNeeded:true, sourceSection:"S4 River Cruise / SE1 Christmas Markets" }),

R({ id:"biscay-whale-ferry", routeName:"Biscay Whale-Watching Ferry (Portsmouth–Santander)", shortName:"Biscay Ferry",
  parentCategory:"Sea", tripTypes:["Ferry","Wildlife","Road Trip"], countries:["Spain"],
  regions:["Bay of Biscay","Cantabria"], mainStops:["Portsmouth","Santander","Picos de Europa"],
  description:"A 24–32h crossing that doubles as a whale-watching trip, landing you (and optionally your car) in green northern Spain.",
  highlights:["Dolphins and whales from the deck (Jul–Aug peak)","Cabin crossing feels like a mini cruise","Gateway to Picos de Europa"],
  drawbacks:["Portsmouth is far from Manchester","Biscay swell is real"],
  bestMonths:[6,7,8], acceptableMonths:[5,9], unsuitableMonths:[12,1,2],
  minimumDurationDays:4, idealDurationDays:6, maximumDurationDays:10,
  budgetMinGBP:300, budgetTypicalGBP:500, budgetMaxGBP:900,
  departurePorts:["Portsmouth"], directFromManchester:"not-applicable",
  ManchesterAccessScore:4, approximateManchesterToStartHours:5,
  flightRequired:false, ferryPossible:true, drivingRequired:false,
  overnightTravelPossible:true, overnightTravelRequired:true,
  typicalTransferLevel:"medium", hotelChanges:"medium",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:2, comfortLevel:3, weatherRisk:3,
  natureScore:8, sceneryScore:7, cultureScore:5, historyScore:4, foodScore:7,
  relaxationScore:6, photographyScore:7, uniqueTransportScore:7, valueForMoneyScore:8,
  onceInALifetimeScore:5, revisitScore:5,
  tags:["summer","no-fly","wildlife"], officialSources:[{label:"Brittany Ferries",url:"https://www.brittany-ferries.co.uk"}],
  liveVerificationNeeded:true, sourceSection:"S5 Ferry / SE10 Whale Watching" }),

/* ---------------- SEA · sailing & islands ---------------- */
R({ id:"croatia-sailing", routeName:"Croatia Dalmatian Coast Sailing Week", shortName:"Croatia Sailing",
  parentCategory:"Sea", tripTypes:["Sailing","Island Hopping","Beach"], countries:["Croatia"],
  regions:["Dalmatia"], mainStops:["Split","Hvar","Vis","Korčula"],
  description:"Flotilla or skippered yacht: sail by day, swim off the stern, moor in a stone harbour town each night.",
  highlights:["Anchor-and-swim lunches","Hvar and Vis harbour evenings","Flotilla = solo-friendly crew life"],
  drawbacks:["Boat life: ladders, motion, shared heads","July–Aug crowds and prices"],
  bestMonths:[5,6,9], acceptableMonths:[7,8], unsuitableMonths:[11,12,1,2,3],
  minimumDurationDays:7, idealDurationDays:7, maximumDurationDays:14,
  budgetMinGBP:700, budgetTypicalGBP:1100, budgetMaxGBP:2000,
  directFromManchester:"seasonal", ManchesterAccessScore:7, approximateManchesterToStartHours:5,
  typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:3, walkingLevel:2, stairsRisk:4, luggageHandling:3, comfortLevel:3, weatherRisk:2,
  suitableForMum:false, suitableForOlderTraveller:false,
  natureScore:8, sceneryScore:9, cultureScore:5, historyScore:5, foodScore:7,
  relaxationScore:8, adventureScore:8, photographyScore:8, uniqueTransportScore:8,
  valueForMoneyScore:6, onceInALifetimeScore:7, revisitScore:8,
  tags:["summer","beach"], officialSources:[{label:"Sunsail",url:"https://www.sunsail.co.uk"},{label:"Croatia Tourist Board",url:"https://croatia.hr"}],
  liveVerificationNeeded:true, sourceSection:"S6 Sailing Holiday" }),

R({ id:"cyclades-hopping", routeName:"Cyclades Island Hopping (Athens–Paros–Naxos–Santorini)", shortName:"Cyclades Hopping",
  parentCategory:"Sea", tripTypes:["Island Hopping","Beach","Food & Wine"], countries:["Greece"],
  regions:["Cyclades","Aegean"], mainStops:["Athens","Paros","Naxos","Santorini"],
  description:"Public ferries stitch three contrasting islands onto an Athens start — the guide's definitive first Greek route.",
  highlights:["Naxos tavernas + beaches","Santorini caldera sunset finale","Ferries are the scenic bit, not a chore"],
  drawbacks:["Luggage on/off ferries 3–4 times","Santorini = crowds + steps"],
  bestMonths:[5,6,9], acceptableMonths:[4,10,7,8], unsuitableMonths:[12,1,2],
  minimumDurationDays:7, idealDurationDays:8, maximumDurationDays:14,
  budgetMinGBP:550, budgetTypicalGBP:800, budgetMaxGBP:1400,
  directFromManchester:"yes", ManchesterAccessScore:7, approximateManchesterToStartHours:5.5,
  ferryPossible:true, typicalTransferLevel:"high", hotelChanges:"high",
  physicalEffort:3, walkingLevel:3, stairsRisk:3, luggageHandling:4, comfortLevel:3, weatherRisk:1,
  suitableForMum:false,
  natureScore:7, sceneryScore:9, cultureScore:6, historyScore:6, foodScore:9,
  relaxationScore:7, adventureScore:6, photographyScore:9, uniqueTransportScore:6,
  valueForMoneyScore:7, onceInALifetimeScore:7, revisitScore:9,
  tags:["summer","beach"], officialSources:[{label:"Blue Star Ferries",url:"https://www.bluestarferries.com"},{label:"SeaJets",url:"https://www.seajets.com"}],
  liveVerificationNeeded:true, sourceSection:"S7 Island Hopping" }),

R({ id:"canary-hopping", routeName:"Canary Islands Hopping (Tenerife–La Gomera–La Palma)", shortName:"Canaries Hopping",
  parentCategory:"Sea", tripTypes:["Island Hopping","Hiking","Beach"], countries:["Spain"],
  regions:["Canary Islands"], mainStops:["Tenerife","La Gomera","La Palma"],
  description:"Volcano islands an hour apart by ferry — winter warmth with real landscapes beyond the resorts.",
  highlights:["Teide + laurel cloud forests","Year-round 20°C+","Slow 2-island version is very gentle"],
  drawbacks:["Inter-island ferries need planning","Resort strips easy to accidentally book"],
  bestMonths:[1,2,3,11,12,4], acceptableMonths:[5,10], unsuitableMonths:[],
  minimumDurationDays:6, idealDurationDays:8, maximumDurationDays:14,
  budgetMinGBP:450, budgetTypicalGBP:700, budgetMaxGBP:1200,
  directFromManchester:"yes", ManchesterAccessScore:7, approximateManchesterToStartHours:6,
  ferryPossible:true, typicalTransferLevel:"medium", hotelChanges:"medium",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:3, comfortLevel:4, weatherRisk:1,
  natureScore:8, sceneryScore:8, cultureScore:4, historyScore:3, foodScore:6,
  relaxationScore:8, photographyScore:7, uniqueTransportScore:4, valueForMoneyScore:8,
  onceInALifetimeScore:4, revisitScore:7,
  tags:["winter","warm-escape","beach"], officialSources:[{label:"Hello Canary Islands",url:"https://www.hellocanaryislands.com"}],
  liveVerificationNeeded:true, sourceSection:"S7 Island Hopping" }),

R({ id:"azores-hopping", routeName:"Azores Island Hopping (São Miguel–Terceira–Pico)", shortName:"Azores",
  parentCategory:"Sea", tripTypes:["Island Hopping","Hiking","Wildlife"], countries:["Portugal"],
  regions:["Azores","Mid-Atlantic"], mainStops:["São Miguel","Terceira","Pico"],
  description:"Crater lakes, hot springs and whales in the mid-Atlantic — Europe's quietest big-nature secret.",
  highlights:["Sete Cidades twin crater lakes","Spring blue-whale migration","Hydrangea-lined roads"],
  drawbacks:["No Manchester direct — via Lisbon","Weather changes hourly"],
  bestMonths:[5,6,7,8,9], acceptableMonths:[4,10], unsuitableMonths:[12,1,2],
  minimumDurationDays:5, idealDurationDays:7, maximumDurationDays:12,
  budgetMinGBP:550, budgetTypicalGBP:800, budgetMaxGBP:1300,
  directFromManchester:"no", ManchesterAccessScore:4, approximateManchesterToStartHours:9,
  ferryPossible:true, typicalTransferLevel:"high", hotelChanges:"medium",
  physicalEffort:3, walkingLevel:3, stairsRisk:2, luggageHandling:3, comfortLevel:3, weatherRisk:4,
  suitableForMum:false,
  natureScore:10, sceneryScore:9, cultureScore:4, historyScore:4, foodScore:6,
  relaxationScore:7, adventureScore:7, photographyScore:9, uniqueTransportScore:4,
  valueForMoneyScore:8, onceInALifetimeScore:7, revisitScore:7,
  tags:["summer","wildlife"], officialSources:[{label:"Visit Azores",url:"https://www.visitazores.com"}],
  liveVerificationNeeded:true, sourceSection:"S7 Island Hopping / SE10 Whale Watching" }),

R({ id:"hebrides-hopping", routeName:"Scottish Hebrides Island Hopping (Oban–Mull–Iona–Skye)", shortName:"Hebrides",
  parentCategory:"Sea", tripTypes:["Island Hopping","Ferry","Wildlife"], countries:["United Kingdom"],
  regions:["Scotland","Inner Hebrides"], mainStops:["Oban","Mull","Iona","Skye"],
  description:"CalMac ferries link abbey islands, sea eagles and whisky — a no-fly island chain from your own doorstep.",
  highlights:["Iona abbey at golden hour","No flights: train to Oban","Hopscotch ferry tickets keep it cheap"],
  drawbacks:["Weather is the itinerary's boss","Foot-passenger buses on islands are sparse"],
  bestMonths:[5,6,9], acceptableMonths:[4,7,8,10], unsuitableMonths:[12,1,2],
  minimumDurationDays:4, idealDurationDays:7, maximumDurationDays:10,
  budgetMinGBP:350, budgetTypicalGBP:550, budgetMaxGBP:900,
  directFromManchester:"not-applicable", ManchesterAccessScore:7, approximateManchesterToStartHours:6,
  flightRequired:false, ferryPossible:true, trainPossible:true,
  typicalTransferLevel:"high", hotelChanges:"medium",
  physicalEffort:3, walkingLevel:3, stairsRisk:2, luggageHandling:3, comfortLevel:3, weatherRisk:4,
  suitableForMum:false,
  natureScore:9, sceneryScore:9, cultureScore:6, historyScore:7, foodScore:6,
  relaxationScore:7, photographyScore:9, uniqueTransportScore:6, valueForMoneyScore:8,
  onceInALifetimeScore:5, revisitScore:8,
  tags:["summer","no-fly","wildlife"], officialSources:[{label:"CalMac",url:"https://www.calmac.co.uk"},{label:"VisitScotland",url:"https://www.visitscotland.com"}],
  sourceSection:"S7 Island Hopping" }),

R({ id:"malta-gozo", routeName:"Malta–Gozo–Comino Trio", shortName:"Malta & Gozo",
  parentCategory:"Sea", tripTypes:["Island Hopping","UNESCO Heritage","Beach"], countries:["Malta"],
  regions:["Malta"], mainStops:["Valletta","Mdina","Gozo","Comino Blue Lagoon"],
  description:"Three islands, one base: 25-minute ferries mean island hopping without ever repacking a bag.",
  highlights:["Valletta + Mdina golden-stone cities","One hotel the whole trip","English widely spoken — easy with Mum"],
  drawbacks:["Valletta has steep stepped streets in places","High summer is fiercely hot"],
  bestMonths:[4,5,6,10], acceptableMonths:[3,9,11], unsuitableMonths:[7,8],
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:8,
  budgetMinGBP:300, budgetTypicalGBP:450, budgetMaxGBP:800,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:5,
  ferryPossible:true, typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:2, walkingLevel:3, stairsRisk:3, luggageHandling:1, comfortLevel:4, weatherRisk:1,
  natureScore:5, sceneryScore:7, cultureScore:8, historyScore:9, foodScore:6,
  relaxationScore:7, photographyScore:8, uniqueTransportScore:3, valueForMoneyScore:8,
  onceInALifetimeScore:4, revisitScore:6,
  tags:["spring","warm-escape","beach"], officialSources:[{label:"Visit Malta",url:"https://www.visitmalta.com"}],
  sourceSection:"S7 Island Hopping / X5 UNESCO" }),

/* ---------------- LAND · rail ---------------- */
R({ id:"bernina-express", routeName:"Bernina Express (Chur–Tirano)", shortName:"Bernina Express",
  parentCategory:"Land", tripTypes:["Scenic Railway"], countries:["Switzerland","Italy"],
  regions:["Graubünden","Alps"], mainStops:["Chur","Landwasser Viaduct","Ospizio Bernina","Tirano"],
  description:"A UNESCO-listed line spiralling over glaciers and viaducts — sit still while the Alps perform.",
  highlights:["Landwasser Viaduct moment","Glacier views from a panorama car","Snow version is a second, different trip"],
  drawbacks:["Swiss prices around the journey","Panorama cars need seat reservations"],
  bestMonths:[6,7,8,9,1,2], acceptableMonths:[5,10,12,3], unsuitableMonths:[],
  minimumDurationDays:2, idealDurationDays:3, maximumDurationDays:5,
  budgetMinGBP:350, budgetTypicalGBP:550, budgetMaxGBP:900,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:6,
  trainPossible:true, typicalTransferLevel:"medium", hotelChanges:"low",
  physicalEffort:1, walkingLevel:1, stairsRisk:1, luggageHandling:2, comfortLevel:4, weatherRisk:2,
  natureScore:9, sceneryScore:10, cultureScore:3, historyScore:4, foodScore:5,
  relaxationScore:9, photographyScore:10, uniqueTransportScore:10, valueForMoneyScore:7,
  onceInALifetimeScore:8, revisitScore:9,
  tags:["summer","winter","snow"], officialSources:[{label:"Rhaetian Railway",url:"https://www.rhb.ch"}],
  sourceSection:"L1 Scenic Railways" }),

R({ id:"glacier-express", routeName:"Glacier Express (Zermatt–St. Moritz)", shortName:"Glacier Express",
  parentCategory:"Land", tripTypes:["Scenic Railway"], countries:["Switzerland"],
  regions:["Valais","Graubünden"], mainStops:["Zermatt","Andermatt","Oberalp Pass","St. Moritz"],
  description:"The 'slowest express in the world': 8 hours, 291 bridges, lunch served at your panoramic seat.",
  highlights:["All-day panorama with at-seat dining","Oberalp Pass snowscapes","Pairs with Gornergrat/Matterhorn"],
  drawbacks:["Full day seated (fine for some, long for others)","Priciest single scenic ticket in the guide"],
  bestMonths:[6,7,8,9,1,2], acceptableMonths:[5,10,12,3], unsuitableMonths:[],
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:6,
  budgetMinGBP:500, budgetTypicalGBP:750, budgetMaxGBP:1200,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:7,
  trainPossible:true, typicalTransferLevel:"medium", hotelChanges:"low",
  physicalEffort:1, walkingLevel:1, stairsRisk:1, luggageHandling:2, comfortLevel:5, weatherRisk:2,
  natureScore:9, sceneryScore:10, cultureScore:3, historyScore:4, foodScore:6,
  relaxationScore:9, photographyScore:10, uniqueTransportScore:10, valueForMoneyScore:6,
  onceInALifetimeScore:8, revisitScore:8,
  tags:["summer","winter","snow"], officialSources:[{label:"Glacier Express",url:"https://www.glacierexpress.ch"}],
  sourceSection:"L1 Scenic Railways" }),

R({ id:"flam-nutshell", routeName:"Flåm Railway & Norway in a Nutshell", shortName:"Flåm / Nutshell",
  parentCategory:"Land", tripTypes:["Scenic Railway","Ferry"], countries:["Norway"],
  regions:["Fjord Norway"], mainStops:["Bergen","Myrdal","Flåm","Nærøyfjord","Oslo"],
  description:"Mountain railway plunging to fjord level, then a boat through UNESCO Nærøyfjord — Norway's greatest hits in sequence.",
  highlights:["One of the world's steepest standard-gauge lines","Fjord cruise leg included","Works Bergen→Oslo as a moving day"],
  drawbacks:["Norway prices","Peak-summer coach-tour crowds at Flåm"],
  bestMonths:[5,6,7,8,9], acceptableMonths:[4,10], unsuitableMonths:[1,2],
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:7,
  budgetMinGBP:550, budgetTypicalGBP:800, budgetMaxGBP:1300,
  directFromManchester:"no", ManchesterAccessScore:5, approximateManchesterToStartHours:7,
  trainPossible:true, ferryPossible:true, typicalTransferLevel:"medium", hotelChanges:"medium",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:3, comfortLevel:4, weatherRisk:3,
  natureScore:10, sceneryScore:10, cultureScore:3, historyScore:3, foodScore:5,
  relaxationScore:8, photographyScore:10, uniqueTransportScore:9, valueForMoneyScore:6,
  onceInALifetimeScore:8, revisitScore:7,
  tags:["summer"], officialSources:[{label:"Visit Flåm",url:"https://www.visitflam.com"},{label:"Vy",url:"https://www.vy.no"}],
  liveVerificationNeeded:true, sourceSection:"L1 Scenic Railways" }),

R({ id:"goldenpass", routeName:"GoldenPass Express (Montreux–Interlaken)", shortName:"GoldenPass",
  parentCategory:"Land", tripTypes:["Scenic Railway"], countries:["Switzerland"],
  regions:["Lake Geneva","Bernese Oberland"], mainStops:["Montreux","Gstaad","Interlaken"],
  description:"Lake Geneva vineyards to Bernese Oberland peaks in one gentle panoramic run.",
  highlights:["Lavaux vineyard views","Connects two classic Swiss bases","Quieter than Glacier/Bernina"],
  drawbacks:["Less dramatic than Bernina","Swiss prices"],
  bestMonths:[6,7,8,9], acceptableMonths:[5,10,1,2], unsuitableMonths:[],
  minimumDurationDays:2, idealDurationDays:3, maximumDurationDays:5,
  budgetMinGBP:350, budgetTypicalGBP:550, budgetMaxGBP:900,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:5,
  trainPossible:true, typicalTransferLevel:"low", hotelChanges:"low",
  physicalEffort:1, walkingLevel:1, stairsRisk:1, luggageHandling:2, comfortLevel:5, weatherRisk:2,
  natureScore:8, sceneryScore:9, cultureScore:4, historyScore:4, foodScore:6,
  relaxationScore:9, photographyScore:9, uniqueTransportScore:8, valueForMoneyScore:7,
  onceInALifetimeScore:6, revisitScore:8,
  tags:["summer"], officialSources:[{label:"GoldenPass / MOB",url:"https://journey.mob.ch"},{label:"SBB",url:"https://www.sbb.ch"}],
  sourceSection:"L1 Scenic Railways" }),

R({ id:"west-highland", routeName:"West Highland Line & Jacobite Steam (Glasgow–Mallaig)", shortName:"West Highland Line",
  parentCategory:"Land", tripTypes:["Scenic Railway"], countries:["United Kingdom"],
  regions:["Scottish Highlands"], mainStops:["Glasgow","Rannoch Moor","Fort William","Glenfinnan","Mallaig"],
  description:"Britain's most beautiful railway, crowned by the Glenfinnan Viaduct steam crossing — all without leaving the country.",
  highlights:["Glenfinnan Viaduct by steam train","Rannoch Moor wilderness","Cheapest world-class rail trip from home"],
  drawbacks:["Jacobite sells out months ahead","Highland weather roulette"],
  bestMonths:[5,6,9], acceptableMonths:[4,7,8,10], unsuitableMonths:[],
  minimumDurationDays:2, idealDurationDays:3, maximumDurationDays:5,
  budgetMinGBP:200, budgetTypicalGBP:320, budgetMaxGBP:550, budgetConfidence:"high",
  directFromManchester:"not-applicable", ManchesterAccessScore:9, approximateManchesterToStartHours:3.5,
  flightRequired:false, trainPossible:true, typicalTransferLevel:"low", hotelChanges:"low",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:2, comfortLevel:3, weatherRisk:4,
  natureScore:9, sceneryScore:9, cultureScore:5, historyScore:6, foodScore:4,
  relaxationScore:8, photographyScore:9, uniqueTransportScore:9, valueForMoneyScore:9,
  onceInALifetimeScore:6, revisitScore:8,
  tags:["summer","no-fly","weekend"], officialSources:[{label:"ScotRail",url:"https://www.scotrail.co.uk"}],
  liveVerificationNeeded:true, sourceSection:"L1 Scenic Railways / Part 4 Scenic Trains" }),

R({ id:"cinque-terre-rail", routeName:"Cinque Terre Coastal Railway", shortName:"Cinque Terre",
  parentCategory:"Land", tripTypes:["Scenic Railway","Hiking","Food & Wine"], countries:["Italy"],
  regions:["Liguria"], mainStops:["Riomaggiore","Manarola","Vernazza","Monterosso"],
  description:"Five cliff villages strung on one local railway line — hop between them by train, linger for seafood and sunsets.",
  highlights:["Villages 5 min apart by train","Manarola sunset viewpoint","Optional coastal path sections"],
  drawbacks:["Villages themselves are steep and stepped","Summer day-tripper crush"],
  bestMonths:[4,5,9,10], acceptableMonths:[6,3], unsuitableMonths:[7,8],
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:6,
  budgetMinGBP:350, budgetTypicalGBP:550, budgetMaxGBP:900,
  directFromManchester:"seasonal", ManchesterAccessScore:6, approximateManchesterToStartHours:7,
  trainPossible:true, typicalTransferLevel:"medium", hotelChanges:"low",
  physicalEffort:3, walkingLevel:4, stairsRisk:4, luggageHandling:3, comfortLevel:3, weatherRisk:2,
  suitableForMum:false,
  natureScore:7, sceneryScore:9, cultureScore:6, historyScore:5, foodScore:9,
  relaxationScore:6, photographyScore:10, uniqueTransportScore:7, valueForMoneyScore:7,
  onceInALifetimeScore:6, revisitScore:7,
  tags:["spring","autumn"], officialSources:[{label:"Trenitalia",url:"https://www.trenitalia.com"},{label:"Cinque Terre NP",url:"https://www.parconazionale5terre.it"}],
  sourceSection:"L1 Scenic Railways" }),

R({ id:"caledonian-sleeper", routeName:"Caledonian Sleeper to the Highlands", shortName:"Caledonian Sleeper",
  parentCategory:"Land", tripTypes:["Sleeper Train"], countries:["United Kingdom"],
  regions:["Scottish Highlands"], mainStops:["London Euston","Fort William / Inverness"],
  description:"Board in London, wake up rolling across Rannoch Moor — Britain's most romantic commute.",
  highlights:["Breakfast with Highland views","Saves a hotel night","Pairs with West Highland Line"],
  drawbacks:["Cabins cost more than flying","Light sleepers may struggle"],
  bestMonths:[5,6,9], acceptableMonths:[4,7,8,10,12], unsuitableMonths:[],
  minimumDurationDays:2, idealDurationDays:3, maximumDurationDays:5,
  budgetMinGBP:250, budgetTypicalGBP:400, budgetMaxGBP:700,
  directFromManchester:"not-applicable", ManchesterAccessScore:8, approximateManchesterToStartHours:2.5,
  flightRequired:false, trainPossible:true,
  overnightTravelPossible:true, overnightTravelRequired:true,
  typicalTransferLevel:"low", hotelChanges:"low",
  physicalEffort:1, walkingLevel:2, stairsRisk:2, luggageHandling:2, comfortLevel:3, weatherRisk:3,
  natureScore:8, sceneryScore:8, cultureScore:4, historyScore:5, foodScore:4,
  relaxationScore:7, photographyScore:8, uniqueTransportScore:9, valueForMoneyScore:7,
  onceInALifetimeScore:5, revisitScore:7,
  tags:["no-fly","weekend"], officialSources:[{label:"Caledonian Sleeper",url:"https://www.sleeper.scot"}],
  sourceSection:"L2 Sleeper Trains" }),

R({ id:"santa-claus-express", routeName:"Santa Claus Express to Lapland (Helsinki–Rovaniemi)", shortName:"Santa Claus Express",
  parentCategory:"Land", tripTypes:["Sleeper Train","Northern Lights","Christmas Markets"], countries:["Finland"],
  regions:["Lapland"], mainStops:["Helsinki","Rovaniemi","Arctic Circle"],
  description:"Overnight train to the Arctic Circle: Santa's village, husky sledges and an aurora lottery ticket.",
  highlights:["Wake up inside the Arctic Circle","Santa Claus Village crossing-the-line moment","Aurora chances on clear nights"],
  drawbacks:["Deep-winter cold is serious (−20°C)","Lapland activity prices add up fast"],
  bestMonths:[12,1,2], acceptableMonths:[3,11], unsuitableMonths:[6,7],
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:7,
  budgetMinGBP:700, budgetTypicalGBP:1000, budgetMaxGBP:1800,
  directFromManchester:"no", ManchesterAccessScore:4, approximateManchesterToStartHours:8,
  trainPossible:true, overnightTravelPossible:true, overnightTravelRequired:true,
  typicalTransferLevel:"medium", hotelChanges:"medium",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:3, comfortLevel:3, weatherRisk:3,
  natureScore:8, sceneryScore:8, cultureScore:4, historyScore:3, foodScore:4,
  relaxationScore:6, adventureScore:7, photographyScore:8, uniqueTransportScore:9,
  valueForMoneyScore:6, onceInALifetimeScore:8, revisitScore:5,
  tags:["winter","christmas","snow","northern-lights"], officialSources:[{label:"VR",url:"https://www.vr.fi"},{label:"Visit Rovaniemi",url:"https://www.visitrovaniemi.fi"}],
  liveVerificationNeeded:true, sourceSection:"L2 Sleeper Trains" }),

R({ id:"orient-express", routeName:"Venice Simplon-Orient-Express (London–Venice)", shortName:"Orient Express",
  parentCategory:"Land", tripTypes:["Luxury Train"], countries:["United Kingdom","France","Italy"],
  regions:["Alps"], mainStops:["London","Paris","Alps","Venice"],
  description:"Art Deco carriages, black-tie dinner, the Alps at dawn — the guide's grand finale purchase.",
  highlights:["A moving five-star hotel","Alpine sunrise from a 1920s cabin","Ends in Venice"],
  drawbacks:["£3,500+ per person","One-night experience for the price of a fortnight elsewhere"],
  bestMonths:[5,6,9], acceptableMonths:[4,7,8,10], unsuitableMonths:[12,1,2],
  minimumDurationDays:2, idealDurationDays:4, maximumDurationDays:6,
  budgetMinGBP:3500, budgetTypicalGBP:4200, budgetMaxGBP:6000, budgetConfidence:"medium",
  directFromManchester:"not-applicable", ManchesterAccessScore:7, approximateManchesterToStartHours:2.5,
  flightRequired:false, trainPossible:true, overnightTravelPossible:true, overnightTravelRequired:true,
  typicalTransferLevel:"low", hotelChanges:"low",
  physicalEffort:1, walkingLevel:1, stairsRisk:2, luggageHandling:1, comfortLevel:5, weatherRisk:1,
  natureScore:6, sceneryScore:9, cultureScore:7, historyScore:8, foodScore:9,
  relaxationScore:9, photographyScore:9, uniqueTransportScore:10, valueForMoneyScore:2,
  onceInALifetimeScore:10, revisitScore:2,
  tags:["luxury"], officialSources:[{label:"Belmond",url:"https://www.belmond.com"}],
  liveVerificationNeeded:true, sourceSection:"L3 Luxury Trains" }),

R({ id:"interrail-central", routeName:"Interrail Central Europe (Berlin–Prague–Vienna–Budapest)", shortName:"Interrail Central",
  parentCategory:"Land", tripTypes:["Interrail","City Break"], countries:["Germany","Czechia","Austria","Hungary"],
  regions:["Central Europe"], mainStops:["Berlin","Prague","Vienna","Budapest"],
  description:"One pass, four capitals, trains every couple of hours — the classic first Interrail loop.",
  highlights:["Total route freedom","Four distinct capitals by rail","Passholder Eurostar fares from the UK"],
  drawbacks:["Hotel every 2–3 nights","Seat reservations needed on some legs"],
  bestMonths:[5,6,9], acceptableMonths:[4,10,7,8,12], unsuitableMonths:[],
  minimumDurationDays:8, idealDurationDays:12, maximumDurationDays:21,
  budgetMinGBP:700, budgetTypicalGBP:1000, budgetMaxGBP:1600,
  directFromManchester:"not-applicable", ManchesterAccessScore:7, approximateManchesterToStartHours:9,
  flightRequired:false, trainPossible:true, overnightTravelPossible:true,
  typicalTransferLevel:"high", hotelChanges:"high",
  physicalEffort:3, walkingLevel:3, stairsRisk:3, luggageHandling:4, comfortLevel:3, weatherRisk:2,
  suitableForMum:false,
  natureScore:3, sceneryScore:5, cultureScore:9, historyScore:9, foodScore:7,
  relaxationScore:4, adventureScore:6, photographyScore:7, uniqueTransportScore:7,
  valueForMoneyScore:8, onceInALifetimeScore:6, revisitScore:8,
  tags:["summer","no-fly"], officialSources:[{label:"Interrail",url:"https://www.interrail.eu"},{label:"Eurostar",url:"https://www.eurostar.com"}],
  sourceSection:"L4 Interrail" }),

/* ---------------- LAND · road, hike, alpine ---------------- */
R({ id:"nc500", routeName:"North Coast 500 Road Trip", shortName:"NC500",
  parentCategory:"Land", tripTypes:["Road Trip"], countries:["United Kingdom"],
  regions:["Scottish Highlands"], mainStops:["Inverness","Applecross","Durness","John o' Groats"],
  description:"516 miles around Scotland's wild northern edge — beaches like the Caribbean, weather like Scotland.",
  highlights:["Bealach na Bà hairpins","Empty white-sand beaches","Drive from your own front door"],
  drawbacks:["Single-track roads need confidence","Accommodation books out for summer"],
  bestMonths:[5,6,9], acceptableMonths:[4,7,8,10], unsuitableMonths:[12,1,2],
  minimumDurationDays:5, idealDurationDays:6, maximumDurationDays:10,
  budgetMinGBP:400, budgetTypicalGBP:600, budgetMaxGBP:1000, budgetConfidence:"high",
  directFromManchester:"not-applicable", ManchesterAccessScore:8, approximateManchesterToStartHours:6,
  flightRequired:false, drivingRequired:true, trainPossible:false,
  typicalTransferLevel:"low", hotelChanges:"high",
  physicalEffort:2, walkingLevel:2, stairsRisk:1, luggageHandling:3, comfortLevel:3, weatherRisk:4,
  natureScore:10, sceneryScore:10, cultureScore:4, historyScore:5, foodScore:6,
  relaxationScore:6, adventureScore:7, photographyScore:10, uniqueTransportScore:5,
  valueForMoneyScore:8, onceInALifetimeScore:7, revisitScore:8,
  tags:["summer","no-fly"], officialSources:[{label:"North Coast 500",url:"https://www.northcoast500.com"}],
  sourceSection:"L5 Road Trip" }),

R({ id:"iceland-ring", routeName:"Iceland Ring Road Circuit", shortName:"Iceland Ring Road",
  parentCategory:"Land", tripTypes:["Road Trip","Wildlife"], countries:["Iceland"],
  regions:["Iceland"], mainStops:["Reykjavik","Vík","Jökulsárlón","Mývatn","Snæfellsnes"],
  description:"1,332 km of waterfalls, glaciers, black beaches and volcanoes — the road trip other road trips are measured against.",
  highlights:["Jökulsárlón glacier lagoon","New landscape every hour","Summer = endless daylight for driving"],
  drawbacks:["Iceland prices sting","Weather can close sections even in summer"],
  bestMonths:[6,7,8,9], acceptableMonths:[5], unsuitableMonths:[11,12,1,2,3],
  minimumDurationDays:7, idealDurationDays:9, maximumDurationDays:14,
  budgetMinGBP:1000, budgetTypicalGBP:1400, budgetMaxGBP:2400,
  directFromManchester:"yes", ManchesterAccessScore:7, approximateManchesterToStartHours:4.5,
  drivingRequired:true, typicalTransferLevel:"low", hotelChanges:"high",
  physicalEffort:3, walkingLevel:3, stairsRisk:2, luggageHandling:4, comfortLevel:3, weatherRisk:4,
  suitableForMum:false,
  natureScore:10, sceneryScore:10, cultureScore:3, historyScore:3, foodScore:5,
  relaxationScore:5, adventureScore:9, photographyScore:10, uniqueTransportScore:4,
  valueForMoneyScore:5, onceInALifetimeScore:9, revisitScore:8,
  tags:["summer","wildlife"], officialSources:[{label:"Visit Iceland",url:"https://www.visiticeland.com"}],
  sourceSection:"L5 Road Trip" }),

R({ id:"wild-atlantic", routeName:"Wild Atlantic Way (Kerry & Clare section)", shortName:"Wild Atlantic Way",
  parentCategory:"Land", tripTypes:["Road Trip"], countries:["Ireland"],
  regions:["West Ireland"], mainStops:["Ring of Kerry","Dingle","Cliffs of Moher","Galway"],
  description:"A drivable slice of the 2,500 km Atlantic coast — cliffs, trad-music pubs and forty shades of green.",
  highlights:["Cliffs of Moher","Dingle peninsula + pub sessions","55-minute flight or ferry options"],
  drawbacks:["Rain is part of the deal","Narrow lanes on the peninsulas"],
  bestMonths:[5,6,9], acceptableMonths:[4,7,8,10], unsuitableMonths:[12,1],
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:10,
  budgetMinGBP:350, budgetTypicalGBP:550, budgetMaxGBP:900,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:3,
  drivingRequired:true, ferryPossible:true,
  typicalTransferLevel:"low", hotelChanges:"medium",
  physicalEffort:2, walkingLevel:2, stairsRisk:1, luggageHandling:3, comfortLevel:3, weatherRisk:4,
  natureScore:9, sceneryScore:9, cultureScore:6, historyScore:6, foodScore:6,
  relaxationScore:6, photographyScore:9, uniqueTransportScore:4, valueForMoneyScore:8,
  onceInALifetimeScore:5, revisitScore:8,
  tags:["summer"], officialSources:[{label:"Wild Atlantic Way",url:"https://www.thewildatlanticway.com"}],
  sourceSection:"L5 Road Trip" }),

R({ id:"romantic-road", routeName:"Romantic Road & Neuschwanstein (Würzburg–Füssen)", shortName:"Romantic Road",
  parentCategory:"Land", tripTypes:["Road Trip","Castle Stay","UNESCO Heritage"], countries:["Germany"],
  regions:["Bavaria"], mainStops:["Würzburg","Rothenburg ob der Tauber","Füssen","Neuschwanstein"],
  description:"Walled medieval towns strung along Bavaria, finishing beneath the fairy-tale castle itself.",
  highlights:["Rothenburg's intact walls","Neuschwanstein finale","Golden in October foliage"],
  drawbacks:["Castle interior = coach crowds","Rothenburg cobbles everywhere"],
  bestMonths:[5,6,9,10], acceptableMonths:[4,7,8,12], unsuitableMonths:[1,2],
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:7,
  budgetMinGBP:400, budgetTypicalGBP:600, budgetMaxGBP:1000,
  directFromManchester:"yes", ManchesterAccessScore:7, approximateManchesterToStartHours:4.5,
  drivingRequired:true, trainPossible:true,
  typicalTransferLevel:"low", hotelChanges:"medium",
  physicalEffort:2, walkingLevel:3, stairsRisk:3, luggageHandling:3, comfortLevel:4, weatherRisk:2,
  natureScore:5, sceneryScore:7, cultureScore:8, historyScore:9, foodScore:6,
  relaxationScore:6, photographyScore:9, uniqueTransportScore:3, valueForMoneyScore:7,
  onceInALifetimeScore:6, revisitScore:6,
  tags:["autumn","foliage"], officialSources:[{label:"Romantic Road",url:"https://www.romantischestrasse.de"}],
  sourceSection:"L5 Road Trip / SE7 Autumn" }),

R({ id:"plitvice", routeName:"Plitvice Lakes & Croatian Interior", shortName:"Plitvice Lakes",
  parentCategory:"Land", tripTypes:["Hiking","UNESCO Heritage"], countries:["Croatia"],
  regions:["Lika"], mainStops:["Zagreb","Plitvice Lakes NP","Zadar"],
  description:"Sixteen terraced turquoise lakes joined by waterfalls, walked entirely on flat boardwalks — big nature at low effort.",
  highlights:["Boardwalks = level walking through waterfalls","Electric boat crosses the big lake","October colour is spectacular"],
  drawbacks:["Summer queues on the boardwalks","Needs a transfer from Zagreb/Zadar"],
  bestMonths:[5,6,9,10], acceptableMonths:[4], unsuitableMonths:[7,8,1,2],
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:6,
  budgetMinGBP:300, budgetTypicalGBP:450, budgetMaxGBP:750,
  directFromManchester:"seasonal", ManchesterAccessScore:6, approximateManchesterToStartHours:7,
  typicalTransferLevel:"medium", hotelChanges:"low",
  physicalEffort:2, walkingLevel:3, stairsRisk:1, luggageHandling:2, comfortLevel:3, weatherRisk:2,
  natureScore:10, sceneryScore:10, cultureScore:3, historyScore:3, foodScore:5,
  relaxationScore:7, photographyScore:10, uniqueTransportScore:3, valueForMoneyScore:8,
  onceInALifetimeScore:7, revisitScore:6,
  tags:["spring","autumn","foliage"], officialSources:[{label:"Plitvice Lakes NP",url:"https://np-plitvicka-jezera.hr"}],
  liveVerificationNeeded:true, sourceSection:"L8 Hiking & National Parks" }),

R({ id:"dolomites", routeName:"Dolomites & Tre Cime (Cortina/Val Gardena)", shortName:"Dolomites",
  parentCategory:"Land", tripTypes:["Hiking","Alpine Route"], countries:["Italy"],
  regions:["South Tyrol","Dolomites"], mainStops:["Bolzano","Val Gardena","Tre Cime di Lavaredo"],
  description:"Pale rock towers over green meadows — cable cars do the climbing, you choose how far to walk.",
  highlights:["Tre Cime loop","Cable-car network opens high country to all","Alpine huts serve proper Italian lunch"],
  drawbacks:["Fly to Verona/Venice then 2h+ transfer","Weather turns fast at altitude"],
  bestMonths:[7,8,9], acceptableMonths:[6,10,1,2], unsuitableMonths:[4,11],
  minimumDurationDays:4, idealDurationDays:6, maximumDurationDays:10,
  budgetMinGBP:500, budgetTypicalGBP:750, budgetMaxGBP:1300,
  directFromManchester:"seasonal", ManchesterAccessScore:5, approximateManchesterToStartHours:8,
  drivingRequired:false, typicalTransferLevel:"medium", hotelChanges:"low",
  physicalEffort:4, walkingLevel:4, stairsRisk:3, luggageHandling:3, comfortLevel:3, weatherRisk:3,
  suitableForMum:false,
  natureScore:10, sceneryScore:10, cultureScore:4, historyScore:4, foodScore:8,
  relaxationScore:5, adventureScore:8, photographyScore:10, uniqueTransportScore:6,
  valueForMoneyScore:7, onceInALifetimeScore:8, revisitScore:9,
  tags:["summer"], officialSources:[{label:"South Tyrol",url:"https://www.suedtirol.info"}],
  sourceSection:"L8 Hiking / L9 Alpine Routes" }),

R({ id:"madeira-levada", routeName:"Madeira Levada Walks & Gardens", shortName:"Madeira",
  parentCategory:"Land", tripTypes:["Hiking","Island Hopping","Slow Travel"], countries:["Portugal"],
  regions:["Madeira"], mainStops:["Funchal","Levada do Caldeirão Verde","Monte Gardens"],
  description:"Flat irrigation-channel paths contour through cloud forest — gentle walking on a spring-all-year island.",
  highlights:["Levadas: level paths, big scenery","20°C in January","Funchal gardens + cable car for low-effort days"],
  drawbacks:["Some levadas have drops/tunnels — choose graded ones","Mountain weather shifts quickly"],
  bestMonths:[3,4,5,9,10,11], acceptableMonths:[1,2,6,12], unsuitableMonths:[],
  minimumDurationDays:5, idealDurationDays:7, maximumDurationDays:14,
  budgetMinGBP:400, budgetTypicalGBP:600, budgetMaxGBP:1000,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:5,
  typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:2, walkingLevel:3, stairsRisk:2, luggageHandling:1, comfortLevel:4, weatherRisk:2,
  natureScore:9, sceneryScore:9, cultureScore:4, historyScore:4, foodScore:6,
  relaxationScore:8, photographyScore:8, uniqueTransportScore:3, valueForMoneyScore:8,
  onceInALifetimeScore:5, revisitScore:8,
  tags:["winter","warm-escape","flowers"], officialSources:[{label:"Visit Madeira",url:"https://www.visitmadeira.com"}],
  sourceSection:"L8 Hiking & National Parks" }),

R({ id:"danube-cycle", routeName:"Danube Cycle Path (Passau–Vienna)", shortName:"Danube Cycle",
  parentCategory:"Land", tripTypes:["Cycling"], countries:["Germany","Austria"],
  regions:["Danube Valley","Wachau"], mainStops:["Passau","Linz","Wachau","Vienna"],
  description:"Europe's flattest famous cycle route: riverside all the way, luggage vans move your bags between hotels.",
  highlights:["Flat, car-free riverside path","Luggage transferred for you","Wachau apricot orchards + wine taverns"],
  drawbacks:["6 consecutive riding days","Saddle time even if gentle"],
  bestMonths:[5,6,9], acceptableMonths:[4,7,8], unsuitableMonths:[11,12,1,2],
  minimumDurationDays:6, idealDurationDays:7, maximumDurationDays:9,
  budgetMinGBP:550, budgetTypicalGBP:800, budgetMaxGBP:1200,
  directFromManchester:"yes", ManchesterAccessScore:7, approximateManchesterToStartHours:6,
  typicalTransferLevel:"medium", hotelChanges:"high",
  physicalEffort:3, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:3, weatherRisk:2,
  suitableForMum:false, suitableForOlderTraveller:true,
  natureScore:7, sceneryScore:8, cultureScore:6, historyScore:6, foodScore:7,
  relaxationScore:6, adventureScore:6, photographyScore:7, uniqueTransportScore:7,
  valueForMoneyScore:8, onceInALifetimeScore:5, revisitScore:7,
  tags:["summer"], officialSources:[{label:"Donau Radweg",url:"https://www.donauradweg.at"},{label:"EuroVelo",url:"https://en.eurovelo.com"}],
  sourceSection:"L7 Cycling" }),

R({ id:"jungfrau", routeName:"Jungfraujoch & Bernese Oberland (Interlaken base)", shortName:"Jungfraujoch",
  parentCategory:"Land", tripTypes:["Alpine Route","Scenic Railway"], countries:["Switzerland"],
  regions:["Bernese Oberland"], mainStops:["Interlaken","Grindelwald","Jungfraujoch","Mürren"],
  description:"Cog railways and cable cars lift you to 3,454 m 'Top of Europe' — glacier views with zero climbing.",
  highlights:["Highest railway station in Europe","One base, day trips by mountain rail","Mürren car-free village"],
  drawbacks:["Jungfraujoch ticket is eye-watering","Cloud can hide everything — check webcams"],
  bestMonths:[6,7,8,9], acceptableMonths:[5,10,1,2], unsuitableMonths:[],
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:8,
  budgetMinGBP:700, budgetTypicalGBP:1000, budgetMaxGBP:1600,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:6,
  trainPossible:true, typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:5, weatherRisk:3,
  natureScore:10, sceneryScore:10, cultureScore:3, historyScore:3, foodScore:6,
  relaxationScore:8, photographyScore:10, uniqueTransportScore:9, valueForMoneyScore:5,
  onceInALifetimeScore:8, revisitScore:9,
  tags:["summer","snow","mum-flagship"], officialSources:[{label:"Jungfrau Railways",url:"https://www.jungfrau.ch"},{label:"MySwitzerland",url:"https://www.myswitzerland.com"}],
  sourceSection:"L9 Alpine Routes" }),

R({ id:"zermatt", routeName:"Zermatt & Gornergrat (Matterhorn)", shortName:"Zermatt / Matterhorn",
  parentCategory:"Land", tripTypes:["Alpine Route","Scenic Railway"], countries:["Switzerland"],
  regions:["Valais"], mainStops:["Zermatt","Gornergrat","Riffelsee"],
  description:"Car-free village beneath the world's most photogenic mountain; the cog railway does all the work.",
  highlights:["Matterhorn sunrise from Gornergrat","Riffelsee reflection shot","Combines with Glacier Express"],
  drawbacks:["Swiss prices at their steepest","Village busy in peak weeks"],
  bestMonths:[6,7,8,9], acceptableMonths:[5,10,12,1,2], unsuitableMonths:[],
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:7,
  budgetMinGBP:650, budgetTypicalGBP:950, budgetMaxGBP:1600,
  directFromManchester:"yes", ManchesterAccessScore:7, approximateManchesterToStartHours:7,
  trainPossible:true, typicalTransferLevel:"medium", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:2, comfortLevel:5, weatherRisk:3,
  natureScore:10, sceneryScore:10, cultureScore:3, historyScore:3, foodScore:6,
  relaxationScore:8, photographyScore:10, uniqueTransportScore:9, valueForMoneyScore:5,
  onceInALifetimeScore:8, revisitScore:9,
  tags:["summer","snow"], officialSources:[{label:"Gornergrat",url:"https://www.gornergrat.ch"},{label:"Zermatt",url:"https://www.zermatt.ch"}],
  sourceSection:"L9 Alpine Routes" }),

/* ---------------- SEASONAL ---------------- */
R({ id:"vienna-christmas", routeName:"Vienna Christmas Markets & Coffee Houses", shortName:"Vienna Christmas",
  parentCategory:"Seasonal", tripTypes:["Christmas Markets","City Break"], countries:["Austria"],
  regions:["Vienna"], mainStops:["Rathausplatz market","Schönbrunn market","Café Central"],
  description:"The most elegant Christmas in Europe: Rathaus lights, Schönbrunn stalls, Sachertorte between markets.",
  highlights:["Rathausplatz under lights","Flat city + superb trams","Coffee-house warm-up culture"],
  drawbacks:["Vienna prices push a tight budget","Cold, short days"],
  bestMonths:[12], acceptableMonths:[11], unsuitableMonths:[6,7,8],
  seasonalWindow:"Mid-Nov – 26 Dec",
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:5,
  budgetMinGBP:350, budgetTypicalGBP:480, budgetMaxGBP:750,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:4,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:5, weatherRisk:2,
  natureScore:2, sceneryScore:6, cultureScore:10, historyScore:9, foodScore:8,
  relaxationScore:8, photographyScore:8, uniqueTransportScore:3, valueForMoneyScore:6,
  onceInALifetimeScore:6, revisitScore:9,
  tags:["winter","christmas","mum-flagship","weekend"], officialSources:[{label:"Vienna Tourist Board",url:"https://www.wien.info"}],
  sourceSection:"SE1 Christmas Markets" }),

R({ id:"nuremberg-christmas", routeName:"Nuremberg Christkindlesmarkt", shortName:"Nuremberg Christmas",
  parentCategory:"Seasonal", tripTypes:["Christmas Markets","City Break"], countries:["Germany"],
  regions:["Bavaria"], mainStops:["Hauptmarkt","Kaiserburg","Lebkuchen bakeries"],
  description:"Germany's most traditional market — gingerbread's birthplace, in a walled medieval old town.",
  highlights:["The original Christkind opening","Lebkuchen + Drei-im-Weggla sausages","Compact walkable old town"],
  drawbacks:["Usually one connection to reach (no MAN direct — verify)","Cobbles + castle hill optional"],
  bestMonths:[12], acceptableMonths:[11], unsuitableMonths:[6,7,8],
  seasonalWindow:"Late Nov – 24 Dec",
  minimumDurationDays:3, idealDurationDays:3, maximumDurationDays:5,
  budgetMinGBP:300, budgetTypicalGBP:420, budgetMaxGBP:650,
  directFromManchester:"unknown", ManchesterAccessScore:5, approximateManchesterToStartHours:6,
  typicalTransferLevel:"medium", hotelChanges:"none",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:1, comfortLevel:4, weatherRisk:2,
  natureScore:1, sceneryScore:5, cultureScore:9, historyScore:9, foodScore:8,
  relaxationScore:7, photographyScore:8, uniqueTransportScore:2, valueForMoneyScore:7,
  onceInALifetimeScore:6, revisitScore:7,
  tags:["winter","christmas","weekend"], officialSources:[{label:"Christkindlesmarkt",url:"https://www.christkindlesmarkt.de"}],
  liveVerificationNeeded:true, sourceSection:"SE1 Christmas Markets" }),

R({ id:"cologne-christmas", routeName:"Cologne Cathedral Christmas Markets", shortName:"Cologne Christmas",
  parentCategory:"Seasonal", tripTypes:["Christmas Markets","City Break"], countries:["Germany"],
  regions:["Rhineland"], mainStops:["Cathedral market","Alter Markt","Rhine promenade"],
  description:"Seven markets under one Gothic colossus — the easiest big German Christmas to reach from Manchester.",
  highlights:["Market beneath the Dom","Flat city, markets close together","Seasonal MAN direct flights (verify)"],
  drawbacks:["Busiest German market — weekend crowds","City itself is plainer beyond the markets"],
  bestMonths:[12], acceptableMonths:[11], unsuitableMonths:[6,7,8],
  seasonalWindow:"Late Nov – 23 Dec",
  minimumDurationDays:2, idealDurationDays:3, maximumDurationDays:4,
  budgetMinGBP:250, budgetTypicalGBP:380, budgetMaxGBP:600,
  directFromManchester:"seasonal", ManchesterAccessScore:8, approximateManchesterToStartHours:3.5,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:4, weatherRisk:2,
  natureScore:1, sceneryScore:5, cultureScore:8, historyScore:8, foodScore:7,
  relaxationScore:7, photographyScore:8, uniqueTransportScore:2, valueForMoneyScore:8,
  onceInALifetimeScore:5, revisitScore:7,
  tags:["winter","christmas","weekend","mum-flagship"], officialSources:[{label:"Cologne Tourism",url:"https://www.cologne-tourism.com"}],
  liveVerificationNeeded:true, sourceSection:"SE1 Christmas Markets" }),

R({ id:"prague-christmas", routeName:"Prague Old Town Christmas", shortName:"Prague Christmas",
  parentCategory:"Seasonal", tripTypes:["Christmas Markets","City Break"], countries:["Czechia"],
  regions:["Bohemia"], mainStops:["Old Town Square","Charles Bridge","Prague Castle (tram 22)"],
  description:"The astronomical clock with a Christmas tree in front of it — fairy-tale value for money.",
  highlights:["Old Town Square market backdrop","Cheapest of the classic markets","Tram 22 beats the castle hill"],
  drawbacks:["Cobbles everywhere — sturdy shoes","Very touristy at Christmas"],
  bestMonths:[12], acceptableMonths:[11,1], unsuitableMonths:[7,8],
  seasonalWindow:"Late Nov – 6 Jan",
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:5,
  budgetMinGBP:280, budgetTypicalGBP:400, budgetMaxGBP:600,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:3.5,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:2, walkingLevel:3, stairsRisk:2, luggageHandling:1, comfortLevel:4, weatherRisk:2,
  natureScore:1, sceneryScore:7, cultureScore:9, historyScore:9, foodScore:6,
  relaxationScore:6, photographyScore:9, uniqueTransportScore:3, valueForMoneyScore:8,
  onceInALifetimeScore:5, revisitScore:7,
  tags:["winter","christmas","weekend"], officialSources:[{label:"Prague City Tourism",url:"https://www.prague.eu"}],
  sourceSection:"SE1 Christmas Markets" }),

R({ id:"tromso-aurora", routeName:"Tromsø Northern Lights Break", shortName:"Tromsø Aurora",
  parentCategory:"Seasonal", tripTypes:["Northern Lights","Wildlife"], countries:["Norway"],
  regions:["Arctic Norway"], mainStops:["Tromsø","Lyngen Alps","Fjellheisen cable car"],
  description:"The aurora capital: city comforts by day, minibus chases under the oval by night.",
  highlights:["Highest aurora hit-rate in the guide","Stay urban, chase by bus — Mum-workable","Cable car + fjord scenery as backup"],
  drawbacks:["Via Oslo (no MAN direct — verify)","Clear skies never guaranteed"],
  bestMonths:[2,3,9,10], acceptableMonths:[1,11,12], unsuitableMonths:[5,6,7],
  seasonalWindow:"Sep – Mar",
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:7,
  budgetMinGBP:750, budgetTypicalGBP:1000, budgetMaxGBP:1600,
  directFromManchester:"no", ManchesterAccessScore:4, approximateManchesterToStartHours:8,
  typicalTransferLevel:"medium", hotelChanges:"none",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:2, comfortLevel:4, weatherRisk:4,
  natureScore:9, sceneryScore:9, cultureScore:3, historyScore:2, foodScore:5,
  relaxationScore:6, adventureScore:7, photographyScore:10, uniqueTransportScore:4,
  valueForMoneyScore:5, onceInALifetimeScore:9, revisitScore:6,
  tags:["winter","northern-lights","snow"], officialSources:[{label:"Visit Tromsø",url:"https://www.visittromso.no"}],
  liveVerificationNeeded:true, sourceSection:"SE2 Northern Lights" }),

R({ id:"iceland-winter", routeName:"Iceland Winter: Ice Caves, Aurora & Golden Circle", shortName:"Iceland Winter",
  parentCategory:"Seasonal", tripTypes:["Northern Lights","Wildlife"], countries:["Iceland"],
  regions:["South Iceland"], mainStops:["Reykjavik","Golden Circle","Jökulsárlón","Vatnajökull ice cave"],
  description:"Blue ice caves by day, aurora hunting by night — a compact 4-day double bill, direct from Manchester.",
  highlights:["Sapphire ice-cave interiors (Nov–Mar only)","MAN direct, 2.5h flight","Glacier lagoon needs zero walking"],
  drawbacks:["Winter storms can cancel tours","Ice-cave tours = uneven footing (crampons)"],
  bestMonths:[2,11,3], acceptableMonths:[12,1,10], unsuitableMonths:[6,7,8],
  seasonalWindow:"Ice caves Nov – Mar",
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:7,
  budgetMinGBP:650, budgetTypicalGBP:900, budgetMaxGBP:1500,
  directFromManchester:"yes", ManchesterAccessScore:7, approximateManchesterToStartHours:4.5,
  typicalTransferLevel:"low", hotelChanges:"low",
  physicalEffort:3, walkingLevel:3, stairsRisk:3, luggageHandling:2, comfortLevel:3, weatherRisk:5,
  suitableForMum:false,
  natureScore:10, sceneryScore:10, cultureScore:2, historyScore:2, foodScore:5,
  relaxationScore:5, adventureScore:8, photographyScore:10, uniqueTransportScore:4,
  valueForMoneyScore:6, onceInALifetimeScore:9, revisitScore:7,
  tags:["winter","northern-lights","snow"], officialSources:[{label:"Vatnajökull NP",url:"https://www.vatnajokulsthjodgardur.is"},{label:"Visit Iceland",url:"https://www.visiticeland.com"}],
  liveVerificationNeeded:true, sourceSection:"SE2 / SE9 Glacier" }),

R({ id:"lapland-igloo", routeName:"Finnish Lapland Glass Igloo & Husky Safari", shortName:"Lapland Igloo",
  parentCategory:"Seasonal", tripTypes:["Northern Lights","Christmas Markets"], countries:["Finland"],
  regions:["Lapland"], mainStops:["Rovaniemi / Levi","glass igloo resort","husky farm"],
  description:"Watch for the aurora from a heated glass-roofed bed — the bucket-list splurge of the winter section.",
  highlights:["Aurora from your pillow","Husky + reindeer sledges","Santa's village for the inner child"],
  drawbacks:["Igloo nights are very expensive","Deep cold (−15 to −25°C)"],
  bestMonths:[12,1,2,3], acceptableMonths:[11], unsuitableMonths:[6,7,8],
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:7,
  budgetMinGBP:1200, budgetTypicalGBP:1800, budgetMaxGBP:3000, budgetConfidence:"low",
  directFromManchester:"seasonal", ManchesterAccessScore:6, approximateManchesterToStartHours:5,
  typicalTransferLevel:"low", hotelChanges:"low",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:2, comfortLevel:5, weatherRisk:4,
  natureScore:9, sceneryScore:9, cultureScore:3, historyScore:2, foodScore:5,
  relaxationScore:8, adventureScore:7, photographyScore:9, uniqueTransportScore:6,
  valueForMoneyScore:4, onceInALifetimeScore:9, revisitScore:4,
  tags:["winter","northern-lights","snow","christmas"], officialSources:[{label:"Visit Rovaniemi",url:"https://www.visitrovaniemi.fi"}],
  liveVerificationNeeded:true, sourceSection:"SE2 Northern Lights / Top100 #45" }),

R({ id:"lofoten-midnightsun", routeName:"Lofoten Islands Midnight Sun", shortName:"Lofoten",
  parentCategory:"Seasonal", tripTypes:["Road Trip","Hiking"], countries:["Norway"],
  regions:["Arctic Norway","Lofoten"], mainStops:["Reine","Hamnøy","Henningsvær","Unstad"],
  description:"Red fishing cabins under granite spires, lit by a sun that never sets — Norway's most surreal June.",
  highlights:["24-hour golden light for photos","Stay in a rorbu fishing cabin","Beaches that look tropical (water isn't)"],
  drawbacks:["Two flights + drive to reach","Sleep needs an eye mask"],
  bestMonths:[6], acceptableMonths:[5,7], unsuitableMonths:[11,12,1],
  seasonalWindow:"Midnight sun late May – mid Jul",
  minimumDurationDays:5, idealDurationDays:6, maximumDurationDays:10,
  budgetMinGBP:900, budgetTypicalGBP:1250, budgetMaxGBP:2000,
  directFromManchester:"no", ManchesterAccessScore:3, approximateManchesterToStartHours:11,
  drivingRequired:true, typicalTransferLevel:"high", hotelChanges:"medium",
  physicalEffort:3, walkingLevel:3, stairsRisk:2, luggageHandling:3, comfortLevel:3, weatherRisk:4,
  suitableForMum:false,
  natureScore:10, sceneryScore:10, cultureScore:3, historyScore:3, foodScore:6,
  relaxationScore:6, adventureScore:8, photographyScore:10, uniqueTransportScore:4,
  valueForMoneyScore:5, onceInALifetimeScore:9, revisitScore:7,
  tags:["summer","midnight-sun"], officialSources:[{label:"Visit Norway",url:"https://www.visitnorway.com"}],
  liveVerificationNeeded:true, sourceSection:"SE3 Midnight Sun" }),

R({ id:"keukenhof", routeName:"Keukenhof Tulips & Haarlem", shortName:"Keukenhof Tulips",
  parentCategory:"Seasonal", tripTypes:["City Break","Slow Travel"], countries:["Netherlands"],
  regions:["Holland"], mainStops:["Haarlem","Keukenhof","Amsterdam canals","Zaanse Schans"],
  description:"Seven million bulbs in bloom for six short weeks — Europe's gentlest, flattest big spectacle.",
  highlights:["The world's densest colour, benches everywhere","Pancake-flat: easiest walking in the guide","Haarlem base cuts costs vs Amsterdam"],
  drawbacks:["Hard seasonal window (bloom is weather's call)","Dutch prices strain small budgets"],
  bestMonths:[4], acceptableMonths:[3,5], unsuitableMonths:[6,7,8,9,10,11,12,1],
  seasonalWindow:"Park open ~late Mar – mid May; peak mid-Apr",
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:5,
  budgetMinGBP:320, budgetTypicalGBP:420, budgetMaxGBP:650,
  directFromManchester:"yes", ManchesterAccessScore:10, approximateManchesterToStartHours:4,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:4, weatherRisk:3,
  natureScore:8, sceneryScore:9, cultureScore:6, historyScore:5, foodScore:5,
  relaxationScore:8, photographyScore:10, uniqueTransportScore:3, valueForMoneyScore:6,
  onceInALifetimeScore:7, revisitScore:6,
  tags:["spring","flowers","mum-flagship","weekend"], officialSources:[{label:"Keukenhof",url:"https://keukenhof.nl"}],
  liveVerificationNeeded:true, sourceSection:"SE4 Tulips" }),

R({ id:"provence-lavender", routeName:"Provence Lavender (Valensole & Sault)", shortName:"Provence Lavender",
  parentCategory:"Seasonal", tripTypes:["Road Trip","Food & Wine"], countries:["France"],
  regions:["Provence"], mainStops:["Valensole Plateau","Sault","Sénanque Abbey","Aix-en-Provence"],
  description:"Purple to the horizon and the air smells of it — a two-week July window worth planning a year around.",
  highlights:["Valensole at golden hour","Sénanque Abbey postcard shot","Markets + rosé in Aix"],
  drawbacks:["Needs a hire car","Fields harvested from mid-July"],
  bestMonths:[7], acceptableMonths:[6], unsuitableMonths:[9,10,11,12,1,2,3],
  seasonalWindow:"Late Jun – mid Jul",
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:6,
  budgetMinGBP:450, budgetTypicalGBP:600, budgetMaxGBP:950,
  directFromManchester:"seasonal", ManchesterAccessScore:6, approximateManchesterToStartHours:6,
  drivingRequired:true, typicalTransferLevel:"low", hotelChanges:"low",
  physicalEffort:2, walkingLevel:2, stairsRisk:1, luggageHandling:2, comfortLevel:4, weatherRisk:1,
  natureScore:8, sceneryScore:9, cultureScore:5, historyScore:5, foodScore:8,
  relaxationScore:8, photographyScore:10, uniqueTransportScore:2, valueForMoneyScore:6,
  onceInALifetimeScore:7, revisitScore:6,
  tags:["summer","flowers"], officialSources:[{label:"Provence Tourism",url:"https://provence-alpes-cotedazur.com"}],
  liveVerificationNeeded:true, sourceSection:"SE5 Lavender" }),

R({ id:"alsace-autumn", routeName:"Alsace Wine Route in Autumn", shortName:"Alsace Autumn",
  parentCategory:"Seasonal", tripTypes:["Food & Wine","Road Trip"], countries:["France"],
  regions:["Alsace"], mainStops:["Colmar","Riquewihr","Eguisheim","Strasbourg"],
  description:"Half-timbered villages in golden vineyards, cellars open for the new vintage — October at its most flattering.",
  highlights:["Riquewihr + Eguisheim storybook lanes","Harvest tastings","Crowds gone, colour arrived"],
  drawbacks:["Best done with a car (or pricey tours)","Basel/Strasbourg arrival + transfer"],
  bestMonths:[9,10], acceptableMonths:[5,6,12], unsuitableMonths:[1,2],
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:6,
  budgetMinGBP:400, budgetTypicalGBP:550, budgetMaxGBP:850,
  directFromManchester:"yes", ManchesterAccessScore:7, approximateManchesterToStartHours:5,
  drivingRequired:false, typicalTransferLevel:"medium", hotelChanges:"low",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:2, comfortLevel:4, weatherRisk:2,
  natureScore:6, sceneryScore:8, cultureScore:7, historyScore:7, foodScore:9,
  relaxationScore:8, photographyScore:9, uniqueTransportScore:2, valueForMoneyScore:7,
  onceInALifetimeScore:5, revisitScore:8,
  tags:["autumn","foliage","wine","mum-flagship"], officialSources:[{label:"Vins d'Alsace",url:"https://www.vinsalsace.com"},{label:"Visit Alsace",url:"https://www.visit.alsace"}],
  sourceSection:"SE7 Autumn / SE12 Wine Harvest" }),

R({ id:"venice-carnival", routeName:"Venice Carnival", shortName:"Venice Carnival",
  parentCategory:"Seasonal", tripTypes:["Festival","City Break"], countries:["Italy"],
  regions:["Veneto"], mainStops:["Piazza San Marco","Grand Canal","mask ateliers"],
  description:"Masked figures drifting through February fog — Venice at its most theatrical and least summery.",
  highlights:["Costumed figures posing at dawn","Vaporetto = sightseeing while seated","Off-season Venice underneath it all"],
  drawbacks:["Carnival hotel prices spike","Bridges = constant small stair flights"],
  bestMonths:[2], acceptableMonths:[1], unsuitableMonths:[7,8],
  seasonalWindow:"~2 weeks before Shrove Tuesday (dates shift yearly)",
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:5,
  budgetMinGBP:450, budgetTypicalGBP:600, budgetMaxGBP:950,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:4,
  typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:2, walkingLevel:3, stairsRisk:4, luggageHandling:2, comfortLevel:3, weatherRisk:2,
  suitableForMum:false,
  natureScore:2, sceneryScore:9, cultureScore:9, historyScore:9, foodScore:6,
  relaxationScore:4, photographyScore:10, uniqueTransportScore:6, valueForMoneyScore:5,
  onceInALifetimeScore:8, revisitScore:6,
  tags:["winter","festival"], officialSources:[{label:"Venice Carnival",url:"https://www.carnevale.venezia.it"}],
  liveVerificationNeeded:true, sourceSection:"SE13 Carnival" }),

R({ id:"alpine-ski", routeName:"Alpine Ski Week (Dolomites / Bansko / Innsbruck)", shortName:"Ski Week",
  parentCategory:"Seasonal", tripTypes:["Alpine Route"], countries:["Italy","Bulgaria","Austria"],
  regions:["Alps","Pirin"], mainStops:["Sella Ronda","Bansko","Innsbruck"],
  description:"From £600 Bansko value weeks to the Sella Ronda circuit — winter's participation sport, at your chosen price.",
  highlights:["Bansko = cheapest learning curve","Sella Ronda ski-circuit of the Dolomites","Innsbruck works for non-skiers too"],
  drawbacks:["Gear, lessons and passes stack up","Real injury risk for beginners"],
  bestMonths:[1,2,3], acceptableMonths:[12,4], unsuitableMonths:[6,7,8,9],
  minimumDurationDays:4, idealDurationDays:7, maximumDurationDays:10,
  budgetMinGBP:600, budgetTypicalGBP:950, budgetMaxGBP:2000,
  directFromManchester:"seasonal", ManchesterAccessScore:8, approximateManchesterToStartHours:5,
  typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:5, walkingLevel:3, stairsRisk:2, luggageHandling:3, comfortLevel:3, weatherRisk:3,
  suitableForMum:false, suitableForOlderTraveller:false,
  natureScore:8, sceneryScore:9, cultureScore:3, historyScore:2, foodScore:6,
  relaxationScore:4, adventureScore:9, photographyScore:7, uniqueTransportScore:5,
  valueForMoneyScore:7, onceInALifetimeScore:5, revisitScore:9,
  tags:["winter","snow"], officialSources:[{label:"Innsbruck",url:"https://www.innsbruck.info"},{label:"Bansko",url:"https://banskoski.com"}],
  liveVerificationNeeded:true, sourceSection:"SE8 Ski" }),

/* ---------------- CITY / FOOD / WELLNESS / HERITAGE ---------------- */
R({ id:"budapest-spa", routeName:"Budapest Thermal Baths & Danube", shortName:"Budapest Spa",
  parentCategory:"Wellness", tripTypes:["Spa & Wellness","City Break","Food & Wine"], countries:["Hungary"],
  regions:["Budapest"], mainStops:["Széchenyi Baths","Parliament river cruise","Castle funicular","Szentendre"],
  description:"Grand cafés, a castle reached by funicular and Europe's great bath culture — comfort-first city at low prices.",
  highlights:["Széchenyi outdoor pools year-round","Night river cruise = seated sightseeing","Best value of the classic capitals"],
  drawbacks:["Summer afternoons get hot","Ruin-bar district noisy at night — book away from it"],
  bestMonths:[4,5,6,9,10], acceptableMonths:[3,11,12,1,2], unsuitableMonths:[],
  minimumDurationDays:3, idealDurationDays:5, maximumDurationDays:6,
  budgetMinGBP:290, budgetTypicalGBP:380, budgetMaxGBP:600, budgetConfidence:"high",
  directFromManchester:"yes", ManchesterAccessScore:9, approximateManchesterToStartHours:4.5,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:5, weatherRisk:1,
  natureScore:3, sceneryScore:7, cultureScore:9, historyScore:8, foodScore:8,
  relaxationScore:10, photographyScore:8, uniqueTransportScore:5, valueForMoneyScore:10,
  onceInALifetimeScore:5, revisitScore:9,
  tags:["spring","autumn","mum-flagship","weekend"], officialSources:[{label:"Széchenyi Baths",url:"https://www.szechenyifurdo.hu"}],
  sourceSection:"X3 Thermal Spa / Final Comparison winner" }),

R({ id:"krakow-break", routeName:"Kraków Old Town & Ojców", shortName:"Kraków",
  parentCategory:"City", tripTypes:["City Break","UNESCO Heritage"], countries:["Poland"],
  regions:["Lesser Poland"], mainStops:["Main Market Square","Wawel Castle","Kazimierz","Ojców NP"],
  description:"Europe's biggest medieval square in a flat, compact old town — the cheapest culture-dense break in the guide.",
  highlights:["Flat old town = naturally capped walking","Pierogi at half UK prices","Ojców limestone valley for a nature half-day"],
  drawbacks:["Wieliczka salt mine = 380 steps down (skip with Mum)","April can still be cold"],
  bestMonths:[5,6,9], acceptableMonths:[4,10,12], unsuitableMonths:[1,2],
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:6,
  budgetMinGBP:220, budgetTypicalGBP:300, budgetMaxGBP:500, budgetConfidence:"high",
  directFromManchester:"yes", ManchesterAccessScore:9, approximateManchesterToStartHours:4,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:4, weatherRisk:2,
  natureScore:4, sceneryScore:6, cultureScore:10, historyScore:10, foodScore:8,
  relaxationScore:7, photographyScore:8, uniqueTransportScore:2, valueForMoneyScore:10,
  onceInALifetimeScore:5, revisitScore:8,
  tags:["spring","weekend","mum-flagship"], officialSources:[{label:"Kraków Travel",url:"https://www.krakow.travel"}],
  sourceSection:"X1 City Break / Trip Selector Top 5" }),

R({ id:"valencia-break", routeName:"Valencia: Old Town, Turia & Albufera", shortName:"Valencia",
  parentCategory:"City", tripTypes:["City Break","Food & Wine","Beach"], countries:["Spain"],
  regions:["Valencian Community"], mainStops:["Old town","Turia Gardens","City of Arts","Albufera lagoon"],
  description:"A flat Mediterranean city with a 9 km garden where its river used to be — paella's birthplace, 300 sunny days.",
  highlights:["Turia: level green promenade with benches","Albufera sunset by boat (seated nature)","Real paella at the source"],
  drawbacks:["Culture density below Kraków/Vienna","Hot from late June"],
  bestMonths:[4,5,10], acceptableMonths:[3,6,9,11], unsuitableMonths:[7,8],
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:7,
  budgetMinGBP:280, budgetTypicalGBP:380, budgetMaxGBP:600, budgetConfidence:"high",
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:4.5,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:1, walkingLevel:2, stairsRisk:1, luggageHandling:1, comfortLevel:5, weatherRisk:1,
  natureScore:6, sceneryScore:7, cultureScore:7, historyScore:7, foodScore:10,
  relaxationScore:9, photographyScore:7, uniqueTransportScore:3, valueForMoneyScore:9,
  onceInALifetimeScore:4, revisitScore:8,
  tags:["spring","warm-escape","beach","mum-flagship","weekend"], officialSources:[{label:"Visit València",url:"https://www.visitvalencia.com"}],
  sourceSection:"X1 City Break / Trip Selector Top 5" }),

R({ id:"porto-douro", routeName:"Porto & Douro Day Trip", shortName:"Porto",
  parentCategory:"City", tripTypes:["City Break","Food & Wine"], countries:["Portugal"],
  regions:["Northern Portugal"], mainStops:["Ribeira","port lodges","Douro by train/boat","Livraria Lello"],
  description:"Tiled facades, port cellars and a river valley an hour away — magnificent, but built on hills and stairs.",
  highlights:["Port lodge tastings across the river","Douro valley by seated boat/train","Cheapest food scene in western Europe"],
  drawbacks:["Steep streets and staircases everywhere","Not the one for limited-mobility trips"],
  bestMonths:[4,5,6,9,10], acceptableMonths:[3,11], unsuitableMonths:[],
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:6,
  budgetMinGBP:240, budgetTypicalGBP:330, budgetMaxGBP:550, budgetConfidence:"high",
  directFromManchester:"yes", ManchesterAccessScore:9, approximateManchesterToStartHours:4,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:3, walkingLevel:4, stairsRisk:5, luggageHandling:2, comfortLevel:3, weatherRisk:2,
  suitableForMum:false,
  natureScore:5, sceneryScore:8, cultureScore:8, historyScore:7, foodScore:10,
  relaxationScore:6, photographyScore:9, uniqueTransportScore:4, valueForMoneyScore:10,
  onceInALifetimeScore:5, revisitScore:9,
  tags:["spring","autumn","wine","weekend"], officialSources:[{label:"Visit Porto & North",url:"https://www.visitportoandnorth.travel"}],
  sourceSection:"X1 City Break / eliminated for Mum in Trip Selector" }),

R({ id:"rome-ancient", routeName:"Rome, Colosseum & Pompeii", shortName:"Rome & Pompeii",
  parentCategory:"Heritage", tripTypes:["UNESCO Heritage","City Break","Food & Wine"], countries:["Italy","Vatican City"],
  regions:["Lazio","Campania"], mainStops:["Colosseum","Forum","Vatican","Naples","Pompeii"],
  description:"Two thousand years underfoot: the Forum, the Sistine ceiling, then a fast train south to a city frozen in AD 79.",
  highlights:["Colosseum + Forum in one archaeological sweep","Pompeii day by high-speed rail","Naples pizza pilgrimage en route"],
  drawbacks:["Serious walking on uneven ancient surfaces","Queues without pre-booked slots"],
  bestMonths:[4,5,10], acceptableMonths:[3,11,9], unsuitableMonths:[7,8],
  minimumDurationDays:5, idealDurationDays:7, maximumDurationDays:9,
  budgetMinGBP:500, budgetTypicalGBP:700, budgetMaxGBP:1100,
  directFromManchester:"yes", ManchesterAccessScore:8, approximateManchesterToStartHours:4.5,
  trainPossible:true, typicalTransferLevel:"low", hotelChanges:"low",
  physicalEffort:3, walkingLevel:4, stairsRisk:3, luggageHandling:2, comfortLevel:3, weatherRisk:1,
  suitableForMum:false,
  natureScore:2, sceneryScore:6, cultureScore:10, historyScore:10, foodScore:9,
  relaxationScore:3, photographyScore:9, uniqueTransportScore:3, valueForMoneyScore:7,
  onceInALifetimeScore:8, revisitScore:8,
  tags:["spring","autumn"], officialSources:[{label:"Parco Colosseo",url:"https://parcocolosseo.it"},{label:"Pompeii Sites",url:"https://pompeiisites.org"}],
  sourceSection:"X5 UNESCO & Ancient Sites" }),

R({ id:"andalusia", routeName:"Andalusia: Seville, Granada & Córdoba", shortName:"Andalusia",
  parentCategory:"Heritage", tripTypes:["UNESCO Heritage","City Break","Food & Wine"], countries:["Spain"],
  regions:["Andalusia"], mainStops:["Seville","Córdoba Mezquita","Granada Alhambra"],
  description:"Moorish palaces, orange-tree patios and flamenco — three cities linked by easy fast trains.",
  highlights:["The Alhambra (book 2–3 months out)","Mezquita's striped arches","Tapas-crawl culture"],
  drawbacks:["Alhambra tickets sell out fast","Brutal heat Jun–Aug"],
  bestMonths:[3,4,5,10], acceptableMonths:[2,11], unsuitableMonths:[6,7,8],
  minimumDurationDays:6, idealDurationDays:7, maximumDurationDays:10,
  budgetMinGBP:500, budgetTypicalGBP:700, budgetMaxGBP:1100,
  directFromManchester:"yes", ManchesterAccessScore:7, approximateManchesterToStartHours:5,
  trainPossible:true, typicalTransferLevel:"medium", hotelChanges:"medium",
  physicalEffort:3, walkingLevel:3, stairsRisk:3, luggageHandling:3, comfortLevel:4, weatherRisk:1,
  natureScore:3, sceneryScore:7, cultureScore:10, historyScore:10, foodScore:9,
  relaxationScore:5, photographyScore:9, uniqueTransportScore:4, valueForMoneyScore:8,
  onceInALifetimeScore:8, revisitScore:8,
  tags:["spring","warm-escape"], officialSources:[{label:"Alhambra",url:"https://www.alhambra-patronato.es"}],
  liveVerificationNeeded:true, sourceSection:"X5 UNESCO / Year 5 roadmap" }),

R({ id:"bologna-food", routeName:"Bologna & Emilia Food Pilgrimage", shortName:"Bologna Food",
  parentCategory:"Food", tripTypes:["Food & Wine","City Break"], countries:["Italy"],
  regions:["Emilia-Romagna"], mainStops:["Quadrilatero market","pasta workshop","Parma / Modena day trip"],
  description:"The city Italians call 'the fat one': fresh-pasta workshops, parmesan dairies and balsamic attics an hour apart.",
  highlights:["Hand-rolled tortellini class","Parmesan wheel cracking at a dairy","Porticoes shade every walk"],
  drawbacks:["It's genuinely all about food — thin on big sights","Summer is humid"],
  bestMonths:[4,5,9,10], acceptableMonths:[3,6,11], unsuitableMonths:[7,8],
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:5,
  budgetMinGBP:350, budgetTypicalGBP:480, budgetMaxGBP:750,
  directFromManchester:"seasonal", ManchesterAccessScore:7, approximateManchesterToStartHours:4.5,
  trainPossible:true, typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:1, comfortLevel:4, weatherRisk:1,
  natureScore:2, sceneryScore:5, cultureScore:7, historyScore:7, foodScore:10,
  relaxationScore:7, photographyScore:6, uniqueTransportScore:2, valueForMoneyScore:8,
  onceInALifetimeScore:5, revisitScore:8,
  tags:["spring","autumn","weekend","mum-flagship"], officialSources:[{label:"Bologna Welcome",url:"https://www.bolognawelcome.com"}],
  liveVerificationNeeded:true, sourceSection:"X2 Food & Wine" }),

R({ id:"san-sebastian", routeName:"San Sebastián Pintxos & Basque Coast", shortName:"San Sebastián",
  parentCategory:"Food", tripTypes:["Food & Wine","Beach"], countries:["Spain"],
  regions:["Basque Country"], mainStops:["Parte Vieja pintxo bars","La Concha promenade","Getaria"],
  description:"The highest concentration of great eating in Europe, wrapped around a shell-shaped bay with a flat promenade.",
  highlights:["Pintxos-bar crawl in Parte Vieja","La Concha: level seafront strolling","Michelin density if you splurge"],
  drawbacks:["Fly to Bilbao + 1h15 bus transfer","Food costs escalate happily"],
  bestMonths:[5,6,9], acceptableMonths:[4,10,7], unsuitableMonths:[1,2],
  minimumDurationDays:3, idealDurationDays:4, maximumDurationDays:6,
  budgetMinGBP:450, budgetTypicalGBP:650, budgetMaxGBP:1100,
  directFromManchester:"seasonal", ManchesterAccessScore:6, approximateManchesterToStartHours:6,
  ferryPossible:true, typicalTransferLevel:"medium", hotelChanges:"none",
  physicalEffort:2, walkingLevel:3, stairsRisk:2, luggageHandling:2, comfortLevel:4, weatherRisk:3,
  natureScore:5, sceneryScore:8, cultureScore:6, historyScore:5, foodScore:10,
  relaxationScore:7, photographyScore:7, uniqueTransportScore:3, valueForMoneyScore:6,
  onceInALifetimeScore:6, revisitScore:9,
  tags:["summer","beach"], officialSources:[{label:"San Sebastián Turismoa",url:"https://www.sansebastianturismoa.eus"}],
  liveVerificationNeeded:true, sourceSection:"X2 Food & Wine" }),

/* ---------------- UNIQUE / FESTIVAL / WILDLIFE ---------------- */
R({ id:"cappadocia-balloon", routeName:"Cappadocia Hot Air Balloon & Istanbul", shortName:"Cappadocia Balloon",
  parentCategory:"Air", tripTypes:["Festival","UNESCO Heritage"], countries:["Türkiye"],
  regions:["Cappadocia","Istanbul"], mainStops:["Göreme","balloon sunrise","Hagia Sophia","Blue Mosque"],
  description:"A hundred balloons rising over fairy chimneys at dawn, paired with Istanbul's imperial skyline.",
  highlights:["The sunrise mass ascent","Cave-hotel stays","Hagia Sophia + Grand Bazaar add-on"],
  drawbacks:["Via Istanbul connection","Balloons cancel in wind — allow 2 mornings"],
  bestMonths:[4,5,9,10], acceptableMonths:[6,7,8], unsuitableMonths:[1,2],
  minimumDurationDays:5, idealDurationDays:7, maximumDurationDays:9,
  budgetMinGBP:600, budgetTypicalGBP:850, budgetMaxGBP:1400,
  directFromManchester:"yes", ManchesterAccessScore:6, approximateManchesterToStartHours:8,
  typicalTransferLevel:"medium", hotelChanges:"medium",
  physicalEffort:2, walkingLevel:3, stairsRisk:3, luggageHandling:3, comfortLevel:4, weatherRisk:2,
  natureScore:8, sceneryScore:10, cultureScore:8, historyScore:9, foodScore:8,
  relaxationScore:5, adventureScore:7, photographyScore:10, uniqueTransportScore:9,
  valueForMoneyScore:7, onceInALifetimeScore:9, revisitScore:5,
  tags:["spring","autumn"], officialSources:[{label:"Go Türkiye",url:"https://www.goturkiye.com"}],
  liveVerificationNeeded:true, sourceSection:"A3 Hot Air Balloon / Top100 #86" }),

R({ id:"farne-puffins", routeName:"Farne Islands Puffin Weekend", shortName:"Farne Puffins",
  parentCategory:"Land", tripTypes:["Wildlife","Ferry"], countries:["United Kingdom"],
  regions:["Northumberland"], mainStops:["Seahouses","Farne Islands","Bamburgh Castle"],
  description:"Boat out to 100,000 seabirds — puffins at arm's length, three hours from home, for the price of a night out.",
  highlights:["Puffins metres away (May–Jul)","Bamburgh Castle beach finish","Cheapest wildlife spectacle in the guide"],
  drawbacks:["Landing trips are weather-dependent","Sailings book up in puffin season"],
  bestMonths:[5,6], acceptableMonths:[7,4], unsuitableMonths:[10,11,12,1,2],
  seasonalWindow:"Breeding season Apr – late Jul",
  minimumDurationDays:1, idealDurationDays:2, maximumDurationDays:3,
  budgetMinGBP:120, budgetTypicalGBP:180, budgetMaxGBP:300, budgetConfidence:"high",
  directFromManchester:"not-applicable", ManchesterAccessScore:8, approximateManchesterToStartHours:3,
  flightRequired:false, drivingRequired:false, trainPossible:true, ferryPossible:true,
  typicalTransferLevel:"low", hotelChanges:"none",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:1, comfortLevel:3, weatherRisk:4,
  natureScore:9, sceneryScore:7, cultureScore:3, historyScore:5, foodScore:4,
  relaxationScore:6, photographyScore:10, uniqueTransportScore:4, valueForMoneyScore:10,
  onceInALifetimeScore:5, revisitScore:8,
  tags:["spring","summer","wildlife","no-fly","weekend"], officialSources:[{label:"National Trust Farne Islands",url:"https://www.nationaltrust.org.uk"}],
  liveVerificationNeeded:true, sourceSection:"SE11 Puffins" }),

R({ id:"faroe-islands", routeName:"Faroe Islands Escape", shortName:"Faroe Islands",
  parentCategory:"Land", tripTypes:["Road Trip","Hiking","Wildlife"], countries:["Faroe Islands (Denmark)"],
  regions:["North Atlantic"], mainStops:["Tórshavn","Múlafossur waterfall","Mykines puffins"],
  description:"Grass-roofed villages under vertical green cliffs — the Atlantic's best-kept secret, refreshingly untouristed.",
  highlights:["Múlafossur falling into the sea","Mykines puffin colonies","Sea-tunnel roundabout drives"],
  drawbacks:["Via Copenhagen/Edinburgh (verify routes)","Fog can erase a whole day"],
  bestMonths:[5,6,7,8], acceptableMonths:[4,9], unsuitableMonths:[11,12,1,2],
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:8,
  budgetMinGBP:700, budgetTypicalGBP:950, budgetMaxGBP:1500,
  directFromManchester:"no", ManchesterAccessScore:3, approximateManchesterToStartHours:9,
  drivingRequired:true, typicalTransferLevel:"high", hotelChanges:"low",
  physicalEffort:3, walkingLevel:3, stairsRisk:2, luggageHandling:3, comfortLevel:3, weatherRisk:5,
  suitableForMum:false,
  natureScore:10, sceneryScore:10, cultureScore:4, historyScore:4, foodScore:5,
  relaxationScore:5, adventureScore:8, photographyScore:10, uniqueTransportScore:5,
  valueForMoneyScore:6, onceInALifetimeScore:8, revisitScore:6,
  tags:["summer","wildlife"], officialSources:[{label:"Visit Faroe Islands",url:"https://visitfaroeislands.com"}],
  liveVerificationNeeded:true, sourceSection:"Top100 #90" }),

R({ id:"edinburgh-fringe", routeName:"Edinburgh Festival Fringe", shortName:"Edinburgh Fringe",
  parentCategory:"Festival", tripTypes:["Festival","City Break"], countries:["United Kingdom"],
  regions:["Scotland"], mainStops:["Royal Mile","Old Town venues","Arthur's Seat (optional)"],
  description:"The world's biggest arts festival, a direct train from home — ten shows in three days if you dare.",
  highlights:["3,000+ shows, many £10 or free","Train from Manchester ~3h","Whole city becomes a stage"],
  drawbacks:["August accommodation triples in price","Old Town = hills and closes (steps)"],
  bestMonths:[8], acceptableMonths:[], unsuitableMonths:[1,2,3,10,11],
  seasonalWindow:"All of August",
  minimumDurationDays:2, idealDurationDays:3, maximumDurationDays:5,
  budgetMinGBP:250, budgetTypicalGBP:400, budgetMaxGBP:700,
  directFromManchester:"not-applicable", ManchesterAccessScore:10, approximateManchesterToStartHours:3,
  flightRequired:false, trainPossible:true,
  typicalTransferLevel:"none", hotelChanges:"none",
  physicalEffort:3, walkingLevel:4, stairsRisk:4, luggageHandling:1, comfortLevel:3, weatherRisk:3,
  suitableForMum:false,
  natureScore:2, sceneryScore:6, cultureScore:10, historyScore:7, foodScore:6,
  relaxationScore:3, photographyScore:6, uniqueTransportScore:2, valueForMoneyScore:7,
  onceInALifetimeScore:7, revisitScore:9,
  tags:["summer","festival","no-fly","weekend"], officialSources:[{label:"Edinburgh Fringe",url:"https://www.edfringe.com"}],
  sourceSection:"X6 Festivals / Top100 #92" }),

R({ id:"ljubljana-bled", routeName:"Ljubljana & Lake Bled", shortName:"Ljubljana & Bled",
  parentCategory:"Land", tripTypes:["City Break","Hiking","Slow Travel"], countries:["Slovenia"],
  regions:["Julian Alps"], mainStops:["Ljubljana old town","Lake Bled","island church by pletna boat"],
  description:"A pocket-sized green capital plus the alpine lake with a church on an island — rowed there in a traditional pletna.",
  highlights:["Bled island by seated pletna boat","Car-free riverside old town","Lakeshore path is flat (castle climb optional)"],
  drawbacks:["No reliable MAN direct — via Venice/Zagreb + 2–3h transfer","That transfer breaks minimal-transfer trips"],
  bestMonths:[5,6,9], acceptableMonths:[4,10,7,8], unsuitableMonths:[1,2],
  minimumDurationDays:4, idealDurationDays:5, maximumDurationDays:7,
  budgetMinGBP:400, budgetTypicalGBP:550, budgetMaxGBP:850,
  directFromManchester:"no", ManchesterAccessScore:4, approximateManchesterToStartHours:8,
  typicalTransferLevel:"high", hotelChanges:"low",
  physicalEffort:2, walkingLevel:2, stairsRisk:2, luggageHandling:2, comfortLevel:4, weatherRisk:2,
  natureScore:8, sceneryScore:9, cultureScore:6, historyScore:5, foodScore:6,
  relaxationScore:8, photographyScore:9, uniqueTransportScore:5, valueForMoneyScore:8,
  onceInALifetimeScore:6, revisitScore:7,
  tags:["spring","summer"], officialSources:[{label:"Visit Ljubljana",url:"https://www.visitljubljana.com"},{label:"Bled",url:"https://www.bled.si"}],
  liveVerificationNeeded:true, sourceSection:"Top100 #94 / eliminated in Trip Selector for transfers" }),

...MANCHESTER_WEEKEND_ROUTES.map(R),
];

/* ============================================================
   DERIVED LISTS (built from data so no filter is ever "dead")
   ============================================================ */
const ALL_TAGS = new Set(ROUTES.flatMap((r) => r.tags));
const ENV_OPTIONS = [
  ["spring", "Spring"], ["summer", "Summer"], ["autumn", "Autumn"], ["winter", "Winter"],
  ["warm-escape", "Warm escape"], ["snow", "Snow"], ["northern-lights", "Northern Lights"],
  ["midnight-sun", "Midnight Sun"], ["flowers", "Flowers"], ["autumn-foliage", "Autumn foliage"],
  ["christmas", "Christmas"], ["wildlife", "Wildlife"], ["beach", "Beach"],
].filter(([t]) => ALL_TAGS.has(t));
const TYPE_OPTIONS = [...new Set(ROUTES.flatMap((r) => r.tripTypes))].sort();
const INTERESTS = [
  ["nature", "Nature"], ["scenery", "Scenery"], ["history", "History"], ["culture", "Culture"],
  ["food", "Food"], ["relaxation", "Relaxation"], ["photography", "Photography"],
  ["adventure", "Adventure"], ["uniqueTransport", "Unique transport"], ["seasonal", "Seasonal event"],
];
const COMPANIONS = [
  ["any", "Anyone"], ["solo", "Solo"], ["mum", "Mum / older traveller"],
  ["couple", "Couple"], ["friends", "Friends"], ["family", "Family"],
];
const TL = { none: 1, low: 2, medium: 3, high: 4 };
const TL_LABEL = { none: "None", low: "Low", medium: "Medium", high: "High" };

const DEFAULT_FILTERS = {
  month: 0, daysMin: 2, daysMax: 21, budgetMin: 100, budgetMax: 5000,
  travelStyle: null,
  companion: "any", interests: [], tripTypes: [], env: [],
  noFlying: false, directMAN: false, northernDeparture: false, noDriving: false,
  noOvernight: false, maxOneTransfer: false, minHotelChanges: false, minLuggage: false,
  maxEffort: 5, maxWalking: 5, comfortPriority: 3, weatherTol: "any",
  mumOnly: false, avoidStairs: false, onceOnly: false, manchesterWeekend: false,
  wizardTimeChoice: null, wizardBudgetChoice: null,
  wizardExperienceChoices: [], wizardImportantChoice: null,
};

/* ============================================================
   HARD FILTERS — return list of exclusion reasons (empty = pass)
   ============================================================ */
function hardReasons(r, f) {
  const out = [];
  if (f.travelStyle && !r.travelStyles.includes(f.travelStyle))
    out.push(`Doesn't support ${f.travelStyle} travel style`);
  if (f.manchesterWeekend) {
    if (!r.isManchesterWeekendRoute) out.push("Not part of the researched Manchester weekend set");
    if (r.minimumDurationDays > 3 || r.maximumDurationDays < 2) out.push("Cannot be completed within a 2–3 day weekend");
    if (!["none", "low", "medium"].includes(r.typicalTransferLevel)) out.push("Travel complexity is above medium");
    if (f.maxOneTransfer && (r.majorTransferCountToBase == null || r.majorTransferCountToBase > 1))
      out.push("More than one major transfer from Manchester");
    if (r.fridayEveningFeasible === false && r.saturdayMorningFeasible === false)
      out.push("Neither Friday evening nor Saturday morning departure is feasible");
    if (r.sundayEveningReturnFeasible === false) out.push("Sunday evening return is not feasible");
    if (r.physicalEffort > f.maxEffort)
      out.push(`Too physically demanding (effort ${r.physicalEffort}/5 vs your max ${f.maxEffort})`);
    if (r.walkingLevel > f.maxWalking)
      out.push(`Too much walking (level ${r.walkingLevel}/5 vs your max ${f.maxWalking})`);
  }
  if (r.budgetMinGBP != null && f.budgetMax < r.budgetMinGBP)
    out.push(`Over budget — realistically from ~£${r.budgetMinGBP} pp`);
  if (f.daysMax < r.minimumDurationDays) out.push(`Needs at least ${r.minimumDurationDays} days`);
  if (f.month > 0 && r.unsuitableMonths.includes(f.month))
    out.push(`Not suitable in ${MONTHS[f.month - 1]}`);
  if (f.month > 0 && r.seasonalWindow && !r.bestMonths.includes(f.month) && !r.acceptableMonths.includes(f.month))
    out.push(`Outside seasonal window (${r.seasonalWindow})`);
  if (f.noDriving && r.drivingRequired) out.push("Driving required");
  if (f.noFlying && r.flightRequired && !(r.trainPossible || r.ferryPossible || r.cruiseBased))
    out.push("Flight required — no realistic rail/sea alternative");
  if (f.noOvernight && r.overnightTravelRequired) out.push("Overnight travel is unavoidable");
  if ((f.mumOnly || (f.companion === "mum" && f.mumOnly)) && !r.suitableForMum)
    out.push("Not suited to travelling with Mum");
  if (f.avoidStairs && r.stairsRisk >= 4) out.push("Steep terrain / frequent stairs");
  if (!f.manchesterWeekend && r.physicalEffort > f.maxEffort + 1)
    out.push(`Too physically demanding (effort ${r.physicalEffort}/5 vs your max ${f.maxEffort})`);
  if (f.tripTypes.length && !r.tripTypes.some((t) => f.tripTypes.includes(t)))
    out.push("Trip type not selected");
  if (f.env.length && !r.tags.some((t) => f.env.includes(t)))
    out.push("Doesn't match selected season / environment");
  if (f.onceOnly && r.onceInALifetimeScore < 8) out.push("Not a once-in-a-lifetime tier trip");
  if (f.companion === "solo" && !r.suitableForSolo) out.push("Not well suited to solo travel");
  return out;
}

function exclusionGroupFor(reason) {
  if (reason.startsWith("Doesn't support")) return { key: "travel-style", label: "do not support this trip length", actionLabel: "Any duration" };
  if (reason.startsWith("Over budget")) return { key: "budget", label: "over budget", actionLabel: "Raise budget" };
  if (reason.startsWith("Needs at least")) return { key: "duration", label: "need more days", actionLabel: "Allow more days" };
  if (reason.startsWith("Not suitable in") || reason.startsWith("Outside seasonal window"))
    return { key: "month", label: "unsuitable for selected month", actionLabel: "Any month" };
  if (reason.startsWith("Too physically demanding")) return { key: "effort", label: "exceed physical-effort limit", actionLabel: "Raise effort limit" };
  if (reason.startsWith("Too much walking")) return { key: "walking", label: "exceed walking limit", actionLabel: "Raise walking limit" };
  if (reason === "Driving required") return { key: "driving", label: "require driving", actionLabel: "Allow driving" };
  if (reason.startsWith("Flight required")) return { key: "flying", label: "require flying", actionLabel: "Allow flying" };
  if (reason === "Overnight travel is unavoidable") return { key: "overnight", label: "require overnight travel", actionLabel: "Allow overnight" };
  if (reason === "Not suited to travelling with Mum") return { key: "mum", label: "are not Mum-friendly", actionLabel: "Include all" };
  if (reason === "Steep terrain / frequent stairs") return { key: "stairs", label: "have steep terrain or stairs", actionLabel: "Allow stairs" };
  if (reason === "Trip type not selected") return { key: "trip-type", label: "do not match selected trip type", actionLabel: "Any trip type" };
  if (reason === "Doesn't match selected season / environment") return { key: "environment", label: "do not match selected environment", actionLabel: "Any environment" };
  if (reason === "Not a once-in-a-lifetime tier trip") return { key: "once", label: "are below once-in-a-lifetime tier", actionLabel: "Include all tiers" };
  if (reason === "Not well suited to solo travel") return { key: "solo", label: "are not suited to solo travel", actionLabel: "Any companion" };
  if (reason === "More than one major transfer from Manchester") return { key: "transfers", label: "need more than one major transfer", actionLabel: "Allow transfers" };
  if (reason === "Not part of the researched Manchester weekend set") return { key: "weekend-mode", label: "are outside the Manchester Weekend set", actionLabel: "Exit weekend mode" };
  if (reason === "Cannot be completed within a 2–3 day weekend") return { key: "weekend-mode", label: "cannot fit a 2–3 day weekend", actionLabel: "Exit weekend mode" };
  if (reason === "Travel complexity is above medium") return { key: "weekend-mode", label: "exceed weekend travel complexity", actionLabel: "Exit weekend mode" };
  if (reason === "Neither Friday evening nor Saturday morning departure is feasible") return { key: "weekend-mode", label: "lack a feasible weekend departure", actionLabel: "Exit weekend mode" };
  if (reason === "Sunday evening return is not feasible") return { key: "weekend-mode", label: "lack a Sunday-evening return", actionLabel: "Exit weekend mode" };
  return { key: reason, label: reason.toLowerCase(), actionLabel: "Reset filters" };
}

/* ============================================================
   MATCH SCORE — 0–100, weight set switches when companion = mum
   ============================================================ */
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function subScores(r, f) {
  const mum = f.companion === "mum";
  // Month
  let month;
  if (f.month === 0) month = 0.85;
  else if (r.bestMonths.includes(f.month)) month = 1;
  else if (r.acceptableMonths.includes(f.month)) month = 0.6;
  else month = 0.35;
  // Budget
  const t = r.budgetTypicalGBP ?? r.budgetMinGBP;
  let budget;
  if (t == null) budget = 0.6;
  else if (t >= f.budgetMin && t <= f.budgetMax) budget = 1;
  else if (t < f.budgetMin) budget = 0.85;
  else budget = 0.45; // typical above max but minimum within (else hard-excluded)
  // Duration
  let duration;
  if (r.idealDurationDays >= f.daysMin && r.idealDurationDays <= f.daysMax) duration = 1;
  else if (r.minimumDurationDays <= f.daysMax && r.maximumDurationDays >= f.daysMin) duration = 0.65;
  else duration = 0.4;
  // Companion
  const compMap = {
    any: 0.85,
    solo: r.suitableForSolo ? 1 : 0.2,
    couple: r.suitableForCouple ? 1 : 0.3,
    friends: r.suitableForFriends ? 1 : 0.3,
    family: r.suitableForFamily ? 1 : 0.25,
    mum: r.suitableForMum ? 1 : r.suitableForOlderTraveller ? 0.5 : 0.15,
  };
  const companion = compMap[f.companion] ?? 0.85;
  // Interests
  const iMap = {
    nature: r.natureScore, scenery: r.sceneryScore, history: r.historyScore, culture: r.cultureScore,
    food: r.foodScore, relaxation: r.relaxationScore, photography: r.photographyScore,
    adventure: r.adventureScore, uniqueTransport: r.uniqueTransportScore,
    seasonal: r.seasonalWindow ? 9 : 3,
  };
  const interests = f.interests.length
    ? clamp01(f.interests.reduce((s, k) => s + (iMap[k] ?? 5), 0) / (f.interests.length * 10))
    : 0.7;
  // Logistics (soft preferences)
  let lg = 1;
  if (f.directMAN) {
    if (r.directFromManchester === "no" || r.directFromManchester === "unknown") lg -= 0.25;
    else if (r.directFromManchester === "seasonal") lg -= 0.1;
  }
  if (f.maxOneTransfer) lg -= { none: 0, low: 0.05, medium: 0.25, high: 0.45 }[r.typicalTransferLevel] ?? 0;
  if (f.minHotelChanges) lg -= { none: 0, low: 0.05, medium: 0.22, high: 0.4 }[r.hotelChanges] ?? 0;
  if (f.minLuggage) lg -= r.luggageHandling >= 4 ? 0.3 : r.luggageHandling === 3 ? 0.15 : 0;
  if (f.northernDeparture) {
    const north = [...r.departurePorts, ...r.departureCities].join(" ").match(/Liverpool|Newcastle|Manchester|Oban|Glasgow|Edinburgh/i);
    if (!north) lg -= 0.12;
  }
  if (f.noOvernight && r.overnightTravelPossible && !r.overnightTravelRequired) lg -= 0.05;
  const logistics = clamp01(lg);
  // Mum-mode transfers & luggage bundle
  const trf = { none: 1, low: 0.85, medium: 0.55, high: 0.25 }[r.typicalTransferLevel] ?? 0.5;
  const hot = { none: 1, low: 0.85, medium: 0.5, high: 0.25 }[r.hotelChanges] ?? 0.5;
  const lug = r.luggageHandling <= 2 ? 1 : r.luggageHandling === 3 ? 0.7 : r.luggageHandling === 4 ? 0.4 : 0.2;
  const transfersLuggage = (trf + hot + lug) / 3;
  // Comfort & physical
  let cf = 1;
  cf -= Math.max(0, r.physicalEffort - f.maxEffort) * 0.45;
  cf -= Math.max(0, r.walkingLevel - f.maxWalking) * 0.3;
  if (f.comfortPriority >= 4) cf -= (5 - r.comfortLevel) * 0.1;
  if (f.weatherTol === "mild" && r.weatherRisk >= 4) cf -= 0.2;
  if (mum) cf -= Math.max(0, r.stairsRisk - 2) * 0.12;
  const comfort = clamp01(cf);
  const man = clamp01(r.ManchesterAccessScore / 10);
  return { month, budget, duration, companion, interests, logistics, transfersLuggage, comfort, man };
}

const BASE_WEIGHTS = [
  ["month", "Month fit", 15], ["budget", "Budget fit", 15], ["duration", "Duration fit", 15],
  ["companion", "Companion fit", 10], ["interests", "Interests fit", 15],
  ["logistics", "Transport & logistics", 10], ["comfort", "Comfort & physical", 10],
  ["man", "Manchester convenience", 10],
];
const MUM_WEIGHTS = [
  ["month", "Month fit", 10], ["budget", "Budget fit", 10], ["duration", "Duration fit", 10],
  ["companion", "Mum suitability", 20], ["comfort", "Comfort & physical", 20],
  ["transfersLuggage", "Transfers & luggage", 15], ["man", "Manchester convenience", 10],
  ["interests", "Interests fit", 5],
];

function scoreRoute(r, f) {
  const subs = subScores(r, f);
  const weights = f.companion === "mum" ? MUM_WEIGHTS : BASE_WEIGHTS;
  const parts = weights.map(([key, label, max]) => ({
    key, label, max, sub: subs[key], pts: Math.round(subs[key] * max * 10) / 10,
  }));
  const total = Math.round(parts.reduce((s, p) => s + p.pts, 0));
  return { total, parts };
}

const REASON_TEXT = {
  month: (r, f) => f.month ? `${MONTHS[f.month - 1]} is prime season for this route` : "Works across many months",
  budget: (r) => `Typical cost ~£${r.budgetTypicalGBP ?? r.budgetMinGBP} pp sits inside your budget`,
  duration: (r) => `Ideal length (${r.idealDurationDays} days) fits your window`,
  companion: (r, f) => f.companion === "mum" ? "Genuinely comfortable with Mum — low strain, low stairs" : "Well matched to your travel party",
  interests: () => "Strong overlap with the experiences you picked",
  logistics: () => "Clean logistics for your transport preferences",
  transfersLuggage: () => "Minimal transfers, hotel changes and bag-hauling",
  comfort: () => "Comfort and effort levels are well within your limits",
  man: (r) => r.flightRequired === false ? "No-fly and easy to reach from Manchester" : "Convenient from Manchester",
};
function topReasons(r, f, parts) {
  return [...parts].sort((a, b) => b.sub * b.max - a.sub * a.max).slice(0, 3)
    .map((p) => REASON_TEXT[p.key]?.(r, f) ?? p.label);
}
function topDrawbacks(r, parts) {
  const weak = [...parts].filter((p) => p.sub < 0.6).sort((a, b) => a.sub - b.sub).slice(0, 1)
    .map((p) => `Weak spot: ${p.label.toLowerCase()}`);
  return [...(r.drawbacks.slice(0, weak.length ? 1 : 2)), ...weak].slice(0, 2);
}

/* ============================================================
   PRESETS — each genuinely rewrites the filter state
   ============================================================ */
const PRESETS = [
  { id: "mum", label: "Best trip with Mum", f: { companion: "mum", mumOnly: true, maxEffort: 2, maxWalking: 3, comfortPriority: 5, maxOneTransfer: true, minLuggage: true, minHotelChanges: true }, sort: "match" },
  { id: "man-weekend", label: "Manchester weekend", f: { manchesterWeekend: true, travelStyle: "weekend", daysMin: 2, daysMax: 3, directMAN: true, noFlying: true, noOvernight: true, maxOneTransfer: true, minHotelChanges: true }, sort: "weekend" },
  { id: "weekend", label: "Cheap long weekend", f: { daysMin: 2, daysMax: 4, budgetMax: 350 }, sort: "budget" },
  { id: "u500", label: "Under £500", f: { budgetMax: 500 }, sort: "match" },
  { id: "nofly", label: "No-fly from the UK", f: { noFlying: true }, sort: "match" },
  { id: "rail", label: "Scenic railway holiday", f: { tripTypes: ["Scenic Railway", "Sleeper Train", "Luxury Train", "Interrail"].filter((t) => TYPE_OPTIONS.includes(t)) }, sort: "match" },
  { id: "cruiseuk", label: "Cruise from the UK", f: { tripTypes: ["Ocean Cruise", "Mini Cruise", "Expedition Cruise"].filter((t) => TYPE_OPTIONS.includes(t)), noFlying: true }, sort: "match" },
  { id: "mintrf", label: "Minimal transfers", f: { maxOneTransfer: true, minHotelChanges: true, minLuggage: true }, sort: "transfers" },
  { id: "loweffort", label: "Low physical effort", f: { maxEffort: 2, maxWalking: 2 }, sort: "effort" },
  { id: "winter", label: "Winter escape", f: { month: 1, env: ["warm-escape"].filter((t) => ALL_TAGS.has(t)) }, sort: "match" },
  { id: "xmas", label: "Christmas atmosphere", f: { month: 12, env: ["christmas"].filter((t) => ALL_TAGS.has(t)) }, sort: "match" },
  { id: "sumnature", label: "Summer nature", f: { month: 6, interests: ["nature", "scenery"] }, sort: "match" },
  { id: "food", label: "Food-focused trip", f: { interests: ["food"] }, sort: "food" },
  { id: "oial", label: "Once-in-a-lifetime", f: { onceOnly: true }, sort: "unique" },
  { id: "manf", label: "Manchester-friendly", f: { directMAN: true }, sort: "manchester" },
];

const WIZARD_TIME_OPTIONS = [
  { id: "day", label: "Day trip", daysMin: 1, daysMax: 1, travelStyle: "day-trip" },
  { id: "weekend", label: "Weekend, 2–3 days", summary: "Weekend", daysMin: 2, daysMax: 3, travelStyle: "weekend" },
  { id: "short", label: "Short break, 4–5 days", summary: "Short break", daysMin: 4, daysMax: 5, travelStyle: "short-break" },
  { id: "week", label: "One week, 6–8 days", summary: "One week", daysMin: 6, daysMax: 8, travelStyle: "one-week" },
  { id: "longer", label: "Longer trip, 9–14 days", summary: "Longer trip", daysMin: 9, daysMax: 14, travelStyle: "longer-trip" },
  { id: "flexible", label: "I am flexible", summary: "Flexible timing", daysMin: 2, daysMax: 21, travelStyle: null },
];
const WIZARD_COMPANION_OPTIONS = [
  { id: "solo", label: "Solo", companion: "solo" },
  { id: "mum", label: "Mum / older traveller", summary: "Mum-friendly", companion: "mum" },
  { id: "partner", label: "Partner", companion: "couple" },
  { id: "friends", label: "Friends", companion: "friends" },
  { id: "family", label: "Family", companion: "family" },
  { id: "undecided", label: "Not decided", companion: "any" },
];
const WIZARD_BUDGET_OPTIONS = [
  { id: "u250", label: "Under £250", budgetMin: 100, budgetMax: 250 },
  { id: "250-500", label: "£250–£500", summary: "Under £500", budgetMin: 250, budgetMax: 500 },
  { id: "500-800", label: "£500–£800", budgetMin: 500, budgetMax: 800 },
  { id: "800-1200", label: "£800–£1,200", budgetMin: 800, budgetMax: 1200 },
  { id: "1200plus", label: "£1,200+", budgetMin: 1200, budgetMax: 5000 },
  { id: "flexible", label: "Flexible", summary: "Flexible budget", budgetMin: 100, budgetMax: 5000 },
];
const WIZARD_EXPERIENCE_OPTIONS = [
  { id: "relax", label: "Relaxing escape", interests: ["relaxation"] },
  { id: "nature", label: "Nature and scenery", interests: ["nature", "scenery"] },
  { id: "culture", label: "History and culture", interests: ["history", "culture"] },
  { id: "food", label: "Food", interests: ["food"] },
  { id: "train", label: "Scenic train", interests: ["uniqueTransport"], tripTypes: ["Scenic Railway", "Sleeper Train", "Luxury Train", "Interrail"] },
  { id: "cruise", label: "Cruise or ferry", tripTypes: ["Ocean Cruise", "Mini Cruise", "Expedition Cruise", "Ferry"] },
  { id: "coast", label: "Coast and islands", interests: ["scenery", "relaxation"], tripTypes: ["Beach", "Island Hopping"] },
  { id: "mountains", label: "Mountains", interests: ["nature", "scenery"], tripTypes: ["Hiking", "Alpine Route"] },
  { id: "seasonal", label: "Seasonal atmosphere", interests: ["seasonal"] },
  { id: "photography", label: "Photography", interests: ["photography"] },
  { id: "adventure", label: "Adventure", interests: ["adventure"] },
  { id: "surprise", label: "Surprise me", description: "Keep the choice broad and let the existing match score lead." },
];
const WIZARD_IMPORTANT_OPTIONS = [
  { id: "nofly", label: "No flying" }, { id: "nodrive", label: "No driving" },
  { id: "transfers", label: "Minimal transfers" }, { id: "loweffort", label: "Low physical effort" },
  { id: "manweekend", label: "Manchester weekend" }, { id: "direct", label: "Direct from Manchester preferred" },
  { id: "noovernight", label: "No overnight travel" }, { id: "none", label: "No preference" },
];

const wizardTimeChoice = (f) => WIZARD_TIME_OPTIONS.find((o) => o.id === f.wizardTimeChoice) ??
  WIZARD_TIME_OPTIONS.find((o) => o.daysMin === f.daysMin && o.daysMax === f.daysMax) ?? null;
const wizardBudgetChoice = (f) => WIZARD_BUDGET_OPTIONS.find((o) => o.id === f.wizardBudgetChoice) ??
  WIZARD_BUDGET_OPTIONS.find((o) => o.budgetMin === f.budgetMin && o.budgetMax === f.budgetMax) ?? null;
const wizardCompanionChoice = (f) => WIZARD_COMPANION_OPTIONS.find((o) => o.companion === f.companion) ?? WIZARD_COMPANION_OPTIONS.at(-1);
const wizardImportantChoice = (f) => {
  if (f.wizardImportantChoice) return f.wizardImportantChoice;
  if (f.manchesterWeekend) return "manweekend";
  if (f.noFlying) return "nofly"; if (f.noDriving) return "nodrive";
  if (f.noOvernight) return "noovernight"; if (f.directMAN) return "direct";
  if (f.maxEffort <= 2) return "loweffort"; if (f.maxOneTransfer) return "transfers";
  return "none";
};
const inferredWizardExperiences = (f) => {
  if (f.wizardExperienceChoices?.length) return f.wizardExperienceChoices;
  return WIZARD_EXPERIENCE_OPTIONS.filter((o) => o.id !== "surprise" &&
    (o.interests?.length || o.tripTypes?.length) &&
    (o.interests ?? []).every((x) => f.interests.includes(x)) &&
    (o.tripTypes ?? []).every((x) => f.tripTypes.includes(x))).map((o) => o.id).slice(0, 3);
};

function filtersForExperiences(f, ids) {
  const picked = ids.includes("surprise") ? [] : WIZARD_EXPERIENCE_OPTIONS.filter((o) => ids.includes(o.id));
  return {
    ...f, wizardExperienceChoices: ids,
    interests: [...new Set(picked.flatMap((o) => o.interests ?? []))],
    tripTypes: [...new Set(picked.flatMap((o) => o.tripTypes ?? []))].filter((t) => TYPE_OPTIONS.includes(t)),
  };
}

function filtersForCompanion(f, id) {
  const choice = WIZARD_COMPANION_OPTIONS.find((o) => o.id === id);
  const mum = choice?.companion === "mum";
  return {
    ...f, companion: choice?.companion ?? "any", mumOnly: mum,
    maxEffort: mum ? 3 : 5, maxWalking: mum ? 3 : 5, comfortPriority: mum ? 5 : 3,
    maxOneTransfer: mum, minHotelChanges: mum, minLuggage: mum,
  };
}

function filtersForImportantChoice(f, id) {
  const mum = f.companion === "mum";
  const next = {
    ...f, wizardImportantChoice: id, noFlying: false, noDriving: false, noOvernight: false,
    directMAN: false, manchesterWeekend: false, maxOneTransfer: mum,
    maxEffort: mum ? 3 : 5, maxWalking: mum ? 3 : 5,
    minHotelChanges: mum, minLuggage: mum,
  };
  if (id === "nofly") next.noFlying = true;
  if (id === "nodrive") next.noDriving = true;
  if (id === "noovernight") next.noOvernight = true;
  if (id === "direct") next.directMAN = true;
  if (id === "transfers") next.maxOneTransfer = true;
  if (id === "loweffort") { next.maxEffort = 2; next.maxWalking = 2; }
  if (id === "manweekend") Object.assign(next, { manchesterWeekend: true, travelStyle: "weekend", daysMin: 2, daysMax: 3, wizardTimeChoice: "weekend", directMAN: true, noFlying: true, noOvernight: true, maxOneTransfer: true, minHotelChanges: true });
  return next;
}

/* ============================================================
   SORTS
   ============================================================ */
const SORTS = [
  ["match", "Best match"], ["weekend", "Weekend suitability"], ["budget", "Lowest estimated budget"], ["duration", "Shortest ideal duration"],
  ["manchester", "Best from Manchester"], ["mum", "Best for Mum"], ["effort", "Lowest physical effort"],
  ["transfers", "Fewest transfers"], ["scenery", "Best scenery"], ["food", "Best food"],
  ["relax", "Most relaxing"], ["value", "Best value"], ["unique", "Most unique"], ["revisit", "Highest revisit value"],
];
function sortFn(key) {
  switch (key) {
    case "weekend": return (a, b) =>
      (b.r.weekendSuitability ?? -1) - (a.r.weekendSuitability ?? -1) ||
      (a.r.manchesterJourneyTime?.maxHours ?? 99) - (b.r.manchesterJourneyTime?.maxHours ?? 99) ||
      (a.r.majorTransferCountToBase ?? 99) - (b.r.majorTransferCountToBase ?? 99) ||
      b.score.total - a.score.total;
    case "budget": return (a, b) => (a.r.budgetTypicalGBP ?? 99999) - (b.r.budgetTypicalGBP ?? 99999);
    case "duration": return (a, b) => a.r.idealDurationDays - b.r.idealDurationDays;
    case "manchester": return (a, b) => b.r.ManchesterAccessScore - a.r.ManchesterAccessScore;
    case "mum": return (a, b) => ((b.r.suitableForMum ? 50 : 0) + b.r.comfortLevel * 5 - b.r.physicalEffort * 4 - b.r.stairsRisk * 3) - ((a.r.suitableForMum ? 50 : 0) + a.r.comfortLevel * 5 - a.r.physicalEffort * 4 - a.r.stairsRisk * 3);
    case "effort": return (a, b) => a.r.physicalEffort - b.r.physicalEffort || a.r.walkingLevel - b.r.walkingLevel;
    case "transfers": return (a, b) => TL[a.r.typicalTransferLevel] - TL[b.r.typicalTransferLevel] || a.r.luggageHandling - b.r.luggageHandling;
    case "scenery": return (a, b) => b.r.sceneryScore - a.r.sceneryScore;
    case "food": return (a, b) => b.r.foodScore - a.r.foodScore;
    case "relax": return (a, b) => b.r.relaxationScore - a.r.relaxationScore;
    case "value": return (a, b) => b.r.valueForMoneyScore - a.r.valueForMoneyScore;
    case "unique": return (a, b) => b.r.onceInALifetimeScore - a.r.onceInALifetimeScore;
    case "revisit": return (a, b) => b.r.revisitScore - a.r.revisitScore;
    default: return (a, b) => b.score.total - a.score.total;
  }
}

/* ============================================================
   PERSISTENCE — supports artifact storage and regular browsers
   ============================================================ */
const STORE_KEY = "ets-state-v1";
async function loadState() {
  try {
    if (window.storage) {
      const res = await window.storage.get(STORE_KEY);
      return res ? JSON.parse(res.value) : null;
    }
    const value = window.localStorage.getItem(STORE_KEY);
    return value ? JSON.parse(value) : null;
  } catch { return null; }
}
let saveTimer = null;
function saveState(state) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      const value = JSON.stringify(state);
      if (window.storage) await window.storage.set(STORE_KEY, value);
      else window.localStorage.setItem(STORE_KEY, value);
    } catch (e) { /* best effort */ }
  }, 700);
}

const fmtGBP = (n) => (n == null ? "—" : "£" + n.toLocaleString());
const monthsLabel = (arr) => arr.length ? arr.map((m) => MONTHS[m - 1]).join(" · ") : "—";

/* ============================================================
   SMALL UI PIECES
   ============================================================ */
const Chip = ({ active, onClick, children, tone = "moss" }) => (
  <button onClick={onClick} style={{
    fontFamily: T.sans, fontSize: 12, padding: "4px 10px", borderRadius: 999,
    border: `1px solid ${active ? (tone === "carmine" ? T.carmine : T.moss) : T.line}`,
    background: active ? (tone === "carmine" ? T.carmineSoft : T.mossSoft) : "#fff",
    color: active ? (tone === "carmine" ? T.carmine : T.moss) : T.ink, cursor: "pointer",
    whiteSpace: "nowrap", lineHeight: 1.4,
  }}>{children}</button>
);

const Dots = ({ n, max = 5, color = T.ink }) => (
  <span aria-label={`${n} of ${max}`} style={{ letterSpacing: 2, color, fontSize: 11 }}>
    {"●".repeat(n)}{"○".repeat(Math.max(0, max - n))}
  </span>
);

const Stamp = ({ score }) => (
  <div style={{
    width: 54, height: 54, borderRadius: "50%", border: `1.5px dashed ${score >= 80 ? T.moss : score >= 60 ? T.gold : T.muted}`,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    transform: "rotate(-7deg)", color: score >= 80 ? T.moss : score >= 60 ? T.gold : T.muted,
    background: "#fff", flexShrink: 0,
  }}>
    <div style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 700, lineHeight: 1 }}>{score}</div>
    <div style={{ fontFamily: T.sans, fontSize: 7, letterSpacing: 1, textTransform: "uppercase" }}>match</div>
  </div>
);

const Badge = ({ children, tone = "moss", title }) => (
  <span title={title} style={{
    fontFamily: T.sans, fontSize: 10, letterSpacing: 0.4, textTransform: "uppercase",
    padding: "2px 7px", borderRadius: 3,
    background: tone === "carmine" ? T.carmineSoft : tone === "gold" ? "#F3EBD8" : T.mossSoft,
    color: tone === "carmine" ? T.carmine : tone === "gold" ? T.gold : T.moss,
  }}>{children}</span>
);

const hasDefiniteWeekendOutbound = (r) =>
  r.fridayEveningFeasible === true || r.saturdayMorningFeasible === true;
const isWeekendFriendly = (r) =>
  r.isManchesterWeekendRoute &&
  r.minimumDurationDays <= 3 && r.maximumDurationDays >= 2 &&
  ["none", "low", "medium"].includes(r.typicalTransferLevel) &&
  r.majorTransferCountToBase <= 1 &&
  hasDefiniteWeekendOutbound(r) &&
  r.sundayEveningReturnFeasible === true;
const hasUncertainWeekendTiming = (r) =>
  r.isManchesterWeekendRoute && [
    r.fridayEveningFeasible,
    r.saturdayMorningFeasible,
    r.sundayEveningReturnFeasible,
  ].includes("uncertain");
const timingLabel = (value) => value === true ? "Yes" : value === false ? "No" : "Uncertain — verify live";

const CATEGORY_GRADIENTS = {
  Air: "linear-gradient(135deg, #C9DCE5 0%, #EEF2EE 52%, #D9C9B0 100%)",
  City: "linear-gradient(135deg, #DDD3C4 0%, #EEE9DF 45%, #AEBAC0 100%)",
  Food: "linear-gradient(135deg, #E6D2B5 0%, #F2E9D8 48%, #B66C57 100%)",
  Land: "linear-gradient(135deg, #B7C7B0 0%, #E8E5D5 50%, #8FA1A7 100%)",
  Sea: "linear-gradient(135deg, #9FBCC8 0%, #DCE8E7 48%, #647F8A 100%)",
  Seasonal: "linear-gradient(135deg, #D8C9D2 0%, #F1E8DD 50%, #A58B78 100%)",
  Wellness: "linear-gradient(135deg, #B8CCC1 0%, #EDF0E7 50%, #B9A58D 100%)",
};

function RouteVisual({ route, detail = false }) {
  const visualStyle = {
    position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden",
    borderRadius: detail ? 8 : 6, flexShrink: 0,
    background: CATEGORY_GRADIENTS[route.parentCategory] ?? CATEGORY_GRADIENTS.Land,
  };
  if (!route.imageUrl) {
    return (
      <div role="img" aria-label={`${route.routeName} — ${route.parentCategory.toLowerCase()} route placeholder`} style={{ ...visualStyle, display: "flex", alignItems: "flex-end", padding: 12, boxSizing: "border-box" }}>
        <span style={{ fontFamily: T.serif, fontSize: detail ? 15 : 12, color: `${T.ink}B8`, letterSpacing: 0.3 }}>{route.parentCategory} route</span>
      </div>
    );
  }
  return (
    <figure style={{ ...visualStyle, margin: 0 }}>
      <img src={route.imageUrl} alt={route.imageAlt || `${route.routeName} route image`} loading="lazy" decoding="async" width="1600" height="900"
        style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
      {route.imageCredit && (
        <figcaption style={{ position: "absolute", right: 7, bottom: 6, fontFamily: T.sans, fontSize: 9, color: "#fff", background: "rgba(30,39,51,0.68)", padding: "2px 5px", borderRadius: 3 }}>
          {route.imageCredit}
        </figcaption>
      )}
    </figure>
  );
}

const Toggle = ({ label, value, onChange, note }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: T.sans, fontSize: 13, color: T.ink, cursor: "pointer", padding: "3px 0" }}>
    <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} style={{ accentColor: T.moss }} />
    <span>{label}{note && <span style={{ color: T.muted, fontSize: 11 }}> — {note}</span>}</span>
  </label>
);

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: `1px solid ${T.lineSoft}`, paddingTop: 10, marginTop: 10 }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <span style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: T.muted }}>{title}</span>
        {open ? <ChevronUp size={14} color={T.muted} /> : <ChevronDown size={14} color={T.muted} />}
      </button>
      {open && <div style={{ marginTop: 8 }}>{children}</div>}
    </div>
  );
};

const RangeRow = ({ label, min, max, value, onChange, unit = "", step = 1 }) => (
  <div style={{ fontFamily: T.sans, fontSize: 12, marginBottom: 6 }}>
    <div style={{ display: "flex", justifyContent: "space-between", color: T.ink }}>
      <span>{label}</span><span style={{ color: T.moss, fontWeight: 600 }}>{unit}{value.toLocaleString()}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: "100%", accentColor: T.moss }} />
  </div>
);

const FilterSubhead = ({ children }) => (
  <div style={{ fontFamily: T.sans, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", color: T.muted, margin: "10px 0 5px" }}>{children}</div>
);

/* ============================================================
   FILTER PANEL
   ============================================================ */
function FilterPanel({ f, set, onClear }) {
  const tog = (key, val) => set({ ...f, [key]: val });
  const togArr = (key, val) => set({ ...f, [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val] });
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: T.serif, fontSize: 16, color: T.ink }}>Filters</span>
        <button onClick={onClear} style={{ display: "flex", gap: 4, alignItems: "center", fontFamily: T.sans, fontSize: 11, color: T.carmine, background: "none", border: "none", cursor: "pointer" }}>
          <RotateCcw size={11} /> Clear all
        </button>
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 10.5, lineHeight: 1.4, color: T.muted, background: T.paper, borderRadius: 5, padding: "7px 8px", marginTop: 8 }}>
        Must-have conditions remove unsuitable trips. Preferences only affect ranking.
      </div>

      <Section title="Must have">
        <div style={{ background: T.carmineSoft, borderRadius: 6, padding: "2px 9px 9px" }}>
          <FilterSubhead>Month</FilterSubhead>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Chip active={f.month === 0} onClick={() => tog("month", 0)}>Any</Chip>
            {MONTHS.map((m, i) => <Chip key={m} active={f.month === i + 1} onClick={() => tog("month", i + 1)}>{m}</Chip>)}
          </div>

          <FilterSubhead>Limits</FilterSubhead>
          <RangeRow label="Maximum days" min={1} max={21} value={f.daysMax} onChange={(v) => set({ ...f, daysMax: Math.max(v, f.daysMin) })} />
          <RangeRow label="Maximum budget per person" min={100} max={5000} step={50} unit="£" value={f.budgetMax} onChange={(v) => set({ ...f, budgetMax: Math.max(v, f.budgetMin) })} />

          <FilterSubhead>Who's going</FilterSubhead>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {COMPANIONS.map(([k, l]) => <Chip key={k} active={f.companion === k} onClick={() => tog("companion", k)}>{l}</Chip>)}
          </div>
          {f.companion === "mum" && (
            <div style={{ marginTop: 6 }}>
              <Toggle label="Mum-friendly routes only" value={f.mumOnly} onChange={(v) => tog("mumOnly", v)} />
              <div style={{ fontFamily: T.sans, fontSize: 10, color: T.moss }}>Mum mode also gives comfort, transfers and luggage extra weight in ranking.</div>
            </div>
          )}

          <FilterSubhead>Trip fit</FilterSubhead>
          <div style={{ fontFamily: T.sans, fontSize: 10.5, color: T.muted, marginBottom: 4 }}>Trip type</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {TYPE_OPTIONS.map((t) => <Chip key={t} active={f.tripTypes.includes(t)} onClick={() => togArr("tripTypes", t)}>{t}</Chip>)}
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 10.5, color: T.muted, margin: "7px 0 4px" }}>Season & environment</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {ENV_OPTIONS.map(([k, l]) => <Chip key={k} active={f.env.includes(k)} onClick={() => togArr("env", k)}>{l}</Chip>)}
          </div>

          <FilterSubhead>Transport</FilterSubhead>
          <Toggle label="No flying" value={f.noFlying} onChange={(v) => tog("noFlying", v)} />
          <Toggle label="No driving" value={f.noDriving} onChange={(v) => tog("noDriving", v)} />
          <Toggle label="No overnight travel" value={f.noOvernight} onChange={(v) => tog("noOvernight", v)} />
          {f.manchesterWeekend && <Toggle label="Max one major transfer" value={f.maxOneTransfer} onChange={(v) => tog("maxOneTransfer", v)} />}

          <FilterSubhead>Accessibility</FilterSubhead>
          <RangeRow label="Max physical effort (1–5)" min={1} max={5} value={f.maxEffort} onChange={(v) => tog("maxEffort", v)} />
          {f.manchesterWeekend && <RangeRow label="Max walking level (1–5)" min={1} max={5} value={f.maxWalking} onChange={(v) => tog("maxWalking", v)} />}
          <Toggle label="Avoid steep terrain / frequent stairs" value={f.avoidStairs} onChange={(v) => tog("avoidStairs", v)} />
        </div>
      </Section>

      <Section title="Nice to have" defaultOpen={false}>
        <div style={{ background: T.mossSoft, borderRadius: 6, padding: "2px 9px 9px" }}>
          <FilterSubhead>Timing & budget preferences</FilterSubhead>
          <RangeRow label="Preferred minimum days" min={1} max={21} value={f.daysMin} onChange={(v) => set({ ...f, daysMin: Math.min(v, f.daysMax) })} />
          <RangeRow label="Preferred minimum budget" min={100} max={5000} step={50} unit="£" value={f.budgetMin} onChange={(v) => set({ ...f, budgetMin: Math.min(v, f.budgetMax) })} />
          <div style={{ fontFamily: T.sans, fontSize: 10, color: T.muted }}>Budgets are per-person estimates, twin-share where stated.</div>

          <FilterSubhead>Experiences</FilterSubhead>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {INTERESTS.map(([k, l]) => <Chip key={k} active={f.interests.includes(k)} onClick={() => togArr("interests", k)}>{l}</Chip>)}
          </div>

          <FilterSubhead>Transport preferences</FilterSubhead>
          <Toggle label="Direct from Manchester preferred" value={f.directMAN} onChange={(v) => tog("directMAN", v)} />
          <Toggle label="Depart from northern England" value={f.northernDeparture} onChange={(v) => tog("northernDeparture", v)} />
          {!f.manchesterWeekend && <Toggle label="Max one major transfer" value={f.maxOneTransfer} onChange={(v) => tog("maxOneTransfer", v)} />}
          <Toggle label="Minimise hotel changes" value={f.minHotelChanges} onChange={(v) => tog("minHotelChanges", v)} />
          <Toggle label="Minimise luggage handling" value={f.minLuggage} onChange={(v) => tog("minLuggage", v)} />
          <div style={{ fontFamily: T.sans, fontSize: 10, color: T.muted, marginTop: 4 }}>Departure-time preferences depend on live schedules and are not scored here.</div>

          <FilterSubhead>Comfort preferences</FilterSubhead>
          {!f.manchesterWeekend && <RangeRow label="Preferred max walking level (1–5)" min={1} max={5} value={f.maxWalking} onChange={(v) => tog("maxWalking", v)} />}
          <RangeRow label="Comfort priority (1–5)" min={1} max={5} value={f.comfortPriority} onChange={(v) => tog("comfortPriority", v)} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            {[["any", "Any weather"], ["mild", "Mild preferred"], ["cold", "Cold is fine"], ["heat", "Heat is fine"]].map(([k, l]) => (
              <Chip key={k} active={f.weatherTol === k} onClick={() => tog("weatherTol", k)}>{l}</Chip>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   ROUTE CARD
   ============================================================ */
function RouteCard({ item, fav, hidden, inCompare, onFav, onHide, onCompare, onOpen, compareFull }) {
  const { r, score, reasons, draws } = item;
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
      <RouteVisual route={r} />
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.sans, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.muted }}>
            {r.parentCategory} · {r.countries.join(", ")}
          </div>
          <button onClick={onOpen} style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer" }}>
            <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, lineHeight: 1.25 }}>{r.routeName}</div>
          </button>
        </div>
        <Stamp score={score.total} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {r.tripTypes.slice(0, 3).map((t) => <span key={t} style={{ fontFamily: T.sans, fontSize: 10, border: `1px solid ${T.lineSoft}`, borderRadius: 3, padding: "1px 6px", color: T.muted }}>{t}</span>)}
        {isWeekendFriendly(r) && <Badge title="Fits a 2–3 day weekend, has at most one major transfer, a definite outward option and a definite Sunday-evening return">Weekend-friendly</Badge>}
        {hasUncertainWeekendTiming(r) && <Badge tone="gold" title="At least one weekend timing estimate needs a current timetable check">Weekend timing uncertain</Badge>}
        {r.suitableForMum && <Badge>Mum-friendly</Badge>}
        {r.liveVerificationNeeded && <Badge tone="carmine" title="Schedules, fares and seasonal services change — verify before booking">Needs live verification</Badge>}
        {r.estimated && <Badge tone="gold" title={r.budgetBasis}>Estimates</Badge>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontFamily: T.sans, fontSize: 12, color: T.ink }}>
        <div><span style={{ color: T.muted }}>Best: </span>{monthsLabel(r.bestMonths)}</div>
        <div><span style={{ color: T.muted }}>Ideal: </span>{r.idealDurationDays} days</div>
        <div><span style={{ color: T.muted }}>Budget: </span>~{fmtGBP(r.budgetTypicalGBP)} pp</div>
        <div><span style={{ color: T.muted }}>{r.manchesterJourneyTime ? "From MAN: " : "MAN access: "}</span>{r.manchesterJourneyTime?.label ?? `${r.ManchesterAccessScore}/10`}</div>
        <div><span style={{ color: T.muted }}>Effort: </span><Dots n={r.physicalEffort} /></div>
        <div><span style={{ color: T.muted }}>Transfers: </span>{TL_LABEL[r.typicalTransferLevel]}</div>
      </div>

      <ul style={{ margin: 0, paddingLeft: 16, fontFamily: T.sans, fontSize: 12, color: T.ink }}>
        {reasons.map((x, i) => <li key={i} style={{ marginBottom: 2 }}>{x}</li>)}
      </ul>
      {draws.length > 0 && (
        <div style={{ fontFamily: T.sans, fontSize: 11.5, color: T.carmine, display: "flex", gap: 5, alignItems: "flex-start" }}>
          <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} /><span>{draws.join(" · ")}</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginTop: "auto", paddingTop: 6, borderTop: `1px solid ${T.lineSoft}` }}>
        <button onClick={onOpen} style={{ flex: 1, fontFamily: T.sans, fontSize: 12, padding: "6px 0", background: T.ink, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" }}>Details</button>
        <button title={inCompare ? "Remove from compare" : compareFull ? "Compare is full (4)" : "Add to compare"} onClick={onCompare}
          disabled={!inCompare && compareFull}
          style={{ padding: "6px 9px", borderRadius: 5, border: `1px solid ${inCompare ? T.moss : T.line}`, background: inCompare ? T.mossSoft : "#fff", cursor: compareFull && !inCompare ? "not-allowed" : "pointer", opacity: compareFull && !inCompare ? 0.4 : 1 }}>
          <Scale size={14} color={inCompare ? T.moss : T.muted} />
        </button>
        <button title={fav ? "Unfavourite" : "Favourite"} onClick={onFav} style={{ padding: "6px 9px", borderRadius: 5, border: `1px solid ${fav ? T.carmine : T.line}`, background: fav ? T.carmineSoft : "#fff", cursor: "pointer" }}>
          <Heart size={14} color={fav ? T.carmine : T.muted} fill={fav ? T.carmine : "none"} />
        </button>
        <button title={hidden ? "Restore" : "Hide"} onClick={onHide} style={{ padding: "6px 9px", borderRadius: 5, border: `1px solid ${T.line}`, background: "#fff", cursor: "pointer" }}>
          {hidden ? <Eye size={14} color={T.moss} /> : <EyeOff size={14} color={T.muted} />}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL MODAL
   ============================================================ */
function DetailModal({ item, onClose, mumMode }) {
  const { r, score, reasons, draws } = item;
  const row = (label, val) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "4px 0", borderBottom: `1px solid ${T.lineSoft}`, fontFamily: T.sans, fontSize: 12.5 }}>
      <span style={{ color: T.muted, flexShrink: 0 }}>{label}</span>
      <span style={{ color: T.ink, textAlign: "right" }}>{val}</span>
    </div>
  );
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,39,51,0.5)", zIndex: 50, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "4vh 12px", overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.paper, borderRadius: 10, maxWidth: 680, width: "100%", padding: 22, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "#fff", border: `1px solid ${T.line}`, borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={15} /></button>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingRight: 34 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.sans, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.muted }}>{r.parentCategory} · {r.sourceSection}</div>
            <h2 style={{ fontFamily: T.serif, fontSize: 24, margin: "2px 0 4px", color: T.ink, lineHeight: 1.2 }}>{r.routeName}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {isWeekendFriendly(r) && <Badge title="Based on observable weekend timing and logistics, not the suitability score">Weekend-friendly</Badge>}
              {hasUncertainWeekendTiming(r) && <Badge tone="gold">Weekend timing uncertain</Badge>}
              {r.suitableForMum && <Badge>Mum-friendly</Badge>}
              {r.liveVerificationNeeded && <Badge tone="carmine">Needs live verification</Badge>}
              {r.estimated && <Badge tone="gold">Budget is an estimate</Badge>}
            </div>
          </div>
          <Stamp score={score.total} />
        </div>

        {r.imageUrl && <div style={{ marginTop: 14 }}><RouteVisual route={r} detail /></div>}

        <p style={{ fontFamily: T.serif, fontSize: 14.5, lineHeight: 1.55, color: T.ink }}>{r.description}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          <div>
            {row("Main stops", r.mainStops.join(" → "))}
            {row("Countries", r.countries.join(", "))}
            {row("Best months", monthsLabel(r.bestMonths))}
            {r.acceptableMonths.length > 0 && row("Also possible", monthsLabel(r.acceptableMonths))}
            {r.seasonalWindow && row("Seasonal window", r.seasonalWindow)}
            {row("Days (min / ideal / max)", `${r.minimumDurationDays} / ${r.idealDurationDays} / ${r.maximumDurationDays}`)}
            {row("Travel styles", r.travelStyles.join(", "))}
            {row("Budget range pp", `${fmtGBP(r.budgetMinGBP)} – ${fmtGBP(r.budgetMaxGBP)} (typ. ${fmtGBP(r.budgetTypicalGBP)})`)}
            {row("Budget basis", r.budgetBasis)}
            {row("Budget confidence", r.budgetConfidence)}
          </div>
          <div>
            {row("Departure", [...r.departurePorts, ...r.departureCities].join(" / "))}
            {row("Direct from Manchester", r.directFromManchester)}
            {row("Manchester access", `${r.ManchesterAccessScore}/10${r.approximateManchesterToStartHours ? ` · ~${r.approximateManchesterToStartHours}h to start` : ""}`)}
            {r.isManchesterWeekendRoute && row("Weekend route base", r.routeBase)}
            {r.isManchesterWeekendRoute && row("Weekend route type", r.weekendRouteType ?? r.routeType)}
            {r.manchesterJourneyTime && row("Manchester journey band", `${r.manchesterJourneyTime.label} · planning estimate`)}
            {r.isManchesterWeekendRoute && row("Likely transport", r.likelyTransportMode)}
            {r.isManchesterWeekendRoute && row("Direct connection status", r.directConnectionStatus)}
            {r.isManchesterWeekendRoute && row("Major transfers to base", r.majorTransferCountToBase)}
            {r.isManchesterWeekendRoute && row("Car", r.carDependency)}
            {r.isManchesterWeekendRoute && row("Friday evening departure", timingLabel(r.fridayEveningFeasible))}
            {r.isManchesterWeekendRoute && row("Saturday morning departure", timingLabel(r.saturdayMorningFeasible))}
            {r.isManchesterWeekendRoute && row("Sunday evening return", timingLabel(r.sundayEveningReturnFeasible))}
            {r.isManchesterWeekendRoute && row("Weekend suitability", `${r.weekendSuitability}/10 · sorting estimate only`)}
            {row("Getting there", [r.flightRequired ? "flight" : null, r.trainPossible ? "train possible" : null, r.ferryPossible ? "ferry possible" : null, r.cruiseBased ? "cruise-based" : null, r.drivingRequired ? "driving required" : null].filter(Boolean).join(" · ") || "—")}
            {row("Overnight travel", r.overnightTravelRequired ? "Required" : r.overnightTravelPossible ? "Optional" : "Not needed")}
            {row("Transfers / hotel changes", `${TL_LABEL[r.typicalTransferLevel]} / ${TL_LABEL[r.hotelChanges] ?? r.hotelChanges}`)}
            {row("Effort · Walking · Stairs", `${r.physicalEffort} · ${r.walkingLevel} · ${r.stairsRisk} (of 5)`)}
            {row("Luggage handling · Comfort", `${r.luggageHandling}/5 · ${r.comfortLevel}/5`)}
            {row("Good for", [r.suitableForSolo && "solo", r.suitableForCouple && "couples", r.suitableForFriends && "friends", r.suitableForFamily && "family", r.suitableForMum && "Mum", r.suitableForOlderTraveller && "older travellers"].filter(Boolean).join(", "))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginTop: 14 }}>
          <div>
            <div style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.moss, marginBottom: 4 }}>Highlights</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontFamily: T.sans, fontSize: 12.5, color: T.ink }}>
              {r.highlights.map((h, i) => <li key={i} style={{ marginBottom: 3 }}>{h}</li>)}
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.carmine, marginBottom: 4 }}>Drawbacks</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontFamily: T.sans, fontSize: 12.5, color: T.ink }}>
              {r.drawbacks.map((h, i) => <li key={i} style={{ marginBottom: 3 }}>{h}</li>)}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 16, background: "#fff", border: `1px solid ${T.line}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.muted, marginBottom: 6 }}>
            Why this score? {mumMode && <span style={{ color: T.moss }}>(Mum weighting active)</span>}
          </div>
          {score.parts.map((p) => (
            <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontFamily: T.sans, fontSize: 12 }}>
              <span style={{ width: 165, color: T.ink, flexShrink: 0 }}>{p.label}</span>
              <div style={{ flex: 1, height: 6, background: T.lineSoft, borderRadius: 3 }}>
                <div style={{ width: `${(p.pts / p.max) * 100}%`, height: "100%", background: p.sub >= 0.75 ? T.moss : p.sub >= 0.5 ? T.gold : T.carmine, borderRadius: 3 }} />
              </div>
              <span style={{ width: 52, textAlign: "right", color: T.muted }}>{p.pts}/{p.max}</span>
            </div>
          ))}
          <div style={{ fontFamily: T.sans, fontSize: 11.5, color: T.ink, marginTop: 8 }}>
            <strong style={{ color: T.moss }}>Why it fits now:</strong> {reasons.join("; ")}.
            {draws.length > 0 && <> <strong style={{ color: T.carmine }}> Watch out:</strong> {draws.join("; ")}.</>}
          </div>
        </div>

        <div style={{ marginTop: 14, fontFamily: T.sans, fontSize: 12 }}>
          {r.isManchesterWeekendRoute && (
            <div style={{ marginBottom: 10, color: T.ink }}>
              <strong style={{ color: T.moss }}>Weekend evidence:</strong> {r.evidenceNote}
              <br /><strong style={{ color: T.moss }}>Suitability estimate:</strong> {r.weekendSuitabilityEvidence}
            </div>
          )}
          <div style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.muted, marginBottom: 4 }}>{r.isManchesterWeekendRoute ? "Official research sources" : "Official sources (from the Master Guide)"}</div>
          {r.officialSources.length ? r.officialSources.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noreferrer" style={{ color: T.moss, marginRight: 12 }}>{s.label} ↗</a>
          )) : <span style={{ color: T.muted }}>None recorded — verify with the official tourist board.</span>}
          <div style={{ marginTop: 8, color: T.carmine, display: "flex", gap: 6, alignItems: "flex-start" }}>
            <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              {r.liveVerificationNeeded && "Flight routes, sailing dates, seasonal services and prices change — verify live before booking. "}
              {r.estimated && "All budget figures are rough planning estimates, not quotes."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPARE MODAL
   ============================================================ */
function CompareModal({ items, onClose, onRemove }) {
  const rows = [
    ["Match score", (i) => i.score.total, "high"],
    ["Estimated budget pp", (i) => i.r.budgetTypicalGBP, "low", (v) => fmtGBP(v)],
    ["Ideal duration", (i) => i.r.idealDurationDays, "low", (v) => `${v} days`],
    ["Best months", (i) => monthsLabel(i.r.bestMonths), null],
    ["Manchester convenience", (i) => i.r.ManchesterAccessScore, "high", (v) => `${v}/10`],
    ["Flight required", (i) => (i.r.flightRequired ? 1 : 0), "low", (v) => (v ? "Yes" : "No")],
    ["Driving required", (i) => (i.r.drivingRequired ? 1 : 0), "low", (v) => (v ? "Yes" : "No")],
    ["Overnight travel", (i) => (i.r.overnightTravelRequired ? 2 : i.r.overnightTravelPossible ? 1 : 0), "low", (v) => ["No", "Optional", "Required"][v]],
    ["Transfer level", (i) => TL[i.r.typicalTransferLevel], "low", (v) => Object.keys(TL)[v - 1]],
    ["Hotel changes", (i) => TL[i.r.hotelChanges] ?? 2, "low", (v) => Object.keys(TL)[v - 1]],
    ["Physical effort", (i) => i.r.physicalEffort, "low", (v) => `${v}/5`],
    ["Walking", (i) => i.r.walkingLevel, "low", (v) => `${v}/5`],
    ["Luggage handling", (i) => i.r.luggageHandling, "low", (v) => `${v}/5`],
    ["Comfort", (i) => i.r.comfortLevel, "high", (v) => `${v}/5`],
    ["Weather risk", (i) => i.r.weatherRisk, "low", (v) => `${v}/5`],
    ["Mum suitability", (i) => (i.r.suitableForMum ? 1 : 0), "high", (v) => (v ? "✓ Yes" : "✗ No")],
    ["Nature", (i) => i.r.natureScore, "high", (v) => `${v}/10`],
    ["Culture", (i) => i.r.cultureScore, "high", (v) => `${v}/10`],
    ["History", (i) => i.r.historyScore, "high", (v) => `${v}/10`],
    ["Food", (i) => i.r.foodScore, "high", (v) => `${v}/10`],
    ["Relaxation", (i) => i.r.relaxationScore, "high", (v) => `${v}/10`],
    ["Unique transport", (i) => i.r.uniqueTransportScore, "high", (v) => `${v}/10`],
    ["Value for money", (i) => i.r.valueForMoneyScore, "high", (v) => `${v}/10`],
    ["Main advantage", (i) => i.r.highlights[0], null],
    ["Main drawback", (i) => i.r.drawbacks[0], null],
  ];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,39,51,0.5)", zIndex: 50, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "4vh 12px", overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.paper, borderRadius: 10, maxWidth: 900, width: "100%", padding: 20, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "#fff", border: `1px solid ${T.line}`, borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={15} /></button>
        <h2 style={{ fontFamily: T.serif, fontSize: 20, margin: "0 0 4px", color: T.ink }}>Compare routes</h2>
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginBottom: 10 }}>Best value in each row is highlighted. Budgets are per-person estimates.</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: T.sans, fontSize: 12, minWidth: 560 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, position: "sticky", left: 0, background: T.paper, minWidth: 130 }}></th>
                {items.map((i) => (
                  <th key={i.r.id} style={{ textAlign: "left", padding: 8, verticalAlign: "top", minWidth: 140 }}>
                    <div style={{ fontFamily: T.serif, fontSize: 14, color: T.ink }}>{i.r.shortName}</div>
                    <button onClick={() => onRemove(i.r.id)} style={{ fontFamily: T.sans, fontSize: 10, color: T.carmine, background: "none", border: "none", cursor: "pointer", padding: 0 }}>remove</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, get, dir, fmt]) => {
                const vals = items.map(get);
                let bestIdx = -1;
                if (dir) {
                  const nums = vals.map((v) => (typeof v === "number" ? v : null));
                  const valid = nums.filter((v) => v != null);
                  if (valid.length > 1) {
                    const best = dir === "high" ? Math.max(...valid) : Math.min(...valid);
                    if (!valid.every((v) => v === best)) bestIdx = nums.indexOf(best);
                  }
                }
                return (
                  <tr key={label} style={{ borderTop: `1px solid ${T.lineSoft}` }}>
                    <td style={{ padding: "6px 8px", color: T.muted, position: "sticky", left: 0, background: T.paper }}>{label}</td>
                    {vals.map((v, idx) => (
                      <td key={idx} style={{ padding: "6px 8px", color: T.ink, background: idx === bestIdx ? T.mossSoft : "transparent", fontWeight: idx === bestIdx ? 600 : 400 }}>
                        {fmt ? fmt(v) : v ?? "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MATRIX VIEW
   ============================================================ */
function MatrixView({ items, onOpen, compareIds, onCompare }) {
  const [ms, setMs] = useState({ key: "match", dir: -1 });
  const cols = [
    ["route", "Route", (i) => i.r.shortName],
    ["type", "Type", (i) => i.r.tripTypes[0] ?? "—"],
    ["months", "Best months", (i) => monthsLabel(i.r.bestMonths)],
    ["days", "Days", (i) => i.r.idealDurationDays],
    ["budget", "Budget", (i) => i.r.budgetTypicalGBP],
    ["man", "MAN", (i) => i.r.ManchesterAccessScore],
    ["transfers", "Transfers", (i) => TL[i.r.typicalTransferLevel]],
    ["effort", "Effort", (i) => i.r.physicalEffort],
    ["mum", "Mum", (i) => (i.r.suitableForMum ? 1 : 0)],
    ["nature", "Nature", (i) => i.r.natureScore],
    ["culture", "Culture", (i) => i.r.cultureScore],
    ["food", "Food", (i) => i.r.foodScore],
    ["relax", "Relax", (i) => i.r.relaxationScore],
    ["match", "Match", (i) => i.score.total],
  ];
  const colMap = Object.fromEntries(cols.map((c) => [c[0], c[2]]));
  const sorted = useMemo(() => {
    const get = colMap[ms.key];
    return [...items].sort((a, b) => {
      const av = get(a), bv = get(b);
      if (typeof av === "string") return ms.dir * av.localeCompare(bv);
      return ms.dir * ((av ?? -1) - (bv ?? -1));
    });
  }, [items, ms]);
  const disp = {
    budget: (v) => fmtGBP(v), man: (v) => `${v}/10`, transfers: (v) => Object.keys(TL)[v - 1],
    mum: (v) => (v ? "✓" : "—"),
  };
  return (
    <div style={{ overflowX: "auto", background: T.panel, border: `1px solid ${T.line}`, borderRadius: 8 }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: T.sans, fontSize: 12, minWidth: 980 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${T.line}` }}>
            {cols.map(([key, label]) => (
              <th key={key} onClick={() => setMs((s) => ({ key, dir: s.key === key ? -s.dir : key === "route" ? 1 : -1 }))}
                style={{ textAlign: "left", padding: "8px 10px", cursor: "pointer", whiteSpace: "nowrap", color: ms.key === key ? T.moss : T.muted, position: key === "route" ? "sticky" : "static", left: 0, background: T.panel, zIndex: key === "route" ? 2 : 1, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {label}{ms.key === key ? (ms.dir === 1 ? " ↑" : " ↓") : ""}
              </th>
            ))}
            <th style={{ padding: "8px 10px" }}></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((i) => (
            <tr key={i.r.id} onClick={() => onOpen(i)} style={{ borderTop: `1px solid ${T.lineSoft}`, cursor: "pointer" }}>
              {cols.map(([key, , get]) => (
                <td key={key} style={{ padding: "7px 10px", whiteSpace: key === "route" || key === "months" ? "normal" : "nowrap", color: T.ink, position: key === "route" ? "sticky" : "static", left: 0, background: T.panel, fontFamily: key === "route" ? T.serif : T.sans, fontSize: key === "route" ? 13 : 12, minWidth: key === "route" ? 150 : undefined, fontWeight: key === "match" ? 700 : 400 }}>
                  {disp[key] ? disp[key](get(i)) : get(i)}
                </td>
              ))}
              <td style={{ padding: "7px 10px" }} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onCompare(i.r.id)} title="Add to compare" style={{ border: `1px solid ${compareIds.includes(i.r.id) ? T.moss : T.line}`, background: compareIds.includes(i.r.id) ? T.mossSoft : "#fff", borderRadius: 4, padding: "3px 6px", cursor: "pointer" }}>
                  <Scale size={12} color={compareIds.includes(i.r.id) ? T.moss : T.muted} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   DECISION WIZARD — entry point only; writes to existing filters
   ============================================================ */
function WizardProgress({ step }) {
  return (
    <div role="status" aria-live="polite" aria-label={`Step ${step} of 5`} style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, marginBottom: 7 }}>Step {step} of 5</div>
      <div aria-hidden="true" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5 }}>
        {[1, 2, 3, 4, 5].map((n) => <span key={n} style={{ height: 5, borderRadius: 3, background: n <= step ? T.moss : T.lineSoft }} />)}
      </div>
    </div>
  );
}

function WizardOptionCard({ label, description, selected, onClick, disabled }) {
  return (
    <button type="button" aria-pressed={selected} disabled={disabled} onClick={onClick} style={{
      width: "100%", minHeight: 64, textAlign: "left", padding: "13px 15px", borderRadius: 7,
      border: `2px solid ${selected ? T.moss : T.line}`, background: selected ? T.mossSoft : "#fff",
      color: T.ink, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
      display: "flex", gap: 11, alignItems: "flex-start", fontFamily: T.sans,
    }}>
      <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${selected ? T.moss : T.line}`, background: selected ? T.moss : "#fff", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>{selected ? "✓" : ""}</span>
      <span><span style={{ display: "block", fontSize: 15, fontWeight: 600 }}>{label}</span>{description && <span style={{ display: "block", fontSize: 12, color: T.muted, marginTop: 3, lineHeight: 1.4 }}>{description}</span>}</span>
    </button>
  );
}

function TravelWizard({ filters, onChange, step, setStep, onComplete, onSkip, onOpenAdvanced, onRestart }) {
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus(); }, [step]);
  const time = wizardTimeChoice(filters);
  const companion = wizardCompanionChoice(filters);
  const budget = wizardBudgetChoice(filters);
  const experiences = inferredWizardExperiences(filters);
  const important = wizardImportantChoice(filters);

  if (step === 0) {
    return (
      <main style={{ minHeight: "100vh", background: T.paper, color: T.ink, padding: "clamp(28px, 8vw, 84px) 18px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: 1.1, textTransform: "uppercase", color: T.carmine, marginBottom: 18 }}>Europe Travel Selector</div>
          <h1 ref={headingRef} tabIndex="-1" style={{ fontFamily: T.serif, fontSize: "clamp(34px, 7vw, 52px)", lineHeight: 1.08, margin: 0, outline: "none" }}>Find your next trip</h1>
          <p style={{ fontFamily: T.sans, fontSize: 17, lineHeight: 1.55, color: T.muted, maxWidth: 590, margin: "18px 0 30px" }}>Tell us how much time you have, your budget and what kind of experience you want.</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
            <button onClick={() => setStep(1)} style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 600, padding: "12px 20px", border: "none", borderRadius: 6, background: T.ink, color: "#fff", cursor: "pointer" }}>Find my trip</button>
            <button onClick={onSkip} style={{ fontFamily: T.sans, fontSize: 13, color: T.carmine, background: "none", border: "none", padding: "4px 0", textDecoration: "underline", cursor: "pointer" }}>Skip to advanced search</button>
          </div>
        </div>
      </main>
    );
  }

  const selectTime = (choice) => {
    const base = filters.manchesterWeekend ? filtersForImportantChoice(filters, "none") : filters;
    onChange({ ...base, daysMin: choice.daysMin, daysMax: choice.daysMax, travelStyle: choice.travelStyle, wizardTimeChoice: choice.id });
  };
  const selectCompanion = (choice) => {
    const currentImportant = wizardImportantChoice(filters);
    onChange(filtersForImportantChoice(filtersForCompanion(filters, choice.id), currentImportant));
  };
  const selectBudget = (choice) => onChange({ ...filters, budgetMin: choice.budgetMin, budgetMax: choice.budgetMax, wizardBudgetChoice: choice.id });
  const toggleExperience = (id) => {
    let next;
    if (id === "surprise") next = ["surprise"];
    else {
      const withoutSurprise = experiences.filter((x) => x !== "surprise");
      next = withoutSurprise.includes(id) ? withoutSurprise.filter((x) => x !== id) : withoutSurprise.length < 3 ? [...withoutSurprise, id] : withoutSurprise;
    }
    onChange(filtersForExperiences(filters, next));
  };
  const titles = [null, "How much time do you have?", "Who are you travelling with?", "What is your estimated budget per person?", "What kind of trip are you looking for?", "Anything important?"];
  const descriptions = [null, "Choose the time you can realistically set aside.", "This helps balance comfort, logistics and suitability.", "Use a rough estimate per person, including transport and accommodation.", "Choose up to three. These answers guide the existing match score.", "Optional — choose the condition or preference that matters most."];
  const canContinue = step !== 4 || experiences.length > 0;

  return (
    <main style={{ minHeight: "100vh", background: T.paper, color: T.ink, padding: "24px 16px 50px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 24 }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} style={{ fontFamily: T.sans, fontSize: 13, color: T.carmine, background: "none", border: "none", padding: 0, textDecoration: "underline", cursor: "pointer" }}>← Back</button>
          <button onClick={onRestart} style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, background: "none", border: "none", padding: 0, textDecoration: "underline", cursor: "pointer" }}>Start again</button>
        </div>
        <WizardProgress step={step} />
        <h1 ref={headingRef} tabIndex="-1" style={{ fontFamily: T.serif, fontSize: "clamp(27px, 6vw, 38px)", lineHeight: 1.15, margin: 0, outline: "none" }}>{titles[step]}</h1>
        <p style={{ fontFamily: T.sans, fontSize: 14, color: T.muted, lineHeight: 1.5, margin: "10px 0 22px" }}>{descriptions[step]}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
          {step === 1 && WIZARD_TIME_OPTIONS.map((o) => <WizardOptionCard key={o.id} label={o.label} selected={time?.id === o.id} onClick={() => selectTime(o)} />)}
          {step === 2 && WIZARD_COMPANION_OPTIONS.map((o) => <WizardOptionCard key={o.id} label={o.label} selected={companion?.id === o.id} onClick={() => selectCompanion(o)} />)}
          {step === 3 && WIZARD_BUDGET_OPTIONS.map((o) => <WizardOptionCard key={o.id} label={o.label} selected={budget?.id === o.id} onClick={() => selectBudget(o)} />)}
          {step === 4 && WIZARD_EXPERIENCE_OPTIONS.map((o) => <WizardOptionCard key={o.id} label={o.label} description={o.description} selected={experiences.includes(o.id)} disabled={!experiences.includes(o.id) && !experiences.includes("surprise") && experiences.length >= 3} onClick={() => toggleExperience(o.id)} />)}
          {step === 5 && WIZARD_IMPORTANT_OPTIONS.map((o) => <WizardOptionCard key={o.id} label={o.label} selected={important === o.id} onClick={() => onChange(filtersForImportantChoice(filters, o.id))} />)}
        </div>
        {step === 4 && <div aria-live="polite" style={{ fontFamily: T.sans, fontSize: 12, color: experiences.length >= 3 ? T.carmine : T.muted, marginTop: 10 }}>{experiences.length} of 3 selected</div>}

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 28, paddingTop: 18, borderTop: `1px solid ${T.line}` }}>
          <button disabled={!canContinue} onClick={() => step === 5 ? onComplete() : setStep(step + 1)} style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, padding: "10px 18px", border: "none", borderRadius: 6, background: canContinue ? T.ink : T.line, color: "#fff", cursor: canContinue ? "pointer" : "not-allowed" }}>{step === 5 ? "Show my recommendations" : "Continue"}</button>
          <button onClick={onOpenAdvanced} style={{ fontFamily: T.sans, fontSize: 12.5, color: T.carmine, background: "none", border: "none", padding: "5px 0", textDecoration: "underline", cursor: "pointer" }}>Continue in advanced search</button>
        </div>
      </div>
    </main>
  );
}

function recommendationSummaryParts(f) {
  const parts = [];
  const time = wizardTimeChoice(f); if (time && time.id !== "flexible") parts.push(time.summary ?? time.label);
  const companion = wizardCompanionChoice(f); if (companion && companion.id !== "undecided") parts.push(companion.summary ?? companion.label);
  const budget = wizardBudgetChoice(f); if (budget && budget.id !== "flexible") parts.push(budget.summary ?? budget.label);
  const experienceIds = f.wizardExperienceChoices?.length ? f.wizardExperienceChoices : [];
  if (experienceIds.includes("surprise")) parts.push("Broad discovery");
  else experienceIds.slice(0, 3).forEach((id) => { const option = WIZARD_EXPERIENCE_OPTIONS.find((o) => o.id === id); if (option) parts.push(option.label); });
  if (!experienceIds.length) f.interests.slice(0, 2).forEach((id) => { const option = INTERESTS.find(([key]) => key === id); if (option) parts.push(option[1]); });
  const importantId = wizardImportantChoice(f);
  const important = WIZARD_IMPORTANT_OPTIONS.find((o) => o.id === importantId);
  if (important && important.id !== "none" && important.id !== "manweekend") parts.push(important.label);
  return parts.length ? parts : ["Flexible recommendations"];
}

function RecommendationSummary({ filters, count, onEdit, onRefine }) {
  return (
    <section aria-label="Your recommendation summary" style={{ background: T.mossSoft, border: `1px solid ${T.moss}44`, borderRadius: 8, padding: "13px 15px", marginBottom: 12 }}>
      <div style={{ fontFamily: T.serif, fontSize: 16, color: T.ink }}><strong>Your recommendations:</strong> {recommendationSummaryParts(filters).join(" · ")}</div>
      <div style={{ fontFamily: T.sans, fontSize: 11.5, color: T.muted, marginTop: 4 }}>{count} matching routes, ranked by the existing Best match score.</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 9 }}>
        <button onClick={onEdit} style={{ fontFamily: T.sans, fontSize: 11.5, padding: "5px 9px", border: `1px solid ${T.moss}`, borderRadius: 5, background: "#fff", color: T.moss, cursor: "pointer" }}>Edit answers</button>
        <button onClick={onRefine} style={{ fontFamily: T.sans, fontSize: 11.5, padding: "5px 9px", border: "none", borderRadius: 5, background: T.ink, color: "#fff", cursor: "pointer" }}>Refine with advanced filters</button>
      </div>
    </section>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function EuropeTravelSelector() {
  const [filters, setFiltersRaw] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("match");
  const [view, setView] = useState("cards");
  const [favs, setFavs] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [detail, setDetail] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [showExcluded, setShowExcluded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [appMode, setAppMode] = useState("wizard");
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardCompleted, setWizardCompleted] = useState(false);
  const [wizardResultActive, setWizardResultActive] = useState(false);
  const [stateReady, setStateReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      const s = await loadState();
      if (s) {
        if (s.filters) setFiltersRaw({ ...DEFAULT_FILTERS, ...s.filters });
        if (s.sortBy) setSortBy(s.sortBy);
        if (s.view) setView(s.view);
        setFavs(s.favs ?? []); setHidden(s.hidden ?? []); setCompareIds(s.compareIds ?? []);
      }
      const completed = s?.wizardCompleted ?? Boolean(s);
      setWizardCompleted(completed);
      setWizardResultActive(s?.wizardResultActive ?? false);
      setAppMode(completed ? "selector" : "wizard");
      loaded.current = true;
      setStateReady(true);
    })();
  }, []);
  useEffect(() => {
    if (loaded.current) saveState({ filters, sortBy, view, favs, hidden, compareIds, wizardCompleted, wizardResultActive });
  }, [filters, sortBy, view, favs, hidden, compareIds, wizardCompleted, wizardResultActive]);

  const clearWizardChoiceMetadata = (f) => ({ ...f, travelStyle: null, wizardTimeChoice: null, wizardBudgetChoice: null, wizardExperienceChoices: [], wizardImportantChoice: null });
  const setFilters = (f) => { setFiltersRaw(clearWizardChoiceMetadata(f)); setActivePreset(null); };
  const setWizardFilters = (f) => { setFiltersRaw(f); setActivePreset(null); };
  const applyPreset = (p) => {
    setFiltersRaw({ ...DEFAULT_FILTERS, ...p.f });
    setSortBy(p.sort ?? "match");
    setActivePreset(p.id);
    setWizardResultActive(false);
  };
  const resetAll = () => { setFiltersRaw(DEFAULT_FILTERS); setSortBy("match"); setActivePreset(null); setShowFavsOnly(false); setWizardResultActive(false); };
  const restartWizard = () => {
    setFiltersRaw(DEFAULT_FILTERS); setSortBy("match"); setActivePreset(null); setShowFavsOnly(false);
    setWizardResultActive(false); setWizardCompleted(false); setWizardStep(0); setAppMode("wizard");
  };
  const editWizardAnswers = () => { setWizardCompleted(false); setWizardStep(1); setAppMode("wizard"); };
  const completeWizard = () => { setSortBy("match"); setActivePreset(null); setWizardCompleted(true); setWizardResultActive(true); setAppMode("selector"); };
  const skipWizard = () => {
    setFiltersRaw(DEFAULT_FILTERS); setSortBy("match"); setActivePreset(null);
    setWizardCompleted(true); setWizardResultActive(false); setAppMode("selector");
  };
  const openAdvancedFromWizard = () => { setSortBy("match"); setWizardCompleted(true); setWizardResultActive(wizardStep > 0); setAppMode("selector"); };

  const toggleIn = (arr, setArr, id) => setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  const toggleCompare = (id) =>
    setCompareIds((c) => c.includes(id) ? c.filter((x) => x !== id) : c.length >= 4 ? c : [...c, id]);

  const { matched, excluded } = useMemo(() => {
    const m = [], e = [];
    for (const r of ROUTES) {
      const reasons = hardReasons(r, filters);
      if (reasons.length) { e.push({ r, reasons }); continue; }
      const score = scoreRoute(r, filters);
      m.push({ r, score, reasons: topReasons(r, filters, score.parts), draws: topDrawbacks(r, score.parts) });
    }
    return { matched: m, excluded: e };
  }, [filters]);

  const visible = useMemo(() => {
    let v = matched.filter((i) => (showHidden ? true : !hidden.includes(i.r.id)));
    if (showFavsOnly) v = v.filter((i) => favs.includes(i.r.id));
    return [...v].sort(sortFn(sortBy));
  }, [matched, hidden, favs, showFavsOnly, showHidden, sortBy]);

  const compareItems = matched.filter((i) => compareIds.includes(i.r.id));
  const hiddenCount = matched.filter((i) => hidden.includes(i.r.id)).length;
  const exclusionGroups = useMemo(() => {
    const groups = new Map();
    for (const item of excluded) {
      const meta = exclusionGroupFor(item.reasons[0]);
      const group = groups.get(meta.key) ?? { ...meta, items: [] };
      group.items.push(item);
      groups.set(meta.key, group);
    }
    return [...groups.values()].sort((a, b) => b.items.length - a.items.length || a.label.localeCompare(b.label));
  }, [excluded]);

  const relaxExclusion = (group) => {
    const next = { ...filters };
    switch (group.key) {
      case "budget":
        next.budgetMax = Math.min(5000, Math.max(filters.budgetMax, ...group.items.map(({ r }) => r.budgetMinGBP ?? filters.budgetMax)));
        break;
      case "duration":
        next.daysMax = Math.min(21, Math.max(filters.daysMax, ...group.items.map(({ r }) => r.minimumDurationDays)));
        break;
      case "travel-style": next.travelStyle = null; next.wizardTimeChoice = null; break;
      case "month": next.month = 0; break;
      case "effort": next.maxEffort = Math.min(5, Math.max(filters.maxEffort, ...group.items.map(({ r }) => r.physicalEffort))); break;
      case "walking": next.maxWalking = Math.min(5, Math.max(filters.maxWalking, ...group.items.map(({ r }) => r.walkingLevel))); break;
      case "driving": next.noDriving = false; break;
      case "flying": next.noFlying = false; break;
      case "overnight": next.noOvernight = false; break;
      case "mum": next.mumOnly = false; break;
      case "stairs": next.avoidStairs = false; break;
      case "trip-type": next.tripTypes = []; break;
      case "environment": next.env = []; break;
      case "once": next.onceOnly = false; break;
      case "solo": next.companion = "any"; break;
      case "transfers": next.maxOneTransfer = false; break;
      case "weekend-mode": next.manchesterWeekend = false; break;
      default: resetAll(); return;
    }
    setFilters(next);
  };

  const activeChips = [];
  if (filters.manchesterWeekend) activeChips.push(["Manchester weekend mode", () => setFilters({ ...filters, manchesterWeekend: false })]);
  if (filters.month) activeChips.push([`Month: ${MONTHS[filters.month - 1]}`, () => setFilters({ ...filters, month: 0 })]);
  if (filters.daysMin !== 2 || filters.daysMax !== 21) activeChips.push([`${filters.daysMin}–${filters.daysMax} days`, () => setFilters({ ...filters, daysMin: 2, daysMax: 21 })]);
  if (filters.budgetMax !== 5000 || filters.budgetMin !== 100) activeChips.push([`£${filters.budgetMin}–£${filters.budgetMax}`, () => setFilters({ ...filters, budgetMin: 100, budgetMax: 5000 })]);
  if (filters.companion !== "any") activeChips.push([`With: ${COMPANIONS.find(([k]) => k === filters.companion)[1]}`, () => setFilters({ ...filters, companion: "any", mumOnly: false })]);
  filters.interests.forEach((k) => activeChips.push([INTERESTS.find(([x]) => x === k)[1], () => setFilters({ ...filters, interests: filters.interests.filter((x) => x !== k) })]));
  filters.tripTypes.forEach((t) => activeChips.push([t, () => setFilters({ ...filters, tripTypes: filters.tripTypes.filter((x) => x !== t) })]));
  filters.env.forEach((t) => activeChips.push([ENV_OPTIONS.find(([x]) => x === t)?.[1] ?? t, () => setFilters({ ...filters, env: filters.env.filter((x) => x !== t) })]));
  [["noFlying", "No flying"], ["noDriving", "No driving"], ["noOvernight", "No overnight"], ["directMAN", "Direct MAN pref."], ["northernDeparture", "Northern departure"], ["maxOneTransfer", "≤1 transfer"], ["minHotelChanges", "Few hotel changes"], ["minLuggage", "Light luggage"], ["mumOnly", "Mum-friendly only"], ["avoidStairs", "No stairs"], ["onceOnly", "Once-in-a-lifetime"]]
    .forEach(([k, l]) => { if (filters[k]) activeChips.push([l, () => setFilters({ ...filters, [k]: false })]); });
  if (filters.maxEffort < 5) activeChips.push([`Effort ≤${filters.maxEffort}`, () => setFilters({ ...filters, maxEffort: 5 })]);
  if (filters.maxWalking < 5) activeChips.push([`Walking ≤${filters.maxWalking}`, () => setFilters({ ...filters, maxWalking: 5 })]);

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 900;

  const refineAdvanced = () => {
    if (!isDesktop) setDrawerOpen(true);
    else document.getElementById("advanced-filters")?.scrollIntoView({ block: "start" });
  };

  if (!stateReady) return <div aria-busy="true" aria-label="Loading travel selector" style={{ minHeight: "100vh", background: T.paper }} />;
  if (appMode === "wizard") return (
    <TravelWizard filters={filters} onChange={setWizardFilters} step={wizardStep} setStep={setWizardStep}
      onComplete={completeWizard} onSkip={skipWizard} onOpenAdvanced={openAdvancedFromWizard} onRestart={restartWizard} />
  );

  return (
    <div style={{ minHeight: "100vh", background: T.paper, color: T.ink }}>
      {/* header */}
      <header style={{ borderBottom: `1px solid ${T.line}`, background: T.paper, padding: "16px 18px 12px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: T.serif, fontSize: 26, margin: 0, color: T.ink }}>Europe Travel Selector</h1>
            <span style={{ fontFamily: T.sans, fontSize: 11, color: T.carmine, border: `1px solid ${T.carmine}`, borderRadius: 3, padding: "1px 6px", transform: "rotate(-2deg)" }}>from the Master Guide</span>
            <button onClick={restartWizard} style={{ marginLeft: "auto", fontFamily: T.sans, fontSize: 11.5, color: T.carmine, background: "none", border: "none", padding: 0, textDecoration: "underline", cursor: "pointer" }}>Find another trip</button>
          </div>
          <p style={{ fontFamily: T.sans, fontSize: 12.5, color: T.muted, margin: "4px 0 10px", maxWidth: 620 }}>
            Find the right European trip by month, budget, time and travel style — from a Manchester-based perspective. Budgets are per-person estimates; anything schedule-dependent is flagged for live verification.
          </p>
          {/* presets */}
          <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 4 }}>
            {PRESETS.map((p) => (
              <Chip key={p.id} active={activePreset === p.id} onClick={() => applyPreset(p)} tone="carmine">{p.label}</Chip>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 18, padding: "14px 18px", alignItems: "flex-start" }}>
        {/* desktop filter panel */}
        {isDesktop && (
          <aside id="advanced-filters" style={{ width: 270, flexShrink: 0, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 8, padding: 14, position: "sticky", top: 12, maxHeight: "92vh", overflowY: "auto", scrollMarginTop: 12 }}>
            <FilterPanel f={filters} set={setFilters} onClear={resetAll} />
          </aside>
        )}

        <main style={{ flex: 1, minWidth: 0 }}>
          {wizardResultActive && <RecommendationSummary filters={filters} count={visible.length} onEdit={editWizardAnswers} onRefine={refineAdvanced} />}
          {/* toolbar */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 8 }}>
            {!isDesktop && (
              <button onClick={() => setDrawerOpen(true)} style={{ display: "flex", gap: 5, alignItems: "center", fontFamily: T.sans, fontSize: 12, padding: "6px 10px", border: `1px solid ${T.line}`, borderRadius: 6, background: "#fff", cursor: "pointer" }}>
                <Filter size={13} /> Filters
              </button>
            )}
            <span style={{ fontFamily: T.serif, fontSize: 14 }}>
              <strong>{visible.length}</strong> routes match
              <button onClick={() => setShowExcluded(!showExcluded)} aria-expanded={showExcluded} style={{ fontFamily: T.sans, fontSize: 11.5, color: T.carmine, background: "none", border: "none", cursor: "pointer" }}>
                · {excluded.length} excluded by hard filters {showExcluded ? "▴" : "▾"}
              </button>
            </span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <Chip active={showFavsOnly} onClick={() => setShowFavsOnly(!showFavsOnly)} tone="carmine">♥ Favourites ({favs.length})</Chip>
              {hiddenCount > 0 && <Chip active={showHidden} onClick={() => setShowHidden(!showHidden)}>{showHidden ? "Showing hidden" : `Hidden (${hiddenCount})`}</Chip>}
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ fontFamily: T.sans, fontSize: 12, padding: "5px 8px", border: `1px solid ${T.line}`, borderRadius: 6, background: "#fff", color: T.ink }}>
                {SORTS.map(([k, l]) => <option key={k} value={k}>Sort: {l}</option>)}
              </select>
              <div style={{ display: "flex", border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden" }}>
                <button onClick={() => setView("cards")} title="Card view" style={{ padding: "6px 9px", background: view === "cards" ? T.ink : "#fff", border: "none", cursor: "pointer" }}><LayoutGrid size={13} color={view === "cards" ? "#fff" : T.muted} /></button>
                <button onClick={() => setView("matrix")} title="Matrix view" style={{ padding: "6px 9px", background: view === "matrix" ? T.ink : "#fff", border: "none", cursor: "pointer" }}><Table2 size={13} color={view === "matrix" ? "#fff" : T.muted} /></button>
              </div>
            </div>
          </div>

          {/* active filter chips */}
          {activeChips.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10, alignItems: "center" }}>
              {activeChips.map(([label, clear], i) => (
                <span key={i} style={{ fontFamily: T.sans, fontSize: 11, background: T.mossSoft, color: T.moss, borderRadius: 999, padding: "3px 8px", display: "inline-flex", gap: 4, alignItems: "center" }}>
                  {label}<button onClick={clear} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: T.moss, display: "flex" }}><X size={10} /></button>
                </span>
              ))}
              <button onClick={resetAll} style={{ fontFamily: T.sans, fontSize: 11, color: T.carmine, background: "none", border: "none", cursor: "pointer" }}>Reset</button>
            </div>
          )}

          {/* excluded reasons */}
          {showExcluded && (
            <div style={{ background: T.carmineSoft, border: `1px solid ${T.carmine}33`, borderRadius: 8, padding: 12, marginBottom: 12, fontFamily: T.sans, fontSize: 12 }}>
              <div style={{ fontWeight: 600, color: T.carmine, marginBottom: 3 }}>Excluded by your must-have conditions</div>
              <div style={{ color: T.muted, fontSize: 10.5, marginBottom: 7 }}>Each route is counted under its first blocking condition, so the totals add up.</div>
              {excluded.length === 0 ? <span style={{ color: T.muted }}>Nothing excluded yet.</span> : exclusionGroups.map((group) => (
                <div key={group.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: `1px solid ${T.carmine}22`, color: T.ink }}>
                  <span style={{ flex: 1 }}><strong>{group.items.length}</strong> {group.label}</span>
                  <button onClick={() => relaxExclusion(group)} title={`Relax condition: ${group.label}`} style={{ fontFamily: T.sans, fontSize: 10.5, color: T.carmine, background: "#fff", border: `1px solid ${T.carmine}55`, borderRadius: 4, padding: "3px 7px", cursor: "pointer", whiteSpace: "nowrap" }}>
                    {group.actionLabel}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* results */}
          {visible.length === 0 ? (
            <div style={{ background: T.panel, border: `1px dashed ${T.line}`, borderRadius: 8, padding: 32, textAlign: "center", fontFamily: T.sans, fontSize: 13, color: T.muted }}>
              No routes match these filters. Try widening the budget or days, or press Reset to start again.
            </div>
          ) : view === "cards" ? (
            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(auto-fill, minmax(300px, 1fr))" : "1fr", gap: 12 }}>
              {visible.map((item) => (
                <RouteCard key={item.r.id} item={item}
                  fav={favs.includes(item.r.id)} hidden={hidden.includes(item.r.id)}
                  inCompare={compareIds.includes(item.r.id)} compareFull={compareIds.length >= 4}
                  onFav={() => toggleIn(favs, setFavs, item.r.id)}
                  onHide={() => toggleIn(hidden, setHidden, item.r.id)}
                  onCompare={() => toggleCompare(item.r.id)}
                  onOpen={() => setDetail(item)} />
              ))}
            </div>
          ) : (
            <MatrixView items={visible} onOpen={setDetail} compareIds={compareIds} onCompare={toggleCompare} />
          )}
        </main>
      </div>

      {/* compare tray */}
      {compareIds.length > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.ink, color: "#fff", padding: "10px 16px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", zIndex: 40 }}>
          <Scale size={15} />
          <span style={{ fontFamily: T.sans, fontSize: 12 }}>Compare ({compareIds.length}/4):</span>
          {compareItems.map((i) => (
            <span key={i.r.id} style={{ fontFamily: T.sans, fontSize: 11, background: "#ffffff22", borderRadius: 999, padding: "3px 9px", display: "inline-flex", gap: 5, alignItems: "center" }}>
              {i.r.shortName}
              <button onClick={() => toggleCompare(i.r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex" }}><X size={10} /></button>
            </span>
          ))}
          <button onClick={() => setShowCompare(true)} disabled={compareIds.length < 2}
            style={{ marginLeft: "auto", fontFamily: T.sans, fontSize: 12, padding: "6px 14px", borderRadius: 5, border: "none", background: compareIds.length < 2 ? "#ffffff33" : T.carmine, color: "#fff", cursor: compareIds.length < 2 ? "not-allowed" : "pointer" }}>
            Compare {compareIds.length < 2 ? "(pick 2+)" : "now"}
          </button>
        </div>
      )}

      {/* mobile filter drawer */}
      {!isDesktop && drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(30,39,51,0.5)" }} onClick={() => setDrawerOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "86%", maxWidth: 340, background: T.paper, padding: 16, overflowY: "auto" }}>
            <button onClick={() => setDrawerOpen(false)} style={{ float: "right", background: "#fff", border: `1px solid ${T.line}`, borderRadius: "50%", width: 30, height: 30, cursor: "pointer" }}><X size={14} /></button>
            <FilterPanel f={filters} set={setFilters} onClear={resetAll} />
            <button onClick={() => setDrawerOpen(false)} style={{ marginTop: 14, width: "100%", fontFamily: T.sans, fontSize: 13, padding: "9px 0", background: T.ink, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
              Show {visible.length} routes
            </button>
          </div>
        </div>
      )}

      {detail && <DetailModal item={detail} onClose={() => setDetail(null)} mumMode={filters.companion === "mum"} />}
      {showCompare && compareItems.length >= 2 && (
        <CompareModal items={compareItems} onClose={() => setShowCompare(false)} onRemove={(id) => { toggleCompare(id); if (compareIds.length <= 2) setShowCompare(false); }} />
      )}

      <footer style={{ maxWidth: 1280, margin: "0 auto", padding: "18px", fontFamily: T.sans, fontSize: 10.5, color: T.muted, paddingBottom: compareIds.length ? 70 : 18 }}>
        Data source: the Europe Travel Master Guide (2026), plus linked official destination and transport sources for Manchester Weekend routes. All budgets, weekend suitability and journey-time bands are planning estimates, not quotes or live timetables. Items marked "Needs live verification" must be checked against official sources before booking.
      </footer>
    </div>
  );
}
