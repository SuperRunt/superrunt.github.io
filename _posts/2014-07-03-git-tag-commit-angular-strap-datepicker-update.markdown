---
layout: post
title:  "Using git tags"
date:   2014-07-03 21:44:46
categories: git deployment bower
short: "Adding tags to your commits is an easy way to create releases in code that is continuously updated."
summary: "I just made an update to my date range directive for angular-strap and had to update the bower package, which means tagging with git. Creating git tags is easy, and this is how to do it."
---
Git tags is the way to go for creating releases. A tag is just a label referring to a certain commit. For creating releases it's recommended that you create annotated tags, since that stores the
tag as a full object in the git database. That means it's stored with name, email and date. After your commit, you just tag like this:

{% highlight bash %}
git tag -a v1.1.3 -m "your message about the v1.1.3 release"
{% endhighlight %}

You can get all the information about this tag by using 'git show'. This will give you information about the tagger, date, commit etc:
{% highlight bash %}
git show v1.1.3
{% endhighlight %}

If you forget to tag your commit and need to add the tag later (or you're just paranoid and want to be 100% sure the correct commit gets the tag), you can add the commit checksum when creating
the tag. First look up your commit history to find the checksum for the commit you want to tag, then add that when runnign 'git tag':
{% highlight bash %}
git log --pretty=oneline
# this will output something like this:
# d5751660eb7baa14d238ae43e0928e4ae5285908 updated to work with angularjs v 1.2.19 and angular-strap v 2.0.3
# 69a5728da63bf5fdbe4673ff6a32c63fac5db303 updated README
# ... the list goes on...

git tag -a v1.1.3 -m "v1.1.3" d5751660eb7baa14d238ae4
# you can see that 'd5751660eb7baa14d238ae4' matches parts of the checksum for the first commit in the list
{% endhighlight %}
Adding '-m "v1.1.3"', specifies a tag message just like a commit message.

You might think that tags get transfered to the remote with 'git push', but that's not the case. You have to explicitly push any tags to the remote. You can
either push one tag at a time, or push all tags at once:
{% highlight bash %}
git push origin v1.1.3
# or to push all tags at once
git push origin --tags
{% endhighlight %}

See? Easy peasy lemon squeezy!
