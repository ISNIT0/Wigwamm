# RightMove-Scraper
Easily Scrape RightMove property data

4 Methods:
* byOutcode( string Outcode e.g. 'SW10' ) - Lists first 9999 properties within location provided (SW10)
* detail( string RightMove Id e.g. '51307463' ) - Provides details for provided zoopla property
* areaDetail( string Outcode e.g. 'SW10' )
* rmLocIdentFromOutcode( string Outcode )


```javascript
var RightMove = require('rightmove-scraper')

RightMove.areaDetail('HP13');
/*
{ radius: 0,
  eastLongitude: -0.6996200439622849,
  westLongitude: -0.7882962665350367,
  northLatitude: 51.657015732050226,
  southLatitude: 51.61367094930743,
  searchableLocation: 
   { identifier: 'OUTCODE^1081',
     name: 'HP13',
     centreLatitude: 51.63744498337863,
     centreLongitude: -0.7429532398875729 },
  localHomepages: 
   [ { name: 'Find removal companies',
       identifier: 94771,
       updateDate: 1417690833000,
       homepageImageUrl: 'http://media.rightmove.co.uk/banners/m_removals_dec2014.jpg',
       billboardImageUrl: null,
       apiParametersForPageData: {},
       mobileApplicationPage: 'WEBPAGE_INTERNAL',
       originalDestinationUrl: 'http://www.rightmove.co.uk/removals.html',
       rightmoveAd: true,
       isForRequestedLocation: false },
     { name: 'Sign up for Instant Alerts',
       identifier: 94768,
       updateDate: 1417690831000,
       homepageImageUrl: 'http://media.rightmove.co.uk/banners/m_instantalerts_dec2014.jpg',
       billboardImageUrl: null,
       apiParametersForPageData: {},
       mobileApplicationPage: 'REGISTER',
       originalDestinationUrl: 'https://www.rightmove.co.uk/register.html',
       rightmoveAd: true,
       isForRequestedLocation: false } ],
  numReturnedResults: 0,
  totalAvailableResults: 141,
  cacheTimeout: 15,
  transactionTypeId: 1,
  properties: [],
  createDate: 1429371129504,
  result: 'SUCCESS' }
*/

RightMove.byOutcode('HP13');
/*
[{ identifier: 51162527,
    visible: true,
    price: 227500,
    priceQualifier: 'Guide Price',
    shouldShowPrice: true,
    bedrooms: 2,
    address: 'High Wycombe, Buckinghamshire',
    summary: 'Situated in a development this modern to bedroom apartment is an ideal investment opportunity and is available with current tenants.',
    exactLocationAvailable: true,
    latitude: 51.62635872516048,
    longitude: -0.732135474957837,
    showMap: true,
    propertyType: 'flat',
    development: false,
    updateDate: 1429368130000,
    sortDate: 1426369639000,
    autoEmailReasonType: 'new',
    transactionTypeId: 1,
    status: null,
    dateShortlisted: null,
    photoThumbnailUrl: 'http://media.rightmove.co.uk/31k/30458/30458_1679416_IMG_00_0001.jpg',
    photoLargeThumbnailUrl: 'http://media.rightmove.co.uk/dir/31k/30458/51162527/30458_1679416_IMG_00_0001_max_656x437.jpg',
    photoCount: 10,
    floorplanCount: 1,
    branch: 
     { identifier: 30458,
       name: 'High Wycombe',
       brandName: 'Chancellors',
       development: false,
       address: '2 Crendon Street,\r\nHigh Wycombe,\r\nHP13 6LW',
       updateDate: 1426568406000,
       branchLogo: 'http://media.rightmove.co.uk/brand/brand_rmchoice_logo_12284_0002.jpeg',
       largeBranchLogo: 'http://media.rightmove.co.uk/brand/brand_logo_12284_0002.jpeg',
       brandPlusResale: true,
       brandPlusLettings: false,
       hideReducedPropsFlag: false },
    premiumDisplay: false,
    showStreetView: true,
    orderFromServer: 99 } ... ]
*/

RightMove.detail('51307463');
/*
{ property:
   { identifier: 51307463,
     visible: true,
     price: 500000,
     priceQualifier: 'O.I.R.O',
     shouldShowPrice: true,
     bedrooms: 14,
     address: 'COURT LANE, Birmingham, B23',
     summary: 'Lettings & Sales are pleased to bring to the market a development site currently comprising 3 x 3 storey properties converted into flats but in need of a major overall.',
     exactLocationAvailable: true,
     zoomLevel: 15,
     latitude: 52.531982316432426,
     longitude: -1.8478245763683494,
     showMap: true,
     propertyType: 'detached house',
     development: false,
     updateDate: 1427188881000,
     sortDate: 1427135948000,
     autoEmailReasonType: 'new',
     transactionTypeId: 1,
     status: null,
     dateShortlisted: null,
     photos:
      [ [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object] ],
     photoThumbnailUrl: 'http://media.rightmove.co.uk/86k/85465/85465_CourtLane_IMG_00_0000.jpg',
     photoLargeThumbnailUrl: 'http://media.rightmove.co.uk/dir/86k/85465/51307463/85465_CourtLane_IMG_00_0000_max_656x437.jpg',
     photoCount: 6,
     floorplanCount: 0,
     branch:
      { identifier: 85465,
        name: 'Birmingham',
        brandName: 'Lettings & Sales Limited',
        development: false,
        address: '163 Gravelly Lane,\r\nErdington,\r\nBirmingham,\r\nB23 6LT',
        updateDate: 1419415975000,
        branchLogo: 'http://media.rightmove.co.uk/company/clogo_rmchoice_30484_0000.jpeg',
        largeBranchLogo: 'http://media.rightmove.co.uk/company/clogo_30484_0001.jpeg',
        brandPlusResale: true,
        brandPlusLettings: true,
        hideReducedPropsFlag: false },
     premiumDisplay: false,
     showStreetView: true,
     floorplans: [],
     epcs: [],
     epcGraphs: [],
     mobileVirtualToursUrl: 'http://www.rightmove.co.uk/property-for-sale/mobile-virtualtour/property-51307463.html',
     mobileStreetViewUrl: 'http://www.rightmove.co.uk/apps/streetview.html?propertyId=51307463',
     mobilePropertyMapViewUrl: 'http://www.rightmove.co.uk/apps/property-mapview.html?propertyId=51307463',
     mobileVirtualToursNum: 0,
     features:
      [ [Object],
        [Object],
        [Object],
        [Object] ],
     agentRef: 'CourtLane',
     fullDescription: 'Lettings & Sales are pleased to bring to the market a development site currently comprising 3 x 3 storey properties converted into flats but in need of a major overall. The properties also come with a plot that could be a 3-4 bedroom detached house with a president set with next door already been developed. The plot is Freehold and can offer great potential either as a number of room let properties and selling off the plot to the rear or develop the site as a whole this is all of course subject to planning permission. \r<br />\r<br />Location: The property is located on Court Lane  in between Robert Avenue and Madehurst Road. The property is close to both Gravelly Lane and Chester Road and is in a good location for development. \r<br />\r<br />Viewings: Via the office on 0121 603 2727\r<br />\r<br />Tenure: We are advised by the owner the property is FREEHOLD this will need to be confirmed with your own solicitor. \r<br />\r<br />Current Arrangement: The property is currently converted into the following 100 = 2 flats 102 = 5 flats 104 = 5 flats \r<br />',
     publicsiteUrl: 'http://www.rightmove.co.uk/property-for-sale/property-51307463.html',
     soldPricesUrl: 'http://www.rightmove.co.uk/house-prices/detail.html?locationIdentifier=POSTCODE%5E17643&referrer=propertyDetails&referrerPropertyId=51307463',
     tenureType: 'Freehold',
     letFurnishType: null,
     telephoneNumber: '0121 396 0762',
     outcode: 'B23',
     googleAnalyticsLabel: 'detached 14 beds',
     stations: [ [Object], [Object], [Object] ],
     showLettingFeesMessage: false },
  createDate: 1429371032755,
  result: 'SUCCESS' }
*/
```
