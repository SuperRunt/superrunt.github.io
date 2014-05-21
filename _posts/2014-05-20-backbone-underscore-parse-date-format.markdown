---
layout: post
title:  "Underscore.js date formatting for HTML5 calendars"
date:   2014-05-20 21:44:46
categories: underscore javascript backbone parse HTML5
short: "Format dates to play nice with HTML5 date input calendar, and still look nice to the user."
summary: "The HTML5 date input field displays the date according to the user's locale settings, but requires the use of ISO yyyy-mm-dd format to be set as
          the value. In addition, I was converting a string into a input field, so I needed my date string to be consistent with the
          string that the input field generates."
---

I recently built a website to support an app I built, and the app uses Parse.com for data storage. I used the Parse JS API
for the website, and that API is an extension of BackboneJS, so I went with that and used underscore templates. This isn't
quite as slick as AngularJS, but I didn't really need to worry about dependency injection and scopes much, so it made sense to go
with the JS API instead of the REST API.

<div style="width: 100%;" class="clearfix">
    <img class="pull-left" style="width: 45%" src="/assets/img/posts/tableview.png">
    <img class="pull-left" style="width: 45%" src="/assets/img/posts/calendarview.png">
</div>

I wanted to display a list of trip entries (the app is a mileage log), that could be individually edited. Now the problem is that the
date input field displays the date according to the user's locale settings, but requires the use of ISO yyyy-mm-dd format to be set as
the value. In addition, I was converting a string into a input field, so I needed my date string to be consistent with the
string that the input field generates. Turns out it's not as complicated as it sounds.

The JSON object I get sent back from Parse.com looks like this:
{% highlight javascript %}
date: {__type:Date, iso:2014-05-19T00:00:00.000Z}
{% endhighlight %}

To get a date string that is consistent with the input field:
{% highlight javascript %}
_.template.formatdate = function (stamp) {
    var d = new Date(stamp.iso); // You could just pass in a regular timestamp here too
    return d.toLocaleDateString();
};
{% endhighlight %}

To get a value that works for the calendar:
{% highlight javascript %}
_.template.formatdatevalue = function (stamp) {
    var fragments = stamp.iso.split("T");
    return fragments[0];
};
{% endhighlight %}

If you're dealing with a different format you could do something like this:
{% highlight javascript %}
 _.template.formatdatevalue = function (stamp) {
     var isoStr = new Date(stamp).toISOString();
     var fragments = isoStr.split("T");
     return fragments[0];
 };
{% endhighlight %}

In the HTML it gets used like this:
{% highlight html %}
<td class="current"><%= _.template.formatdate(date) %></td>
<input type="date" value="<%= _.template.formatdatevalue(date) %>">
{% endhighlight %}

More info on the app [here](http://triptrax.focus-43.com/).