# Changelog

## [4.7.2] - 2023-05-06

### Fixed

- Fixed missing type exports (#97)

## [4.7.1] - 2023-03-15

### Added

- `useRequestHandler` allows you to dynamically handle every invoked request (#95) - by @rubenduiveman (#95)

## [4.6.3] - 2023-03-15

### Added

- `useRequestHandler` allows you to dynamically handle every invoked request (#95) - by @rubenduiveman (#95)

## [4.7.0] (Beta 2) - 2022-11-12

### Added

- Added (empty) default objects for configuration per HTTP verb (#88) - by @CezarManea (#89)

### Other

- Bumped dependencies (Jest 29)

## [4.7.0] (Beta 1) - 2022-09-01

### Fixed

- Using `Promise.reject` in interceptors triggers `UnhandledPromiseRejection` (#87)

### Changed

- Calling `MockAxios.reset()` now resets interceptors as well

### Other

- Updated dependencies (Jest 28)

## [4.6.2] - 2022-11-12

### Added

- Added (empty) default objects for configuration per HTTP verb (#88) - by @CezarManea (#89)

## [4.6.1] - 2022-04-13

### Changed

- Revert "Experimental support for native ESM" (#83)

## [4.6.0] - 2022-04-13

### Changed

- Experimental support for native ESM (#79)

### Added

- Interceptors are applied now (#82 by @yarilchenko)

## [4.5.0] - 2021-12-05

### Added

- Added support for passing `params` in `getReqMatching` (with support from @kylorhall, #77)

## [4.4.1] - 2021-09-28

### Other

- Updated dependencies (Jest 27)

## [4.4.0] - 2021-04-18

### Added

- Added `getReqByRegex` by @Victorcorcos

### Other

- Updated dependencies

## [4.3.0] - 2021-02-05

### Added

- Added mock for `isAxiosError` by @mAAdhaTTah (#66)
- Errors passed to `mockError` wil now have `isAxiosError` attached by @mAAdhaTTah (#66)

### Other

- Updated dependencies

## [4.2.1] - 2020-07-21

### Fixed

- Add mock for `interceptors.eject` by @webbushka

### Changed

- Ignore case when matching HTTP methods by @Chris-Thompson-bnsf

## [4.2.0] - 2020-06-04

### Breaking

- `throwIfRequested` in `CancelToken` now actually throws if requested (not surprising, so not "really" breaking)

### Added

- Added `getReqByMatchUrl` (!52) by @niltonvasques
- Expose pending requests as `queue` (!52) by @niltonvasques

### Fixed

- Fixed some bugs regarding to the cancel implementation

## [4.1.0] - 2020-05-22

### Added

- Support `axios(url, [config])` syntax

## [4.0.0] - 2020-04-28

### Changed

- Using `.cancel` in the code to test now actually cancels (i.e. rejects) the axios call / promise.

### Removed

- The signatures of `get`, `delete`, `head`, and `options` now align with these of axios, meaning that the third argument (used to be `data`) has been removed.

## [3.2.0] - 2019-12-08

### Added

- Added `mockResponseFor` and `getReqMatching` to support more sophisticated request-responding (#43 by @ThiefMaster)

### Other

- Updated dependencies

## [3.1.2] - 2019-10-26

### Other

- Update dependencies

## [3.1.1] - 2019-09-07

### Fixed

- Fixes an upstream bug in `synchronous-promise` where `finally` would be called too early (#38)

## [3.1.0] - 2019-07-29

### Changed

- We switched the library for synchronous promises from `jest-mock-promise` to `synchronous-promise`. This offers us:
  - Support for `finally` (#35)
  - Better handling of `.catch` (#17)

- The error object used for `mockError` is now passed directly to `catch` / `reject` instead of being cloned beforehand (#14) (Breaking)


### Removed

- You can no longer pass the return value of `then` and `catch` to `lastPromiseGet`. This was an undocumented feature. Use the promise directly instead.

## [3.0.0] - 2019-04-27

### Added

* Allow specifying requests to respond to (#1) - see README
* Provide mocked cancellation (#30, #32), thanks @VanTanev 

### Changed

* Make interface methods non-optional in typings


## [2.4.0] - 2019-04-08

### Added

-  Add support for setting default common headers (#16)

### Changed

- Throw more descriptive error messages when trying to respond to no request as described in #3  (throwing an error can be disabled totally by passing a new, third argument `silentMode` to `mockResponse` and `mockError`)
- Improve type definitions (#25)

### Docs

- Improved docs (#26)

## [2.3.0] - 2019-03-19

### Added
- Add basic support for interceptors (#5, #23)
- Add support for more methods (`patch`, `head`, `options`) (#11, #12)
- Add support for `axios.all` (#21)

### Fixed
- Fix typescript declarations (#10, #15)

### Other
- Fix various README typos (#22)
- Migrate internal build process from webpack to typescript (#10)
