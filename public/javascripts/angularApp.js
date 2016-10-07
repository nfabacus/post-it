var app = angular.module('postit', ['ui.router']);

app.factory('posts', ['$http', function($http) {
  var o = {
    posts: [
      {
        title: "Hello World Title",
        link: "www.helloworld.com",
        upvotes: 5,
        comments: [
          {author: 'Noby', body: 'Cool post!', upvotes: 0},
          {author: 'Giancarlo', body: 'Great idea but everything is wrong!', upvotes: 0}
        ]
      },
      {
        title: "My note",
        link: "www.mynote.com",
        upvotes: 5,
        comments: [
          {author: 'Tony', body: 'What do you think?', upvotes: 0},
          {author: 'Jim', body: 'It is fine!', upvotes: 0}
        ]
      },
      {
        title: "My item",
        link: "www.item.com",
        upvotes: 5,
        comments: [
          {author: 'Noby', body: 'Hahaha!', upvotes: 0},
          {author: 'Giancarlo', body: 'Great idea! ', upvotes: 0}
        ]
      }
    ]
  };
  return o;
}]);

app.service('postservice', ['$http', 'posts', function($http, posts) {

  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  }
}]);


app.controller('MainCtrl', [
  '$scope',
  'posts',
  function($scope, posts){
    $scope.test = 'Hello World';

    $scope.posts = posts.posts;

    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [
          {author: 'Joe', body: 'Cool post!', upvotes: 0},
          {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
        ]
      });
      $scope.title = '';
      $scope.link = '';
    };
    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };
  }]);

  app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',
    function($scope, $stateParams, posts){
      $scope.post = posts.posts[$stateParams.id];
      $scope.addComment = function(){
        if($scope.body === '') { return; }
        $scope.post.comments.push({
          body: $scope.body,
          author: 'user',
          upvotes: 0
        });
        $scope.body = '';
      };
      $scope.incrementUpvotes = function(comment) {
        comment.upvotes += 1;
      };
    }
  ]);

  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: '/home.html',
          controller: 'MainCtrl'
          resolve: {
            postPromise: ['posts', function(posts){
              return posts.getAll();
            }]
          }
        })
        .state('posts', {
          url: '/posts/{id}',
          templateUrl: '/posts.html',
          controller: 'PostsCtrl'
        })
        .state('comments', {
          url: '/comments',
          templateUrl: '/comments.html',
          controller: 'MainCtrl'
        });
      $urlRouterProvider.otherwise('home');
    }
  ]);
