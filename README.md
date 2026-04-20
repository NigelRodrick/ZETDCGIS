# Asset Collect Mobile (Templates)

Project root: `Documents/MobileGIS` (all app files and `icon.png` live here).

Starter mobile templates for field data collection built with React Native + Expo + TypeScript.

## Included

- Meter template (full mapped meter schema)
- Pole template mapped to Epicollect fields (`1_POLES` to `17_COMMENTS` + `LOCATION`)
- Switchgears template for switchgear asset capture
- Transformer template for transformer asset capture
- Basic required field validation
- In-session record list (recent captures)
- Fields for GPS coordinates

## Run

1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm run start`
3. Open on device/emulator with Expo.

## Suggested next steps

- Add persistent local storage (SQLite/AsyncStorage)
- Add camera/photo attachment for meter evidence
- Add offline sync queue to backend API
- Add authentication and role-based access
