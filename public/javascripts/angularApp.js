var app = angular.module('postit', ['ui.router']);

app.factory('posts', ['$http', function($http) {
  var o = {
    posts: []
  };

  o.get = function(id) {
    return $http({
      method: 'GET',
      url: '/posts/' + id
    }).then(function(res){
      return res.data;
    });
  };

  o.getAll = function() {
    return $http({
      method: 'GET',
      url: '/posts'
    }).success(function(data){
      angular.copy(data, o.posts);
    });
  };

  o.create = function(post) {
    return $http({
      method: 'POST',
      url: '/posts',
      data: {post: 'post'}
    }).success(function(data) {
      o.posts.push(data);
    });
  };

  o.upvote = function(post) {
  return $http({
    method: 'PUT',
    url: '/posts/' + post._id + '/upvote'
  })
    .success(function(data){
      post.upvotes += 1;
    });
  };

  o.addComment = function(id, comment) {
    return $http({
      method:'POST',
      url: '/posts/' + id + '/comments',
      data: {comment: 'comment'}
    });
  };

  o.upvoteComment = function(post, comment) {
    return $http({
      method: 'PUT',
      url: '/posts/' + post._id + '/comments/'+ comment._id + '/upvote'
    })
      .success(function(data){
        comment.upvotes += 1;
      });
  };
  return o;
}]);

app.controller('MainCtrl', [
  '$scope',
  'posts',
  function($scope, posts){
    $scope.test = 'Hello World';
    $scope.posts = posts.posts;
    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }
      posts.create({
        title: $scope.title,
        link: $scope.link,
      });
      $scope.title = '';
      $scope.link = '';
    };
    $scope.incrementUpvotes = function(post) {
      posts.upvote(post);
    };

  }]);

  app.controller('PostsCtrl', [
    '$scope',
    'posts',
    'post',
    function($scope, posts, post){
      $scope.post = post;

      $scope.addComment = function(){
        if($scope.body === '') { return; }
        posts.addComment(post._id, {
          body: $scope.body,
          author: 'user',
        }).success(function(comment) {
          $scope.post.comments.push(comment);
        });
        $scope.body = '';
      };
      $scope.incrementUpvotes = function(comment){
        posts.upvoteComment(post, comment);
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
          controller: 'MainCtrl',
          resolve: {
            postPromise: ['posts', function(posts){
              return posts.getAll();
            }]
          }
        })
        .state('posts', {
          url: '/posts/{id}',
          templateUrl: '/posts.html',
          controller: 'PostsCtrl',
          resolve: {
            post: ['$stateParams', 'posts', function($stateParams, posts) {
              return posts.get($stateParams.id);
            }]
          }
        });
        // .state('comments', {
        //   url: '/comments',
        //   templateUrl: '/comments.html',
        //   controller: 'MainCtrl'
        // });

      $urlRouterProvider.otherwise('home');
    }
  ]);
