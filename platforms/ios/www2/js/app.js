var k2hApp = angular.module('k2h', ['ionic', 'k2h.controllers','k2h.services'])

var allCotrollers = angular.module('k2h.controllers',[]);

var allServices = angular.module('k2h.services',[]);

k2hApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider

          .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/sidemenu.html",
            controller:'SideMenuCtrl'
          })

          .state('app.main', {
            cache:false,
            url: "/main",
            views: {
              'menuContent': {
                templateUrl: "templates/main/main.html",
                controller: 'MainCtrl'
              }
            }
          })

          .state('app.favorite', {
            cache:false,
            url: "/favorite",
            views: {
              'menuContent': {
                templateUrl: "templates/foods/favorite.html",
                controller: 'FavoriteCtrl'
              }
            }
          })

          .state('app.menu', {
            cache:false,
            url: "/menu",
            views: {
              'menuContent': {
                templateUrl: "templates/menu/menu.html",
                controller:"MenuCtrl"
              }
            }
          })

          .state('app.address', {
              cache:false,
              url: "/address",
              views: {
              'menuContent': {
                templateUrl: "templates/address/address.html",
                controller: 'AddressCtrl'
              }
            }
          })

          .state('app.tickets', {
              cache:false,
              url: "/tickets",
              views: {
              'menuContent': {
                templateUrl: "templates/tickets/tickets.html",
                controller: 'TicketsCtrl'
              }
            }
          })

          .state('app.setting', {
              cache:false,
              url: "/setting",
              views: {
              'menuContent': {
                templateUrl: "templates/setting/setting.html",
                controller: 'SettingCtrl'
              }
            }
          })

          .state('app.restaurant', {
              url: "/restaurant",
              views: {
                  'menuContent': {
                      templateUrl: "templates/restaurant/restaurant.html",
                      controller: 'ResCtrl'
                  }
              }
          })

          .state('app.foods', {
              url: "/foods",
              views: {
                  'menuContent': {
                      templateUrl: "templates/foods/foods.html",
                      controller: 'FoodsCtrl'
                  }
              }
          })

          .state('app.details', {
              url: "/details/:restaurantID",
              views: {
                  'menuContent': {
                      templateUrl: "templates/restaurant/details.html",
                      controller: 'DetailCtrl'
                  }
              }
          })

          .state('app.message', {
              cache:false,
              url: "/message/:uid",
              views: {
                  'menuContent': {
                      templateUrl: "templates/main/message.html",
                      controller: 'MsgCtrl'
                  }
                 
              }
          })

          .state('guide', {
              url: "/guide",
              templateUrl: "templates/guide/guide.html",
              controller: 'GuideCtrl'
          })


          .state('search', {
              url: "/search",
              templateUrl: "templates/main/search.html",
              controller: 'SearchCtrl'
          })

      ;
        var _store = window.localStorage;
        var guide = _store.getItem('guide');
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise(guide?'app/main':'guide');
    });
