---
layout: page
title: Blog
tagline: Just a blog, I ain't got an awesome tagline for everything
permalink: /categories/
order: 1
---


<h2>Pinned</h2>

<div>&nbsp;</div>

<ul class="post-list">
  {% for post in site.posts %}
  {% if post.categories contains "blog" and post.categories contains "pinned" %}
    <li>

      {% assign date_format = site.cayman-blog.date_format | default: "%b %-d, %Y" %}
      <span class="post-meta">{{ post.date | date: date_format }}</span>

      <h2>
        <a class="post-link" href="{{ post.url | relative_url }}" title="{{ post.title }}">{{ post.title | escape }}</a>
      </h2>

      <span>{{ post.excerpt | markdownify | truncatewords: 30 }}</span>

    </li>
  {% endif %}
  {% endfor %}
</ul>

<h2>Daily Blog</h2>

<ul class="post-list">
  {% for post in site.posts %}
  {% if post.categories contains "blog" %}
    <li>

      {% assign date_format = site.cayman-blog.date_format | default: "%b %-d, %Y" %}
      <span class="post-meta">{{ post.date | date: date_format }}</span>

      <h2>
        <a class="post-link" href="{{ post.url | relative_url }}" title="{{ post.title }}">{{ post.title | escape }}</a>
      </h2>

      <span>{{ post.excerpt | markdownify | truncatewords: 30 }}</span>

    </li>
  {% endif %}
  {% endfor %}
</ul>