var host ='http://58.220.249.174:8088/API/';
//var host ='http://192.168.88.104:8080/API/';
var API = {
  url:function(key){
    return host+key;
  }
};

services.service('proxy',['$http','$filter',function($http,$filter){
  return {
    get:function(url,callback){
      $http.get(API.url(url)).error($filter('errorHttp'))
          .success(function(data) {
            if($filter('errorHandler')(data)) return;
            callback(data);
          });
    },
    post:function(url,params,callback){
      $http.post(API.url(url),params).error($filter('errorHttp'))
          .success(function(data) {
            if($filter('errorHandler')(data)) return;
            callback(data);
          });
    }
  };
}]);

/*操作local storeage 的工具服务*/
services.service('Ds',function(){
  var _store = window.localStorage;
  return {
    has:function(_key){
      //localStorage();
      return null !== _store.getItem(_key);
    },
    clear:function(){
      _store.clear();
    },
    set:function(_key,_value){
      var item = {};
      item.type = typeof(_value);
      item.content = _value;
      _store.setItem(_key, JSON.stringify(item));
    },
    get:function(_key){
      var item = JSON.parse(_store.getItem(_key));

      return item.content;
    },

    remove:function(_key) {
      _store.removeItem(_key);
    },
    clear: function () {
      _store.clear();
    }
  };
});

services.service('Index',[ '$rootScope', 'proxy','$filter',function($rootScope,proxy ,$filter) {
  var service = {
    data : [],
    brand:[],
    get:function(){
      proxy.get('index',function(data){
        var list = data.content;
        list = $filter('indexFilter')(list);
        service.data = list;
        $rootScope.$broadcast( 'index.ready' );
      });
    },
    opinion:function(opinion){
      var truename = encodeURIComponent(encodeURIComponent(opinion.truename)) ;
      var content = encodeURIComponent(encodeURIComponent(opinion.content)) ;
      proxy.get('comment/message?username='+truename+"&tel="+opinion.phone+"&content="+content,function(data){
        $rootScope.$broadcast( 'opinion.posted', data.code);
      });
    },
    book:function(book){
      var truename = encodeURIComponent(encodeURIComponent(book.truename)) ;
      var content = encodeURIComponent(encodeURIComponent(book.content)) ;
      proxy.get('comment/message?username='+truename+"&tel="+book.phone+"&content="+content,function(data){
        $rootScope.$broadcast( 'book.posted', data.code);
      });

    },
    getBrand:function(){
      proxy.get('products/brand/group',function(data){

        var list = data.content;
        $filter('imgFilter')(list);
        service.brand = list;
        $rootScope.$broadcast( 'brand.ready' );
      });
    }
  }
  return service;
}]);


services.service( 'Product', [ '$rootScope', '$http','$filter',function( $rootScope,$http ,$filter) {
  var service = {
    productList : [],
    query:function(condition){
      $http.get(API.url('products/search?'+condition))
          .success(function(data) {
            service.productList = data.content;
            $filter('imgFilter')(service.productList);
            $rootScope.$broadcast( 'product.found' );
          });
    }
  }
  return service;
}]);

services.service( 'Category', [ '$rootScope','$filter','proxy',function( $rootScope ,$filter,proxy) {
  var service = {
    categoryList: [],
    query: function () {
      proxy.get('products/calss', function (data) {
        if (data.content != null) {
          service.categoryList = data.content[0];
          $rootScope.$broadcast('category.init')
        }
      });
    }
  };
  return service;
}]);

services.service( 'Cart', [ '$rootScope','$filter','proxy',function( $rootScope ,$filter,proxy) {
  var service = {
    goods : [],
    query:function(userid){
      proxy.get('myCart?userid='+(userid),function(data){
        if(data.content != null){
          service.goods = data.content;
          $filter('imgFilter')(service.goods);
          $rootScope.$broadcast( 'cart.init' )
        }
      });
    },
    add:function(pid,pnum,userid){
      proxy.get('addCart?userid='+(userid)+'&shopid='+pid+'&shopnum='+pnum,function(data){
        if(data.code==0){
          $rootScope.$broadcast('cart.add.ok');
        }else{
          $rootScope.$broadcast('cart.add.error');
        }
      });
    },
    modify:function(pid,pnum,userid){
      proxy.get('modifyCart?userid='+(userid)+'&shopid='+pid+'&shopnum='+pnum,function(data){
        if(data.code==0){
          $rootScope.$broadcast( 'cart.modify.ok' );
        }else{
          $rootScope.$broadcast( 'cart.modify.error' );
        }
      });
    }
    ,
    clear:function(userid){
      proxy.get('modifyCart?userid='+(userid)+'&shopid=-1&shopnum=-1',function(data){
        if(data.code==0){
          $rootScope.$broadcast( 'cart.modify.ok' );
        }else{
          $rootScope.$broadcast( 'cart.modify.error' );
        }
      });
    }
  }
  return service;
}]);



services.service( 'Search', [ '$rootScope','$filter','proxy',function( $rootScope ,$filter,proxy) {
  var service = {
    productList : [],
    search:function(condition){
      var params = '';
      for(var k in condition){
        params+=('&'+k+'='+condition[k]);
      }
      if(condition.type<5){
        (function(params,order_type){
          proxy.get('products/search?foo=1'+params,function(data){
            var list = data.content;
            $filter('imgFilter')(list);
            service.productList = list;
            $rootScope.$broadcast( 'search.ready',order_type );
            $rootScope.$broadcast('scroll.infiniteScrollComplete');
          });
        })(params,condition.order_type);
      }else if(condition.type == 5){
        (function(params,order_type){
          proxy.get('products/brands?foo=1'+params,function(data){
            var list = data.content;
            $filter('imgFilter')(list);
            service.productList = list;
            $rootScope.$broadcast( 'search.ready',order_type );
            $rootScope.$broadcast('scroll.infiniteScrollComplete');
          });
        })(params,condition.order_type);
      }
    },
    limit:function(){
      proxy.get('products/flashSale',function(data){
        var list = data.content;
        $filter('imgFilter')(list);
        service.productList = list;
        $rootScope.$broadcast( 'limit.ready' );
      });
    },
    clear:function(){
      $rootScope.$broadcast( 'clearSearch' );
    }

  }
  return service;
}]);
