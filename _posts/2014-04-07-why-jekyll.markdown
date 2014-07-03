---
layout: post
title:  "Why Jekyll?"
date:   2014-04-07 21:44:46
categories: jekyll mvc rants
short: "Why should you choose Jekyll for your blog? Because it's easy!"
summary: "If you were dealing with a typical CMS you have to deal with scripting languages, includes, files in directories 8 deep
          etc etc. Not in Jekyll. There's no 'built in' stylesheets or javascript to work around, all the includes are in one folder and
          what happens on build is very predictable."
---

I've tried to start a blog several times. I have gotten so much help from other blog posts over the years, and I figured
it's about time I pay it back. It's nice to have a spot where I organize my solved problems, and share the solutions with
other developers and my future self.

So why haven't the blogging thing worked out before? Two things:
1) I'm lazy and not very good at creating useful content in English (I prefer Javascript or Obj-C).
2) I think CMSs are great (especially C5), but it feels so restrictive and overkill for my own blog.

What's changed?
1) I decided to suck it up, and start working on communicating better in writing (in English).
2) I finally checked out Jekyll.

If you have a mac (which means Ruby is installed), I couldn't be easier. It is literally a matter of typing four lines
in the shell, and you're up and running:
{% highlight bash %}
$ gem install jekyll
$ jekyll new your-site-name
$ cd your-site-name
$ jekyll serve
{% endhighlight %}

Bam! You can now access the site at localhost:4000!

If you were dealing with a typical CMS, now is when you have to start monkeying with php, includes, files in directories 8 deep
etc etc. Not in Jekyll. There's no 'built in' stylesheets or javascript to work around, all the includes are in one folder and
what happens on build is very predictable.

To see if Jekyll could fit into my normal <b>workflow</> with vagrant and gruntjs, I spent a little time getting that set up (it was pretty easy!),
but for something simple as this blog you definitely do not need that. I have a vagrant box file over at
[Github](https://github.com/SuperRunt/vagrant-grunt-jekyll), that could be a good starting point.

<b>Deployment</b> is also a breeze, especially if you use Github Pages. To update this site, I just do exactly what I usually do to commit and push code
and Github takes care of the rest. Not to mention, this is a free option! 
