angular.module('brdr', ['ionic', 'brdr.directives', 'brdr.controllers', 'brdr.services'])

.run(function($ionicPlatform, $ionicPopup, $rootScope, $state, Auth) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.$on('$stateChangeStart', function(ev, nuevoState, nuevoStateParams, actualState) {
      if(nuevoState.data !== undefined && nuevoState.data.requireAuth === true) {
        if(!Auth.isLogged()) {
          ev.preventDefault();
          $state.go('login');
        }
      }
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('registro', {
    url: '/registro',
    templateUrl: 'templates/registro.html',
    controller: 'RegistroCtrl'
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.feed', {
    url: '/feed',
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-feed.html',
        controller: 'FeedCtrl'
      }
    }
  })

    .state('tab.comentarios', {
      url: '/feed/:id',
      views: {
        'tab-feed': {
          templateUrl: 'templates/comentarios.html',
          controller: 'ComentarioCtrl'
        }
      }
    })

    .state('tab.editar', {
      url: '/detalle/:id',
      views: {
        'tab-feed': {
          templateUrl: 'templates/tab-editar.html',
          controller: 'EdicionCtrl'
        }
      }
    })

  .state('tab.new', {
    url: '/new',
    data: {
      requireAuth: true
    },
    views: {
      'tab-new': {
        templateUrl: 'templates/tab-new.html',
        controller: 'NewCtrl'
      }
    }
  })

  .state('tab.profile', {
    url: '/profile',
    data: {
      requireAuth: true
    },
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.feedamigos', {
    url: '/feedamigos',
    data: {
      requireAuth: true
    },
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-feed.html',
        controller: 'FeedAmigosCtrl'
      }
    }
  })

  .state('tab.user', {
    url: '/user/:id',
    data: {
      requireAuth: true
    },
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'UserCtrl'
      }
    }
  })

  .state('tab.fav', {
    url: '/fav',
    data: {
      requireAuth: true
    },
    views: {
      'tab-fav': {
        templateUrl: 'templates/tab-fav.html',
        controller: 'FavCtrl'
      }
    }
  })

  .state('tab.mensajes', {
    url: '/mensajes',
    data: {
      requireAuth: true
    },
    views: {
      'tab-mensajes': {
        templateUrl: 'templates/tab-mensajes.html',
        controller: 'MensajesCtrl'
      }
    }
  })

    .state('tab.amigos', {
      url: '/amigos',
      data: {
        requireAuth: true
      },
      views: {
        'tab-mensajes': {
          templateUrl: 'templates/tab-amigos.html',
          controller: 'AmigosCtrl'
        }
      }
    })

    .state('tab.chat', {
      url: '/mensajes/:id',
      data: {
        requireAuth: true
      },
      views: {
        'tab-mensajes': {
          templateUrl: 'templates/tab-chat.html',
          controller: 'ChatCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/feed');

}).constant('API_SERVER', '/BRDR/public/api')
.constant('IMAGE_FOLDER', '/BRDR/public/images/');
angular.module('brdr.directives', []);