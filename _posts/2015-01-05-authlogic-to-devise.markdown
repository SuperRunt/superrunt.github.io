---
layout: post
title:  "Migrating from Authlogic to Devise"
date:   2015-01-05 10:44:46
categories: ruby rails authentication migration
short: "How I dealt with migrating an app from Authlogic to Devise"
summary: "Tasked with updating a Ruby on Rails app from Ruby version 1.8 and Rails version 2.3.15, I had to move away from Authlogic as the authentication solution. I got some help from online
resources, and had to figure out a few things on my own. It's not like millions of developers out there are going to need this info, but that's also why there isn't a lot of it out there. So I figured
I'd write down what I did, in case someone else is in a similar situation."
---

I volunteer at [Teton Raptor Center](http://tetonraptorcenter.org) (if you're in the Jackson, WY area, you should check them out. That place is all kinds of awesome). Generally, I'm out there feeding birds and
doing raptor rehab, but when the daily log app (built around 2006) needed a sprucing up I offered to help. I had to take it from Ruby 1.8 and Rails 2.3 to Ruby 2.2 and Rails 4.2, which means lots of things needed to be
changed. The biggest change was an update to the authentication solution. Trying to get Authlogic to work seemed silly, when Devise is a way better option that can be sustained going forward.

I wanted to be able to make the change without all the volunteers having to recreate their passwords, and recreating all users was not an option at all. Thanks to Ryan Heath's [gist](https://gist.github.com/rpheath/8343779),
I felt like making this happen was possible. I followed his lead, but had to do some things differently since he had been dealing with earlier versions of Ruby, Rails and Devise. Here's what I did:

<h2>Migration</h2>

{% highlight bash %}
$ rails g migration AuthlogicToDevise
{% endhighlight %}

This is what went in my migration:
{% highlight ruby %}
class AuthlogicToDevise < ActiveRecord::Migration
  def up
    add_column :users, :confirmation_token, :string, :limit => 255
    add_column :users, :confirmed_at, :timestamp
    add_column :users, :confirmation_sent_at, :timestamp
    add_column :users, :unconfirmed_email, :string
    add_column :users, :current_sign_in_ip, :string, :limit => 255
    add_column :users, :last_sign_in_ip, :string, :limit => 255

    execute "UPDATE users SET confirmed_at = created_at, confirmation_sent_at = created_at"

    add_column :users, :reset_password_token, :string, :limit => 255
    add_column :users, :reset_password_sent_at, :timestamp
    add_column :users, :remember_token, :string, :limit => 255
    add_column :users, :remember_created_at, :timestamp
    add_column :users, :unlock_token, :string, :limit => 255
    add_column :users, :locked_at, :timestamp

    rename_column :users, :crypted_password, :encrypted_password
    rename_column :users, :login_count, :sign_in_count
    rename_column :users, :current_login_at, :current_sign_in_at
    rename_column :users, :last_login_at, :last_sign_in_at

    remove_column :users, :persistence_token

    add_index :users, :confirmation_token, unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :unlock_token, unique: true
  end

  def down
    # The opposite goes here. I just took it out for brevity in this post.
  end
end
{% endhighlight %}

I highly recommend taking a look at what fields are already in your users table, so you don't end up with a failed migration. There's a
lot going on in this migration, and undoing can be a pain. Don't forget:

{% highlight bash %}
$ rake db:migrate
{% endhighlight %}

<h2>Gems and Gemfile</h2>

You of course, need to add the devise gem. You also need the devise-encryptable gem to be able to keep using the old passwords. Authlogic
used different encryption than Devise does, but with the devise-encryptable gem you'll be able to keep using the same encryption. More on
that later. Here's what should go in your Gemfile (you might need different version numbers, though).

{% highlight ruby %}
gem "devise", "~> 3.4.1"
gem "devise-encryptable"
{% endhighlight %}

Then run:
{% highlight bash %}
$ bundle install
{% endhighlight %}

<h2>Installing Devise</h2>

You have to install Devise. This puts a devise.rb in initializers. This is the file where you configure Devise later.
{% highlight bash %}
$ rails g devise:install
{% endhighlight %}
Pay attention to the output here, since you might want to do a few of the things suggested there. You can also install the default views to override with
{% highlight bash %}
$ rails g devise:views
{% endhighlight %}

<h2>Code Updates</h2>

I followed the advice in the install output and added to <b>application.html.erb</b>:
{% highlight html %}
<p class="notice"><%= notice %></p>
<p class="alert"><%= alert %></p>
{% endhighlight %}

I updated the devise config file. In <b>config/initializers/devise.rb</b> I added:
{% highlight ruby %}
config.encryptor = :authlogic_sha512
{% endhighlight %}
This tells Devise to use the old authlogic encryption, so the current passwords will still work.
I also updated two other lines:
{% highlight ruby %}
config.mailer_sender = 'your@address.org'
config.stretches = Rails.env.test? ? 1 : 20
{% endhighlight %}
The email address is just for confirmation emails etc. The stretches has to be updated from 10 for the
authlogic passwords to work.

The <b>UserSessionsController</b> has to be updated to inherit from the Devise SessionsController:
{% highlight ruby %}
class UserSessionsController < Devise::SessionsController
{% endhighlight %}

The <b>User Model</b> has to be updated with the Devise defaults, in addition to encryptable for the
authlogic encryption to be used:
{% highlight ruby %}
devise :database_authenticatable, :registerable, :encryptable,
:recoverable, :rememberable, :trackable, :validatable
{% endhighlight %}

<b>Routing</b> has to be updated, and login/logout routes should be replaced by this:
{% highlight ruby %}
devise_for :users, path: "user_session", path_names: { sign_in: 'login', sign_out: 'logout' }
{% endhighlight %}

Some <b>controllers</b> will need an update. Any current_user methods in the application controller should be
removed, and any controllers that need to check for authentication should update to use
:authenticate_user! as the before_filter.

I also updated the login form to look more like the Devise default, although you could just change your current form to use
@user instead of @user_session:
{% highlight html %}
<%= form_for(resource, :as => resource_name, :url => session_path(resource_name), :html => { :role => 'form'}) do |f| %>
    <h3>Sign in</h3>
    <%= devise_error_messages! %>
    <div class="form-group">
      <%= f.label :email %><br />
      <%= f.email_field :email, :autofocus => true, class: 'form-control' %>
    </div>
    <div class="form-group">
      <%= f.label :password %><br />
      <%= f.password_field :password, class: 'form-control' %>
    </div>
    <%= f.submit 'Sign in', :class => 'button right' %>
    <%- if devise_mapping.recoverable? %><br />
        <%= link_to "Forgot password?", new_password_path(resource_name), class: 'right' %>
    <% end -%>
    <%- if devise_mapping.registerable? %>
        OR <%= link_to 'Sign up', new_registration_path(resource_name), class: 'right'  %>
    <% end -%>
<% end %>
{% endhighlight %}

<h2>Cross Fingers</h2>
Now it's time to restart the rails server, and if you're lucky you should be able to log in with any
existing username and password.