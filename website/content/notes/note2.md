
decorator: makes your patty a burger


//////


Part II from *Fluent Python*. Decorator is an interesting and useful callable demonstrating the feature "functions as objects" in Python. Decorator takes a function as input and does some processing, then returns the function or another function or a callable object. Suppose you want a burger with handmade patty for lunch, a burger-maker(decorator) accepts your patty(function), wraps it with bars, pickle, lettuce and etc., then gives you a burger(function) as return. Decorator is defined like any other function with "def" and trigged by "@".<br>
<br>
In a case that we wanna know how long our function takes to run, instead of using "timeit" module, it can be done simply by recording the starting and ending time, then doing subtraction. Here is an example.<br>
All code has been tested in *Python 3.7.1*.<br>

### example

Example1 defines a decorator to time appending 1,000,000 numbers to a list.<br>
Note: Execution time may vary on different machines.<br>

```
from time import time

# define a decorator named decor
def decor(func):
	def timeit():
		t1 = time()
		func()
		t2 = time()
		print('Total time: %.2fs' % (t2-t1))
	return timeit

# define our "patty"(function)
@decor
def append_number():
	nums = []
	for i in range(1000000):
		nums.append(i)

# time it!
append_number()

# Output:
# Total time: 0.14s
```

### a better decorator

The decorator above works, but it's not "general" in terms of losing function metadata, decorator parameters and parsed arguments. To solve these problems, @wraps decorator from *functools* library, \* and \*\* argument are required.<br>
<br>
@wraps preserves the metadata of function append_number(), rather than the wrapper timeit()'s. \*args stores arguments in a tuple called "args", while \*\*kwargs stores keyword arguments in a dict called "kwargs".<br>

```
from time import time
from functools import wraps

def decor(rounds=1):
	# at least 1 round
	def inner(func):
		@wraps(func)
		def timeit(*args, **kwargs):
			t1 = time()
			for i in range(rounds):
				func(*args, **kwargs)
			t2 = time()
			print('Total time: %.2fs' % (t2-t1))
		return timeit
	return inner

# 10 rounds, appending 1,000,000 numbers to a list in each round
@decor(10)
def append_number(n):
	nums = []
	for i in range(n):
		nums.append(i)

append_number(1000000)

# equivalent to "decor(10)(append_number)(1000000)"

# Output:
# Total time: 1.15s
```








