var ridunApp = angular.module('ridun', ['ionic', 'ridun.controllers','ridun.services']);

ridunApp.run(function($ionicPlatform) {
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
});

ridunApp.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive

  // Each tab has its own nav history stack:
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tab.home', {
    url: '/home',
    views: {
      'header':{
        templateUrl: 'templates/head/home.html'
      },
      'tab-home': {
        templateUrl: 'templates/tab/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.category', {
      url: '/category',
      views: {
        'tab-category': {
          templateUrl: 'templates/tab/category.html',
          controller: 'CategoryCtrl'
        }
      }
    })

    //新品
    .state('tab.heart', {
      //cache: false,
      url: '/heart',
      views: {
        'tab-heart': {
          templateUrl: 'templates/tab/heart.html',
          controller: 'NewProductCtrl'
        }
      }
    })
                
    //商品详情
    .state('product-detail', {
      cache: false,
      url: '/product/:productId',
          templateUrl: 'templates/product/product-detail.html',
          controller: 'ProductDetailCtrl'
          //abstract:true
    })
    .state('search', {
      cache: false,
      url: '/search/:keyword',
      templateUrl: 'templates/product/product-list.html',
      controller:'SearchCtrl'
    })

    .state('limit', {
      url: '/limit',
      templateUrl: 'templates/product/single-list.html',
      controller:'LimitCtrl'
    })
    //图文详情
    .state('pic-detail', {
      url: 'pic/:picId',
      templateUrl: 'templates/product/pic-detail.html',
      controller: 'PicDetailCtrl'
    })
    //同类推荐
    .state('same-class', {
      cache: false,
      url: '/class/:classId',
      templateUrl: 'templates/product/same-class.html',
      controller: 'SameClassCtrl'
    })
    //用户评论
    .state('comment', {
      url: '/comment/:commentId',
      templateUrl: 'templates/product/comment.html',
      controller: 'CommentCtrl'
    })


    //个人中心
    .state('tab.person', {
      cache: false,
      url: '/person',
      views: {
        'tab-person': {
          templateUrl: 'templates/tab/person.html',
          controller: 'PersonCtrl'
        }
      }
    })

    .state('tab.cart', {
        //cache: false,
      url: '/cart',
      views: {
        'tab-cart': {
          templateUrl: 'templates/tab/cart.html',
          controller: 'CartCtrl'
        }
      }
    })

    .state('tab.product.hot', {
      url: '/product/hot',
      views: {
        'tab-heart': {
          templateUrl: 'templates/tab/heart.html',
          controller: 'NewProductCtrl'
        }
      }
    })

  //立即购买_订单
  .state('order', {
    cache: false,
    url: '/order/:productId/:cnt',
    templateUrl: 'templates/order/order.html',
    controller: 'OrderCtrl'
  })

  //购物车结算_订单
  .state('cart_order', {
    cache: false,
    url: '/cart_order',
    templateUrl: 'templates/order/order.html',
    controller: 'OrderCtrl'
  })

  //查询订单(所有)
  .state('all_order', {
    cache: false,
    url: '/all_order',
    templateUrl: 'templates/order/allOrders.html',
    controller: 'QueryOrderCtrl'
  })

  //查询订单(分类)
    .state('state_order', {
      cache: false,
      url: '/state_order/:state',
      templateUrl: 'templates/order/queryOrder.html',
      controller: '_QueryOrderCtrl'
    })

  //地址列表
    .state('address', {
      cache: false,
      url: '/address',
      templateUrl: 'templates/order/address.html',
      controller: 'AddressCtrl'
    })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});




var appControllers = angular.module('ridun.controllers', []);

var services = angular.module('ridun.services', []);
