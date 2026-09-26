---
title: 'A citizen report map with react-leaflet (and how I''d rewrite it today)'
description: 'At the Hackacom 2023 hackathon we built Canasta: a map where neighbors report problems in the city and others join in to fix them. I go over the real code, the classic Leaflet icon bug and what I''d change three years later.'
date: 2026-09-17
tags: ['react', 'frontend']
project: 'canasta'
lang: 'en'
translationOf: 'mapa-de-reportes-con-react-leaflet'
---

In 2023 I took part in **Hackacom 2023** with Canasta: an app for people in Cochabamba (Bolivia) to report small problems on a map that neighbors can fix themselves (piled-up trash, abandoned animals, neglected spaces), and for others to sign up as volunteers to go fix them.

We didn't win. But the code is still on my GitHub, and rereading it three years later is a good exercise: you can see what I learned and what I'd do differently. This post shows the interesting parts of the map and an honest review.

## The stack: React + Leaflet + OpenStreetMap

For a map at a hackathon, **Leaflet** with **OpenStreetMap** tiles is hard to beat: no API key, no cost, and `react-leaflet` integrates it with React components.

```jsx
<MapContainer center={[-17.3697, -66.1653]} zoom={13} scrollWheelZoom style={{ height: '100vh' }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {/* markers… */}
</MapContainer>
```

(If you use OpenStreetMap tiles in something that will get real traffic, add the attribution and check their usage policy. It's fine for a hackathon demo; not in production.)

## The classic bug: Leaflet icons don't show up

The first thing that happens to anyone using Leaflet with a bundler (Webpack, Vite…): markers show up as a broken image. Leaflet computes the path of its default icons from its CSS URL, and the bundler changes those paths.

The fix we used (still the standard one) is to delete that computation and pass the imported images:

```js
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
```

If you ever see broken markers in Leaflet, this is it.

## Creating a report: a draggable marker

The reporting interaction was simple and worked well on phones:

1. When the map opens, it asks for the **user's location** and drops a marker there.
2. The marker is **draggable**: the user moves it to the exact spot of the problem.
3. Its popup has a "Create" button that opens the report form with those coordinates.

```jsx
<Marker
  position={markerPosition}
  draggable
  eventHandlers={{
    dragend: (e) => setMarkerPosition(e.target.getLatLng()),
    mouseover: (e) => e.target.openPopup(),
  }}
>
  <Popup>Drag the marker to the report's location</Popup>
</Marker>
```

Reports were classified into **((four categories))** (environment, animal abandonment, urban revitalization and social issues), each with its own color and pin. Filtering by category changed the visible markers.

## The honest review: what I'd change today

Hackathon code is hackathon code: it's written to show the idea in a few hours. But there are things I'd do differently today even in a rush, because they cost the same and prevent problems.

### 1. A lookup table instead of nested ternaries

Each category's button color and icon were picked with chained ternaries, repeated in two places:

```js
// Before
iconUrl: selectedCategory === 'medioambiente' ? require('../assets/pin-green.png')
       : selectedCategory === 'abandonoanimal' ? require('../assets/pin-brown.png')
       : selectedCategory === 'revitalizacionurbana' ? require('../assets/pin-orange.png')
       : /* … */
```

Today I'd solve it with **==a configuration object==**: a single place to add a category, and the color and icon can never get out of sync.

```js
// After
const CATEGORIES = {
  medioambiente:        { name: 'Environment',           color: '#00BA35', pin: pinGreen },
  abandonoanimal:       { name: 'Animal abandonment',    color: '#964B00', pin: pinBrown },
  revitalizacionurbana: { name: 'Urban revitalization',  color: '#FFA500', pin: pinOrange },
  controversiasocial:   { name: 'Social issues',         color: '#FF0000', pin: pinRed },
};
const cat = CATEGORIES[selectedCategory] ?? { color: '#000000', pin: pinBlack };
```

### 2. Create the icons only once

Every render created a `new L.Icon(...)` per marker. With ten markers you don't notice; with hundreds, you do. The icons don't change, so they're created **once, outside the component**:

```js
const ICONS = Object.fromEntries(
  Object.entries(CATEGORIES).map(([id, c]) => [
    id,
    new L.Icon({ iconUrl: c.pin, iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -36] }),
  ]),
);
```

While at it, I'd fix the `iconAnchor`: the point of the icon that touches the map must be **the tip of the pin** (bottom center: `[width / 2, height]`). With a misplaced anchor, the marker "floats" and points a few meters off the real spot, which is exactly what you don't want on a report map.

### 3. Handle the no-location case

The code asked for the location without handling the error:

```js
navigator.geolocation.getCurrentPosition((pos) => setMarkerPosition([pos.coords.latitude, pos.coords.longitude]));
```

If the user denies permission (or is on a computer without GPS), nothing happens and the marker sits at the default center with no explanation. Today I'd add the error callback, a clear message ("drag the marker to the spot") and a timeout:

```js
navigator.geolocation.getCurrentPosition(
  (pos) => setMarkerPosition([pos.coords.latitude, pos.coords.longitude]),
  () => setNotice("We couldn't get your location: drag the marker to where the problem is."),
  { enableHighAccuracy: true, timeout: 8000 },
);
```

### 4. Real data from the start

The demo's reports were hardcoded in an array inside the component. That works for a presentation, but today I'd use a ready-made backend like **Supabase** or **Firebase** from minute one: auth, database and realtime (watching other people's reports appear) in an afternoon, without writing a server.

## What I learned

- **At a hackathon, whoever cuts scope wins.** Defining the minimum that proves the idea (a map, a report, a volunteer) was the most important decision of the hackathon.
- **Some good practices cost no time.** A config object instead of ternaries is just as fast to write and saves you when the judges ask "what if we add another category?".
- **Rereading your old code is the best measure of how much you've grown.** If you can't find anything to change, you probably haven't learned much since.
