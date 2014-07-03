---
layout: post
title:  "Parse.com Cloud Code example"
date:   2014-05-28 21:44:46
categories: javascript parse
short: "Parse Cloud Code let's you do the heavy lifting on the(ir) server side"
summary: "Parse.com is a good option for storing and serving data in an app. Of course,
you'll need more than just storage and delivery of data from an API, to avoid doing a lot of work in
the browser/app. With Cloud Code Parse solves that problem, and it's very easy to use."
---
[Parse.com](http://parse.com) is a good option for storing and serving data in an app. Of course,
you'll need more than just storage and delivery of data from an API, to avoid doing a lot of work in
the browser/app. With Cloud Code Parse solves that problem, and it's very easy to use.

You need to install the Parse command line tool, but that's fast and easy. Then you just
cd into your app's directory (locally) and fire off a
{% highlight bash %}
$ parse new SomeCloudCode
{% endhighlight %}
You'll be asked for your username and password, and you'll also choose which app this code is
related to. A directory called SomeCloudCode gets created in your app directory, with several files
in it. The only one you need to worry about for the easy stuff is cloud/main.js, where you
add the code you want to run on the server. Deploying is a snap with
{% highlight bash %}
$ parse deploy
{% endhighlight %}

As an example, I'll share some code I wrote for the [TripTrax](http://triptrax.focus-43.com) app. I
need to get a user's total mileage driven, and don't want to cycle through a ton of entries and
do that calculation in the browser or in the iPhone app. So I wrote this code and deployed it to
Cloud Code:

{% highlight javascript %}
Parse.Cloud.define("totalMileage", function( request, response ) {
  var user = new Parse.User();
  user.id = request.params.userid;
  var query = new Parse.Query("Trip");
  query.include('user');
  query.equalTo("user", user);
  query.find({
    success: function(results) {
      var sum = 0;
      for ( var i = 0; i < results.length; ++i ) {
        sum +=  results[i].get("end") - results[i].get("start") ;
      }
      response.success( sum );
    },
    error: function() {
      response.error("trip lookup failed");
    }
  });
});
{% endhighlight %}

Note the use of
{% highlight javascript %}
query.include('user');
{% endhighlight %}

This is because the Parse database stores pointers as objects, so you can't compare a
string (even if it's JSON) to an object with query.equalTo(). When you need to search by pointer column,
use query.include('objectToSearchBy'). Now you can compare your object to a database pointer.

To use the cloud method, you use Parse.Cloud.run():
{% highlight javascript %}
Parse.Cloud.run('totalMileage', { userid: user.id }, {
  success: function (result) {
    console.log(result);
  },
  error: function (error) {
    console.log(error);
  }
});
{% endhighlight %}

More info over at the [Parse docs](http://parse.com/docs/cloud_code_guide).

It might also be worth mentioning that I use this inside my save and destroy functions, and
get the user id from the data Parse returns on successful execution on the server side. Here's
an abbreviated example:
{% highlight javascript %}
this.model.destroy({
  wait: true,
  success: function ( data ) {
      Parse.Cloud.run('totalMileage', { userid: data.attributes.user.id }, {});
  },
  error: function ( error ) {
      console.log( error );
  }
});
{% endhighlight %}
