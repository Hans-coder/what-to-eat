# Changelog

All notable changes to this project will be documented in this file.

## [v1.2.0] - 2025-12-04

### Added
- **Open Now Filter**: Added a toggle in the Filter Drawer to show only currently open restaurants.
- **API Update**: Integrated `openNow` parameter into the recommendation API.

## [v1.1.0] - 2025-12-04

### Added
- **Cuisines Filter**: Added a new "Food Type" selector in the Filter Drawer with options like Japanese, Korean, Hot Pot, etc.
- **Search Optimization**: Increased the number of search keywords to improve restaurant discovery.
- **Eaten Indicator**: Added a visual "Recently Eaten" badge to restaurant cards.

### Changed
- **Budget Labels**: Updated budget filter labels to show estimated price ranges (e.g., "$ (<$200)").
- **Eaten Logic**: "Eaten" restaurants are now deprioritized (moved to the bottom) instead of being completely excluded.

## [v1.0.0] - 2025-12-02

### Added
- **Orange Cat Persona**: Implemented a distinct "Orange Cat" personality for the AI, including tone, emojis, and loading animations.
- **Budget Filter**: Added budget range selector ($-$$$$) aligned with Google Maps price levels.
- **Location Search**: 
    - Integrated Google Places Autocomplete.
    - Added "Current Location" button.
    - Implemented fallback to Geocoding API for manual input.
- **Filter Drawer**: 
    - Created a slide-up drawer for filters.
    - Added distance radius selector (500m - 5km).
    - Added ability to save filters as default.
- **Sidebar & Bookmarking**:
    - Added "Wishlist" (❤️) feature.
    - Added "Eaten" (✅) feature with 7-day history tracking.
    - Implemented Sidebar to view and manage lists.
    - Integrated LocalStorage for data persistence.
- **UI Improvements**:
    - Fixed bottom content spacing.
    - Aligned chat input and buttons.
    - Enhanced restaurant card design with bookmark buttons.

### Fixed
- Resolved manual location input issues.
- Fixed UI alignment in the chat interface.

### Technical
- Migrated to `gemini-2.0-flash-exp` model.
- Configured Vercel deployment settings.
