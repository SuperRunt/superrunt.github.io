---
layout: post
title:  "AngularJS date range handling"
date:   2014-05-07 21:44:46
categories: angularjs javascript bower
short: "Date range directive for angular-strap datepicker. This directive lets you compare two angular-strap datepicker fields, for use when you have a to- and from-date in same scope."
summary: "This directive lets you compare two angular-strap datepicker fields, for use when you have a to- and from-date in same scope. This directive observes the from-date. The datepicker minDate will always be set to the from-date + 1 day. If the from-date gets set to after the to-date, the to-date gets updated to from-date + 1 day. If the to-date is updated by the directive, the field 'flashes' to alert the user to this update. "
---
This directive lets you compare two angular-strap datepicker fields, for use when you have a to- and from-date in same scope.

This directive observes the from-date. The datepicker minDate will always be set to the from-date + 1 day. If the from-date gets set to after the to-date, the to-date gets updated to from-date + 1 day. If the to-date is updated by the directive, the field 'flashes' to alert the user to this update.

Easily implemented by adding laterthan="{ { fromDate } }" to the to-date form field together with the bs-datepicker directive. If you would like to add a class to the form field that gets automatically updated, you can add it with changedclass="". I like to pulse the border in a different color. You can see an example of that in the [github repo](https://github.com/SuperRunt/angular-strap-daterange).

{% highlight html %}
<input type="text" class="form-control date" readonly="true" ng-model="searchParams.fromDate" data-min-date="today" bs-datepicker required />
<input type="text" class="form-control date" readonly="true" ng-model="searchParams.toDate" data-min-date="{ { toMinDate } }" laterthan="{ { searchParams.fromDate } }" changedclass="changeAlert" bs-datepicker required />
{% endhighlight %}

Bower install:
{% highlight bash %}
bower install angular-strap-daterange
 {% endhighlight %}
<br>
<strong>Update 7/3/2014: The updated bower package (v1.1.3) supports angularjs v1.2.19 and angular-strap v2.0.3</strong><br>
Angular-strap got some datepicker bugs taken care of, which caused my directive to break. This update fixes that.
