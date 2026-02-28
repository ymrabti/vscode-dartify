# Change Log

All notable changes to the "DARTIFY: JSON to DART data model" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.1] - 2026-02-28
- Fixed a critical bug in the Flutter Forms generation logic that caused incorrect form field types for certain JSON structures.

## [1.0.0]
### Added
- Added comprehensive unit test suite covering core JSON parsing logic, Dart code generators, and utility functions.
- Introduced `npm run test:unit` script for rapid Mocha-based testing.
### Changed
- Ongoing improvements and bug fixes.

`2026-02-27`

## [0.4.4]
### Added
- Advanced generation of Flutter Forms (Creation/Edition).
- Generation of separate or combined Dart files based on user preference.
- Enum and Extensions generation from JSON values.
- Automatic extraction of Flutter project name from `pubspec.yaml` to configure imports.
- View and State class generation for robust state management.
- CopyWith, toJson, fromJson, toString, equals, and hashCode generator algorithm optimized.
- Seamless multi-file generation with auto-linking of imports and models.

### Changed
- Improved nested class handling and null-safety implementation.

## [0.1.0] - Initial release
- Initial capability to convert JSON objects/arrays to Dart data models seamlessly.
