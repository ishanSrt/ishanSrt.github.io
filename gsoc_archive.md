---
layout: page
title: GSoC Archive
tagline: Whatever I learned in the process and latest updates
order: 2
---

<h2>Pinned</h2>

<div>&nbsp;</div>

<ul class="post-list">
  {% for post in site.posts %}
  {% if post.categories contains "gsoc" and post.categories contains "pinned" %}
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

<h2>GSoC Posts</h2>

<ul class="post-list">
  {% for post in site.posts %}
  {% if post.categories contains "gsoc" %}
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