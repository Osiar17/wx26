/* WX 2026 — shared music catalogue (Pass 7). Single source of truth for
   phase metadata and the 28-item setlist catalogue. Setlist and Lyrics both
   import this; counts and phase totals derive from it. Lyric TEXT lives in
   wx-lyrics-data.js, keyed by item number. Do not edit titles/order/artists
   here without updating both pages — that is the point of a single source. */
window.WX_PHASES=[
 {
  "id": "god-is-good",
  "number": "I",
  "title": "God Is Good",
  "subtitle": "The Threshold of Goodness",
  "movement": "Arrival → Assurance",
  "line": "The room begins by becoming assured of who God is and learning to trust Him together.",
  "handoff": "Because He is good, we can trust Him in the dark."
 },
 {
  "id": "god-helps-us-yield",
  "number": "II",
  "title": "God Helps Us Yield",
  "subtitle": "The Help in the Dark",
  "movement": "Assurance → Dependence",
  "line": "The room moves from confidence in God’s goodness into honest dependence on His help.",
  "handoff": "Help does not remove the cup. It gives us strength to place our will before the Father."
 },
 {
  "id": "we-say-yes",
  "number": "III",
  "title": "We Say Yes",
  "subtitle": "The Will Laid Down",
  "movement": "Dependence → Surrender",
  "line": "The room is given truth, weight and space to personally answer God.",
  "handoff": "A will laid down must now rise to obey."
 },
 {
  "id": "god-is-glorified",
  "number": "IV",
  "title": "God Is Glorified",
  "subtitle": "The Gateway to Glory",
  "movement": "Surrender → Glory",
  "line": "The room rises from surrender knowing its Yes must become a life through which God is glorified.",
  "handoff": "The will is settled. The Yes becomes a life. God is glorified."
 }
];
window.WX_CATALOGUE=[
 {
  "number": 1,
  "phase": "god-is-good",
  "title": "Goodness Medley",
  "type": "Curated Medley",
  "components": [
   {
    "letter": "A",
    "title": "You Are Good",
    "artist": "Ntokozo Mbambo"
   },
   {
    "letter": "B",
    "title": "God Is Good",
    "artist": "Don Moen"
   },
   {
    "letter": "C",
    "title": "My God Is Good",
    "artist": "Hala Afrika ft. Ayanda Ntanzi"
   }
  ]
 },
 {
  "number": 2,
  "phase": "god-is-good",
  "title": "Good God, Good Will",
  "artist": "Original"
 },
 {
  "number": 3,
  "phase": "god-is-good",
  "title": "Ghanaian Goodness Medley",
  "type": "Curated Medley",
  "components": [
   {
    "letter": "A",
    "title": "Ebenezer",
    "artist": "Gaddiel Acquaah"
   },
   {
    "letter": "B",
    "title": "Nyame Tease",
    "artist": "J.Y. Sakyi-Baidoo"
   },
   {
    "letter": "C",
    "title": "Okura Me Mu",
    "artist": "New Creation"
   },
   {
    "letter": "D",
    "title": "Merensesa Me Nyame Da",
    "artist": "Kwame Amponsah"
   },
   {
    "letter": "E",
    "title": "Gyatabruwa",
    "artist": "Osei Boateng"
   }
  ]
 },
 {
  "number": 4,
  "phase": "god-is-good",
  "title": "I Trust in You",
  "artist": "Joe Mettle"
 },
 {
  "number": 5,
  "phase": "god-helps-us-yield",
  "title": "God I Look to You",
  "artist": "Bethel Music"
 },
 {
  "number": 6,
  "phase": "god-helps-us-yield",
  "title": "Ɔrentɔ Nko",
  "artist": "Christiana Love"
 },
 {
  "number": 7,
  "phase": "god-helps-us-yield",
  "title": "Matwen Awurade",
  "artist": "Kofi Owusu Peprah"
 },
 {
  "number": 8,
  "phase": "god-helps-us-yield",
  "title": "Through It All / Hold On",
  "type": "Song Pair",
  "components": [
   {
    "letter": "A",
    "title": "Through It All",
    "artist": "Andraé Crouch"
   },
   {
    "letter": "B",
    "title": "Hold On",
    "artist": "Bernice Offei"
   }
  ]
 },
 {
  "number": 9,
  "phase": "god-helps-us-yield",
  "title": "Mercy Medley",
  "type": "Curated Medley",
  "components": [
   {
    "letter": "A",
    "title": "Rahama",
    "artist": "Kaestrings Music"
   },
   {
    "letter": "B",
    "title": "By Myself",
    "artist": "Deon Kipping"
   },
   {
    "letter": "C",
    "title": "Lord Have Mercy",
    "artist": "Michael W. Smith"
   }
  ]
 },
 {
  "number": 10,
  "phase": "god-helps-us-yield",
  "title": "I Am Not Alone",
  "artist": "Kari Jobe"
 },
 {
  "number": 11,
  "phase": "god-helps-us-yield",
  "title": "Another in the Fire",
  "artist": "Hillsong United"
 },
 {
  "number": 12,
  "phase": "we-say-yes",
  "title": "You Are Here",
  "artist": "William McDowell"
 },
 {
  "number": 13,
  "phase": "we-say-yes",
  "title": "Have Your Way",
  "artist": "Ntokozo Mbambo"
 },
 {
  "number": 14,
  "phase": "we-say-yes",
  "title": "Not My Will",
  "artist": "Emmasings"
 },
 {
  "number": 15,
  "phase": "we-say-yes",
  "title": "Oceans",
  "subtitle": "Where Feet May Fail",
  "artist": "Hillsong United"
 },
 {
  "number": 16,
  "phase": "we-say-yes",
  "title": "Lead Me Lord",
  "artist": "The Brooklyn Tabernacle Choir"
 },
 {
  "number": 17,
  "phase": "we-say-yes",
  "title": "Volume of the Book",
  "artist": "Moses Akoh · Theophilus Sunday · Greatman Takit"
 },
 {
  "number": 18,
  "phase": "we-say-yes",
  "title": "I’ll Just Say Yes",
  "artist": "Brian Courtney Wilson"
 },
 {
  "number": 19,
  "phase": "we-say-yes",
  "title": "Withholding Nothing",
  "artist": "William McDowell"
 },
 {
  "number": 20,
  "phase": "we-say-yes",
  "title": "I Surrender All / Yes",
  "artist": "William McDowell"
 },
 {
  "number": 21,
  "phase": "we-say-yes",
  "title": "Your Glory (Have Your Way)"
 },
 {
  "number": 22,
  "phase": "we-say-yes",
  "title": "For Your Glory",
  "artist": "Tasha Cobbs Leonard"
 },
 {
  "number": 23,
  "phase": "we-say-yes",
  "title": "Let Praises Rise",
  "artist": "Maranda Curtis"
 },
 {
  "number": 24,
  "phase": "god-is-glorified",
  "title": "All Is for Your Glory",
  "artist": "Jesus Image"
 },
 {
  "number": 25,
  "phase": "god-is-glorified",
  "title": "Glory Song",
  "artist": "Dunsin Oyekan"
 },
 {
  "number": 26,
  "phase": "god-is-glorified",
  "title": "We Honour You",
  "artist": "Nathaniel Bassey"
 },
 {
  "number": 27,
  "phase": "god-is-glorified",
  "title": "Ogo",
  "artist": "Dunsin Oyekan"
 },
 {
  "number": 28,
  "phase": "god-is-glorified",
  "title": "Final Glory Medley",
  "type": "Curated Medley",
  "developmentNote": "The final components and exact closing sequence are still being curated and will be settled through rehearsal.",
  "components": [
   {
    "letter": "A",
    "title": "The Glory",
    "artist": "Uche Agwu"
   },
   {
    "letter": "B",
    "title": "Trading My Sorrows",
    "artist": "Women of Faith",
    "arrangeNote": "Pre-Chorus + Chorus"
   },
   {
    "letter": "C",
    "title": "My Life Is Available",
    "artist": "The Brooklyn Tabernacle Choir",
    "arrangeNote": "Outro"
   },
   {
    "letter": "D",
    "title": "We Raise a Sound"
   }
  ]
 }
];
