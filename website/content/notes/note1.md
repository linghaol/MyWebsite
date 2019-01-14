
listcomps, genexps, range, map, filter and iterator


//////


This note is Part I of my takeaways from *Fluent Python* written by Luciano Ramalho. It works like a cheatsheet, which summarizes the most commonly used methods to write pythonic code. Since many principles and details are omitted here, if time allowing, it's highly recommended for you to read the whole book. You spend time and get paid off, that's a good deal!<br>
All code has been tested in *Python 3.7.1*.<br>

### listcomps, genexps, range

listcomps stands for "list comprehensions", genexps stands for "generator expressions", both of which are ways to create sequences.
range is a built-in function to create sequences of ordered numbers. These 3 guys can do the same job, but their returns are somehow different.

```
# to create a sequence of increasing numbers(e.g., 0,1,2,3,4,5)
# listcomps: works in [], returns a list
[x for x in range(6)]

# genexps: works in (), returns a generator object
(x for x in range(6))

# range: takes sequence length or (start, end, step=1) as input, returns a range object
range(6), range(0, 6)
```

The biggest benefit to use generator and range over list is probably for saving memory, since generator and range are kind of "lazy" actions. They output sequence members one by one when you iterate them, rather than ocupying a part of memory to store the whole sequence.

### sequence mapping and filtering

"map" and "filter" are 2 built-in functions designed for these purposes, but to be aware, they are not the only ways. listcomps and genexps can also get you, and be more readable in some cases.

```
# to map sequence 0,1,2,3,4,5 to square
# map: takes a function and sequence as input, returns a map object
map(lambda x: x**2, range(6))

# to keep numbers smaller than 2 in sequence 0,1,2,3,4,5
# filter: takes a function and sequence as input, returns a filter object
filter(lambda x: x<2, range(6))

# listcomps and genexps: we can do both!
[x**2 for x in range(6) if x < 2]
(x**2 for x in range(6) if x < 2)
```
Note: *lambda* defines an anonymous function which is equivalent to a function with "def" and input parameter x.

### "one-time" object

list, generator, range object, map object, filter object and iterator, a feature shared by them all is *iterable*. This property is specified by method "__iter__". Different from list and range object, generator, map object, filter object and iterator can only be iterated once. After that, they become empty.

```
# a, b, c, d, e, f contain the same sequence 0,1
a, b, c, d, e, f = [0,1], (x for x in range(2)), range(2), map(int, '01'), filter(lambda x: x<2, range(3)), iter([0,1])

# to iterate them by converting them to list
list(a), list(b), list(c), list(d), list(e), list(f)

# all output [0,1], then iterate them again
list(a), list(b), list(c), list(d), list(e), list(f)

# only list(a) and range(c) output [0,1], others are []
```
