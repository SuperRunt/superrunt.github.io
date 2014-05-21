---
layout: post
title:  "AngularJS directive that compares two form fields"
date:   2014-05-14 21:44:46
categories: angularjs javascript
short: "AngularJS directive for validating that two form fields are equal."
summary: "AngularJS directive for validating that two form fields are equal. For example, comparing an email field to a 'confirm email' field."
---

I had to do validation on a form that had 'email' and 'confirm email' fields. It's pretty straight forward, but I
had to try out a couple different strategies, before finding something I liked. Here's what I came up with:

{% highlight javascript %}
angular.module('myApp').directive('equals', function() {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, elem, attrs, ngModel) {
			if(!ngModel) { return; } // do nothing if no ng-model

			// watch own value and re-validate on change
			scope.$watch(attrs.ngModel, function() {
				validate();
			});

			// observe the other value and re-validate on change
			attrs.$observe('equals', function (val) {
				validate();
			});

			var validate = function() {
				// values
				var val1 = ngModel.$viewValue;
				var val2 = attrs.equals;

				// set validity
				ngModel.$setValidity('equals', val1 === val2);
			};
		}
	};
});
{% endhighlight %}

I use it like this:
{% highlight html %}
<div class="form-group">
	<label class="control-label">Email</label>
	  <input type="email" name="email" class="form-control" ng-model="person.EmailAddress" placeholder="Email" required oninvalid="this.setCustomValidity('Email is required, and must match.');">
</div>

<div class="form-group">
	<label control-label">Email Confirm</label>
	  <input type="email" class="form-control" ng-model="emailConfirm" placeholder="Email Confirm" equals="{{person.EmailAddress}}" oninvalid="this.setCustomValidity('Email is required, and must match.');">
</div>
{% endhighlight %}

I have a few other filters and directives that I use a lot over at [Github](https://github.com/SuperRunt/angular-addons).