# Umuganda Community Waste Management

A Kigali-focused prototype for community waste collection, reporting, recycling, and environmental education. The React application is in [`waste-management/`](waste-management/).

## Run locally

```bash
cd waste-management
npm install
npm run dev
```

Vite prints the local URL when the development server starts. To verify the production build and lint checks:

```bash
cd waste-management
npm run build
npm run lint
```

## Included workflows

- Community dashboard with collection activity and impact indicators
- Collection schedule, pickup requests, and collector status updates
- Waste reports with optional photos, search, status filters, and resolution tracking
- Kigali recycling map and sample collection-point directory
- Waste-sorting guidance for plastic, paper, glass, metal, organic, and general waste
- Notifications and CSV export for community reports

## Prototype notes

The app stores activity in the current browser using local storage. Role selection demonstrates member, collector, and administrator views; it is not authentication or access control. Seeded activity, impact figures, and recycling locations are illustrative and should be replaced with verified community data. The map uses OpenStreetMap and needs an internet connection.