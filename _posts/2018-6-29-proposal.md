---
layout: post

title: "Advanced use of Python decorators and metaclasses"
tagline: "Metaclasses and decorators: a match made in space"
categories:
author: "Ishan Srivastava"
permalink: /pyconindia18/
---

# Abstract

While introducing people to Python metaclasses I realized that sometimes the big problem of the most powerful Python features is that programmers do not perceive how they may simplify their usual tasks. Therefore, features like metaclasses are considered a fancy but rather unuseful addition to a standard OOP language, instead of a real game changer.

This talk wants to show how to use metaclasses and decorators to create a powerful class that can be inherited and customized by easily adding decorated methods.

# Metaclasses and decorators: a match made in space

Metaclasses are a complex topic, and most of the times even advanced programmers do not see a wide range of practical uses for them. Chances are that this is the part of Python (or other languages that support metaclasses, like Smalltalk and Ruby) that fits the least the "standard" object-oriented patterns or solutions found in C++ and Java, just to mention two big players.

Indeed metaclasess usually come in play when programming advanced libraries or frameworks, where a lot of automation must be provided. For example, Django Forms system heavily relies on metaclasses to provide all its magic.

We also have to note, however, that we usually call "magic" or "tricks" all those techniques we are not familiar with, and as a result in Python many things are called this way, being its implementation often peculiar compared to other languages.

Time to bring some spice into your programming: let's practice some Python wizardry and exploit the power of the language!

In this talk I want to show you an interesting joint use of decorators and metaclasses. I will show you how to use decorators to mark methods so that they can be automatically used by the class when performing a given operation.

More in detail, I will implement a class that can be called on a string to "process" it, and show you how to implement different "filters" through simple decorated methods. What I want to obtain is something like this:

```python
class MyStringProcessor(StringProcessor):
    @stringfilter
    def capitalize(self, str):
        [...]

    @stringfilter
    def remove_double_spaces(self, str):
        [...]

msp = MyStringProcessor()
"A test string" == msp("a test string")
```

The module defines a `StringProcessor` class that I can inherit and customize adding methods that have a standard signature `(self, str)` and are decorated with `@stringfilter`. This class can later be instantiated and the instance used to directly process a string and return the result. Internally the class automatically executes all the decorated methods in succession. I also would like the class to obey the order I defined the filters: first defined, first executed.

# The Hitchhiker's Guide To Metaclasses

How can metaclasses help to reach this target?

Simply put, metaclasses are classes that are instantiated to get classes. That means that whenever I use a class, for example to instantiate it, first Python *builds* that class using the metaclass and the class definition we wrote. For example, you know that you can find the class members in the `__dict__` attribute: this attribute is created by the standard metaclass, which is `type`.

Given that, a metaclass is a good starting point for us to insert some code to identify a subset of functions inside the definition of the class. In other words, we want the output of the metaclass (that is, the class) be built exactly as happens in the standard case, but with an addition: a separate list of all the methods decorated with `@stringfilter`.

You know that a class has a *namespace*, that is a dictionary of what was defined inside the class. So, when the standard `type` metaclass is used to create a class, the class body is parsed and a `dict()` object is used to collect the namespace.

We are however interested in preserving the order of definition and a Python dictionary is an unordered structure, so we take advantage of the `__prepare__` hook introduced in the class creation process with Python 3. This function, if present in the metaclass, is used to preprocess the class and to return the structure used to host the namespace. So, following the example found in the official documentation, we start defining a metaclass like

```python
class FilterClass(type):
    def __prepare__(name, bases, **kwds):
        return collections.OrderedDict()
```
        

This way, when the class will be created, an `OrderedDict` will be used to host the namespace, allowing us to keep the definition order. Please note that the signature `__prepare__(name, bases, **kwds)` is enforced by the language. If you want the method to get the metaclass as a first argument (because the code of the method needs it) you have to change the signature to `__prepare__(metacls, name, bases, **kwds)` and decorate it with `@classmethod`.

The second function we want to define in our metaclass is `__new__`. Just like happens for the instantiation of classes, this method is invoked by Python to get a new instance of the metaclass, and is run before `__init__`. Its signature has to be `__new__(metacls, name, bases, namespace, **kwds)` and the result shall be an instance of the metaclass. As for its normal class counterpart (after all a metaclass is a class), `__new__()` usually wraps the same method of the parent class, `type` in this case, adding its own customizations.

The customization we need is the creation of a list of methods that are marked in some way (the decorated filters). Say for simplicity's sake that the decorated methods have an attribute `_filter`.

The full metaclass is then

```python
class FilterClass(type):
    @classmethod
    def __prepare__(name, bases, **kwds):
        return collections.OrderedDict()

    def __new__(metacls, name, bases, namespace, **kwds):
        result = type.__new__(metacls, name, bases, dict(namespace))
        result._filters = [
            value for value in namespace.values() if hasattr(value, '_filter')]
        return result
```

Now we have to find a way to mark all filter methods with a `_filter` attribute.

# The Anatomy of Purple Decorators

**decorate**: *to add something to an object or place, especially in order to make it more attractive* (Cambridge Dictionary)

Decorators are, as the name suggests, the best way to augment functions or methods. Remember that a decorator is basically a callable that accepts another callable, processes it, and returns it.

Used in conjunction with metaclasses, decorators are a very powerful and expressive way to implement advanced behaviours in our code. In this case we may easily use them to add an attribute to decorated methods, one of the most basic tasks for a decorator.

I decided to implement the `@stringfilter` decorator as a function, even if I usually prefer implementing them as classes. The reason is that decorator classes behave differently when used to implement decorators without arguments rather than decorators with arguments. In this case this difference would force to write some complex code and an explanation of that would be overkill now.

The decorator is very simple:

```python
def stringfilter(func):
    func._filter = True
    return func
```

As you can see the decorator just creates an attribute called _filter into the function (remember that functions are objects). The actual value of this attribute is not important in this case, since we are just interested in telling apart class members that contain it.

# The Dynamics of a Callable Object

We are used to think about functions as special language components that may be "called" or executed. In Python functions are objects, just like everything else, and the feature that allows them to be executed comes from the presence of the `__call__()` method. Python is polymorphic by design and based on delegation, so (almost) everything that happens in the code relies on some features of the target object.

The result of this generalization is that every object that contains the `__call__()` method may be executed like a function, and gains the name of *callable object*.

The `StringProcessor` class shall thus contain this method and perform there the string processing with all the contained filters. The code is

```python
class StringProcessor(metaclass=FilterClass):

    def __call__(self, string):
        _string = string
        for _filter in self._filters:
            _string = _filter(self, _string)

        return _string
```

A quick review of this simple function shows that it accepts the string as an argument, stores it in a local variable and loops over the filters, executing each of them on the local string, that is on the result of the previous filter.

The filter functions are extracted from the `self._filters list`, that is compiled by the `FilterClass` metaclass we already discussed.

What we need to do now is to inherit from `StringProcessor` to get the metaclass machinery and the `__call__()` method, and to define as many methods as needed, decorating them with the `@stringfilter` decorator.

Note that, thanks to the decorator and the metaclass, you may have other methods in your class that do not interfere with the string processing as long as they are not decorated with the decorator under consideration.

An example derived class may be the following

```python
class MyStringProcessor(StringProcessor):

    @stringfilter
    def capitalize(self, string):
        return string.capitalize()

    @stringfilter
    def remove_double_spaces(self, string):
        return string.replace(' ', ' ')
```

The two `capitalize()` and `remove_double_spaces()` methods have been decorated, so they will be applied in order to any string passed when calling the class. A quick example of this last class is

```bash
>>> import strproc
>>> msp = strproc.MyStringProcessor()
>>> input_string = "a test string"
>>> output_string = msp(input_string)
>>> print("INPUT STRING:", input_string)
INPUT STRING: a test string
>>> print("OUTPUT STRING:", output_string)
OUTPUT STRING: A test string
>>> 
```

That's it!

# Final words

There are obviously other ways to accomplish the same task, and this talk wanted just to give a practical example of what metaclasses are good for, and why I think that they should be part of any Python programmer's arsenal.

It is especially interesting to know that some developers consider the use of metaclasses a risky business, because they hide a lot of the structure of the class and the underlying machinery. This is true, so (as you should do for other technologies), think carefully about the reasons that drive you to use metaclasses, and be sure you know them well.
