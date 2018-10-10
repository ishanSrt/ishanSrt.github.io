---
layout: page
title: Contact
tagline: Say Hello! 
order: 5
---
<head>
<form method="POST" action="https://getsimpleform.com/messages?form_api_token=e63d7ca9a72a0a0504f57ecbe13381bb" class="form-inline" id="formwrap">
  <input type="email" name="email" placeholder="  Your email" style="width:100%;border: 2px solid #1abc9c ;border-radius: 10px;height:50px;padding-left: 20px;" height="100"><br><br>
  <input type="text" name="your_name" placeholder="  Your name" style="width:100%;border: 2px solid #1abc9c;border-radius: 10px;height:50px;padding-left: 20px;"><br><br>
  <textarea name="your_message" rows="10" placeholder="  Your message" style="width:100%;height:=800px;border: 2px solid #1abc9c ;padding-top:10px;border-radius: 10px;padding-left: 20px;"></textarea>
<br><br>
  <button type="submit" name="submit" style="border:none;border-radius:10px;background:  #17a589   ;width:125px;height:45px;color: white;">Send</button>
  <input type="hidden" name="redirect_to" value="{{ site.url }}{{ site.baseurl }}/thank_you.html">
</form>
</head>


[Go to the Home Page]({{ site.url }}{{ site.baseurl }})
